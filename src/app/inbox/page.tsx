"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, Send, X, RefreshCw, Mail, Clock, ChevronDown, ChevronUp, Pencil } from "lucide-react"

type Email = {
  id: string
  from: string
  fromName: string
  subject: string
  body: string
  receivedAt: string
  draft: string
  status: "pending" | "sent" | "ignored"
  sentAt?: string
}

export default function InboxPage() {
  const [pwd, setPwd]       = useState("")
  const [authed, setAuthed] = useState(false)
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [sending, setSending] = useState<string | null>(null)
  const [error, setError]   = useState("")

  const load = useCallback(async (password: string) => {
    setLoading(true)
    const r = await fetch(`/api/email/list?pwd=${encodeURIComponent(password)}`)
    if (r.status === 401) { setError("Wrong password"); setLoading(false); return }
    const d = await r.json()
    setEmails(d.emails ?? [])
    const map: Record<string, string> = {}
    for (const e of d.emails ?? []) map[e.id] = e.draft
    setDrafts(map)
    setLoading(false)
    setAuthed(true)
  }, [])

  async function send(email: Email) {
    setSending(email.id)
    await fetch(`/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: email.id, body: drafts[email.id] }),
    })
    await load(pwd)
    setSending(null)
    setExpanded(null)
  }

  async function ignore(id: string) {
    await fetch(`/api/email/list?pwd=${encodeURIComponent(pwd)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "ignored" }),
    })
    await load(pwd)
    setExpanded(null)
  }

  const pending  = emails.filter(e => e.status === "pending")
  const sent     = emails.filter(e => e.status === "sent")
  const ignored  = emails.filter(e => e.status === "ignored")

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="text-xl font-black text-white mb-6 text-center">SZENE Inbox</p>
          <form onSubmit={e => { e.preventDefault(); load(pwd) }} className="space-y-3">
            <input
              id="inbox-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/[0.06] border border-white/[0.15] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/60"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors">
              Open inbox
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.10]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-400" />
            <span className="font-black text-sm">SZENE Inbox</span>
            {pending.length > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{pending.length}</span>
            )}
          </div>
          <button onClick={() => load(pwd)} className="text-white/40 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Pending */}
        {pending.length > 0 && (
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Needs reply ({pending.length})</p>
            <div className="space-y-3">
              {pending.map(email => (
                <EmailCard
                  key={email.id} email={email}
                  expanded={expanded === email.id}
                  draft={drafts[email.id] ?? ""}
                  sending={sending === email.id}
                  onToggle={() => setExpanded(expanded === email.id ? null : email.id)}
                  onDraftChange={v => setDrafts(d => ({ ...d, [email.id]: v }))}
                  onSend={() => send(email)}
                  onIgnore={() => ignore(email.id)}
                />
              ))}
            </div>
          </div>
        )}

        {emails.length === 0 && !loading && (
          <div className="text-center py-20">
            <Mail className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No emails yet</p>
            <p className="text-white/20 text-xs mt-1">Emails to hallo@szene.app will appear here</p>
          </div>
        )}

        {/* Sent */}
        {sent.length > 0 && (
          <div>
            <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">Sent ({sent.length})</p>
            <div className="space-y-2">
              {sent.map(email => (
                <div key={email.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 truncate">{email.fromName} — {email.subject}</p>
                  </div>
                  <p className="text-[10px] text-white/25 flex-shrink-0">{new Date(email.sentAt!).toLocaleDateString("de-DE")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ignored */}
        {ignored.length > 0 && (
          <div>
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest mb-3">Ignored ({ignored.length})</p>
            <div className="space-y-2">
              {ignored.map(email => (
                <div key={email.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.04]">
                  <X className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                  <p className="text-xs text-white/30 truncate">{email.fromName} — {email.subject}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmailCard({ email, expanded, draft, sending, onToggle, onDraftChange, onSend, onIgnore }: {
  email: Email; expanded: boolean; draft: string; sending: boolean
  onToggle: () => void; onDraftChange: (v: string) => void
  onSend: () => void; onIgnore: () => void
}) {
  return (
    <div className="rounded-2xl border border-white/[0.12] bg-white/[0.04] overflow-hidden">
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left px-4 py-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-violet-600/25 flex items-center justify-center flex-shrink-0 text-xs font-black text-violet-400">
          {email.fromName[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-white truncate">{email.fromName}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-white/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(email.receivedAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
            </div>
          </div>
          <p className="text-xs text-white/50 truncate">{email.subject}</p>
          <p className="text-xs text-white/30 truncate mt-0.5">{email.from}</p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.08] px-4 pb-4 space-y-4 pt-4">
          {/* Original email */}
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Original message</p>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3">
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{email.body}</p>
            </div>
          </div>

          {/* AI draft */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-bold text-violet-400/70 uppercase tracking-widest">AI draft</p>
              <Pencil className="w-3 h-3 text-violet-400/50" />
            </div>
            <textarea
              value={draft}
              onChange={e => onDraftChange(e.target.value)}
              rows={8}
              className="w-full bg-white/[0.05] border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-violet-500/50 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={onSend} disabled={sending}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors">
              <Send className="w-3.5 h-3.5" />
              {sending ? "Sending…" : "Send reply"}
            </button>
            <button onClick={onIgnore}
              className="px-4 py-3 border border-white/[0.12] text-white/40 hover:text-white hover:border-white/30 rounded-xl text-sm transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
