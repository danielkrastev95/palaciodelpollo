"use client"

export default function CookieSettingsButton() {
  return (
    <button
      className="btn ghost"
      onClick={() => {
        localStorage.removeItem("cookie_consent")
        window.location.reload()
      }}
      style={{ marginTop: 8 }}
    >
      Cambiar preferencias de cookies
    </button>
  )
}
