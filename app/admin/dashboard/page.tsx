"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { CalendarCheck, MessageSquare, LogOut, ShoppingBag, UtensilsCrossed } from "lucide-react"
import { Reservation } from "@/types/database"
import { A, INK, INK3, PAPER, CREAM, BORDER } from "@/app/admin/_shared/adminTheme"

const statusStyle: Record<string, React.CSSProperties> = {
  confirmed: { background: "#F0FAF4", color: "#276749", border: "1px solid #BBE0CC" },
  cancelled:  { background: "#FDF2F2", color: "#9B2335", border: "1px solid #F0B8BF" },
  pending:    { background: "#FEF7EE", color: "#854A1C", border: "1px solid #F4CFA5" },
}
const statusLabel: Record<string, string> = { confirmed: "Confirmada", cancelled: "Cancelada", pending: "Pendiente" }

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: number; sub: string }) {
  return (
    <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 2, padding: 28 }}>
      <Icon size={20} color={A} style={{ marginBottom: 16 }} />
      <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400, color: INK, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: INK, marginTop: 8 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: INK3, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function QuickLink({ href, icon: Icon, title, sub }: { href: string; icon: React.ElementType; title: string; sub: string }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 16,
      background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 2,
      padding: "20px 24px", textDecoration: "none",
      transition: "border-color .2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = A)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
    >
      <Icon size={22} color={A} />
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: INK }}>{title}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: INK3, marginTop: 2 }}>{sub}</div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ pendingReservations: 0, pendingEncargos: 0, totalMenuItems: 0, unreadMessages: 0 })
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      if (!supabase) { setLoading(false); return }
      const [pendRes, pendEnc, menuCount, unreadCount, recentResult] = await Promise.all([
        supabase.from("reservations").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("encargos").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
        supabase.from("reservations").select("*").order("created_at", { ascending: false }).limit(5),
      ])
      setStats({ pendingReservations: pendRes.count ?? 0, pendingEncargos: pendEnc.count ?? 0, totalMenuItems: menuCount.count ?? 0, unreadMessages: unreadCount.count ?? 0 })
      setRecentReservations(recentResult.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin")
    router.refresh()
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3 }}>Cargando…</span>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: PAPER }}>
      {/* Header */}
      <div className="admin-header" style={{ background: CREAM, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: INK }}>
            El Palacio <em style={{ color: A }}>del</em> Pollo
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: INK3, marginLeft: 16 }}>
            Admin
          </span>
        </div>
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
          color: INK3, background: "none", border: "none", cursor: "pointer",
        }}>
          <LogOut size={14} />
          Salir
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard icon={CalendarCheck} label="Reservas pendientes"  value={stats.pendingReservations} sub="Mesas por confirmar" />
          <StatCard icon={ShoppingBag}   label="Encargos pendientes"  value={stats.pendingEncargos}    sub="Para llevar" />
          <StatCard icon={UtensilsCrossed} label="Platos en carta"    value={stats.totalMenuItems}     sub="Menú activo" />
          <StatCard icon={MessageSquare} label="Mensajes sin leer"    value={stats.unreadMessages}     sub="Nuevos" />
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 40 }}>
          <QuickLink href="/admin/reservations" icon={CalendarCheck}   title="Reservas"  sub="Ver y confirmar" />
          <QuickLink href="/admin/orders"        icon={ShoppingBag}    title="Encargos"  sub="Para llevar" />
          <QuickLink href="/admin/menu"          icon={UtensilsCrossed} title="Menú"     sub="Editar carta" />
          <QuickLink href="/admin/messages"      icon={MessageSquare}  title="Mensajes"  sub="Contacto" />
        </div>

        {/* Reservas recientes */}
        <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: INK }}>Reservas recientes</span>
            <Link href="/admin/reservations" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: A, textDecoration: "none" }}>
              Ver todas →
            </Link>
          </div>

          {recentReservations.length === 0 ? (
            <div style={{ padding: "48px 28px", textAlign: "center", fontFamily: "var(--font-body)", fontStyle: "italic", color: INK3, fontSize: 16 }}>
              Aún no hay reservas.
            </div>
          ) : (
            <div>
              {recentReservations.map((res) => (
                <div key={res.id} style={{
                  display: "flex", flexWrap: "wrap",
                  justifyContent: "space-between", alignItems: "center",
                  gap: "8px 16px",
                  padding: "16px 28px",
                  borderBottom: `1px solid ${BORDER}`,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: INK, marginBottom: 4 }}>
                      {res.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, letterSpacing: "0.1em" }}>
                      {res.date} · {res.time} · {res.guests} {res.guests === 1 ? "persona" : "personas"}
                    </div>
                  </div>
                  <span style={{
                    ...statusStyle[res.status],
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 100,
                    flexShrink: 0,
                  }}>
                    {statusLabel[res.status] ?? res.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
