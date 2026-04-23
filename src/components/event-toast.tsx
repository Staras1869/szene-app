"use client"

import { useEffect, useState, useCallback } from "react"
import { X, Sparkles, MapPin, ArrowRight } from "lucide-react"

export type EventToast = {
  id: string
  title: string
  venue: string
  city: string
  category: string
  emoji: string
  url?: string
}

// ─── Single banner ────────────────────────────────────────────────────────────
function Banner({ toast, onDismiss }: { toast: EventToast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 6000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div className="animate-in slide-in-from-top-3 duration-300 pointer-events-auto">
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Pulse dot */}
        <div className="flex-shrink-0 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
        </div>

        {/* Emoji */}
        <span className="text-xl flex-shrink-0">{toast.emoji}</span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black truncate" style={{ color: "var(--text-primary)" }}>
            {toast.title}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: "var(--text-faint)" }} />
            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
              {toast.venue} · {toast.city}
            </p>
          </div>
        </div>

        {/* CTA */}
        {toast.url ? (
          <a
            href={toast.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold text-white px-2.5 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
            onClick={() => onDismiss(toast.id)}
          >
            View <ArrowRight className="w-2.5 h-2.5" />
          </a>
        ) : (
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
        )}

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 p-1 rounded-lg transition-colors"
          style={{ color: "var(--text-faint)" }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

// ─── Toast manager (renders in fixed position) ────────────────────────────────
let _addToast: ((t: EventToast) => void) | null = null

export function triggerEventToast(toast: EventToast) {
  _addToast?.(toast)
}

export function EventToastManager() {
  const [toasts, setToasts] = useState<EventToast[]>([])

  const add = useCallback((t: EventToast) => {
    setToasts(prev => {
      // Max 3 at once, no dupes
      if (prev.find(p => p.id === t.id)) return prev
      return [t, ...prev].slice(0, 3)
    })
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    _addToast = add
    return () => { _addToast = null }
  }, [add])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex flex-col gap-2 px-4 pointer-events-none">
      <div className="max-w-sm mx-auto w-full flex flex-col gap-2">
        {toasts.map(t => (
          <Banner key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </div>
  )
}
