"use client"

import Image from "next/image"
import Link from "next/link"

function Embers() {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    animationDelay: `${(i * 0.27) % 4}s`,
    animationDuration: `${3.5 + (i % 5) * 0.4}s`,
    tx: `${((i * 53) % 80) - 40}px`,
  }))

  return (
    <div className="embers">
      {dots.map((d, i) => (
        <span
          key={i}
          className="ember-dot"
          style={{
            left: d.left,
            animationDelay: d.animationDelay,
            animationDuration: d.animationDuration,
            "--tx": d.tx,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        {/* Main grid */}
        <div className="hero-grid">
          {/* Left: text */}
          <div>
            <div className="stamp" style={{ marginBottom: 20 }}>
              <span style={{ color: "var(--ember)" }}>✦</span>
              Asador · Valdemoro
              <span style={{ color: "var(--ember)" }}>✦</span>
            </div>

            <h1 className="hero-title">
              El<br />
              Pa<span className="w-light">lacio</span><br />
              <em>del Pollo</em>
            </h1>

            <p className="hero-sub">
              Pollos asados, costillar a la BBQ y platos caseros de los de toda la vida.
              Para llevar, para quedarse, para domingo en familia.
            </p>

            <div className="hero-ctas">
              <Link href="/encargar" className="btn ember">Encargar pollo →</Link>
              <Link href="/#carta" className="btn ghost">Ver la carta</Link>
            </div>
          </div>

          {/* Right: image */}
          <div style={{ position: "relative" }}>
            <div className="hero-image-wrap">
              <Image
                src="/assets/hero-chicken.jpg"
                alt="Pollo a la brasa girando sobre las brasas"
                fill
                priority
                sizes="(max-width: 820px) 100vw, 50vw"
                style={{ objectFit: "cover", filter: "saturate(0.92) contrast(1.05)" }}
              />
              <Embers />
              <div className="hero-image-caption">FOTOGRAFÍA · 2026 · COCINA</div>
            </div>

            {/* Floating price badge */}
            <div className="hero-badge" style={{
              position: "absolute", top: -18, right: -14,
              background: "var(--ember)", color: "var(--cream)",
              padding: "18px 20px", borderRadius: "50%",
              width: 120, height: 120,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center", transform: "rotate(8deg)",
              border: "2px solid var(--ink)",
              boxShadow: "0 0 0 4px var(--paper), 0 0 0 5px var(--ink)",
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em",
            }}>
              <span style={{ fontSize: 9, opacity: 0.8 }}>DESDE</span>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 28, lineHeight: 1, margin: "4px 0" }}>15€</span>
              <span style={{ fontSize: 8, opacity: 0.9 }}>MENÚ FAMILIAR</span>
            </div>
          </div>
        </div>

        {/* Marquee row */}
        <div className="hero-marquee">
          <span>Para llevar</span>
          <span className="star">◆</span>
          <span>A domicilio</span>
          <span className="star">◆</span>
          <span>Asador familiar</span>
          <span className="star">◆</span>
          <span>Pollo asado</span>
          <span className="star">◆</span>
          <span>Postres caseros</span>
        </div>
      </div>
    </section>
  )
}
