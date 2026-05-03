"use client"

import { useState, useEffect } from "react"
import { VOICES } from "@/lib/content"

export default function Voices() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % VOICES.length), 7000)
    return () => clearInterval(t)
  }, [])

  const cur = VOICES[idx]

  return (
    <section className="voices" id="voces">
      <div className="container">
        <div className="chapter">
          <span className="chapter-num">Cap. IV</span>
          <span className="chapter-label">Voces de la Sala</span>
          <span className="chapter-line" />
        </div>

        <div className="voices-grid">
          <div className="voices-feature">
            <span className="qmark">&ldquo;</span>
            {/* dangerouslySetInnerHTML is safe here — content comes from our own static lib/content.ts */}
            <div
              className="voices-quote"
              dangerouslySetInnerHTML={{ __html: cur.quote }}
            />
            <div className="voices-attr">
              {cur.name} · {cur.meta}
            </div>
            <div className="voices-nav">
              {VOICES.map((_, i) => (
                <span
                  key={i}
                  className={`voices-dot ${i === idx ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
          </div>

          <div className="voices-list">
            {VOICES.map((v, i) => (
              <div
                key={i}
                className={`voice-item ${i === idx ? "active" : ""}`}
                onClick={() => setIdx(i)}
              >
                <span className="voice-item-date">{v.date}</span>
                <span className="voice-item-name">{v.name}</span>
                <span className="voice-item-stars">{"★".repeat(v.stars)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
