"use client"

import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { user, loading: authLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">SZENE</span>
            <span className="hidden sm:inline text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium mt-0.5">Mannheim</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Events", href: "#events" },
              { label: "Venues", href: "#venues" },
              { label: "Discover", href: "#discover" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-sm text-white/50 hover:text-white transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {!authLoading && (
              user ? (
                <Link href="/profile" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="hidden sm:inline">{user.displayName || "Profile"}</span>
                </Link>
              ) : (
                <Link href="/login" className="text-sm font-semibold text-black bg-white hover:bg-white/90 px-4 py-1.5 rounded-full transition-colors">
                  Sign in
                </Link>
              )
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/60 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.06] space-y-1">
            {["Events", "Venues", "Discover"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm text-white/50 hover:text-white transition-colors">{l}</a>
            ))}
            {!authLoading && !user && (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors font-semibold">Sign in</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
