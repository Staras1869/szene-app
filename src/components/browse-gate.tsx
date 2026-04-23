"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, Check, Sparkles, MapPin, Bell, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

// Call this every time a user expands an event card
let _count = 0
let _trigger: (() => void) | null = null

export function trackEventView() {
  _count++
  if (_count >= 3) _trigger?.()
}

const BENEFITS = [
  { icon: Bell,    text: "Get notified before doors open tonight" },
  { icon: MapPin,  text: "Unlock hidden venues & Geheimtipps" },
  { icon: Users,   text: "See which friends are going" },
  { icon: Sparkles,text: "Save night-out plans to your profile" },
]

export function BrowseGate() {
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (loading || user) return
    if (sessionStorage.getItem("szene_gate_shown")) return
    _trigger = () => {
      setOpen(true)
      sessionStorage.setItem("szene_gate_shown", "1")
    }
    return () => { _trigger = null }
  }, [user, loading])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>

      <div className="w-full max-w-sm rounded-3xl overflow-hidden animate-in slide-in-from-bottom-6 duration-400"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>

        {/* Header glow */}
        <div className="relative px-6 pt-8 pb-5 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, var(--accent) 0%, transparent 70%)" }} />
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-black tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>
            You&apos;ve found 3 events tonight
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Create a free account to save them and get a reminder before doors open.
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 pb-5 space-y-2.5">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(168,85,247,0.15)" }}>
                <Icon className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</p>
              <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-emerald-400" />
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mx-6 mb-5 px-4 py-2.5 rounded-xl text-center"
          style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            🔴 <span style={{ color: "var(--text-primary)" }}>2,400+ people</span> already use Szene in your city
          </p>
        </div>

        {/* CTAs */}
        <div className="px-6 pb-6 space-y-2">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white text-sm font-black transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
            onClick={() => setOpen(false)}
          >
            <Sparkles className="w-4 h-4" /> Create free account
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 text-sm font-medium transition-colors"
            style={{ color: "var(--text-faint)" }}
          >
            Keep browsing
          </button>
        </div>

        {/* Close */}
        <button onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: "var(--text-faint)" }}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
