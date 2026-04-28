"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"

const STATES = {
  ok:      { emoji: "✅", title: "E-Mail bestätigt!", body: "Dein Konto ist jetzt aktiv. Du kannst dich einloggen.", cta: "Zur App", href: "/" },
  expired: { emoji: "⏰", title: "Link abgelaufen",   body: "Dieser Bestätigungslink ist nicht mehr gültig. Bitte registriere dich erneut.", cta: "Neu registrieren", href: "/?register=1" },
  invalid: { emoji: "❌", title: "Ungültiger Link",   body: "Dieser Link ist ungültig oder wurde bereits verwendet.", cta: "Zur App", href: "/" },
  already: { emoji: "💜", title: "Bereits bestätigt", body: "Deine E-Mail wurde bereits verifiziert. Meld dich einfach an.", cta: "Einloggen", href: "/?login=1" },
}

function VerifyContent() {
  const params = useSearchParams()
  const status = (params.get("status") ?? "invalid") as keyof typeof STATES
  const state  = STATES[status] ?? STATES.invalid

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm text-center">
        <div className="szene-card p-8">
          <div className="text-5xl mb-4">{state.emoji}</div>
          <h1 className="text-xl font-black text-szene mb-2">{state.title}</h1>
          <p className="text-sm text-muted mb-6">{state.body}</p>
          <Link href={state.href}
            className="block w-full py-3.5 rounded-2xl font-black text-white text-sm text-center transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            {state.cta}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
