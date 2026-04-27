"use client"

import { useEffect, useState } from "react"
import { Bell, BellRing, X, Zap, Music2, MapPin, Check } from "lucide-react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw     = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

const PERKS = [
  { icon: Zap,    text: "Last-minute tickets dropping",     sub: "before they sell out" },
  { icon: BellRing, text: "Your followed events are starting", sub: "30 min before doors open" },
  { icon: Music2, text: "New events in your vibe",          sub: "Afro, Latin, Techno & more" },
  { icon: MapPin, text: "Tonight's hot spots near you",     sub: "real-time from Szene" },
]

/** Call this to show the push prompt at high-intent moments */
export function triggerPushPrompt() {
  window.dispatchEvent(new CustomEvent("szene:push-prompt"))
}

export function PushPrompt() {
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [closing, setClosing] = useState(false)

  function canShow() {
    if (typeof window === "undefined") return false
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false
    if (localStorage.getItem("szene_push_asked")) return false
    if (Notification.permission === "denied") return false
    return true
  }

  useEffect(() => {
    // Trigger 1: event follow (highest intent)
    function onHighIntent() {
      if (!canShow()) return
      setShow(true)
    }
    window.addEventListener("szene:push-prompt", onHighIntent)

    // Trigger 2: 12s fallback after onboarding (was 30s, gated on onboarded flag)
    let t: ReturnType<typeof setTimeout> | undefined
    if (canShow() && localStorage.getItem("szene_onboarded")) {
      t = setTimeout(() => setShow(true), 12_000)
    }
    return () => {
      window.removeEventListener("szene:push-prompt", onHighIntent)
      if (t) clearTimeout(t)
    }
  }, [])

  async function subscribe() {
    setLoading(true)
    try {
      const r = await fetch("/api/push/subscribe")
      const { publicKey } = await r.json()

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const city  = localStorage.getItem("szene_city")  ?? undefined
      const vibes = JSON.parse(localStorage.getItem("szene_vibes") ?? "[]")
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sub.toJSON(), city, vibes }),
      })

      localStorage.setItem("szene_push_asked", "1")
      setDone(true)
      setTimeout(() => close(), 2200)
    } catch {
      localStorage.setItem("szene_push_asked", "1")
      close()
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setClosing(true)
    localStorage.setItem("szene_push_asked", "1")
    setTimeout(() => setShow(false), 350)
  }

  if (!show) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-350 ${closing ? "opacity-0" : "opacity-100"}`}
        onClick={close}
      />

      {/* Bottom sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-350 ${closing ? "translate-y-full" : "translate-y-0"}`}
        style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="rounded-t-3xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderBottom: "none" }}>

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--border)" }} />
          </div>

          {/* Close */}
          <button onClick={close} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "var(--text-faint)" }}>
            <X className="w-4 h-4" />
          </button>

          <div className="px-6 pb-8 pt-2">
            {done ? (
              /* Success state */
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-4" style={{ boxShadow: "0 0 30px rgba(16,185,129,0.35)" }}>
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-black text-szene">You&apos;re in</p>
                <p className="text-sm text-muted mt-1">Szene will keep you posted on the best nights</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(168,85,247,0.30)" }}>
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-szene leading-tight">Never miss a night</p>
                    <p className="text-sm text-muted mt-0.5">Turn on alerts · it&apos;s free</p>
                  </div>
                </div>

                {/* Perks list */}
                <div className="space-y-3 mb-6">
                  {PERKS.map(({ icon: Icon, text, sub }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.18)" }}>
                        <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-szene leading-tight">{text}</p>
                        <p className="text-[11px] text-faint">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button onClick={subscribe} disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-base text-white transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 24px rgba(168,85,247,0.30)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up alerts…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" />
                      Turn on notifications
                    </span>
                  )}
                </button>

                <p className="text-center text-[10px] text-faint mt-3">No spam. Turn off any time in settings.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
