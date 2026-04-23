"use client"

import { useSzeneTheme } from "@/hooks/use-szene-theme"

export function SzeneThemeProvider({ children }: { children: React.ReactNode }) {
  useSzeneTheme() // applies data-theme to <html> automatically
  return <>{children}</>
}
