"use client"

import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "done">("idle")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || state !== "idle") return
    setState("loading")
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setState("done")
  }

  return (
    <section className="py-24 bg-zinc-950 border-t border-white/6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-widest text-violet-400 mb-4">Stay in the loop</p>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Never miss a night out.
        </h2>
        <p className="text-zinc-500 mb-10 text-sm leading-relaxed">
          Weekly picks — best events, new venues, and local highlights. No spam.
        </p>

        {state === "done" ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm">
            <span className="text-emerald-400">✓</span> You're on the list.
          </div>
        ) : (
          <form onSubmit={submit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {state === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
