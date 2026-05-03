// lib/auth.ts — Helpers de autenticación para API routes server-side
// La cookie "admin_authenticated" está firmada con HMAC-SHA256 usando ADMIN_SECRET_KEY.
// Formato: "{expiresAt}.{hmac_hex}"
// Cualquier modificación invalida la firma → imposible falsificar sin la clave.

import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"

/**
 * Verifica que la cookie de admin sea auténtica y no haya expirado.
 * Devuelve false si:
 *   - No existe la cookie
 *   - La firma no coincide (cookie manipulada)
 *   - La sesión ha expirado
 *   - ADMIN_SECRET_KEY no está configurada
 */
export function isAdmin(req: NextRequest): boolean {
  const cookieValue = req.cookies.get("admin_authenticated")?.value
  if (!cookieValue) return false

  const adminKey = process.env.ADMIN_SECRET_KEY
  if (!adminKey) return false

  // Separar payload de firma: todo hasta el último punto
  const lastDot = cookieValue.lastIndexOf(".")
  if (lastDot === -1) return false

  const payload = cookieValue.slice(0, lastDot)   // "1748000000000"
  const sig     = cookieValue.slice(lastDot + 1)  // hex del HMAC

  // Verificar firma con timingSafeEqual (evita timing attacks)
  try {
    const expectedSig = createHmac("sha256", adminKey).update(payload).digest("hex")
    const aBuf = Buffer.from(sig,         "hex")
    const bBuf = Buffer.from(expectedSig, "hex")
    if (aBuf.length !== bBuf.length || !timingSafeEqual(aBuf, bBuf)) return false
  } catch {
    return false
  }

  // Verificar expiración
  const expiresAt = Number(payload)
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false

  return true
}

/** Devuelve 401 si no es admin. Úsalo al principio de cada API route de admin. */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
  }
  return null
}
