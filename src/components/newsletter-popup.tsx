"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"

const STORAGE_KEY = "szene-newsletter-dismissed"

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setVisible(true), 12_000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setSubmitted(true)
    setTimeout(dismiss, 2500)
  }

  if (!visible) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      <div className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] w-full sm:w-[420px] bg-zinc-950 border border-white/[0.12] sm:rounded-2xl shadow-2xl shadow-black/70 p-8">
        <button onClick={dismiss}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
          aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-white font-semibold">You're on the list.</p>
            <p className="text-white/40 text-sm mt-1">We'll let you know when something good is happening.</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400 mb-3 font-bold">Stay in the loop</p>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Never miss a night out.</h2>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Weekly picks — the best events, new venues, and local highlights delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>

            <p className="text-white/25 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </>
  )
}
