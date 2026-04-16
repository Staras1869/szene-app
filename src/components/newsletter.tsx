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
    <section className="py-24 bg-zinc-950 border-t border-white/[0.06]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-violet-400 mb-4 font-semibold">Stay in the loop</p>
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Never miss a night out.</h2>
        <p className="text-white/30 mb-10 text-sm leading-relaxed">
          Weekly picks — best events, new venues, local highlights. No spam.
        </p>

        {state === "done" ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
            ✓ You're on the list
          </div>
        ) : (
          <form onSubmit={submit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 transition-colors"
            />
            <button
              type="submit" disabled={state === "loading"}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
            >
              {state === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
