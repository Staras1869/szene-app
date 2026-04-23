"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, User, MapPin, Music2, Bell, ChevronRight, ExternalLink, Sparkles, Globe } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { useLanguage } from "@/contexts/language-context"
import { LanguagePicker } from "@/components/language-picker"

const CITY_LABELS: Record<string, string> = {
  mannheim: "Mannheim", heidelberg: "Heidelberg", frankfurt: "Frankfurt",
  ludwigshafen: "Ludwigshafen", karlsruhe: "Karlsruhe",
}
const VIBE_LABELS: Record<string, { label: string; emoji: string }> = {
  afro:    { label: "Afrobeats",  emoji: "🌍" },
  latin:   { label: "Latin",      emoji: "🔥" },
  hiphop:  { label: "Hip-Hop",    emoji: "🎤" },
  student: { label: "Uni",        emoji: "🎓" },
  party:   { label: "Party",      emoji: "🎉" },
  chill:   { label: "Chill",      emoji: "🍷" },
  music:   { label: "Live Music", emoji: "🎷" },
  outside: { label: "Outside",    emoji: "🌿" },
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [city, setCity]   = useState<string>("")
  const [vibes, setVibes] = useState<string[]>([])
  const [pushOn, setPushOn] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, user, router])

  useEffect(() => {
    setCity(localStorage.getItem("szene_city") ?? "mannheim")
    try { setVibes(JSON.parse(localStorage.getItem("szene_vibes") ?? "[]")) } catch { /**/ }
    setPushOn(!!localStorage.getItem("szene_push_asked"))
  }, [])

  async function handleLogout() {
    await logout()
    router.replace("/")
  }

  if (loading || !user) return (
    <div className="min-h-screen bg-szene flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
    </div>
  )

  const displayName = user.displayName || user.email?.split("@")[0] || "You"
  const initials    = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-szene">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl font-black text-white"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}>
            {initials}
          </div>
          <h1 className="text-xl font-black text-szene">{displayName}</h1>
          <p className="text-sm text-muted mt-0.5">{user.email}</p>
        </div>

        {/* Preferences card */}
        <div className="szene-card p-5 mb-4 space-y-4">
          <h2 className="text-xs font-bold text-faint uppercase tracking-widest">{t("city")}</h2>

          {/* City */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface border border-szene flex items-center justify-center">
                <MapPin className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-szene">{t("city")}</p>
                <p className="text-xs text-muted">{city ? CITY_LABELS[city] ?? city : "—"}</p>
              </div>
            </div>
            <button onClick={() => {
              const cities = Object.keys(CITY_LABELS)
              const idx = cities.indexOf(city)
              const next = cities[(idx + 1) % cities.length]
              setCity(next)
              localStorage.setItem("szene_city", next)
            }} className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--accent)" }}>
              {t("city_change") || "Ändern"}
            </button>
          </div>

          {/* Vibes */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-surface border border-szene flex items-center justify-center">
                <Music2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-sm font-semibold text-szene">{t("categories") || "Vibes"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(VIBE_LABELS).map(([id, { label, emoji }]) => {
                const on = vibes.includes(id)
                return (
                  <button key={id} onClick={() => {
                    const next = on ? vibes.filter(v => v !== id) : [...vibes, id]
                    setVibes(next)
                    localStorage.setItem("szene_vibes", JSON.stringify(next))
                  }} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                    on ? "vibe-active" : "vibe-inactive"
                  }`}>
                    <span>{emoji}</span>{label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface border border-szene flex items-center justify-center">
                <Bell className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-szene">{t("venueStatus") || "Alerts"}</p>
                <p className="text-xs text-muted">{pushOn ? t("online") : t("offline")}</p>
              </div>
            </div>
            {!pushOn && (
              <button onClick={() => {
                localStorage.removeItem("szene_push_asked")
                window.location.reload()
              }} className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--accent)" }}>
                {t("install") || "Aktivieren"}
              </button>
            )}
          </div>
        </div>

        {/* Language picker */}
        <div className="szene-card p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-surface border border-szene flex items-center justify-center">
              <Globe className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-sm font-semibold text-szene">{t("about") || "Sprache"}</p>
          </div>
          <LanguagePicker compact />
        </div>

        {/* Links */}
        <div className="szene-card mb-4 divide-szene overflow-hidden">
          {[
            { href: "/submit-event", icon: Sparkles,     label: t("submitRestaurant") || "Event einreichen" },
            { href: "/partner",      icon: ExternalLink,  label: t("ourStory") || "Partner werden" },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-5 py-4 hover:bg-surface transition-colors">
              <Icon className="w-4 h-4 text-faint" />
              <span className="text-sm text-szene flex-1">{label}</span>
              <ChevronRight className="w-4 h-4 text-faint" />
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="szene-card mb-6 divide-szene overflow-hidden">
          {[
            { href: "/impressum",   label: t("impressum") },
            { href: "/datenschutz", label: t("privacyPolicy") },
            { href: "/agb",         label: "AGB" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface transition-colors">
              <span className="text-sm text-muted flex-1">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-faint" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/8 transition-colors text-sm font-semibold">
          <LogOut className="w-4 h-4" />
          {t("cancel") === "Abbrechen" ? "Abmelden" : t("cancel")}
        </button>

        <p className="text-center text-xs text-whisper mt-6">
          Szene v1.0 · Made in Mannheim 🇩🇪
        </p>
      </div>
    </div>
  )
}
