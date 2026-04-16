"use client"

import { useState } from "react"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import Link from "next/link"

const CITIES = ["Mannheim", "Heidelberg", "Frankfurt", "Ludwigshafen", "Karlsruhe"]
const TYPES  = ["Club", "Bar", "Restaurant", "Rooftop", "Jazz bar", "Wine bar", "Culture venue", "Festival", "Pop-up", "Other"]

type Tab = "venue" | "event"

export default function SubmitPage() {
  const [tab, setTab]       = useState<Tab>("venue")
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)

  // Venue form
  const [vName, setVName]   = useState("")
  const [vCity, setVCity]   = useState("")
  const [vType, setVType]   = useState("")
  const [vArea, setVArea]   = useState("")
  const [vAddress, setVAddress] = useState("")
  const [vDesc, setVDesc]   = useState("")
  const [vWeb, setVWeb]     = useState("")
  const [vIg, setVIg]       = useState("")

  // Event form
  const [eTitle, setETitle] = useState("")
  const [eVenue, setEVenue] = useState("")
  const [eCity, setECity]   = useState("")
  const [eDate, setEDate]   = useState("")
  const [eTime, setETime]   = useState("")
  const [ePrice, setEPrice] = useState("")
  const [eDesc, setEDesc]   = useState("")
  const [eLink, setELink]   = useState("")
  const [eIg, setEIg]       = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = tab === "venue"
        ? { type: "venue", name: vName, city: vCity, venueType: vType, area: vArea, address: vAddress, description: vDesc, website: vWeb, instagram: vIg }
        : { type: "event", title: eTitle, venue: eVenue, city: eCity, date: eDate, time: eTime, price: ePrice, description: eDesc, link: eLink, instagram: eIg }

      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      setDone(true)
    } catch {}
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-white">Submitted!</h1>
        <p className="text-white/40 text-sm max-w-xs">
          We'll review it and add it to the app. Usually within 24h.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setDone(false); setVName(""); setETitle("") }}
            className="px-5 py-2.5 border border-white/[0.12] text-white/60 hover:text-white rounded-full text-sm font-semibold transition-colors">
            Submit another
          </button>
          <Link href="/" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-sm font-bold transition-colors">
            Back to app
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-sm font-bold text-white">Add to Szene</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            Are you a <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">promoter</span> or venue?
          </h2>
          <p className="text-white/35 text-sm leading-relaxed">
            Get your venue or event in front of thousands of people in Mannheim, Heidelberg, Frankfurt and beyond. Free, always.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-white/[0.05] border border-white/[0.08] rounded-xl mb-8 w-fit">
          {(["venue", "event"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                tab === t ? "bg-violet-600 text-white" : "text-white/30 hover:text-white"
              }`}>
              {t === "venue" ? "📍 Venue" : "🎉 Event"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === "venue" ? (
            <>
              <Field label="Venue name *" required>
                <input value={vName} onChange={e => setVName(e.target.value)} required placeholder="e.g. BASE Club" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City *" required>
                  <select value={vCity} onChange={e => setVCity(e.target.value)} required className={inputCls}>
                    <option value="">Select…</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Type *" required>
                  <select value={vType} onChange={e => setVType(e.target.value)} required className={inputCls}>
                    <option value="">Select…</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Neighbourhood / Area">
                <input value={vArea} onChange={e => setVArea(e.target.value)} placeholder="e.g. Jungbusch, Altstadt…" className={inputCls} />
              </Field>
              <Field label="Address">
                <input value={vAddress} onChange={e => setVAddress(e.target.value)} placeholder="Street, city" className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea value={vDesc} onChange={e => setVDesc(e.target.value)} rows={3} placeholder="Tell people what makes this place special…" className={inputCls + " resize-none"} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Website">
                  <input value={vWeb} onChange={e => setVWeb(e.target.value)} placeholder="https://…" type="url" className={inputCls} />
                </Field>
                <Field label="Instagram">
                  <input value={vIg} onChange={e => setVIg(e.target.value)} placeholder="@handle" className={inputCls} />
                </Field>
              </div>
            </>
          ) : (
            <>
              <Field label="Event title *" required>
                <input value={eTitle} onChange={e => setETitle(e.target.value)} required placeholder="e.g. Rooftop Sessions" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Venue / Location *" required>
                  <input value={eVenue} onChange={e => setEVenue(e.target.value)} required placeholder="Club name or address" className={inputCls} />
                </Field>
                <Field label="City *" required>
                  <select value={eCity} onChange={e => setECity(e.target.value)} required className={inputCls}>
                    <option value="">Select…</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date *" required>
                  <input value={eDate} onChange={e => setEDate(e.target.value)} required type="date" className={inputCls} />
                </Field>
                <Field label="Start time">
                  <input value={eTime} onChange={e => setETime(e.target.value)} type="time" className={inputCls} />
                </Field>
              </div>
              <Field label="Price">
                <input value={ePrice} onChange={e => setEPrice(e.target.value)} placeholder="e.g. Free, €10, €5 before midnight" className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea value={eDesc} onChange={e => setEDesc(e.target.value)} rows={3} placeholder="Line-up, vibe, dress code, anything useful…" className={inputCls + " resize-none"} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ticket / Event link">
                  <input value={eLink} onChange={e => setELink(e.target.value)} placeholder="https://…" type="url" className={inputCls} />
                </Field>
                <Field label="Instagram">
                  <input value={eIg} onChange={e => setEIg(e.target.value)} placeholder="@handle" className={inputCls} />
                </Field>
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Submitting…" : `Submit ${tab}`}
          </button>

          <p className="text-white/20 text-xs text-center">
            Reviewed within 24h · Free forever · No account needed
          </p>
        </form>
      </div>
    </div>
  )
}

const inputCls = "w-full bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-white/35 uppercase tracking-widest mb-1.5 font-semibold">
        {label}
      </label>
      {children}
    </div>
  )
}
