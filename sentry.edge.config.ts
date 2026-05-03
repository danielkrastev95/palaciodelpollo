// sentry.edge.config.ts — Sentry para el Edge runtime (middleware, OG image)

import * as Sentry from "@sentry/nextjs"

const dsn = process.env.SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    environment:      process.env.NODE_ENV,
  })
}
