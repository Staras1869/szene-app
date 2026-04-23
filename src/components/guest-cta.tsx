"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { X, ArrowRight } from "lucide-react"

const MESSAGES = [
  { emoji: "🔴", text: "People are going out right now — see who" },
  { emoji: "🔒", text: "3 hidden venues near you. Unlock them free." },
  { emoji: "🎯", text: "Get alerts before doors open tonight" },
  { emoji: "👥", text: "Your friends are already on Szene" },
  { emoji: "✦",  text: "Save your night out plan — takes 20 seconds" },
]

export function GuestCTA() {
  const { user, loading } = useAuth()
  const [visible, setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [msgIdx, setMsgIdx]     = useState(0)

  // Show after 10s, only to guests, only once per session
  useEffect(() => {
    if (loading || user) return
    if (sessionStorage.getItem("szene_cta_dismissed")) return
    const t = setTimeout(() => setVisible(true), 10_000)
    return () => clearTimeout(t)
  }, [user, loading])

  // Rotate message every 4s
  useEffect(() => {
    if (!visible) return
    const i = setInterval(() => setMsgIdx(n => (n + 1) % MESSAGES.length), 4_000)
    return () => clearInterval(i)
  }, [visible])

  function dismiss() {
    setDismissed(true)
    sessionStorage.setItem("szene_cta_dismissed", "1")
    setTimeout(() => setVisible(false), 300)
  }

  if (loading || user || !visible) return null

  const msg = MESSAGES[msgIdx]

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ${dismissed ? "translate-y-full" : "translate-y-0"}`}>
      {/* Gradient fade above bar */}
      <div className="h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      <div style={{ backgroundColor: "var(--card-bg)", borderTop: "1px solid var(--card-border)" }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          {/* Rotating message */}
          <div className="flex-1 min-w-0">
            <div key={msgIdx} className="animate-in fade-in duration-500">
              <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                <span className="mr-1.5">{msg.emoji}</span>{msg.text}
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-black text-white px-4 py-2.5 rounded-xl transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Join free <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Dismiss */}
          <button onClick={dismiss} className="flex-shrink-0 p-1 rounded-lg" style={{ color: "var(--text-faint)" }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
