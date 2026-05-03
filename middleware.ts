// middleware.ts
// El "portero" de las rutas admin. Se ejecuta en Edge Runtime antes de servir cualquier página.
// Verifica que la cookie HMAC sea válida y no haya expirado.
// Usa Web Crypto API (compatible con Edge Runtime, a diferencia de Node crypto).

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Verifica la cookie firmada con HMAC-SHA256 usando Web Crypto API.
 * Formato esperado: "{expiresAt}.{hmac_hex}"
 */
async function isAdminAuthenticated(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false

  const adminKey = process.env.ADMIN_SECRET_KEY
  if (!adminKey) return false

  // Separar payload de firma
  const lastDot = cookieValue.lastIndexOf(".")
  if (lastDot === -1) return false

  const payload = cookieValue.slice(0, lastDot)   // timestamp
  const signature = cookieValue.slice(lastDot + 1) // hex del HMAC

  // Verificar expiración primero (más barato que crypto)
  const expiresAt = Number(payload)
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false

  // Verificar firma HMAC-SHA256 con Web Crypto API
  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(adminKey)
    const payloadData = encoder.encode(payload)

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, payloadData)
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")

    // Comparación constant-time para evitar timing attacks
    if (signature.length !== expectedSignature.length) return false
    let mismatch = 0
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
    }
    return mismatch === 0
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger todas las rutas /admin/* excepto /admin (la página de login)
  if (pathname.startsWith("/admin/") && pathname !== "/admin") {
    const cookieValue = request.cookies.get("admin_authenticated")?.value
    const isValid = await isAdminAuthenticated(cookieValue)

    if (!isValid) {
      // Redirigir al login con la URL de destino para volver después
      const loginUrl = new URL("/admin", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Bloquear indexación de robots en rutas admin
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next()
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
    return response
  }

  return NextResponse.next()
}

export const config = {
  // Solo ejecutar el middleware en rutas admin (no en archivos estáticos)
  matcher: ["/admin", "/admin/:path*"],
}
