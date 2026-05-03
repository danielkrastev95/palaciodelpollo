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
  const [open, setOpen] = useState(false)
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

  const close = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

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
        className={`nav-mobile-panel ${open ? "open" : ""}`}
        style={{ zIndex: 999 }}
      >
        <button
          aria-label="Cerrar menú"
          style={{
            position: "absolute", top: 20, right: 20,
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--ink-3)",
          }}
          onClick={close}
        >
          Cerrar ×
        </button>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
        <a
          href="tel:+34918953216"
          className="btn ember"
          style={{ alignSelf: "flex-start", marginTop: 8 }}
          onClick={close}
        >
          Llamar · +34 918 95 32 16
        </a>
      </div>
    </>
  )
}
