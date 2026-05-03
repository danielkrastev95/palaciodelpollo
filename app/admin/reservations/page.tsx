"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { Reservation } from "@/types/database"
import { ArrowLeft, Check, X, Phone, Mail, Users, Calendar, Clock, Search } from "lucide-react"
import { A, INK, INK2, INK3, PAPER, CREAM, BORDER, PAGE_SIZE } from "@/app/admin/_shared/adminTheme"
import AdminPagination from "@/app/admin/_shared/AdminPagination"

const STATUS = {
  pending:   { label: "Pendiente",  bg: "#FEF7EE", color: "#854A1C", border: "#F4CFA5" },
  confirmed: { label: "Confirmada", bg: "#F0FAF4", color: "#276749", border: "#BBE0CC" },
  cancelled: { label: "Cancelada",  bg: "#FDF2F2", color: "#9B2335", border: "#F0B8BF" },
}

type Toast = { message: string; type: "success" | "error" } | null

const STATUS_FILTERS = ["all", "pending", "confirmed", "cancelled"] as const
type DateFilter = "all" | "today" | "tomorrow" | "week"

function todayStr()    { return new Date().toISOString().slice(0, 10) }
function tomorrowStr() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) }
function weekEnd()     { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10) }

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading,      setLoading]      = useState(true)
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>("pending")
  const [dateFilter,   setDateFilter]   = useState<DateFilter>("all")
  const [search,       setSearch]       = useState("")
  const [page,         setPage]         = useState(1)
  const [toast,        setToast]        = useState<Toast>(null)

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => { loadReservations() }, [])

  const loadReservations = async () => {
    try {
      const res = await fetch("/api/admin/reservations")
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setReservations(data ?? [])
    } catch {
      console.error("[admin/reservations] Error al cargar")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: "confirmed" | "cancelled" | "pending") => {
    const res = await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      const messages = {
        confirmed: "Reserva confirmada correctamente",
        cancelled: "Reserva cancelada",
        pending: "Reserva marcada como pendiente",
      }
      showToast(messages[status], status === "cancelled" ? "error" : "success")
    } else {
      showToast("Error al actualizar la reserva", "error")
    }
  }

  const filtered = useMemo(() => {
    const today    = todayStr()
    const tomorrow = tomorrowStr()
    const weekLast = weekEnd()
    const q = search.toLowerCase().trim()

    return reservations.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (dateFilter === "today"    && r.date !== today)                      return false
      if (dateFilter === "tomorrow" && r.date !== tomorrow)                   return false
      if (dateFilter === "week"     && (r.date < today || r.date > weekLast)) return false
      if (q && !r.name.toLowerCase().includes(q) && !r.phone.includes(q) && !r.email.toLowerCase().includes(q)) return false
      return true
    })
  }, [reservations, statusFilter, dateFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset página cuando cambian los filtros
  useEffect(() => setPage(1), [statusFilter, dateFilter, search])

  const count = (s: string) => reservations.filter(r => r.status === s).length

  if (loading) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: INK3 }}>Cargando…</span>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: PAPER, padding: "40px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/admin/dashboard" style={{ color: INK3, display: "flex" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: INK, lineHeight: 1 }}>Reservas</h1>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3, marginTop: 4 }}>
              {reservations.length} en total · {filtered.length} mostradas
            </div>
          </div>
        </div>

        {/* Filtros de estado */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {STATUS_FILTERS.map(f => {
            const active = statusFilter === f
            return (
              <button key={f} onClick={() => setStatusFilter(f)} style={{
                padding: "7px 16px", borderRadius: 100,
                border: `1px solid ${active ? A : BORDER}`,
                background: active ? A : "transparent",
                color: active ? CREAM : INK3,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
                cursor: "pointer",
              }}>
                {f === "all"       ? "Todas"
                : f === "pending"  ? `Pendientes · ${count("pending")}`
                : f === "confirmed"? `Confirmadas · ${count("confirmed")}`
                :                   `Canceladas · ${count("cancelled")}`}
              </button>
            )
          })}
        </div>

        {/* Filtros de fecha */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {(["all","today","tomorrow","week"] as DateFilter[]).map(f => {
            const active = dateFilter === f
            const labels = { all: "Cualquier fecha", today: "Hoy", tomorrow: "Mañana", week: "Próximos 7 días" }
            return (
              <button key={f} onClick={() => setDateFilter(f)} style={{
                padding: "6px 14px", borderRadius: 100,
                border: `1px solid ${active ? INK : BORDER}`,
                background: active ? INK : "transparent",
                color: active ? CREAM : INK3,
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                cursor: "pointer",
              }}>
                {labels[f]}
              </button>
            )
          })}
        </div>

        {/* Búsqueda */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search size={14} color={INK3} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="search"
            placeholder="Buscar por nombre, teléfono o email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "10px 12px 10px 34px",
              border: `1px solid ${BORDER}`,
              background: CREAM, color: INK,
              fontFamily: "var(--font-mono)", fontSize: 11,
              borderRadius: 2, outline: "none",
            }}
          />
        </div>

        {/* Lista */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 18, color: INK3 }}>
            No hay reservas con estos filtros.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {paginated.map(r => {
              const s = STATUS[r.status]
              return (
                <div key={r.id} style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 2, padding: "24px 28px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>

                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                        <span style={{ fontFamily: "var(--font-ui)", fontSize: 18, fontWeight: 600, color: INK }}>{r.name}</span>
                        <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100 }}>
                          {s.label}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
                        {[
                          { icon: Calendar, text: r.date },
                          { icon: Clock,    text: r.time },
                          { icon: Users,    text: `${r.guests} personas` },
                        ].map(({ icon: Icon, text }) => (
                          <span key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2 }}>
                            <Icon size={13} color={A} />{text}
                          </span>
                        ))}
                        <a href={`mailto:${r.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2, textDecoration: "none" }}>
                          <Mail size={13} color={A} />{r.email}
                        </a>
                        <a href={`tel:${r.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2, textDecoration: "none" }}>
                          <Phone size={13} color={A} />{r.phone}
                        </a>
                      </div>

                      {r.notes && (
                        <div style={{ marginTop: 10, fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 14, color: INK3 }}>
                          {r.notes}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      {r.status !== "confirmed" && (
                        <button onClick={() => updateStatus(r.id, "confirmed")} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#F0FAF4", border: "1px solid #BBE0CC", color: "#276749",
                          borderRadius: 2, padding: "8px 16px",
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                          cursor: "pointer",
                        }}>
                          <Check size={13} /> Confirmar
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button onClick={() => updateStatus(r.id, "cancelled")} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#FDF2F2", border: "1px solid #F0B8BF", color: "#9B2335",
                          borderRadius: 2, padding: "8px 16px",
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                          cursor: "pointer",
                        }}>
                          <X size={13} /> Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Paginación */}
        <AdminPagination page={page} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />

      </div>

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            padding: "14px 24px",
            borderRadius: 4,
            background: toast.type === "success" ? "#276749" : "#9B2335",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.05em",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {toast.type === "success" ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
