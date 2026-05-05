"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const links = [
  { label: "Cómo lo hacemos", href: "/#ritual" },
  { label: "La carta",        href: "/#carta" },
  { label: "Opiniones",       href: "/#voces" },
  { label: "La casa",         href: "/#casa" },
  { label: "Encargar",        href: "/encargar" },
]

export default function Navbar() {
  const [open,    setOpen]    = useState(false)
  const [instant, setInstant] = useState(false)  // cierre sin animación (al navegar)
  const panelRef        = useRef<HTMLDivElement>(null)
  const toggleRef       = useRef<HTMLButtonElement>(null)

  /* ── Focus trap + Escape cuando el panel mobile está abierto ── */
  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    if (!panel) return

    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const els = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
    els[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== "Tab") return
      if (els.length === 0) { e.preventDefault(); return }
      const first = els[0]
      const last  = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  // Cerrar siempre es instantáneo en móvil — la animación es solo para abrir.
  const close = () => {
    setInstant(true)
    setOpen(false)
    toggleRef.current?.focus()
  }
  const closeFromLink = () => {
    setInstant(true)
    setOpen(false)
  }

  // Reset modo instant al reabrir
  useEffect(() => {
    if (open) setInstant(false)
  }, [open])

  return (
    <>
      <nav className="nav" aria-label="Navegación principal">
        <div className="container nav-inner">
          <Link href="/" className="nav-brand">
            <span className="dot" />
            <span>El Palacio <em style={{ color: "var(--ember)" }}>del</em> Pollo</span>
          </Link>

          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </div>

          <div className="nav-cta">
            <a className="nav-phone" href="tel:+34918953216">+34 918 95 32 16</a>
            <a href="tel:+34918953216" className="btn ember" style={{ padding: "10px 18px" }}>
              Llamar
            </a>
            <button
              ref={toggleRef}
              className="nav-mobile-btn"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M2 2l14 14M16 2L2 16" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M2 5h14M2 9h14M2 13h14" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`nav-mobile-panel ${open ? "open" : ""} ${instant ? "instant" : ""}`}
      >
        <div className="nav-mobile-header">
          <span className="nav-mobile-brand">
            <span className="dot" /> El Palacio <em>del</em> Pollo
          </span>
          <button
            className="nav-mobile-close"
            aria-label="Cerrar menú"
            onClick={close}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 3l16 16M19 3L3 19" />
            </svg>
          </button>
        </div>

        <div className="nav-mobile-label">Cap. I · Navegación</div>

        <nav className="nav-mobile-links" aria-label="Enlaces principales">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={closeFromLink}>
              <span className="nav-mobile-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="nav-mobile-label-link">{l.label}</span>
              <span className="nav-mobile-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>

        <a
          href="tel:+34918953216"
          className="nav-mobile-phone"
          onClick={closeFromLink}
          aria-label="Llamar al restaurante"
        >
          <span className="nav-mobile-phone-icon" aria-hidden="true">☎</span>
          <span className="nav-mobile-phone-num">+34 918 95 32 16</span>
        </a>

        <div className="nav-mobile-footer">
          <div>
            <span className="nav-mobile-foot-label">Dirección</span>
            <span className="nav-mobile-foot-val">Calle Pozo Chico 30 · Valdemoro</span>
          </div>
        </div>
      </div>
    </>
  )
}
