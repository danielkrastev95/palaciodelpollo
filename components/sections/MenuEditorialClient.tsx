"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { supabase, isOwnImage } from "@/lib/supabase"
import { MENU_DATA } from "@/lib/content"

/* ── Tipos Supabase ── */
interface DBCategory {
  id: number
  name: string
  slug: string
  description: string | null
  display_order: number
}

interface DBItem {
  id: number
  name: string
  description: string | null
  price: number
  category_id: number
  available: boolean
  featured: boolean
  display_order: number
  image_url: string | null
}

/* ── Formato interno unificado (DB o estático) ── */
interface MenuCat  { id: string; label: string; note?: string | null; count: number }
interface MenuItem { name: string; desc?: string | null; price: number; featured?: boolean; image?: string | null }

/* ─────────────────────────────────────── */

function formatPrice(p: number) {
  const [e, c] = p.toFixed(2).split(".")
  return (
    <>
      {e}<span className="cents">,{c}€</span>
    </>
  )
}

function Lightbox({ src, name, desc, price, onClose, triggerRef }: {
  src: string; name: string; desc?: string | null; price: number
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}) {
  const dialogRef  = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const titleId    = "lb-title"

  /* Focus trap + Escape */
  useEffect(() => {
    closeBtnRef.current?.focus()

    const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return }
      if (e.key !== "Tab") return
      const els = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (!els.length) return
      const first = els[0]; const last = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener("keydown", onKey)
    const trigger = triggerRef?.current
    return () => {
      document.removeEventListener("keydown", onKey)
      // Devuelve el foco al botón que abrió el lightbox
      trigger?.focus()
    }
  }, [onClose, triggerRef])

  return (
    <div
      className="lb-backdrop"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(26,20,16,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="lb-card"
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          maxWidth: 540, width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        <Image
          src={src}
          alt={name}
          width={540}
          height={405}
          sizes="(max-width: 600px) 100vw, 540px"
          unoptimized={!isOwnImage(src)}
          style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
        />
        <div className="lb-info" style={{ padding: "20px 24px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: desc ? 6 : 0 }}>
            <span id={titleId} style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)" }}>{name}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--ink)", whiteSpace: "nowrap" }}>
              {formatPrice(price)}
            </span>
          </div>
          {desc && <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 15, color: "var(--ink-2)", lineHeight: 1.4 }}>{desc}</p>}
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Cerrar imagen"
            style={{
              marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--ink-3)", background: "none", border: "none",
              cursor: "pointer", padding: 0,
            }}
          >
            Cerrar ×
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuRow({ name, desc, price, featured, image, onImageClick, imgBtnRef }: MenuItem & {
  onImageClick?: () => void
  imgBtnRef?: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className={`menu-row ${image ? "menu-row--img" : ""}`}>
      <div className="menu-row-name">
        {name}
        {featured && (
          <span className="menu-row-tags">
            <span className="menu-tag fire">recomendado</span>
          </span>
        )}
      </div>
      {desc && <div className="menu-row-desc">{desc}</div>}
      <div className="menu-row-price">{formatPrice(price)}</div>
      {image && (
        <button
          ref={imgBtnRef}
          type="button"
          onClick={onImageClick}
          aria-label={`Ver foto de ${name}`}
          style={{
            padding: 0, border: "none", background: "none",
            cursor: "zoom-in", display: "block", lineHeight: 0,
          }}
        >
          <Image
            className="menu-row-img"
            src={image}
            alt=""
            aria-hidden="true"
            width={88}
            height={88}
            sizes="88px"
            unoptimized={!isOwnImage(image)}
            style={{ objectFit: "cover", display: "block" }}
          />
        </button>
      )}
    </div>
  )
}

function CategoryNote({ note }: { note?: string | null }) {
  if (!note) return null
  return (
    <div style={{
      marginBottom: 20,
      padding: "10px 14px",
      background: "var(--paper-2)",
      borderLeft: "2px solid var(--ember)",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--ink-2)",
    }}>
      {note}
    </div>
  )
}

/* ─────────────────────────────────────── */

