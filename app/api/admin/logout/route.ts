import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  // Borramos la cookie eliminando su valor y poniendo fecha pasada
  response.cookies.set("admin_authenticated", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  })
  return response
}
