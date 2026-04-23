"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Star, Users, TrendingUp, Instagram, Globe, Sparkles } from "lucide-react"

const PERKS = [
  { icon: Star,       title: "Verified badge",        desc: "Your venue gets a ✓ verified badge on every event card — users trust you instantly." },
  { icon: Instagram,  title: "Instagram linked",       desc: "Your latest posts surface directly on Szene. Users tap straight to your profile." },
  { icon: Users,      title: "Going count",            desc: "See how many Szene users mark your events as 'Going' — real demand data." },
  { icon: TrendingUp, title: "Analytics dashboard",   desc: "Views, taps, going count, city breakdown. Know your audience." },
  { icon: Sparkles,   title: "AI recommendations",    desc: "Our AI concierge recommends your venue when it matches what users ask for." },
  { icon: Globe,      title: "Direct ticket link",    desc: "Add your ticket or booking URL — users go straight to purchase." },
]

const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"

export default function PartnerPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    venue: "", city: "", instagram: "", website: "", contact: "", message: ""
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/partner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {})
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: "var(--bg-sticky)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-sm font-black tracking-tight" style={{ color: "var(--text-primary)" }}>SZENE</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide uppercase"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--accent)" }}>
            <Sparkles className="w-3 h-3" /> For venues & event brands
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Get your venue on<br />
            <span style={{ color: "var(--accent)" }}>Szene</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Reach thousands of students and nightlife lovers in Mannheim, Heidelberg, Frankfurt and beyond. Partnered venues get verified badges, AI recommendations, and direct links to Instagram & tickets.
          </p>
        </div>

        {/* Perks grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {PERKS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.title} className="p-5 rounded-2xl transition-colors szene-card">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "var(--bg-surface)" }}>
                  <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>{p.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Form */}
        <div className="rounded-3xl p-8 szene-card">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-black mb-2">We got it!</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>We'll reach out within 24 hours to set up your partner profile.</p>
              <Link href="/" className="inline-block mt-6 text-sm transition-colors" style={{ color: "var(--accent)" }}>
                ← Back to Szene
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black mb-1">Apply to partner</h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Free to apply. We'll set everything up for you.</p>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Venue / Brand name *</label>
                    <input
                      required value={form.venue}
                      onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                      placeholder="e.g. Kaizen Mannheim"
                      className={inputCls}
                      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>City *</label>
                    <select
                      required value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className={inputCls}
                      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    >
                      <option value="">Select city</option>
                      <option value="mannheim">Mannheim</option>
                      <option value="heidelberg">Heidelberg</option>
                      <option value="frankfurt">Frankfurt</option>
                      <option value="ludwigshafen">Ludwigshafen</option>
                      <option value="karlsruhe">Karlsruhe</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Instagram handle</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-faint)" }}>@</span>
                      <input
                        value={form.instagram}
                        onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                        placeholder="yourvenue"
                        className={inputCls + " pl-8"}
                        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Website / Ticket link</label>
                    <input
                      value={form.website}
                      onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                      placeholder="https://..."
                      className={inputCls}
                      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Your contact email *</label>
                  <input
                    type="email" required value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    placeholder="you@yourvenue.de"
                    className={inputCls}
                    style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Anything to add?</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your venue, events, audience..."
                    rows={3}
                    className={inputCls + " resize-none"}
                    style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>

                <button type="submit"
                  className="w-full py-4 text-white font-black rounded-xl transition-colors text-sm tracking-wide"
                  style={{ backgroundColor: "var(--accent)" }}>
                  Apply now — it&apos;s free
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--text-faint)" }}>
          Questions? <a href="mailto:hallo@szene.app" className="underline transition-colors hover:opacity-70">hallo@szene.app</a>
        </p>
      </div>
    </div>
  )
}
