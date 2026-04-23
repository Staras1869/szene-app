"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, X, Clock, MapPin, Mail, Instagram, ExternalLink, Loader2, RefreshCw, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle } from "lucide-react"

type Sub = {
  id: string; status: "pending" | "approved" | "rejected"
  promoterName: string; promoterEmail: string; promoterInstagram?: string
  title: string; venue: string; city: string; date: string; time: string
  genre: string; price: string; dresscode?: string; description: string
  ticketUrl?: string; instagram?: string; website?: string
  submittedAt: string; reviewedAt?: string; reviewNote?: string
}

type CredCheck = {
  verdict: "credible" | "suspicious" | "likely_fake"
  score: number
  summary: string
  checks: { label: string; ok: boolean; note: string }[]
  flags: string[]
  recommendation: "approve" | "investigate" | "reject"
}

const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-amber-500/15 text-amber-400 border-amber-500/25",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  rejected: "bg-red-500/15 text-red-400 border-red-500/25",
}

const VERDICT_CONFIG = {
  credible:    { icon: ShieldCheck,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Credible" },
  suspicious:  { icon: ShieldAlert,  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",   label: "Suspicious" },
  likely_fake: { icon: ShieldX,      color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",       label: "Likely Fake" },
}

const REC_COLORS = {
  approve:     "text-emerald-400",
  investigate: "text-amber-400",
  reject:      "text-red-400",
}

export default function AdminEventsPage() {
  const [pw, setPw]           = useState("")
  const [authed, setAuthed]   = useState(false)
  const [subs, setSubs]       = useState<Sub[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter]   = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [note, setNote]       = useState("")
  const [acting, setActing]   = useState<string | null>(null)
  const [checks, setChecks]   = useState<Record<string, CredCheck | "loading" | "error">>({})

  const load = useCallback(async (password: string) => {
    setLoading(true)
    try {
      const url = filter === "all"
        ? `/api/events/review?pw=${password}`
        : `/api/events/review?pw=${password}&status=${filter}`
      const res = await fetch(url)
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      setSubs(Array.isArray(data) ? data : [])
    } catch { /**/ }
    setLoading(false)
  }, [filter])

  async function login() {
    setLoading(true)
    const res = await fetch(`/api/events/review?pw=${pw}&status=pending`)
    if (res.ok) { setAuthed(true); const d = await res.json(); setSubs(Array.isArray(d) ? d : []) }
    else setAuthed(false)
    setLoading(false)
  }

  useEffect(() => { if (authed) load(pw) }, [filter, authed, load, pw])

  async function expand(sub: Sub) {
    const newId = expanded === sub.id ? null : sub.id
    setExpanded(newId)
    if (!newId || checks[sub.id]) return

    // Run AI credibility check automatically on expand
    setChecks(c => ({ ...c, [sub.id]: "loading" }))
    try {
      const res = await fetch(`/api/events/check?pw=${pw}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      })
      if (res.ok) {
        const data: CredCheck = await res.json()
        setChecks(c => ({ ...c, [sub.id]: data }))
      } else {
        setChecks(c => ({ ...c, [sub.id]: "error" }))
      }
    } catch {
      setChecks(c => ({ ...c, [sub.id]: "error" }))
    }
  }

  async function act(id: string, action: "approve" | "reject") {
    setActing(id)
    await fetch(`/api/events/review?pw=${pw}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, note: note || undefined }),
    })
    setNote(""); setExpanded(null); setActing(null)
    load(pw)
  }

  if (!authed) return (
    <div className="min-h-screen bg-szene flex items-center justify-center px-4">
      <div className="w-full max-w-xs space-y-4 text-center">
        <h1 className="text-xl font-black text-szene">Admin · Events</h1>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Passwort"
          className="w-full rounded-xl px-4 py-3 text-sm text-szene bg-surface border border-szene focus:outline-none focus:border-violet-500/50 transition-colors" />
        <button onClick={login} disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)" }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Einloggen"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-szene">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-szene">Event-Einreichungen</h1>
            <p className="text-xs text-faint mt-0.5">KI-Glaubwürdigkeitsprüfung aktiviert</p>
          </div>
          <button onClick={() => load(pw)} className="text-faint hover:text-szene transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f ? "pill-active" : "pill-inactive"
              }`}>
              {f === "pending" ? "Ausstehend" : f === "approved" ? "Freigegeben" : f === "rejected" ? "Abgelehnt" : "Alle"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-violet-400 animate-spin" /></div>
        ) : subs.length === 0 ? (
          <p className="text-center text-faint py-16 text-sm">Keine Einreichungen in dieser Kategorie.</p>
        ) : (
          <div className="space-y-3">
            {subs.map(s => {
              const check = checks[s.id]
              const vc    = typeof check === "object" ? VERDICT_CONFIG[check.verdict] : null
              return (
                <div key={s.id} className="szene-card overflow-hidden">
                  {/* Summary row */}
                  <button className="w-full text-left p-4" onClick={() => expand(s)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-szene truncate">{s.title}</p>
                        <p className="text-xs text-muted mt-0.5">{s.venue} · {s.city.charAt(0).toUpperCase() + s.city.slice(1)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* AI verdict badge */}
                        {vc && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${vc.bg} ${vc.color}`}>
                            <vc.icon className="w-2.5 h-2.5" />
                            {vc.label}
                          </span>
                        )}
                        {check === "loading" && <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[s.status]}`}>
                          {s.status === "pending" ? "Ausstehend" : s.status === "approved" ? "Freigegeben" : "Abgelehnt"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-faint">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.date} {s.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.genre}</span>
                      <span className="font-semibold text-violet-400/80">{s.price}</span>
                    </div>
                  </button>

                  {/* Expanded panel */}
                  {expanded === s.id && (
                    <div className="px-4 pb-4 border-t border-szene pt-4 space-y-4">

                      {/* ── AI Credibility Check ── */}
                      <div className="rounded-xl border border-szene overflow-hidden">
                        <div className="px-4 py-2.5 flex items-center gap-2 border-b border-szene bg-surface">
                          <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                          <p className="text-xs font-bold text-szene">KI-Glaubwürdigkeitsprüfung</p>
                        </div>

                        {check === "loading" && (
                          <div className="flex items-center justify-center gap-2 py-6">
                            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                            <span className="text-xs text-muted">Analysiere…</span>
                          </div>
                        )}

                        {check === "error" && (
                          <p className="text-xs text-red-400 px-4 py-4">Prüfung fehlgeschlagen — bitte manuell überprüfen.</p>
                        )}

                        {typeof check === "object" && (() => {
                          const cfg = VERDICT_CONFIG[check.verdict]
                          return (
                            <div className="p-4 space-y-3">
                              {/* Score + verdict */}
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${cfg.bg} ${cfg.color}`}>
                                  <cfg.icon className="w-4 h-4" />
                                  {cfg.label}
                                </div>
                                <div className="flex-1">
                                  <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${check.score >= 70 ? "bg-emerald-500" : check.score >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                                      style={{ width: `${check.score}%` }} />
                                  </div>
                                  <p className="text-[10px] text-faint mt-1">{check.score}/100 Glaubwürdigkeit</p>
                                </div>
                              </div>

                              {/* Summary */}
                              <p className="text-xs text-muted leading-relaxed">{check.summary}</p>

                              {/* Checks */}
                              <div className="space-y-1.5">
                                {check.checks.map(c => (
                                  <div key={c.label} className="flex items-start gap-2 text-xs">
                                    <span className={`mt-0.5 flex-shrink-0 ${c.ok ? "text-emerald-500" : "text-red-400"}`}>
                                      {c.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    </span>
                                    <div>
                                      <span className="font-semibold text-szene">{c.label}: </span>
                                      <span className="text-muted">{c.note}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Flags */}
                              {check.flags.length > 0 && (
                                <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 space-y-1">
                                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Red Flags
                                  </p>
                                  {check.flags.map((f, i) => (
                                    <p key={i} className="text-xs text-amber-400/80">· {f}</p>
                                  ))}
                                </div>
                              )}

                              {/* Recommendation */}
                              <p className="text-xs font-bold">
                                KI-Empfehlung:{" "}
                                <span className={REC_COLORS[check.recommendation]}>
                                  {check.recommendation === "approve" ? "✅ Freigeben" : check.recommendation === "investigate" ? "⚠️ Nachprüfen" : "❌ Ablehnen"}
                                </span>
                              </p>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted leading-relaxed">{s.description}</p>

                      {/* Links + meta */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {s.dresscode && <span className="bg-surface border border-szene px-3 py-1 rounded-full text-muted">👔 {s.dresscode}</span>}
                        {s.ticketUrl && <a href={s.ticketUrl} target="_blank" rel="noopener noreferrer" className="bg-surface border border-szene px-3 py-1 rounded-full text-muted hover:text-szene flex items-center gap-1"><ExternalLink className="w-3 h-3" />Tickets</a>}
                        {s.website   && <a href={s.website}   target="_blank" rel="noopener noreferrer" className="bg-surface border border-szene px-3 py-1 rounded-full text-muted hover:text-szene flex items-center gap-1"><ExternalLink className="w-3 h-3" />Website</a>}
                        {s.instagram && <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener noreferrer" className="bg-surface border border-szene px-3 py-1 rounded-full text-pink-400 hover:text-pink-300 flex items-center gap-1"><Instagram className="w-3 h-3" />@{s.instagram}</a>}
                      </div>

                      {/* Promoter */}
                      <div className="bg-surface border border-szene rounded-xl p-3 text-xs space-y-1">
                        <p className="font-semibold text-szene">{s.promoterName}</p>
                        <p className="text-muted flex items-center gap-1"><Mail className="w-3 h-3" />{s.promoterEmail}</p>
                        {s.promoterInstagram && <p className="text-muted flex items-center gap-1"><Instagram className="w-3 h-3" />@{s.promoterInstagram}</p>}
                        <p className="text-faint">Eingereicht: {new Date(s.submittedAt).toLocaleString("de-DE")}</p>
                      </div>

                      {/* Review actions (pending only) */}
                      {s.status === "pending" && (
                        <>
                          <textarea value={note} onChange={e => setNote(e.target.value)}
                            placeholder="Optionale Notiz (wird an Promoter gesendet)…"
                            rows={2}
                            className="w-full rounded-xl px-3 py-2.5 text-xs text-szene bg-surface border border-szene focus:outline-none focus:border-violet-500/50 transition-colors resize-none" />
                          <div className="flex gap-2">
                            <button onClick={() => act(s.id, "approve")} disabled={!!acting}
                              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                              {acting === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              Freigeben
                            </button>
                            <button onClick={() => act(s.id, "reject")} disabled={!!acting}
                              className="flex-1 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                              {acting === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                              Ablehnen
                            </button>
                          </div>
                        </>
                      )}

                      {s.status !== "pending" && (
                        <p className="text-xs text-faint">
                          {s.status === "approved" ? "✅ Freigegeben" : "❌ Abgelehnt"}
                          {s.reviewedAt && ` · ${new Date(s.reviewedAt).toLocaleString("de-DE")}`}
                          {s.reviewNote && ` · "${s.reviewNote}"`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
