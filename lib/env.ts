// lib/env.ts — Validación de variables de entorno en server-side
// En producción lanza error claro si falta alguna variable crítica.
// En desarrollo avisa pero no rompe (permite usar la app sin Supabase).

function getServerVar(key: string, minLength = 1): string {
  const val = process.env[key]

  if (!val || val.length < minLength) {
    if (process.env.NODE_ENV === "production") {
      // En producción es fatal: lanzar para que aparezca en los logs de Vercel
      throw new Error(
        `[env] Variable de entorno requerida no configurada o demasiado corta: ${key}` +
        (minLength > 1 ? ` (mínimo ${minLength} caracteres)` : ""),
      )
    }
    // En desarrollo solo avisamos
    if (process.env.NODE_ENV !== "test") {
      console.warn(`[env] ⚠  ${key} no configurada — funcionalidad limitada en dev`)
    }
    return ""
  }

  return val
}

/**
 * Devuelve las variables de entorno validadas.
 * Llamar DENTRO de los route handlers (server-side), nunca en componentes cliente.
 * Así el error aparece en el request, no al arrancar el proceso.
 */
export function getEnv() {
  return {
    adminPassword:   getServerVar("ADMIN_PASSWORD",                12),
    adminSecretKey:  getServerVar("ADMIN_SECRET_KEY",              32),
    serviceRoleKey:  getServerVar("SUPABASE_SERVICE_ROLE_KEY",     20),
    supabaseUrl:     getServerVar("NEXT_PUBLIC_SUPABASE_URL",       8),
    supabaseAnonKey: getServerVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", 20),
    resendApiKey:    process.env.RESEND_API_KEY ?? "",  // Opcional: emails son fire-and-forget
  } as const
}
