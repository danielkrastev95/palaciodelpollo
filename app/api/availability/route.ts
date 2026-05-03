// app/api/availability/route.ts
// Devuelve el número de reservas por slot horario para una fecha dada.
// Público (no necesita auth) pero solo expone conteos, no datos personales.

import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { checkRateLimit, getIP } from "@/lib/rate-limit"

export async function GET(req: NextRequest) {
  // ── Rate limiting: 30 consultas por IP por minuto ────────────
  const ip    = getIP(req)
  const limit = await checkRateLimit("availability", ip)
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Demasiadas consultas." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    )
  }

  // ── Validación de parámetro ──────────────────────────────────
  const date = req.nextUrl.searchParams.get("date")
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ success: false, error: "Fecha no válida" }, { status: 400 })
  }

  const db = createServerSupabaseClient()
  if (!db) return NextResponse.json({ success: true, data: { counts: {} } })

  const { data } = await db
    .from("reservations")
    .select("time")
    .eq("date", date)
    .neq("status", "cancelled")

  const counts: Record<string, number> = {}
  for (const row of (data ?? []) as { time: string }[]) {
    counts[row.time] = (counts[row.time] ?? 0) + 1
  }

  return NextResponse.json({ success: true, data: { counts } })
}
