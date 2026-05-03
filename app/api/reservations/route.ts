// app/api/reservations/route.ts
// Endpoint público para crear reservas.
// Valida con Zod server-side y usa service_role para insertar.
// El cliente NUNCA toca Supabase directamente para esto.

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase"
import { sendEmail, tplNuevaReserva, tplReciboReserva } from "@/lib/email"
import { checkRateLimit, getIP } from "@/lib/rate-limit"

const VALID_TIMES = ["12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"] as const

const schema = z.object({
  name:   z.string().min(2, "Nombre demasiado corto").max(100),
  email:  z.string().email("Email no válido"),
  phone:  z.string()
    .refine(v => /^[+\d\s\-().]+$/.test(v),       "Solo números y +")
    .refine(v => v.replace(/\D/g, "").length >= 9, "Mínimo 9 dígitos"),
  date:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
  time:   z.enum(VALID_TIMES, { error: "Hora no válida" }),
  guests: z.number().int().min(1).max(12),  // max 12: mesa grande realista
  notes:  z.string().max(500).optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting: 3 reservas por IP cada 10 minutos ────────
    const ip    = getIP(req)
    const limit = await checkRateLimit("reservations", ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: `Demasiadas peticiones. Espera ${limit.retryAfter}s.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      )
    }

    // ── Validación ───────────────────────────────────────────────
    const body   = await req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Datos no válidos" }, { status: 400 })
    }

    const data = result.data

    // Fecha no puede ser en el pasado
    const todayStr = new Date().toISOString().slice(0, 10)
    if (data.date < todayStr) {
      return NextResponse.json({ success: false, error: "Fecha no válida" }, { status: 400 })
    }

    // ── Inserción ────────────────────────────────────────────────
    const db = createServerSupabaseClient()
    if (!db) {
      return NextResponse.json({ success: false, error: "Servicio no disponible" }, { status: 503 })
    }

    const { error } = await db.from("reservations").insert({
      name:   data.name,
      email:  data.email,
      phone:  data.phone,
      date:   data.date,
      time:   data.time,
      guests: data.guests,
      notes:  data.notes ?? null,
      status: "pending",
    })

    if (error) {
      // Trigger de capacidad: el slot está lleno
      if (error.code === "P0001" && error.message === "SLOT_FULL") {
        return NextResponse.json(
          { success: false, error: "Ese horario acaba de llenarse. Elige otro." },
          { status: 409 },
        )
      }
      throw error
    }

    // ── Emails (fire-and-forget) ─────────────────────────────────
    sendEmail(tplNuevaReserva({
      name: data.name, email: data.email, phone: data.phone,
      date: data.date, time: data.time, guests: data.guests,
      notes: data.notes,
    })).catch(() => {})

    sendEmail(tplReciboReserva({
      name: data.name, email: data.email,
      date: data.date, time: data.time, guests: data.guests,
    })).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[api/reservations POST]", e)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