export default function MenuEditorialClient() {
  const [cats,      setCats]      = useState<MenuCat[]>([])
  const [itemMap,   setItemMap]   = useState<Record<string, MenuItem[]>>({})
  const [active,    setActive]    = useState("")
  const [loading,   setLoading]   = useState(true)
  const [lightbox,  setLightbox]  = useState<MenuItem | null>(null)
  const triggerRef                = useRef<HTMLButtonElement | null>(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    /* ── Sin Supabase: usar datos estáticos de lib/content.ts ── */
    if (!supabase) {
      const staticCats: MenuCat[] = Object.entries(MENU_DATA).map(([id, cat]) => ({
        id,
        label: cat.label,
        note:  cat.note,
        count: cat.items.length,
      }))
      const staticMap: Record<string, MenuItem[]> = Object.fromEntries(
        Object.entries(MENU_DATA).map(([id, cat]) => [
          id,
          cat.items.map(it => ({
            name:     it.name,
            desc:     it.desc,
            price:    it.price,
            featured: it.tags.includes("fire"),
          })),
        ])
      )
      setCats(staticCats)
      setItemMap(staticMap)
      setActive(staticCats[0]?.id ?? "")
      setLoading(false)
      return
    }

    /* ── Con Supabase: leer categorías e ítems ── */
    async function fetchMenu() {
      const [catsRes, itemsRes] = await Promise.all([
        supabase!.from("categories").select("*").order("display_order"),
        supabase!.from("menu_items").select("*").eq("available", true).order("display_order"),
      ])

      const dbCats:  DBCategory[] = catsRes.data  ?? []
      const dbItems: DBItem[]     = itemsRes.data  ?? []

      // Construir catálogo unificado
      const newCats: MenuCat[] = dbCats.map(c => ({
        id:    c.slug,
        label: c.name,
        note:  c.description,
        count: dbItems.filter(i => i.category_id === c.id).length,
      }))

      const newMap: Record<string, MenuItem[]> = {}
      for (const cat of dbCats) {
        newMap[cat.slug] = dbItems
          .filter(i => i.category_id === cat.id)
          .map(i => ({
            name:     i.name,
            desc:     i.description,
            price:    i.price,
            featured: i.featured,
            image:    i.image_url,
          }))
      }

      setCats(newCats)
      setItemMap(newMap)
      setActive(newCats[0]?.id ?? "")
      setLoading(false)
    }

    fetchMenu()
  }, [])

  /* ── Estado de carga ── */
  if (loading) {
    return (
      <section className="menu-section" id="carta">
        <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
          <div className="mono" style={{ color: "var(--ink-3)", letterSpacing: "0.2em", fontSize: 11 }}>
            Cargando carta…
          </div>
        </div>
      </section>
    )
  }

  const currentCat   = cats.find(c => c.id === active)
  const currentItems = itemMap[active] ?? []
  const mid          = Math.ceil(currentItems.length / 2)
  const colA         = currentItems.slice(0, mid)
  const colB         = currentItems.slice(mid)

  return (
    <section className="menu-section" id="carta">
      <div className="container">
        <div className="chapter">
          <span className="chapter-num">Cap. II</span>
          <span className="chapter-label">La Carta</span>
          <span className="chapter-line" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 30 }}>
          <h2 className="section-title">Qué comer <em>hoy</em>.</h2>
          <div className="mono" style={{ color: "var(--ink-3)" }}>
            Precios con IVA · Consulte alérgenos
          </div>
        </div>

        {/* Tabs */}
        <div className="menu-tabs">
          {cats.map((c) => (
            <button
              key={c.id}
              className={`menu-tab ${active === c.id ? "active" : ""}`}
              onClick={() => setActive(c.id)}
            >
              {c.label}
              <span className="count">{c.count}</span>
            </button>
          ))}
        </div>

        {/* Nota de categoría (p.ej. "Incluye: patatas fritas…") */}
        <CategoryNote note={currentCat?.note} />

        {/* Grid de platos en 2 columnas */}
        <div className="menu-grid">
          <div>{colA.map((it) => (
            <MenuRow
              key={it.name} {...it}
              imgBtnRef={it.image ? triggerRef : undefined}
              onImageClick={it.image ? () => setLightbox(it) : undefined}
            />
          ))}</div>
          <div>{colB.map((it) => (
            <MenuRow
              key={it.name} {...it}
              imgBtnRef={it.image ? triggerRef : undefined}
              onImageClick={it.image ? () => setLightbox(it) : undefined}
            />
          ))}</div>
        </div>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div className="mono" style={{ color: "var(--ink-3)" }}>
            <span style={{ color: "var(--ember)", marginRight: 8 }}>◆ recomendado</span>
          </div>
          <a href="#reservar" className="btn">Reservar una mesa →</a>
        </div>
      </div>

      {lightbox?.image && (
        <Lightbox
          src={lightbox.image}
          name={lightbox.name}
          desc={lightbox.desc}
          price={lightbox.price}
          onClose={closeLightbox}
          triggerRef={triggerRef}
        />
      )}
    </section>
  )
}
