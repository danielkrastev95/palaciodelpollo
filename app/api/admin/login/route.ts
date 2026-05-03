// app/api/admin/login/route.ts
// Login del panel admin.
// Seguridad:
//   - Rate limiting: 5 intentos por IP por minuto
//   - timingSafeEqual: evita timing attacks en la comparación de contraseña
//   - Cookie firmada con HMAC-SHA256 usando ADMIN_SECRET_KEY (clave criptográfica, no se teclea)
//   - ADMIN_PASSWORD: contraseña humana que teclea el usuario (mínimo 12 caracteres)
//   - ADMIN_SECRET_KEY: clave aleatoria para firmar cookies (mínimo 32 caracteres)

import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual, createHmac }  from "crypto"
import { checkRateLimit, getIP } from "@/lib/rate-limit"
import { getEnv } from "@/lib/env"

// Duración de la sesión admin: 8 horas
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

/** Crea el valor firmado de la cookie: "{expiresAt}.{hmac}" */
function signCookie(secretKey: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload   = String(expiresAt)
  const sig       = createHmac("sha256", secretKey).update(payload).digest("hex")
  return `${payload}.${sig}`
}

export async function POST(request: NextRequest) {
  try {
    // ── 1. Rate limiting ────────────────────────────────────────
    const ip    = getIP(request)
    const limit = await checkRateLimit("login", ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: `Demasiados intentos. Espera ${limit.retryAfter}s.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      )
    }

    // ── 2. Validar env ──────────────────────────────────────────
    const { adminPassword, adminSecretKey } = getEnv()
    if (!adminPassword || !adminSecretKey) {
      return NextResponse.json(
        { success: false, error: "Panel no configurado. Contacta con el administrador." },
        { status: 500 },
      )
    }

    // ── 3. Comparar con timingSafeEqual ─────────────────────────
    const { password } = await request.json()
    const inputBuf    = Buffer.from(String(password ?? ""))
    const expectedBuf = Buffer.from(adminPassword)

    // timingSafeEqual exige misma longitud → padding si difieren
    const maxLen      = Math.max(inputBuf.length, expectedBuf.length)
    const padInput    = Buffer.concat([inputBuf,    Buffer.alloc(maxLen - inputBuf.length)])
    const padExpected = Buffer.concat([expectedBuf, Buffer.alloc(maxLen - expectedBuf.length)])

    const match =
      inputBuf.length === expectedBuf.length &&
      timingSafeEqual(padInput, padExpected)

    if (!match) {
      // Delay variable añadido por encima de timingSafeEqual (defensa en profundidad)
      await new Promise(r => setTimeout(r, 400 + Math.random() * 200))
      return NextResponse.json({ success: false, error: "Contraseña incorrecta." }, { status: 401 })
    }

    // ── 4. Cookie firmada con HMAC ──────────────────────────────
    const cookieValue = signCookie(adminSecretKey)

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_authenticated", cookieValue, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   SESSION_TTL_MS / 1000,
      path:     "/",
    })

    return response
  } catch {
    return NextResponse.json({ success: false, error: "Error del servidor." }, { status: 500 })
  }
}
