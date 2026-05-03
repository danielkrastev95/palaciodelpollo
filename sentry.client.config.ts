// sentry.client.config.ts — Sentry para el navegador (client components)
// Solo activo si NEXT_PUBLIC_SENTRY_DSN está configurado.
// Sin DSN: el módulo carga pero no envía nada.

import * as Sentry from "@sentry/nextjs"

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    // Solo capturamos 10% de las sesiones para el replay (no datos sensibles de formularios)
    integrations: [
      Sentry.replayIntegration({
        maskAllText:   true,   // Enmascara texto — los formularios tienen datos personales
        blockAllMedia: false,
      }),
    ],
    // En producción: 5% de traces de rendimiento, 10% de replays en error
    tracesSampleRate:   process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    replaysSessionSampleRate: 0,      // Sin replay en sesión normal
    replaysOnErrorSampleRate: 0.1,   // Solo replay cuando hay un error
    environment: process.env.NODE_ENV,
  })
}
