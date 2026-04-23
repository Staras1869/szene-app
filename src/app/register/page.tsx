"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Bell, MapPin, Users, Sparkles, Check } from "lucide-react"

const BENEFITS = [
  { icon: Bell,     text: "Alerts before doors open — be the first in" },
  { icon: MapPin,   text: "Unlock hidden venues only locals know" },
  { icon: Users,    text: "See which friends are going tonight" },
  { icon: Sparkles, text: "Save night-out plans to your profile" },
]

const SOCIAL_PROOF = [
  { emoji: "🌍", name: "Amir K.",    city: "Mannheim",   quote: "Found the best Afro night in Jungbusch through Szene" },
  { emoji: "💃", name: "Isabella R.", city: "Frankfurt",  quote: "The hidden venues tip changed my whole Friday routine" },
  { emoji: "🎓", name: "Lukas M.",   city: "Heidelberg", quote: "Gets me to the uni parties before tickets sell out" },
]

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Registration failed"); return }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      router.push(loginRes.ok ? "/onboarding" : "/login")
      router.refresh()
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ backgroundColor: "var(--accent)", opacity: 0.07, filter: "blur(140px)" }} />

      <div className="relative max-w-lg mx-auto px-4 pt-10 pb-20">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Szene
          </Link>
        </div>

        {/* Social proof bar */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {["🌍","💃","🎓","🎸","🔥"].map((e, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs"
                style={{ borderColor: "var(--bg-primary)", backgroundColor: "var(--bg-surface)" }}>
                {e}
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--text-primary)" }}>2,400+</span> people already on Szene
          </p>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
            Don&apos;t miss tonight
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Free forever. Takes 20 seconds.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <p className="text-[11px] leading-tight" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Your name
              </label>
              <input
                type="text" required value={name}
                onChange={e => setName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
                {t("email")}
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
                {t("password")}
              </label>
              <input
                type="password" required minLength={8} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
              <p className="text-[11px] mt-1.5" style={{ color: "var(--text-faint)" }}>
                {t("passwordHint")}
              </p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 disabled:opacity-60 text-white text-sm font-black rounded-xl transition-colors mt-1"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? "Creating your account…" : "Create free account →"}
            </button>
          </form>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-5 mb-8">
          {["No spam", "Free forever", "Cancel anytime"].map(s => (
            <div key={s} className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="space-y-2 mb-8">
          {SOCIAL_PROOF.map(p => (
            <div key={p.name} className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <span className="text-xl flex-shrink-0">{p.emoji}</span>
              <div>
                <p className="text-xs italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;{p.quote}&rdquo;
                </p>
                <p className="text-[10px] mt-1 font-semibold" style={{ color: "var(--text-faint)" }}>
                  — {p.name}, {p.city}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Already have account */}
        <p className="text-center text-sm" style={{ color: "var(--text-faint)" }}>
          {t("alreadyAccount")}{" "}
          <Link href="/login" className="font-bold transition-colors" style={{ color: "var(--accent)" }}>
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  )
}
