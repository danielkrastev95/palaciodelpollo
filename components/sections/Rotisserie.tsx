"use client"

import { useRef, useEffect, useState } from "react"

// Desktop: 40 frames. Mobile (<768px) o saveData: 20 frames (impares: 1,3,5…39).
// WebP se intenta primero; si no existe el servidor sirve el JPG como fallback.
const TOTAL_FRAMES_DESKTOP = 40
const TOTAL_FRAMES_MOBILE  = 20          // Solo frames impares
const SECTION_HEIGHT_VH    = 320

/** Números de frame a cargar según dispositivo (1-based, tal como están en /public) */
function getFrameNumbers(mobile: boolean): number[] {
  if (mobile) {
    // Frames impares: 1, 3, 5, … 39  (20 frames que cubren toda la animación)
    return Array.from({ length: TOTAL_FRAMES_MOBILE }, (_, i) => i * 2 + 1)
  }
  return Array.from({ length: TOTAL_FRAMES_DESKTOP }, (_, i) => i + 1)
}

/** Carga una imagen intentando WebP primero, con fallback a JPG */
function loadFrame(n: number, onLoad: () => void, onError: () => void): HTMLImageElement {
  const im = new Image()
  im.onload  = onLoad
  im.onerror = () => {
    // Prueba JPG si WebP falla (útil hasta que se conviertan los archivos)
    if (im.src.endsWith(".webp")) {
      im.onerror = onError
      im.src     = `/assets/frames/f${n}.jpg`
    } else {
      onError()
    }
  }
  im.src = `/assets/frames/f${n}.webp`
  return im
}

