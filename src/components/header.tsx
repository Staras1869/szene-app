"use client"

import { useState } from "react"
import { Menu, X, User, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "./language-selector"
import { WeatherWidget } from "./weather-widget"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Szene
            </h1>
            <span className="ml-2 text-xs text-zinc-500 hidden sm:inline uppercase tracking-widest">{t("location")}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#events" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Events
            </a>
            <a href="#categories" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Discover
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Map
            </a>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Auth link */}
            {!authLoading && (
              user ? (
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Sign in
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/8">
            <nav className="flex flex-col space-y-1">
              <a href="#events" onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors py-2 text-sm">Events</a>
              <a href="#categories" onClick={() => setIsMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors py-2 text-sm">Discover</a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors py-2 text-sm">Map</a>
              {!authLoading && (
                user ? (
                  <Link href="/profile" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-2 text-sm">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-2 text-sm">
                    <LogIn className="w-4 h-4" /> Sign in
                  </Link>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
