"use client"

import { useState } from "react"
import { Menu, X, User, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useSzeneTheme } from "@/hooks/use-szene-theme"

type Go = (opts: { city?: string; tab?: string }) => void

export function Header({ go }: { go?: Go }) {
  const { user, loading: authLoading } = useAuth()
  const { theme, toggle } = useSzeneTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isDay = theme === "day"

  const NAV = [
    { label: "For You",  tab: "foryou"  },
    { label: "Events",   tab: "events"  },
    { label: "Tonight",  tab: "tonight" },
    { label: "Venues",   tab: "venues"  },
  ]

  return (
    <header style={{
      backgroundColor: isDay ? "rgba(250,249,246,0.85)" : "rgba(10,10,15,0.85)",
      borderBottomColor: isDay ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.10)",
    }} className="sticky top-0 z-50 backdrop-blur-xl border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" style={{
            fontFamily: "var(--font-display)",
            color: isDay ? "#1a1a1a" : "#e2e0ff",
            letterSpacing: isDay ? "0.05em" : "-0.02em",
            fontSize: isDay ? "1.25rem" : "1.5rem",
          }}>
            SZENE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map(l => (
              <button key={l.tab} onClick={() => go?.({ tab: l.tab })}
                style={{ color: isDay ? "#8a8680" : "rgba(255,255,255,0.55)" }}
                className="text-sm font-medium hover:opacity-100 transition-opacity">
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggle} title={isDay ? "Switch to night mode" : "Switch to day mode"}
              style={{
                color: isDay ? "#8a8680" : "rgba(255,255,255,0.45)",
                backgroundColor: isDay ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
              {isDay ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            {/* Auth */}
            {!authLoading && (
              user ? (
                <Link href="/profile" className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: isDay ? "#8a8680" : "rgba(255,255,255,0.60)" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(168,85,247,0.20)", border: "1px solid rgba(168,85,247,0.35)" }}>
                    <User className="w-3.5 h-3.5" style={{ color: "#a855f7" }} />
                  </div>
                  <span className="hidden sm:inline">{user.displayName || user.email?.split("@")[0] || "Profile"}</span>
                </Link>
              ) : (
                <Link href="/login"
                  style={{
                    backgroundColor: isDay ? "#1a1a1a" : "#ffffff",
                    color: isDay ? "#ffffff" : "#000000",
                  }}
                  className="text-sm font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-80">
                  Sign in
                </Link>
              )
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: isDay ? "#8a8680" : "rgba(255,255,255,0.60)" }}
              className="md:hidden transition-colors">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div style={{ borderTopColor: isDay ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.10)" }}
            className="md:hidden py-4 border-t space-y-1">
            {NAV.map(l => (
              <button key={l.tab} onClick={() => { go?.({ tab: l.tab }); setIsMenuOpen(false) }}
                style={{ color: isDay ? "#8a8680" : "rgba(255,255,255,0.60)" }}
                className="block w-full text-left py-2.5 text-sm font-medium transition-colors">
                {l.label}
              </button>
            ))}
            {!authLoading && !user && (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}
                className="block py-2.5 text-sm font-semibold transition-colors"
                style={{ color: "#a855f7" }}>
                Sign in
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
