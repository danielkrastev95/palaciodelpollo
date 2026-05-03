"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type CookiePreferences = {
  necessary: boolean    // Siempre true, no se puede desactivar
  analytics: boolean
  marketing: boolean
}

const COOKIE_NAME = "cookie_consent"
const COOKIE_VERSION = "v1"

function getCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(COOKIE_NAME)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (parsed.version !== COOKIE_VERSION) return null
    return parsed.preferences
  } catch {
    return null
  }
}

function setCookieConsent(preferences: CookiePreferences) {
  localStorage.setItem(COOKIE_NAME, JSON.stringify({
    version: COOKIE_VERSION,
    preferences,
    timestamp: Date.now(),
  }))
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Esperar un poco para no bloquear el render inicial
    const timer = setTimeout(() => {
      const stored = getCookieConsent()
      if (!stored) {
        setVisible(true)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setCookieConsent(allAccepted)
    setVisible(false)
  }

  const handleAcceptNecessary = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setCookieConsent(onlyNecessary)
    setVisible(false)
  }

  const handleSavePreferences = () => {
    setCookieConsent(preferences)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-backdrop">
      <div className="cookie-banner">
        {!showSettings ? (
          <>
            <div className="cookie-header">
              <span className="cookie-icon">🍪</span>
              <h3 className="cookie-title">Usamos cookies</h3>
            </div>

            <p className="cookie-text">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia,
              analizar el tráfico y mostrarte contenido personalizado.
              Puedes aceptar todas, solo las necesarias, o configurar tus preferencias.
            </p>

            <div className="cookie-actions">
              <button onClick={handleAcceptAll} className="btn ember">
                Aceptar todas
              </button>
              <button onClick={handleAcceptNecessary} className="btn ghost">
                Solo necesarias
              </button>
              <button onClick={() => setShowSettings(true)} className="cookie-link">
                Configurar
              </button>
            </div>

            <p className="cookie-legal">
              Más información en nuestra{" "}
              <Link href="/cookies" onClick={() => setVisible(false)}>
                Política de Cookies
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="cookie-header">
              <button onClick={() => setShowSettings(false)} className="cookie-back" aria-label="Volver">
                ←
              </button>
              <h3 className="cookie-title">Configurar cookies</h3>
            </div>

            <div className="cookie-options">
              <div className="cookie-option">
                <div className="cookie-option-info">
                  <span className="cookie-option-name">Necesarias</span>
                  <span className="cookie-option-desc">
                    Imprescindibles para el funcionamiento del sitio. No se pueden desactivar.
                  </span>
                </div>
                <div className="cookie-toggle disabled">
                  <span className="cookie-toggle-track active">
                    <span className="cookie-toggle-thumb" />
                  </span>
                </div>
              </div>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <span className="cookie-option-name">Analíticas</span>
                  <span className="cookie-option-desc">
                    Nos ayudan a entender cómo usas el sitio para mejorarlo.
                  </span>
                </div>
                <button
                  className="cookie-toggle"
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  aria-pressed={preferences.analytics}
                >
                  <span className={`cookie-toggle-track ${preferences.analytics ? "active" : ""}`}>
                    <span className="cookie-toggle-thumb" />
                  </span>
                </button>
              </div>

              <div className="cookie-option">
                <div className="cookie-option-info">
                  <span className="cookie-option-name">Marketing</span>
                  <span className="cookie-option-desc">
                    Permiten mostrarte publicidad relevante en otras plataformas.
                  </span>
                </div>
                <button
                  className="cookie-toggle"
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  aria-pressed={preferences.marketing}
                >
                  <span className={`cookie-toggle-track ${preferences.marketing ? "active" : ""}`}>
                    <span className="cookie-toggle-thumb" />
                  </span>
                </button>
              </div>
            </div>

            <div className="cookie-actions">
              <button onClick={handleSavePreferences} className="btn ember">
                Guardar preferencias
              </button>
              <button onClick={handleAcceptAll} className="btn ghost">
                Aceptar todas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Hook para leer las preferencias desde otros componentes */
export function useCookieConsent(): CookiePreferences | null {
  const [consent, setConsent] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    setConsent(getCookieConsent())
  }, [])

  return consent
}
