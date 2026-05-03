"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { ContactMessage } from "@/types/database"
import { ArrowLeft, Mail, MailOpen, Trash2, Clock } from "lucide-react"

const A = "#C94B1F"
const INK = "#1A1410"
const INK2 = "#3A2F26"
const INK3 = "#6B5D50"
const PAPER = "#F3EDE1"
const CREAM = "#FBF6EA"
const BORDER = "rgba(26,20,16,0.12)"

const FILTERS = ["all", "unread", "read"] as const

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<Set<number>>(new Set())

  useEffect(() => { loadMessages() }, [])

  const loadMessages = async () => {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
    if (data) setMessages(data)
    setLoading(false)
  }

  const markAsRead = async (id: number) => {
    if (!supabase) return
    setActionLoading(prev => new Set(prev).add(id))
    const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", id)
    if (!error) setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    setActionLoading(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  const deleteMessage = async (id: number) => {
    if (!confirm("¿Eliminar este mensaje? No se puede deshacer.")) return
    if (!supabase) return
    setActionLoading(prev => new Set(prev).add(id))
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (!error) setMessages(prev => prev.filter(m => m.id !== id))
    setActionLoading(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  const handleExpand = async (msg: ContactMessage) => {
    setExpandedId(expandedId === msg.id ? null : msg.id)
    if (!msg.read) await markAsRead(msg.id)
  }

  const filtered = messages.filter(m => filter === "all" ? true : filter === "unread" ? !m.read : m.read)
  const unread = messages.filter(m => !m.read).length

  if (loading) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: INK3 }}>Cargando…</span>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: PAPER, padding: "40px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link href="/admin/dashboard" style={{ color: INK3, display: "flex" }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: INK, lineHeight: 1 }}>Mensajes</h1>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3, marginTop: 4 }}>
              {unread} sin leer · {messages.length} en total
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {FILTERS.map(f => {
            const active = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 18px", borderRadius: 100,
                border: `1px solid ${active ? A : BORDER}`,
                background: active ? A : "transparent",
                color: active ? CREAM : INK3,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
                cursor: "pointer", transition: "all .15s",
              }}>
                {f === "all" ? "Todos" : f === "unread" ? `Sin leer · ${unread}` : `Leídos · ${messages.length - unread}`}
              </button>
            )
          })}
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 18, color: INK3 }}>
            No hay mensajes en este estado.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(msg => {
              const isExpanded = expandedId === msg.id
              return (
                <div key={msg.id} style={{
                  background: CREAM,
                  border: `1px solid ${!msg.read ? A : BORDER}`,
                  borderLeft: `3px solid ${!msg.read ? A : BORDER}`,
                  borderRadius: 2,
                }}>
                  <button onClick={() => handleExpand(msg)} style={{
                    width: "100%", textAlign: "left",
                    display: "flex", alignItems: "flex-start", gap: 16,
                    padding: "20px 24px", background: "none", border: "none", cursor: "pointer",
                  }}>
                    <div style={{ marginTop: 2, color: !msg.read ? A : INK3, flexShrink: 0 }}>
                      {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: msg.read ? 400 : 600, color: INK }}>
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <span style={{ background: A, color: CREAM, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100 }}>
                            Nuevo
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: INK2, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.subject}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: 10, color: INK3 }}>
                        <Clock size={10} />
                        {new Date(msg.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                      <div style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: INK, marginBottom: 8 }}>
                        {msg.subject}
                      </div>
                      <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: INK2, lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 20 }}>
                        {msg.message}
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: A, color: CREAM,
                          borderRadius: 2, padding: "10px 18px",
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                          textDecoration: "none",
                        }}>
                          <Mail size={13} /> Responder
                        </a>
                        <button onClick={() => deleteMessage(msg.id)} disabled={actionLoading.has(msg.id)} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#FDF2F2", border: "1px solid #F0B8BF", color: "#9B2335",
                          borderRadius: 2, padding: "10px 18px",
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                          cursor: "pointer", opacity: actionLoading.has(msg.id) ? 0.5 : 1,
                        }}>
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
