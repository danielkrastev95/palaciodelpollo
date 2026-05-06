// app/api/admin/upload-image/route.ts
// Upload de imágenes de plato a Supabase Storage (bucket menu_photos).
//
// Solo admin: cookie HMAC validada por requireAdmin.
// Cliente nunca toca Storage directamente — todo pasa por aquí con service_role.
//
// Pipeline de optimización (sharp):
//   - Auto-rotate (respeta EXIF orientation de fotos del móvil)
//   - Resize: máx 1600 px en el lado largo (sin aumentar si es menor)
//   - WebP quality 82 (~80% más pequeño que JPG original sin pérdida visible)
//   - Strip metadata (privacidad: borra GPS/EXIF de fotos del móvil)
//
// Resultado típico: foto de 4-8 MB del móvil → ~150-300 KB en Storage.

import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { requireAdmin } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"

const BUCKET     = "menu_photos"
const MAX_BYTES  = 10 * 1024 * 1024  // 10 MB de input (originales del móvil)
const MAX_DIM    = 1600              // px en el lado largo
const WEBP_Q     = 82                // calidad WebP (80-85 es el sweet spot)

const ALLOWED_INPUT = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
])

// Force Node runtime — sharp no funciona en edge
export const runtime = "nodejs"

function safeBase(name: string): string {
  // Quita extensión, pasa a kebab-case ASCII puro
  const base = name.replace(/\.[^.]+$/, "")
  return base
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .toLowerCase() || "img"
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  // ── Parseo del multipart ────────────────────────────────────
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { success: false, error: "Form data inválido" },
      { status: 400 },
    )
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Falta el archivo" },
      { status: 400 },
    )
  }

  // ── Validación de input ─────────────────────────────────────
  if (!ALLOWED_INPUT.has(file.type)) {
    return NextResponse.json(
      { success: false, error: "Formato no soportado. Usa JPG, PNG, WebP o HEIC." },
      { status: 415 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { success: false, error: "Imagen demasiado grande (máximo 10 MB)" },
      { status: 413 },
    )
  }
  if (file.size === 0) {
    return NextResponse.json(
      { success: false, error: "Archivo vacío" },
      { status: 400 },
    )
  }

  // ── Procesado con sharp ─────────────────────────────────────
  let processed: Buffer
  try {
    const inputBuf = Buffer.from(await file.arrayBuffer())
    processed = await sharp(inputBuf)
      .rotate()                                          // auto-rotate por EXIF
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_Q, effort: 4 })              // effort 4 = balance velocidad/compresión
      .toBuffer()
  } catch (err) {
    console.error("[api/admin/upload-image] sharp:", err)
    return NextResponse.json(
      { success: false, error: "No se pudo procesar la imagen" },
      { status: 422 },
    )
  }

  // ── Subida a Storage ────────────────────────────────────────
  const filename = `${safeBase(file.name)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`

  const db = createServerSupabaseClient()
  if (!db) {
    return NextResponse.json(
      { success: false, error: "Servicio no disponible" },
      { status: 503 },
    )
  }

  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(filename, processed, {
      contentType: "image/webp",
      upsert: false,
      cacheControl: "31536000",  // 1 año (filename único, immutable)
    })

  if (uploadError) {
    console.error("[api/admin/upload-image] upload:", uploadError)
    return NextResponse.json(
      { success: false, error: "Error al subir la imagen" },
      { status: 500 },
    )
  }

  const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(filename)

  return NextResponse.json({
    success: true,
    data: {
      url: publicUrl,
      bytes: processed.length,
      bytesOriginal: file.size,
    },
  })
}
