import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 24px",
      background: "var(--paper)",
    }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        {/* 404 tipográfico */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(80px, 18vw, 140px)",
          lineHeight: 1,
          color: "var(--ember)",
          letterSpacing: "-0.04em",
          marginBottom: 8,
        }}>
          404
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
          Esta página no existe.
        </h1>

        <p style={{
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          fontSize: 17,
          color: "var(--ink-2)",
          lineHeight: 1.55,
          marginBottom: 36,
        }}>
          Quizás la borramos, quizás nunca existió.<br />
          La carta sigue intacta.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn ember">
            ← Volver al inicio
          </Link>
          <Link href="/menu" className="btn ghost">
            Ver la carta
          </Link>
        </div>
      </div>
    </div>
  )
}
