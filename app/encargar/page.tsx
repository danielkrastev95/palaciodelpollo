"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { MENU_DATA } from "@/lib/content"
import { TIMES, toDateString, buildCalendarCells, buildToday, isSlotBookable } from "@/lib/calendar"
import { nameErr, phoneErr, emailErr } from "@/lib/validators"
import FieldError from "@/components/ui/FieldError"
import CalendarWidget from "@/components/ui/CalendarWidget"

function euros(n: number) {
  return n.toFixed(2).replace(".", ",") + " €"
}

/* ─── Tipos ─── */
interface DBCategory { id: number; name: string; slug: string; description: string | null; display_order: number }
interface DBItem     { id: number; name: string; description: string | null; price: number; category_id: number; available: boolean; display_order: number }
interface Item       { id: string; name: string; desc?: string | null; price: number }
interface Cat        { id: string; label: string; items: Item[] }

/* ─── Página principal ─── */
export default function EncargarPage() {
  const now = new Date()

  /* Carta */
  const [cats,        setCats]        = useState<Cat[]>([])
  const [activeCat,   setActiveCat]   = useState("")
  const [loadingMenu, setLoadingMenu] = useState(true)

  /* Carrito: item.id → cantidad — persiste en localStorage */
  const [cart, setCart] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {}
    try { return JSON.parse(localStorage.getItem("palacio-cart") ?? "{}") } catch { return {} }
  })

  /* Calendario */
  const [viewMonth,    setViewMonth]    = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [selectedDay,  setSelectedDay]  = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  /* Formulario */
  const [name,        setName]        = useState("")
  const [phone,       setPhone]       = useState("")
  const [email,       setEmail]       = useState("")
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [touched,     setTouched]     = useState<Record<string, boolean>>({})

  const errs = { name: nameErr(name), phone: phoneErr(phone), email: emailErr(email) }
  const touch = (field: string) => setTouched(p => ({ ...p, [field]: true }))

  /* Calendario helpers */
  const y     = viewMonth.getFullYear()
  const m     = viewMonth.getMonth()
  const today = buildToday()
  const cells = buildCalendarCells(y, m)

  /* Scroll al carrito (desde el FAB flotante) */
  const cartRef = useRef<HTMLDivElement>(null)
  const scrollToCart = () => {
    cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  /* ── Persistir carrito en localStorage ── */
  useEffect(() => {
    try { localStorage.setItem("palacio-cart", JSON.stringify(cart)) } catch {}
  }, [cart])

  /* ── Cargar carta desde Supabase (con fallback estático) ── */
  useEffect(() => {
    if (!supabase) {
      const staticCats: Cat[] = Object.entries(MENU_DATA).map(([id, cat]) => ({
        id,
        label: cat.label,
        items: cat.items.map((it, i) => ({
          id:   `${id}-${i}`,
          name:  it.name,
          desc:  it.desc,
          price: it.price,
        })),
      }))
      setCats(staticCats)
      setActiveCat(staticCats[0]?.id ?? "")
      setLoadingMenu(false)
      return
    }

    async function fetchMenu() {
      const [catsRes, itemsRes] = await Promise.all([
        supabase!.from("categories").select("*").order("display_order"),
        supabase!.from("menu_items").select("*").eq("available", true).order("display_order"),
      ])
      const dbCats:  DBCategory[] = catsRes.data  ?? []
      const dbItems: DBItem[]     = itemsRes.data  ?? []

      const unified: Cat[] = dbCats.map(c => ({
        id:    c.slug,
        label: c.name,
        items: dbItems
          .filter(i => i.category_id === c.id)
          .map(i => ({ id: String(i.id), name: i.name, desc: i.description, price: i.price })),
      }))
      setCats(unified)
      setActiveCat(unified[0]?.id ?? "")
      setLoadingMenu(false)
    }
    fetchMenu()
  }, [])

  /* ── Carrito helpers ── */
  const addItem = (id: string) =>
    setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  const removeItem = (id: string) =>
    setCart(prev => {
      const next = { ...prev }
      if ((next[id] ?? 0) <= 1) delete next[id]
      else next[id]--
      return next
    })

  const allItems   = cats.flatMap(c => c.items)
  const cartItems  = allItems.filter(i => (cart[i.id] ?? 0) > 0)
  const cartTotal  = cartItems.reduce((s, i) => s + i.price * (cart[i.id] ?? 0), 0)
  const cartCount  = Object.values(cart).reduce((s, q) => s + q, 0)
  const visItems   = cats.find(c => c.id === activeCat)?.items ?? []

  const dayName = selectedDay
    ? new Date(y, m, selectedDay).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
    : ""

  const canSubmit = cartCount > 0 && selectedDay !== null && selectedTime !== null
    && !errs.name && !errs.phone && !errs.email

  /* ── Envío ── */
  const submit = async () => {
    setTouched({ name: true, phone: true, email: true })
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setSubmitError(false)
    const notes = [
      ...cartItems.map(i => `${cart[i.id]}× ${i.name} — ${euros(i.price * cart[i.id])}`),
      "─────────────────────────",
      `TOTAL: ${euros(cartTotal)}`,
    ].join("\n")
    try {
      const res = await fetch("/api/encargos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:  name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          date:  toDateString(y, m, selectedDay!),
          time:  selectedTime!,
          notes,
        }),
      })
      if (!res.ok) throw new Error("Error del servidor")
      setSubmitted(true)
    } catch (err) {
      console.error("[EncargarPage] Error al guardar:", err)
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setCart({}); setSelectedDay(null); setSelectedTime(null)
    setName(""); setPhone(""); setEmail(""); setSubmitted(false); setSubmitError(false)
    setTouched({})
    try { localStorage.removeItem("palacio-cart") } catch {}
  }

  /* ══════════════════════════════════════
     PANTALLA DE ÉXITO
  ══════════════════════════════════════ */
  if (submitted) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--ember)", color: "var(--cream)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 28px",
            border: "2px solid var(--ink)",
            boxShadow: "0 0 0 4px var(--paper), 0 0 0 5px var(--ink)",
          }}>✓</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 38, lineHeight: 1, marginBottom: 14 }}>
            Gracias, {name.split(" ")[0]}.
          </h2>
          <p className="serif" style={{ fontSize: 19, color: "var(--ink-2)", marginBottom: 10 }}>
            Recogida el {dayName} a las {selectedTime}.
          </p>
          <p className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>
            {cartItems.map(i => `${cart[i.id]}× ${i.name}`).join(" · ")}
          </p>
          <p className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ember)", marginBottom: 32 }}>
            Total estimado: {euros(cartTotal)} · Te llamamos al {phone}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn ember" onClick={reset}>Hacer otro pedido</button>
            <Link href="/" className="btn">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════
     PÁGINA PRINCIPAL
  ══════════════════════════════════════ */
  return (
    <>
      {/* ── Cabecera de página ── */}
      <div style={{ borderBottom: "1px solid var(--ink)", paddingTop: 40, paddingBottom: 32 }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 10 }}>
                <Link href="/" style={{ color: "inherit" }}>← Inicio</Link>
                &nbsp;·&nbsp;Encargos para llevar
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "clamp(34px, 6vw, 60px)", lineHeight: 0.95, letterSpacing: "-0.02em",
              }}>
                Elige lo que<br /><em style={{ color: "var(--ember)" }}>quieres.</em>
              </h1>
            </div>
            <p className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", textAlign: "right" }}>
              Recogida en local · 12:00 — 16:00<br />
              Todos los días · +34 918 95 32 16
            </p>
          </div>
        </div>
      </div>

      {/* ── Layout: carta + carrito ── */}
      <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <div className="order-layout">

          {/* ══ IZQUIERDA: Carta ══ */}
          <div>
            {loadingMenu ? (
              <div className="mono" style={{ color: "var(--ink-3)", letterSpacing: "0.2em", padding: "60px 0" }}>Cargando carta…</div>
            ) : (
              <>
                {/* Tabs de categorías */}
                <div className="menu-tabs" style={{ marginBottom: 24 }}>
                  {cats.map(c => (
                    <button
                      key={c.id}
                      className={`menu-tab ${activeCat === c.id ? "active" : ""}`}
                      onClick={() => setActiveCat(c.id)}
                    >
                      {c.label}
                      <span className="count">{c.items.length}</span>
                    </button>
                  ))}
                </div>

                {/* Lista de platos */}
                <div>
                  {visItems.map(item => {
                    const qty = cart[item.id] ?? 0
                    return (
                      <div key={item.id} className="order-item">
                        {/* Info */}
                        <div className="order-item-info">
                          <div style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 19, fontWeight: 400,
                            letterSpacing: "-0.01em",
                            color: "var(--ink)", lineHeight: 1.25,
                          }}>
                            {item.name}
                          </div>
                          {item.desc && (
                            <div className="mono" style={{
                              fontSize: 9, letterSpacing: "0.12em",
                              textTransform: "uppercase", color: "var(--ink-3)", marginTop: 3,
                            }}>
                              {item.desc}
                            </div>
                          )}
                        </div>

                        {/* Precio */}
                        <div className="order-item-price" style={{
                          fontFamily: "var(--font-display)", fontStyle: "italic",
                          fontSize: 17, color: "var(--ink)",
                        }}>
                          {euros(item.price)}
                        </div>

                        {/* Controles de cantidad */}
                        <div className="order-item-qty">
                          <button
                            className="qty-btn"
                            onClick={() => removeItem(item.id)}
                            disabled={qty === 0}
                            aria-label={`Quitar ${item.name}`}
                            style={{
                              background: qty > 0 ? "var(--ink)" : "transparent",
                              color:      qty > 0 ? "var(--paper)" : "var(--ink-3)",
                            }}
                          >−</button>

                          <span className="qty-num" aria-live="polite" aria-label={`${qty} de ${item.name}`} style={{ color: qty > 0 ? "var(--ember)" : "var(--ink-3)" }}>
                            {qty}
                          </span>

                          <button className="qty-btn add" onClick={() => addItem(item.id)} aria-label={`Añadir ${item.name}`}>+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* ══ DERECHA: Carrito + Formulario ══ */}
          <div className="order-sidebar" ref={cartRef}>
            <div className="order-cart-panel">
              {/* Cabecera del carrito */}
              <div style={{
                padding: "13px 20px",
                background: "var(--ink)",
                color: "var(--paper)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                  Tu pedido
                </span>
                {cartCount > 0 && (
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--gold-2)" }}>
                    {cartCount} {cartCount === 1 ? "plato" : "platos"} · {euros(cartTotal)}
                  </span>
                )}
              </div>

              <div style={{ padding: 20 }}>

                {/* Lista del carrito */}
                {cartItems.length === 0 ? (
                  <p className="order-empty">Aún no has añadido nada.<br />Empieza por la carta.</p>
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-line">
                        <div className="cart-line-info">
                          <div className="cart-line-name">{item.name}</div>
                          <div className="cart-line-unit">{euros(item.price)} · ud.</div>
                        </div>
                        <div className="cart-line-controls">
                          <button
                            className="qty-btn qty-btn-sm"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Quitar ${item.name}`}
                          >−</button>
                          <span className="qty-num" style={{ color: "var(--ember)" }}>{cart[item.id]}</span>
                          <button
                            className="qty-btn qty-btn-sm add"
                            onClick={() => addItem(item.id)}
                            aria-label={`Añadir ${item.name}`}
                          >+</button>
                        </div>
                        <div className="cart-line-subtotal">
                          {euros(item.price * cart[item.id])}
                        </div>
                      </div>
                    ))}
                    <div className="order-total">
                      <span className="order-total-label">Total estimado</span>
                      <span className="order-total-value">{euros(cartTotal)}</span>
                    </div>
                  </div>
                )}

                {/* Separador */}
                <div style={{ borderTop: "1px solid var(--paper-3)", paddingTop: 16 }}>

                  {/* Calendario */}
                  <div style={{ marginBottom: 14 }}>
                    <label className="res-label">Día de recogida</label>
                    <CalendarWidget
                      y={y} m={m} selectedDay={selectedDay} today={today} cells={cells}
                      onPrev={() => { setViewMonth(new Date(y, m - 1, 1)); setSelectedDay(null); setSelectedTime(null) }}
                      onNext={() => { setViewMonth(new Date(y, m + 1, 1)); setSelectedDay(null); setSelectedTime(null) }}
                      onSelect={(d) => { setSelectedDay(d); setSelectedTime(null) }}
                    />
                  </div>

                  {/* Horario */}
                  <div style={{ marginBottom: 14 }}>
                    <label className="res-label">Hora de recogida</label>
                    <div className="times" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                      {TIMES.map(t => {
                        const dateStr = selectedDay ? toDateString(y, m, selectedDay) : null
                        const past = dateStr ? !isSlotBookable(dateStr, t) : false
                        const disabled = !selectedDay || past
                        return (
                          <button
                            key={t}
                            className={`time-btn ${selectedTime === t ? "active" : ""} ${disabled ? "disabled" : ""}`}
                            disabled={disabled}
                            onClick={() => !disabled && setSelectedTime(t)}
                          >{t}</button>
                        )
                      })}
                    </div>
                    {selectedDay && (() => {
                      const dateStr = toDateString(y, m, selectedDay)
                      const allPast = TIMES.every(t => !isSlotBookable(dateStr, t))
                      return allPast ? (
                        <p
                          role="status"
                          style={{
                            marginTop: 8,
                            fontFamily: "var(--font-body)",
                            fontSize: 14,
                            color: "var(--ember)",
                            fontStyle: "italic",
                          }}
                        >
                          Hoy ya no admitimos encargos. Elige otro día.
                        </p>
                      ) : null
                    })()}
                  </div>

                  {/* Nombre */}
                  <div className="res-field" style={{ marginBottom: 10 }}>
                    <label className="res-label" htmlFor="enc-name">Tu nombre</label>
                    <input
                      id="enc-name"
                      type="text"
                      className="res-input italic"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onBlur={() => touch("name")}
                      placeholder="Nombre y apellido"
                      aria-required="true"
                      aria-invalid={touched.name && !!errs.name}
                      aria-describedby={touched.name && errs.name ? "enc-name-err" : undefined}
                      style={{ borderColor: touched.name && errs.name ? "var(--ember)" : undefined }}
                    />
                    {touched.name && errs.name && <FieldError id="enc-name-err" msg={errs.name} />}
                  </div>

                  {/* Teléfono */}
                  <div className="res-field" style={{ marginBottom: 10 }}>
                    <label className="res-label" htmlFor="enc-phone">Teléfono</label>
                    <input
                      id="enc-phone"
                      type="tel"
                      className="res-input mono"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/[^\d+\s\-().]/g, ""))}
                      onBlur={() => touch("phone")}
                      placeholder="600 00 00 00"
                      aria-required="true"
                      aria-invalid={touched.phone && !!errs.phone}
                      aria-describedby={touched.phone && errs.phone ? "enc-phone-err" : undefined}
                      style={{ borderColor: touched.phone && errs.phone ? "var(--ember)" : undefined }}
                    />
                    {touched.phone && errs.phone && <FieldError id="enc-phone-err" msg={errs.phone} />}
                  </div>

                  {/* Email */}
                  <div className="res-field" style={{ marginBottom: 16 }}>
                    <label className="res-label" htmlFor="enc-email">Email</label>
                    <input
                      id="enc-email"
                      type="email"
                      className="res-input mono"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => touch("email")}
                      placeholder="tu@email.com"
                      aria-required="true"
                      aria-invalid={touched.email && !!errs.email}
                      aria-describedby={touched.email && errs.email ? "enc-email-err" : undefined}
                      style={{ borderColor: touched.email && errs.email ? "var(--ember)" : undefined }}
                    />
                    {touched.email && errs.email && <FieldError id="enc-email-err" msg={errs.email} />}
                  </div>

                  {/* Error */}
                  {submitError && (
                    <div style={{
                      marginBottom: 12, padding: "10px 12px",
                      background: "rgba(201,75,31,0.08)",
                      border: "1px solid var(--ember)", borderRadius: 2,
                      fontFamily: "var(--font-mono)", fontSize: 9,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: "var(--ember)",
                    }}>
                      Error al guardar — llámanos al +34 918 95 32 16
                    </div>
                  )}

                  {/* Resumen */}
                  {selectedDay && selectedTime && cartCount > 0 && (
                    <div style={{
                      marginBottom: 12, padding: "8px 10px",
                      background: "rgba(26,20,16,0.04)", borderRadius: 2,
                      fontFamily: "var(--font-mono)", fontSize: 9,
                      letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-2)",
                    }}>
                      Recogida el {dayName} a las {selectedTime} · {euros(cartTotal)}
                    </div>
                  )}

                  {/* Botón de envío */}
                  <button
                    className="btn ember"
                    style={{ width: "100%", justifyContent: "center", padding: "14px", opacity: (!canSubmit || submitting) ? 0.5 : 1 }}
                    onClick={submit}
                    disabled={!canSubmit || submitting}
                  >
                    {submitting ? "Enviando…" : "Confirmar pedido →"}
                  </button>

                  {/* Hint de validación */}
                  {!canSubmit && (
                    <p className="mono" style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)", textAlign: "center", marginTop: 8 }}>
                      {cartCount === 0
                        ? "Añade platos para continuar"
                        : !selectedDay || !selectedTime
                          ? "Elige día y hora de recogida"
                          : "Completa tu nombre y teléfono"}
                    </p>
                  )}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FAB carrito flotante */}
      {cartCount > 0 && (
        <button
          type="button"
          onClick={scrollToCart}
          className="cart-fab"
          aria-label={`Ver pedido — ${cartCount} ${cartCount === 1 ? "plato" : "platos"}, total ${euros(cartTotal)}`}
        >
          <span className="cart-fab-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            <span className="cart-fab-count">{cartCount}</span>
          </span>
          <span className="cart-fab-text">
            <span className="cart-fab-label">Ver pedido</span>
            <span className="cart-fab-total">{euros(cartTotal)}</span>
          </span>
          <span className="cart-fab-arrow" aria-hidden="true">↓</span>
        </button>
      )}
    </>
  )
}
