// app/api/encargos/route.ts
// Endpoint público para crear encargos para llevar.
// Valida con Zod server-side y usa service_role para insertar.

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase"
import { sendEmail, tplNuevoEncargo, tplReciboEncargo } from "@/lib/email"
import { checkRateLimit, getIP } from "@/lib/rate-limit"

const VALID_TIMES = ["12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"] as const

const schema = z.object({
  name:  z.string().min(2, "Nombre demasiado corto").max(100),
  phone: z.string()
    .refine(v => /^[+\d\s\-().]+$/.test(v),       "Solo números y +")
    .refine(v => v.replace(/\D/g, "").length >= 9, "Mínimo 9 dígitos"),
  // Email opcional: el SQL lo define como TEXT (nullable). Con él enviamos recibo al cliente.
  email: z.string().email("Email no válido").optional().or(z.literal("")),
  date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
  time:  z.enum(VALID_TIMES, { error: "Hora no válida" }),
  notes: z.string().min(5, "El pedido está vacío").max(3000),
})

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting: 3 encargos por IP cada 10 minutos ────────
    const ip    = getIP(req)
    const limit = await checkRateLimit("encargos", ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: `Demasiadas peticiones. Espera ${limit.retryAfter}s.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      )
    }

    // ── Validación ───────────────────────────────────────────────
    const body   = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Datos no válidos" }, { status: 400 })
    }

    const data = result.data

    // Fecha no puede ser en el pasado
    const todayStr = new Date().toISOString().slice(0, 10)
    if (data.date < todayStr) {
      return NextResponse.json({ success: false, error: "Fecha no válida" }, { status: 400 })
    }

    // ── Inserción ────────────────────────────────────────────────
    const db = createServerSupabaseClient()
    if (!db) {
      return NextResponse.json({ success: false, error: "Servicio no disponible" }, { status: 503 })
    }

    const email = data.email || null  // "" o undefined → null en BD

    const { error } = await db.from("encargos").insert({
      name:   data.name,
      phone:  data.phone,
      email,
      date:   data.date,
      time:   data.time,
      notes:  data.notes,
      status: "pending",
    })

    if (error) throw error

    // ── Emails (fire-and-forget) ─────────────────────────────────
    sendEmail(tplNuevoEncargo({
      name:  data.name,
      phone: data.phone,
      email: email ?? "",
      date:  data.date,
      time:  data.time,
      notes: data.notes,
    })).catch(() => {})

    // Solo enviamos recibo al cliente si nos dio su email
    if (email) {
      sendEmail(tplReciboEncargo({
        name:  data.name,
        email,
        date:  data.date,
        time:  data.time,
        notes: data.notes,
      })).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[api/encargos POST]", e)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
