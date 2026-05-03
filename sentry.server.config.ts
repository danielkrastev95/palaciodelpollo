// sentry.server.config.ts — Sentry para el servidor (API routes, Server Components)
// Solo activo si SENTRY_DSN está configurado (variable server-side, sin NEXT_PUBLIC_).

import * as Sentry from "@sentry/nextjs"

const dsn = process.env.SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    // En producción: 5% de traces para no saturar el plan gratuito
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    environment:      process.env.NODE_ENV,
    // No capturamos breadcrumbs de consola — demasiado ruido
    integrations: integrations => integrations.filter(i => i.name !== "Console"),
  })
}
