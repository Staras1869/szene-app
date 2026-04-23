"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export function Newsletter() {
  const { t } = useLanguage()
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
    <section className="py-24" style={{ backgroundColor: "var(--bg-primary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color: "var(--accent)" }}>Stay in the loop</p>
        <h2 className="text-4xl font-black mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>{t("neverMissScene")}</h2>
        <p className="mb-10 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {t("newsletterDescription")}
        </p>

        {state === "done" ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
            ✓ {t("joinPartyEnthusiasts")}
          </div>
        ) : (
          <form onSubmit={submit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t("enterEmail")}
              className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
            <button
              type="submit" disabled={state === "loading"}
              className="disabled:opacity-60 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {state === "loading" ? "…" : t("subscribe")}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
