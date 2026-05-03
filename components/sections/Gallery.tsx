import Image from "next/image"

export default function Gallery() {
  return (
    <section className="gallery" id="casa">
      <div className="container">
        <div className="chapter">
          <span className="chapter-num">Cap. V</span>
          <span className="chapter-label">La Casa · Sensorial</span>
          <span className="chapter-line" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 30 }}>
          <h2 className="section-title">Un <em>domingo</em><br />cualquiera.</h2>
          <p className="serif" style={{ fontSize: 20, maxWidth: 340, color: "var(--ink-2)" }}>
            Pozo Chico, 28. Las 13:30. Los pollos salen del asador, la terraza se llena, huele a casa.
          </p>
        </div>

        <div className="gallery-grid">
          {/* g-a: image tile */}
          <div className="gallery-tile image g-a">
            <Image
              src="/assets/chicken-square.jpg"
              alt="Pollo girando sobre brasas"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: "cover", opacity: 0.8 }}
            />
            <span>↘ LA BRASA · 180°C</span>
          </div>

          {/* g-b: ember big quote */}
          <div className="gallery-tile ember g-b">
            <span className="big">
              «Para llevar,<br /><em>para quedarse</em>,<br />para domingo.»
            </span>
          </div>

          {/* g-c: striped */}
          <div className="gallery-tile striped g-c">
            <span>↘ COMEDOR · 250 PLAZAS</span>
          </div>

          {/* g-d: ink price */}
          <div className="gallery-tile ink g-d">
            <span className="big"><em>11,90€</em></span>
            <span className="tile-corner-label" style={{ color: "var(--gold-2)" }}>
              POLLO ENTERO + PATATAS
            </span>
          </div>

          {/* g-e: text lema */}
          <div className="gallery-tile g-e">
            <div className="tile-quote-wrap">
              <div className="tile-quote">
                «La mejor<br />comida es la<br />que hacían en<br /><em>casa de tu<br />abuela.»</em>
              </div>
              <div className="mono tile-quote-attr">— LEMA DE LA CASA</div>
            </div>
          </div>

          {/* g-f: gold ticket */}
          <div className="gallery-tile gold g-f">
            <span className="big">15€</span>
            <span className="tile-corner-label">TICKET MEDIO</span>
          </div>

          {/* g-g: paper-3 tagline */}
          <div className="gallery-tile g-g tile-tagline-wrap">
            <span className="tile-tagline">
              Casero · <span className="tile-tagline-sub">rápido</span> · para todos los días
            </span>
          </div>

          {/* g-h: ink CTA */}
          <div className="gallery-tile g-h tile-cta-wrap">
            <div>
              <div className="tile-cta-title">Llama y encarga.</div>
              <div className="mono tile-cta-phone">+34 918 95 32 16</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
