// app/api/admin/orders/route.ts
// Gestión de encargos desde el panel admin.
// GET → lista todos | PATCH → cambia estado + envía email de confirmación si hay email
// Requiere cookie admin_authenticated=true

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"
import { sendEmail, tplConfirmarEncargo } from "@/lib/email"

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const db = createServerSupabaseClient()
  if (!db) return NextResponse.json({ success: false, error: "Servicio no disponible" }, { status: 503 })

  const { data, error } = await db
    .from("encargos")
    .select("*")
    .order("date")
    .order("time")

  if (error) {
    console.error("[api/admin/orders GET]", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

const patchSchema = z.object({
  id:     z.number().int().positive(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
})

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req)
  if (denied) return denied

  const body   = await req.json()
  const result = patchSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ success: false, error: "Datos no válidos" }, { status: 400 })
  }

  const { id, status } = result.data
  const db = createServerSupabaseClient()
  if (!db) return NextResponse.json({ success: false, error: "Servicio no disponible" }, { status: 503 })

  const { data: updated, error } = await db
    .from("encargos")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[api/admin/orders PATCH]", error)
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 })
  }

  // Email de confirmación al cliente (solo si dejó email)
  if (status === "confirmed" && updated.email) {
    sendEmail(tplConfirmarEncargo({
      name:  updated.name,
      email: updated.email,
      date:  updated.date,
      time:  updated.time,
      notes: updated.notes,
    })).catch(() => {})
  }

  return NextResponse.json({ success: true, data: updated })
}
