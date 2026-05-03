"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeCtx)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    const initial: Theme = saved === "dark" ? "dark" : "light"
    setTheme(initial)
    document.body.classList.toggle("dark", initial === "dark")
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light"
      document.body.classList.toggle("dark", next === "dark")
      localStorage.setItem("theme", next)
      return next
    })
  }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}