export default function Rotisserie() {
  const sectionRef  = useRef<HTMLElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const framesRef   = useRef<HTMLImageElement[]>([])
  const loadedRef   = useRef(0)
  const currentRef  = useRef(-1)
  const progressRef = useRef(0)
  const totalRef    = useRef(TOTAL_FRAMES_DESKTOP)  // actualizado tras detección

  const [loaded,   setLoaded]   = useState(0)
  const [total,    setTotal]    = useState(TOTAL_FRAMES_DESKTOP)
  const [progress, setProgress] = useState(0)
  const [saveData, setSaveData] = useState(false)

  // Preload frames — detecta mobile/saveData antes de cargar
  useEffect(() => {
    // saveData: no cargar nada, mostrar imagen estática
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) {
      setSaveData(true)
      return
    }

    const isMobile  = window.matchMedia("(max-width: 768px)").matches
    const frameNums = getFrameNumbers(isMobile)
    const frameCount = frameNums.length
    totalRef.current = frameCount
    setTotal(frameCount)

    const imgs: HTMLImageElement[] = new Array(frameCount)

    frameNums.forEach((n, i) => {
      imgs[i] = loadFrame(
        n,
        () => {
          loadedRef.current++
          setLoaded(loadedRef.current)
          if (loadedRef.current === frameCount) drawCurrent()
        },
        () => {
          loadedRef.current++
          setLoaded(loadedRef.current)
        },
      )
    })

    framesRef.current = imgs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fitCanvas = () => {
    const c = canvasRef.current
    if (!c) return
    const rect = c.getBoundingClientRect()
    const dpr  = Math.min(window.devicePixelRatio || 1, 2)
    c.width  = Math.round(rect.width  * dpr)
    c.height = Math.round(rect.height * dpr)
    const ctx = c.getContext("2d")!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    currentRef.current = -1
    drawCurrent()
  }

  useEffect(() => {
    if (saveData) return
    fitCanvas()
    const ro = new ResizeObserver(fitCanvas)
    if (canvasRef.current) ro.observe(canvasRef.current)
    window.addEventListener("resize", fitCanvas)
    return () => { ro.disconnect(); window.removeEventListener("resize", fitCanvas) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveData])

  const drawFrame = (idx: number) => {
    const c   = canvasRef.current
    const img = framesRef.current[idx]
    if (!c || !img || !img.complete || !img.naturalWidth) return
    const ctx  = c.getContext("2d")!
    const rect = c.getBoundingClientRect()
    const cw = rect.width, ch = rect.height
    const ir = img.naturalWidth / img.naturalHeight
    const cr = cw / ch
    let dw: number, dh: number, dx: number, dy: number
    if (ir > cr) {
      dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0
    } else {
      dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2
    }
    ctx.clearRect(0, 0, cw, ch)
    ctx.save()
    ctx.filter = "brightness(1.65) contrast(1.05) saturate(1.1)"
    ctx.drawImage(img, dx, dy, dw, dh)
    ctx.restore()
    currentRef.current = idx
  }

  const drawCurrent = () => {
    const t   = Math.max(0, Math.min(1, progressRef.current))
    const idx = Math.min(totalRef.current - 1, Math.floor(t * totalRef.current))
    if (idx !== currentRef.current) drawFrame(idx)
  }

  useEffect(() => {
    if (saveData) return
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const vh    = window.innerHeight
      const track = el.offsetHeight - vh
      const p     = track > 0 ? -rect.top / track : 0
      progressRef.current = p
      drawCurrent()
      setProgress(Math.max(0, Math.min(1, p)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveData])

  const revs        = Math.max(0, progress * (total / 14))
  const temp        = 180 + Math.round(progress * 95)
  const timeElapsed = Math.round(progress * 105)
  const frameNum    = Math.min(total, Math.floor(progress * total) + 1)

  // ── Fallback para saveData o navegadores sin JS/canvas ──────
  if (saveData) {
    return (
      <section
        className="rotisserie"
        ref={sectionRef}
        id="rotisserie"
        style={{ "--section-vh": "100vh" } as React.CSSProperties}
      >
        <div className="roti-stage">
          {/* Imagen estática: primer frame del pollo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/frames/f1.jpg"
            alt="Pollo en el espetón — El Palacio del Pollo"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.65) contrast(1.05) saturate(1.1)" }}
          />
          <div className="roti-vignette" />
          <div className="roti-chrome">
            <div className="roti-center">
              <div className="roti-kicker">El asado, minuto a minuto</div>
              <h2 className="roti-headline">
                <span className="roti-line">Girar</span>
                <span className="roti-line ital">sin</span>
                <span className="roti-line">pausa.</span>
              </h2>
              <div className="roti-sub">
                Un pollo. El espetón. El fuego.
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="rotisserie"
      ref={sectionRef}
      id="rotisserie"
      style={{ "--section-vh": `${SECTION_HEIGHT_VH}vh` } as React.CSSProperties}
    >
      <div className="roti-stage">
        <canvas ref={canvasRef} className="roti-canvas" />
        <div className="roti-vignette" />
        <div className="roti-grain" />

        {loaded < total && (
          <div className="roti-loading">
            <span
              className="roti-load-bar"
              style={{ width: `${(loaded / total) * 100}%` }}
            />
            <span className="roti-load-label">
              Encendiendo el horno · {loaded}/{total}
            </span>
          </div>
        )}

        <div className="roti-chrome">
          <div className="roti-top">
            <div className="roti-stamp">
              <span className="roti-stamp-dot" /> EN DIRECTO · COCINA
            </div>
            <div className="roti-cap">
              № 04.{String(frameNum).padStart(2, "0")}
              &nbsp;·&nbsp;FRAME {frameNum}/{total}
            </div>
          </div>

          <div className="roti-center">
            <div className="roti-kicker">El asado, minuto a minuto</div>
            <h2 className="roti-headline">
              <span className="roti-line">Girar</span>
              <span className="roti-line ital">sin</span>
              <span className="roti-line">pausa.</span>
            </h2>
            <div className="roti-sub">
              Un pollo. El espetón. El fuego.<br />
              <em>Desplaza</em> para verlo cocinarse.
            </div>
          </div>

          <div className="roti-counters">
            <div className="roti-counter">
              <span className="roti-counter-num">{String(timeElapsed).padStart(3, "0")}</span>
              <span className="roti-counter-label">min en fuego</span>
            </div>
            <div className="roti-counter accent">
              <span className="roti-counter-num">{revs.toFixed(2)}</span>
              <span className="roti-counter-label">revoluciones</span>
            </div>
            <div className="roti-counter">
              <span className="roti-counter-num">{temp}°</span>
              <span className="roti-counter-label">brasa</span>
            </div>
          </div>

          <div className="roti-bottom">
            <div className="roti-progress-track">
              <span
                className="roti-progress-fill"
                style={{ width: `${progress * 100}%` }}
              />
              {[0.25, 0.5, 0.75].map((t) => (
                <span key={t} className="roti-tick" style={{ left: `${t * 100}%` }} />
              ))}
            </div>
            <div className="roti-progress-labels">
              <span>CRUDO</span>
              <span>PIEL DORADA</span>
              <span>JUGOSO</span>
              <span>LISTO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
