"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const STORAGE_KEY = "szene-newsletter-dismissed"

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setVisible(true), 12_000) // 12 s
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Fire-and-forget — wire to your real endpoint later
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Panel */}
      <div className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] w-full sm:w-[440px] bg-zinc-900 border border-white/10 sm:rounded-2xl shadow-2xl p-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-300">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">✓</div>
            <p className="text-white font-semibold">You're on the list.</p>
            <p className="text-zinc-400 text-sm mt-1">We'll let you know when something good is happening.</p>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Stay in the loop</p>
            <h2 className="text-2xl font-bold text-white mb-2">
              Never miss a night out.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Get weekly picks — the best events, new venues, and local highlights delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="text-zinc-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </>
  )
}
