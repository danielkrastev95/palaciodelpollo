"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Encargo } from "@/types/database"
import { ArrowLeft, Check, X, Phone, Mail, Calendar, Clock, FileText, Search } from "lucide-react"
import { A, INK, INK2, INK3, PAPER, CREAM, BORDER, PAGE_SIZE } from "@/app/admin/_shared/adminTheme"
import AdminPagination from "@/app/admin/_shared/AdminPagination"

const STATUS = {
  pending:   { label: "Pendiente",  bg: "#FEF7EE", color: "#854A1C", border: "#F4CFA5" },
  confirmed: { label: "Confirmado", bg: "#F0FAF4", color: "#276749", border: "#BBE0CC" },
  cancelled: { label: "Cancelado",  bg: "#FDF2F2", color: "#9B2335", border: "#F0B8BF" },
}

const STATUS_FILTERS = ["all", "pending", "confirmed", "cancelled"] as const
type DateFilter = "all" | "today" | "tomorrow" | "week"

function todayStr()    { return new Date().toISOString().slice(0, 10) }
function tomorrowStr() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) }
function weekEnd()     { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10) }

export default function AdminOrdersPage() {
  const [encargos,     setEncargos]     = useState<Encargo[]>([])
  const [loading,      setLoading]      = useState(true)
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>("pending")
  const [dateFilter,   setDateFilter]   = useState<DateFilter>("all")
  const [search,       setSearch]       = useState("")
  const [page,         setPage]         = useState(1)

  useEffect(() => { loadEncargos() }, [])

  const loadEncargos = async () => {
    try {
      const res = await fetch("/api/admin/orders")
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setEncargos(data ?? [])
    } catch {
      console.error("[admin/orders] Error al cargar")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: "confirmed" | "cancelled" | "pending") => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setEncargos(prev => prev.map(e => e.id === id ? { ...e, status } : e))
    }
  }

  const filtered = useMemo(() => {
    const today    = todayStr()
    const tomorrow = tomorrowStr()
    const weekLast = weekEnd()
    const q = search.toLowerCase().trim()

    return encargos.filter(e => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false
      if (dateFilter === "today"    && e.date !== today)                      return false
      if (dateFilter === "tomorrow" && e.date !== tomorrow)                   return false
      if (dateFilter === "week"     && (e.date < today || e.date > weekLast)) return false
      if (q && !e.name.toLowerCase().includes(q) && !e.phone.includes(q)
             && !(e.email ?? "").toLowerCase().includes(q)) return false
      return true
    })
  }, [encargos, statusFilter, dateFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => setPage(1), [statusFilter, dateFilter, search])

  const count = (s: string) => encargos.filter(e => e.status === s).length

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
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: INK, lineHeight: 1 }}>Encargos</h1>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3, marginTop: 4 }}>
              {encargos.length} en total · {filtered.length} mostrados · Para llevar
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
                {f === "all"       ? "Todos"
                : f === "pending"  ? `Pendientes · ${count("pending")}`
                : f === "confirmed"? `Confirmados · ${count("confirmed")}`
                :                   `Cancelados · ${count("cancelled")}`}
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
            No hay encargos con estos filtros.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {paginated.map(enc => {
              const s = STATUS[enc.status]
              return (
                <div key={enc.id} style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 2, padding: "24px 28px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>

                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                        <span style={{ fontFamily: "var(--font-ui)", fontSize: 18, fontWeight: 600, color: INK }}>{enc.name}</span>
                        <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100 }}>
                          {s.label}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginBottom: 12 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2 }}>
                          <Calendar size={13} color={A} />{enc.date}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2 }}>
                          <Clock size={13} color={A} />Recogida: {enc.time}
                        </span>
                        <a href={`tel:${enc.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2, textDecoration: "none" }}>
                          <Phone size={13} color={A} />{enc.phone}
                        </a>
                        {enc.email && (
                          <a href={`mailto:${enc.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: INK2, textDecoration: "none" }}>
                            <Mail size={13} color={A} />{enc.email}
                          </a>
                        )}
                      </div>

                      {enc.notes && (() => {
                        const lines   = enc.notes.split("\n")
                        const divider = lines.findIndex(l => l.startsWith("─"))
                        const items   = divider >= 0 ? lines.slice(0, divider) : lines
                        const total   = divider >= 0 ? lines[divider + 1] : null
                        return (
                          <div style={{ background: PAPER, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${A}`, padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3 }}>
                              <FileText size={11} color={A} /> Pedido
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: total ? 10 : 0 }}>
                              {items.map((line, i) => {
                                const [qty, ...rest] = line.split("×")
                                const right    = rest.join("×")
                                const dashIdx  = right.lastIndexOf("—")
                                const itemName = dashIdx >= 0 ? right.slice(0, dashIdx).trim() : right.trim()
                                const price    = dashIdx >= 0 ? right.slice(dashIdx + 1).trim() : ""
                                return (
                                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: INK }}>
                                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: A, marginRight: 6 }}>{qty.trim()}×</span>
                                      {itemName}
                                    </span>
                                    {price && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: INK2, whiteSpace: "nowrap" }}>{price}</span>}
                                  </div>
                                )
                              })}
                            </div>
                            {total && (
                              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: INK3 }}>Total</span>
                                <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: A }}>{total.replace("TOTAL:", "").trim()}</span>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      {enc.status !== "confirmed" && (
                        <button onClick={() => updateStatus(enc.id, "confirmed")} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#F0FAF4", border: "1px solid #BBE0CC", color: "#276749",
                          borderRadius: 2, padding: "8px 16px",
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                          cursor: "pointer",
                        }}>
                          <Check size={13} /> Confirmar
                        </button>
                      )}
                      {enc.status !== "cancelled" && (
                        <button onClick={() => updateStatus(enc.id, "cancelled")} style={{
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
    </div>
  )
}
