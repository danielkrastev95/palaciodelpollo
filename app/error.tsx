"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error en la aplicación:", error)
  }, [error])

  return (
    <div style={{
      minHeight: "70vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 24px",
      background: "var(--paper)",
    }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        {/* Número de error tipográfico */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(72px, 15vw, 120px)",
          lineHeight: 1,
          color: "var(--ember)",
          letterSpacing: "-0.04em",
          marginBottom: 8,
        }}>
          Error
        </div>

        <div style={{
          width: 48, height: 1,
          background: "var(--ink-3)",
          margin: "0 auto 24px",
        }} />

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(22px, 4vw, 30px)",
          color: "var(--ink)",
          lineHeight: 1.1,
          marginBottom: 14,
        }}>
          Algo ha salido mal.
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          fontSize: 17,
          color: "var(--ink-2)",
          lineHeight: 1.55,
          marginBottom: 36,
        }}>
          Ha ocurrido un error inesperado. Puedes intentarlo de nuevo o volver al inicio.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            className="btn ember"
          >
            Intentar de nuevo
          </button>
          <Link href="/" className="btn ghost">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
