"use client"

import { useEffect } from "react"

/**
 * Layout del panel admin.
 * Fuerza modo día siempre: el panel está pensado en claro.
 * Restaura la preferencia del usuario al salir.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const body = document.body
    const wasDark = body.classList.contains("dark")
    body.classList.remove("dark")

    return () => {
      if (wasDark) body.classList.add("dark")
    }
  }, [])

  return <>{children}</>
}
