// app/api/email/route.ts
// Envío de emails — solo accesible con cookie de admin.
// Los emails de nueva reserva/encargo ya se envían internamente desde
// /api/reservations y /api/encargos. Este endpoint es un fallback de admin.

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import {
  sendEmail,
  tplNuevaReserva,
  tplNuevoEncargo,
  tplConfirmarReserva,
  tplConfirmarEncargo,
} from "@/lib/email"

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  try {
    const body = await req.json()
    const { type, data } = body

    let payload
    switch (type) {
      case "nueva-reserva":     payload = tplNuevaReserva(data);     break
      case "nuevo-encargo":     payload = tplNuevoEncargo(data);     break
      case "confirmar-reserva": payload = tplConfirmarReserva(data); break
      case "confirmar-encargo": payload = tplConfirmarEncargo(data); break
      default:
        return NextResponse.json({ success: false, error: "Tipo desconocido" }, { status: 400 })
    }

    const ok = await sendEmail(payload)
    return NextResponse.json({ success: ok })
  } catch (e) {
    console.error("[api/email]", e)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }
}
