"use client"

import { useState, useEffect } from "react"

type Theme = "night" | "day"

function getAutoTheme(): Theme {
  const h = new Date().getHours()
  return h >= 6 && h < 18 ? "day" : "night"
}

export function useSzeneTheme() {
  const [theme, setTheme] = useState<Theme>("night") // safe SSR default
  const [manual, setManual] = useState(false)

  // On mount: load preference or auto-detect
  useEffect(() => {
    const stored = localStorage.getItem("szene-theme") as Theme | null
    if (stored === "day" || stored === "night") {
      setTheme(stored)
      setManual(true)
    } else {
      setTheme(getAutoTheme())
    }
  }, [])

  // Auto-switch every minute (catches 6 AM / 6 PM transitions)
  useEffect(() => {
    if (manual) return
    const interval = setInterval(() => setTheme(getAutoTheme()), 60_000)
    return () => clearInterval(interval)
  }, [manual])

  // Apply to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  function toggle() {
    const next: Theme = theme === "night" ? "day" : "night"
    setTheme(next)
    setManual(true)
    localStorage.setItem("szene-theme", next)
  }

  function resetToAuto() {
    setManual(false)
    localStorage.removeItem("szene-theme")
    setTheme(getAutoTheme())
  }

  return { theme, toggle, resetToAuto, isDay: theme === "day" }
}
