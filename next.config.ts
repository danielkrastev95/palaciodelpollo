import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

// ── Security headers ─────────────────────────────────────────────────────────
// Aplicados a todas las rutas. No incluimos CSP aquí porque requiere auditar
// fuentes inline de Next.js + Google Fonts — se añade en una iteración dedicada.
const securityHeaders = [
  // Impide que la web se cargue en un <iframe> de otro dominio (clickjacking)
  { key: "X-Frame-Options",           value: "DENY" },
  // Bloquea MIME-type sniffing (evita que el navegador reinterprete archivos)
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Solo envía el origin en el referer (no la URL completa)
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Desactiva funciones del navegador que no usamos
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HSTS: fuerza HTTPS durante 1 año (solo en producción, Next ya lo hace en Vercel)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Previene que el navegador ejecute XSS detectado (legacy, pero suma capas)
  { key: "X-XSS-Protection",         value: "1; mode=block" },
]

const nextConfig: NextConfig = {
  images: {
    // Solo dominios reales — no wildcards
    remotePatterns: [
      { protocol: "https", hostname: "gpltodrwtebhbkvgcnhw.supabase.co" },
    ],
    // AVIF primero (30-50% más pequeño que WebP), WebP como fallback
    formats: ["image/avif", "image/webp"],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        // Aplicar a todas las páginas y API routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Las rutas de admin no deben ser cacheadas por proxies intermedios
        source: "/admin/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        // Mismo para las API routes de admin
        source: "/api/admin/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ]
  },
}

// Sentry solo se activa si SENTRY_DSN está configurado.
// Sin DSN: withSentryConfig pasa sin modificar la config.
export default process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      // Evita que Sentry suba sourcemaps a su servidor si no hay token
      silent:           !process.env.SENTRY_AUTH_TOKEN,
      org:              process.env.SENTRY_ORG  ?? "",
      project:          process.env.SENTRY_PROJECT ?? "palacio-del-pollo",
      // Oculta sourcemaps al cliente (solo los sube a Sentry para stacktraces legibles)
      sourcemaps: { deleteSourcemapsAfterUpload: true },
      // No instrumentamos automáticamente cada Server Component (demasiado ruido)
      autoInstrumentServerFunctions: false,
    })
  : nextConfig
