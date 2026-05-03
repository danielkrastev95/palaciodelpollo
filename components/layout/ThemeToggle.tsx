"use client"

import { usePathname } from "next/navigation"
import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()

  // Admin pages use hardcoded inline colours — toggle has no visible effect there
  if (pathname.startsWith("/admin")) return null
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo noche"}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 1000,
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: "1px solid var(--ink-3)",
        background: "var(--paper-2)",
        color: "var(--ink)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 16px rgba(26,20,16,0.18)",
        transition: "background 0.25s, color 0.25s, border-color 0.25s, transform 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {isDark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
