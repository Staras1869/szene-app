"use client"

import { useEffect, useState } from "react"
import { Cookie, X, ChevronRight, Check } from "lucide-react"
import Link from "next/link"

type Consent = { analytics: boolean; marketing: boolean }

export function useCookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("szene_cookie_consent")
    if (stored) {
      try { setConsent(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  return consent
}

export function CookieConsent() {
  const [show, setShow]         = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [closing, setClosing]   = useState(false)
  const [analytics, setAnalytics]   = useState(false)
  const [marketing, setMarketing]   = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("szene_cookie_consent")
    if (!stored) {
      // Small delay so it doesn't flash immediately on page load
      const t = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  function save(consent: Consent) {
    localStorage.setItem("szene_cookie_consent", JSON.stringify(consent))
    setClosing(true)
    setTimeout(() => setShow(false), 350)
  }

  function acceptAll() { save({ analytics: true, marketing: true }) }
  function rejectAll()  { save({ analytics: false, marketing: false }) }
  function saveCustom() { save({ analytics, marketing }) }

  if (!show) return null

  return (
    <>
      <div className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-350 ${closing ? "opacity-0" : "opacity-100"}`} />

      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-350 ${closing ? "translate-y-full" : "translate-y-0"}`}
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <div className="rounded-t-3xl overflow-hidden"
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderBottom: "none" }}>

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--border)" }} />
          </div>

          <div className="px-6 pb-8 pt-3">
            {!showDetails ? (
              /* ── Simple view ── */
              <>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-szene leading-tight">Wir nutzen Cookies</p>
                    <p className="text-xs text-muted mt-0.5">
                      Für ein besseres Erlebnis und Analyse. Details in unserer{" "}
                      <Link href="/datenschutz" className="underline" style={{ color: "var(--accent)" }}>
                        Datenschutzerklärung
                      </Link>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mb-3">
                  <button onClick={rejectAll}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all border"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    Ablehnen
                  </button>
                  <button onClick={acceptAll}
                    className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                    Alle akzeptieren
                  </button>
                </div>

                <button onClick={() => setShowDetails(true)}
                  className="w-full flex items-center justify-center gap-1 text-xs py-2 transition-colors"
                  style={{ color: "var(--text-faint)" }}>
                  Einstellungen anpassen
                  <ChevronRight className="w-3 h-3" />
                </button>
              </>
            ) : (
              /* ── Detailed view ── */
              <>
                <div className="flex items-center justify-between mb-5">
                  <p className="font-black text-szene">Cookie-Einstellungen</p>
                  <button onClick={() => setShowDetails(false)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ color: "var(--text-faint)", backgroundColor: "var(--bg-surface)" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Essential — always on */}
                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-surface)" }}>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-szene">Notwendig</p>
                      <p className="text-xs text-muted mt-0.5">Sicherheit, Session, Spracheinstellung. Kann nicht deaktiviert werden.</p>
                    </div>
                    <div className="w-9 h-5 rounded-full flex-shrink-0 flex items-center justify-end pr-0.5"
                      style={{ background: "var(--accent)" }}>
                      <div className="w-4 h-4 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-surface)" }}>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-szene">Analyse</p>
                      <p className="text-xs text-muted mt-0.5">Hilft uns zu verstehen, welche Inhalte dir gefallen (anonym).</p>
                    </div>
                    <button onClick={() => setAnalytics(a => !a)}
                      className={`w-9 h-5 rounded-full flex-shrink-0 flex items-center transition-colors ${analytics ? "justify-end pr-0.5" : "justify-start pl-0.5"}`}
                      style={{ background: analytics ? "var(--accent)" : "var(--border)" }}>
                      <div className="w-4 h-4 rounded-full bg-white shadow" />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-surface)" }}>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-szene">Marketing</p>
                      <p className="text-xs text-muted mt-0.5">Personalisierte Event- und Veranstaltungsempfehlungen.</p>
                    </div>
                    <button onClick={() => setMarketing(m => !m)}
                      className={`w-9 h-5 rounded-full flex-shrink-0 flex items-center transition-colors ${marketing ? "justify-end pr-0.5" : "justify-start pl-0.5"}`}
                      style={{ background: marketing ? "var(--accent)" : "var(--border)" }}>
                      <div className="w-4 h-4 rounded-full bg-white shadow" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={rejectAll}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold border transition-all"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    Alle ablehnen
                  </button>
                  <button onClick={saveCustom}
                    className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                    <Check className="w-4 h-4" />
                    Speichern
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
