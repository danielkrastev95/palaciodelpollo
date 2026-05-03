// lib/rate-limit.ts — Rate limiter simple en memoria
// Suficiente para un restaurante con tráfico normal.

import type { NextRequest } from "next/server"

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
interface RateLimitResult {
  allowed: boolean
  retryAfter?: number
}

interface MemoryRecord {
  count: number
  resetAt: number
}

// ─────────────────────────────────────────────────────────────
// Store en memoria
// ─────────────────────────────────────────────────────────────
const store = new Map<string, MemoryRecord>()

// Limpieza periódica de registros expirados (cada 5 min)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, rec] of store) {
      if (rec.resetAt < now) store.delete(key)
    }
  }, 5 * 60 * 1000)
}

// ─────────────────────────────────────────────────────────────
// Configuración por tipo de endpoint
// ─────────────────────────────────────────────────────────────
type LimiterType = "reservations" | "encargos" | "availability" | "login"

const config: Record<LimiterType, { max: number; windowMs: number }> = {
  reservations: { max: 3, windowMs: 10 * 60 * 1000 },  // 3 por 10 min
  encargos:     { max: 3, windowMs: 10 * 60 * 1000 },  // 3 por 10 min
  availability: { max: 30, windowMs: 60 * 1000 },      // 30 por minuto
  login:        { max: 5, windowMs: 60 * 1000 },       // 5 por minuto
}

// ─────────────────────────────────────────────────────────────
// API pública
// ─────────────────────────────────────────────────────────────

/**
 * Comprueba si una IP ha excedido el límite de peticiones.
 */
export async function checkRateLimit(
  type: LimiterType,
  identifier: string
): Promise<RateLimitResult> {
  const { max, windowMs } = config[type]
  const key = `${type}:${identifier}`
  const now = Date.now()
  const rec = store.get(key)

  // Primera petición o ventana expirada
  if (!rec || rec.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  // Límite alcanzado
  if (rec.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((rec.resetAt - now) / 1000) }
  }

  // Incrementar contador
  rec.count++
  return { allowed: true }
}

/**
 * Extrae la IP del cliente de una NextRequest.
 */
export function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}
