"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function AdminLoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/admin/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Contraseña incorrecta.")
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label
          htmlFor="admin-password"
          style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B5D50", marginBottom: 8 }}
        >
          Contraseña de acceso
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#fff", border: "1px solid rgba(26,20,16,0.2)",
            borderRadius: 2, padding: "14px 16px",
            fontSize: 16, color: "#1A1410",
            outline: "none", transition: "border-color .2s",
          }}
          onFocus={e => (e.target.style.borderColor = "#C94B1F")}
          onBlur={e => (e.target.style.borderColor = "rgba(26,20,16,0.2)")}
        />
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "#C94B1F" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        style={{
          background: loading || !password ? "rgba(26,20,16,0.15)" : "#C94B1F",
          color: loading || !password ? "#6B5D50" : "#FBF6EA",
          border: "none", borderRadius: 2,
          padding: "15px", fontSize: 13,
          fontFamily: "var(--font-mono)", letterSpacing: "0.2em",
          textTransform: "uppercase", cursor: loading || !password ? "default" : "pointer",
          transition: "background .2s",
        }}
      >
        {loading ? "Verificando…" : "Acceder"}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F3EDE1", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B5D50", marginBottom: 16 }}>
            Panel de Administración
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "#1A1410", lineHeight: 1 }}>
            El Palacio <em style={{ color: "#C94B1F" }}>del</em> Pollo
          </h1>
        </div>

        <div style={{ background: "#FBF6EA", border: "1px solid rgba(26,20,16,0.12)", borderRadius: 2, padding: 32 }}>
          <Suspense fallback={<div style={{ height: 120 }} />}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
