"use client"

import { useEffect, useState } from "react"
import { Bell, X } from "lucide-react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw     = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export function PushPrompt() {
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  useEffect(() => {
    // Only show after user has completed onboarding and browsed for 30s
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return
    if (localStorage.getItem("szene_push_asked")) return
    if (Notification.permission === "denied") return
    if (!localStorage.getItem("szene_onboarded")) return

    const t = setTimeout(() => setShow(true), 30_000)
    return () => clearTimeout(t)
  }, [])

  async function subscribe() {
    setLoading(true)
    try {
      // Get VAPID public key
      const r = await fetch("/api/push/subscribe")
      const { publicKey } = await r.json()

      // Register SW and subscribe
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      // Send to backend
      const city  = localStorage.getItem("szene_city")  ?? undefined
      const vibes = JSON.parse(localStorage.getItem("szene_vibes") ?? "[]")
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sub.toJSON(), city, vibes }),
      })

      localStorage.setItem("szene_push_asked", "1")
      setDone(true)
      setTimeout(() => setShow(false), 1500)
    } catch (err) {
      console.error("Push subscribe failed", err)
      localStorage.setItem("szene_push_asked", "1")
      setShow(false)
    } finally {
      setLoading(false)
    }
  }

  function dismiss() {
    localStorage.setItem("szene_push_asked", "1")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl p-4 shadow-2xl" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
        <button onClick={dismiss} className="absolute top-3 right-3 transition-colors" style={{ color: "var(--text-faint)" }}>
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--accent)", opacity: 0.9 }}>
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 pr-4">
            {done ? (
              <p className="text-sm font-bold text-emerald-400">You&apos;re in ✓</p>
            ) : (
              <>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Tonight&apos;s alerts</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Get notified when doors open — once a day, no spam.</p>
                <button onClick={subscribe} disabled={loading}
                  className="mt-3 w-full py-2.5 rounded-xl text-white text-xs font-bold transition-colors disabled:opacity-60"
                  style={{ backgroundColor: "var(--accent)" }}>
                  {loading ? "Setting up…" : "Notify me tonight 🔔"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
