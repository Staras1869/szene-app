"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react"

const CITIES = ["mannheim", "heidelberg", "frankfurt", "ludwigshafen", "karlsruhe"]
const GENRES = ["Afrobeats", "Afrohouse", "Amapiano", "Reggaeton", "Latin", "Hip-Hop", "R&B", "Techno", "Electronic", "House", "Jazz", "Student Party", "Live Music", "Open Air", "Other"]

export default function SubmitEventPage() {
  const [step, setStep]       = useState<"form" | "sending" | "done">("form")
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    promoterName: "", promoterEmail: "", promoterInstagram: "",
    title: "", venue: "", city: "mannheim", date: "", time: "22:00",
    genre: "", price: "", dresscode: "", description: "",
    ticketUrl: "", instagram: "", website: "",
  })

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.promoterName.trim())  e.promoterName  = "Required"
    if (!form.promoterEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.promoterEmail = "Valid email required"
    if (!form.title.trim())         e.title         = "Required"
    if (!form.venue.trim())         e.venue         = "Required"
    if (!form.date)                 e.date          = "Required"
    if (!form.genre)                e.genre         = "Select a genre"
    if (!form.price.trim())         e.price         = "Required (use 'Frei' if free)"
    if (form.description.trim().length < 20) e.description = "At least 20 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setStep("sending")
    try {
      const res = await fetch("/api/events/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ticketUrl:  form.ticketUrl  || undefined,
          website:    form.website    || undefined,
          dresscode:  form.dresscode  || undefined,
          promoterInstagram: form.promoterInstagram || undefined,
          instagram:  form.instagram  || undefined,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setErrors({ _: d.error ?? "Something went wrong" })
        setStep("form")
      } else {
        setStep("done")
      }
    } catch {
      setErrors({ _: "Network error — please try again." })
      setStep("form")
    }
  }

  if (step === "done") return (
    <div className="min-h-screen bg-szene flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-szene">Eingereicht!</h1>
        <p className="text-muted text-sm leading-relaxed">
          Wir prüfen dein Event und melden uns innerhalb von 24 h per E-Mail. Nach der Freigabe erscheint es direkt in der App.
        </p>
        <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: "var(--accent)" }}>
          Zurück zur App →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-szene">
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-szene transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Zurück
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.20)" }}>
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-2xl font-black text-szene">Event einreichen</h1>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Jedes Event wird manuell geprüft, bevor es live geht. Du erhältst eine E-Mail-Bestätigung.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* Promoter section */}
          <fieldset className="szene-card p-5 space-y-4">
            <legend className="text-xs font-bold text-faint uppercase tracking-widest px-1 -ml-1 mb-2">Deine Infos</legend>
            <Field label="Name / Veranstalter" error={errors.promoterName}>
              <input value={form.promoterName} onChange={e => set("promoterName", e.target.value)}
                placeholder="z.B. Alma Events" {...inputProps} />
            </Field>
            <Field label="E-Mail" error={errors.promoterEmail}>
              <input type="email" value={form.promoterEmail} onChange={e => set("promoterEmail", e.target.value)}
                placeholder="dein@email.de" {...inputProps} />
            </Field>
            <Field label="Instagram (optional)" error={errors.promoterInstagram}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint text-sm">@</span>
                <input value={form.promoterInstagram} onChange={e => set("promoterInstagram", e.target.value)}
                  placeholder="euername" className={`${inputProps.className} pl-8`} />
              </div>
            </Field>
          </fieldset>

          {/* Event details */}
          <fieldset className="szene-card p-5 space-y-4">
            <legend className="text-xs font-bold text-faint uppercase tracking-widest px-1 -ml-1 mb-2">Event Details</legend>
            <Field label="Event-Name" error={errors.title}>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="z.B. Afrobeats x Amapiano" {...inputProps} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Venue / Location" error={errors.venue}>
                <input value={form.venue} onChange={e => set("venue", e.target.value)}
                  placeholder="z.B. MS Connexion" {...inputProps} />
              </Field>
              <Field label="Stadt" error={errors.city}>
                <select value={form.city} onChange={e => set("city", e.target.value)} {...inputProps}>
                  {CITIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Datum" error={errors.date}>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)} {...inputProps} />
              </Field>
              <Field label="Einlass" error={errors.time}>
                <input type="time" value={form.time} onChange={e => set("time", e.target.value)} {...inputProps} />
              </Field>
            </div>
            <Field label="Genre / Musikrichtung" error={errors.genre}>
              <select value={form.genre} onChange={e => set("genre", e.target.value)} {...inputProps}>
                <option value="">Bitte wählen…</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Eintritt" error={errors.price}>
                <input value={form.price} onChange={e => set("price", e.target.value)}
                  placeholder="z.B. €8 oder Frei" {...inputProps} />
              </Field>
              <Field label="Dress Code (optional)">
                <input value={form.dresscode} onChange={e => set("dresscode", e.target.value)}
                  placeholder="z.B. Streetwear" {...inputProps} />
              </Field>
            </div>
            <Field label="Beschreibung" error={errors.description}>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={4} placeholder="Was macht dein Event besonders? Wen ladet ihr ein? Was können Gäste erwarten?"
                className={inputProps.className} />
            </Field>
          </fieldset>

          {/* Links */}
          <fieldset className="szene-card p-5 space-y-4">
            <legend className="text-xs font-bold text-faint uppercase tracking-widest px-1 -ml-1 mb-2">Links (optional)</legend>
            <Field label="Event Instagram">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-faint text-sm">@</span>
                <input value={form.instagram} onChange={e => set("instagram", e.target.value)}
                  placeholder="event_handle" className={`${inputProps.className} pl-8`} />
              </div>
            </Field>
            <Field label="Ticket-Link">
              <input value={form.ticketUrl} onChange={e => set("ticketUrl", e.target.value)}
                placeholder="https://…" {...inputProps} />
            </Field>
            <Field label="Website">
              <input value={form.website} onChange={e => set("website", e.target.value)}
                placeholder="https://…" {...inputProps} />
            </Field>
          </fieldset>

          {errors._ && (
            <p className="text-red-500 text-sm text-center">{errors._}</p>
          )}

          <button type="submit" disabled={step === "sending"}
            className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--accent)" }}>
            {step === "sending"
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</>
              : "Event zur Prüfung einreichen →"}
          </button>

          <p className="text-center text-xs text-faint">
            Nach der Freigabe erscheint dein Event in der App. Wir melden uns innerhalb von 24 h.
          </p>
        </form>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputProps = {
  className: "w-full rounded-xl px-4 py-2.5 text-sm text-szene placeholder:text-faint focus:outline-none transition-colors bg-surface border border-szene focus:border-violet-500/50",
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
