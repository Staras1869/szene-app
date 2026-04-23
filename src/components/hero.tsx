"use client"

import { useState, useEffect } from "react"
import { Sparkles, Loader2, ArrowRight, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const CITIES = [
  { id: "mannheim",     label: "Mannheim",     going: 1847 },
  { id: "heidelberg",   label: "Heidelberg",   going: 934  },
  { id: "frankfurt",    label: "Frankfurt",    going: 3210 },
  { id: "ludwigshafen", label: "Ludwigshafen", going: 412  },
  { id: "karlsruhe",    label: "Karlsruhe",    going: 621  },
]

const QUICK_ASKS = [
  "Best afrobeats night this weekend?",
  "Chill bar for a date?",
  "Any uni parties tonight?",
  "Reggaeton — where?",
  "Hidden bar nobody knows?",
]

const CITY_LINES: Record<string, string> = {
  mannheim:     "Jungbusch is calling.",
  heidelberg:   "Altstadt never sleeps.",
  frankfurt:    "The Main runs late.",
  ludwigshafen: "Rhein vibes only.",
  karlsruhe:    "Substage or Tollhaus?",
}

interface Pick {
  name: string; type: string; why: string; vibe: string
  time?: string; price?: string; area?: string
}

function useGreeting(t: (k: string) => string) {
  const [greeting, setGreeting] = useState("")
  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12)  setGreeting(t("goodMorning"))
    else if (h < 18)       setGreeting(t("goodAfternoon"))
    else if (h < 22)       setGreeting(t("goodEvening"))
    else                   setGreeting(t("stillUp"))
  }, [t])
  return greeting
}

const VIBE_GRADS: Record<string, string> = {
  afro:    "from-green-800 to-emerald-900",
  latin:   "from-orange-800 to-red-900",
  hiphop:  "from-zinc-700 to-zinc-900",
  student: "from-blue-800 to-indigo-900",
  party:   "from-violet-800 to-purple-900",
  chill:   "from-stone-800 to-zinc-900",
  jazz:    "from-amber-800 to-orange-900",
  techno:  "from-fuchsia-800 to-violet-900",
  default: "from-zinc-800 to-neutral-900",
}
function getGrad(vibe: string) {
  const key = Object.keys(VIBE_GRADS).find(k => vibe?.toLowerCase().includes(k))
  return VIBE_GRADS[key ?? "default"]
}

export function Hero({ city, onCityPick }: { city: string | null; onCityPick: (c: string) => void }) {
  const { t } = useLanguage()
  const [asked, setAsked]       = useState(false)
  const [loading, setLoading]   = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer]     = useState("")
  const [picks, setPicks]       = useState<Pick[]>([])
  const greeting                = useGreeting(t)

  const activeCity  = CITIES.find(c => c.id === (city ?? "mannheim")) ?? CITIES[0]
  const cityLine    = CITY_LINES[activeCity.id] ?? ""

  async function ask(q: string) {
    setQuestion(q); setAsked(true); setLoading(true); setAnswer(""); setPicks([])
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${q} (city: ${activeCity.id}). Reply in this JSON format ONLY — no markdown, no explanation outside JSON:
{"answer":"2-sentence concierge reply","picks":[{"name":"Venue or Event","type":"Club/Bar/Event","why":"one line reason","vibe":"emoji + vibe word","time":"e.g. 22:00","price":"e.g. €8 or Free","area":"neighbourhood"}]}
Give exactly 3 picks.`,
          city: activeCity.id,
        }),
      })
      const d   = await res.json()
      const raw = d.reply ?? ""
      const m   = raw.match(/\{[\s\S]*\}/)
      if (m) {
        const p = JSON.parse(m[0])
        setAnswer(p.answer ?? ""); setPicks(p.picks ?? [])
      } else {
        setAnswer(raw)
      }
    } catch { setAnswer("Network error — try again.") }
    setLoading(false)
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Ambient glow — night only, hidden in day via low opacity */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.08] blur-[130px]"
          style={{ backgroundColor: "var(--accent)" }} />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-10">

        {/* Greeting + city line */}
        {greeting && (
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] mb-5"
            style={{ color: "var(--text-muted)" }}>
            {greeting} · {cityLine}
          </p>
        )}

        {/* Main headline */}
        <div className="text-center mb-4">
          <h1 className="font-display leading-none" style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            fontSize: "clamp(3.5rem, 14vw, 6.5rem)",
            letterSpacing: "var(--font-display) === 'Bebas Neue, sans-serif' ? '-0.02em' : '0.02em'",
          }}>
            {activeCity.label.toUpperCase()}
          </h1>
          <p className="font-display mt-1" style={{
            fontFamily: "var(--font-display)",
            color: "var(--accent)",
            fontSize: "clamp(1.5rem, 6vw, 3rem)",
          }}>
            {t("tonight")}
          </p>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="font-bold" style={{ color: "var(--text-secondary)" }}>
              {activeCity.going.toLocaleString("de-DE")}
            </span>{" "}
            people going out in {activeCity.label} this week
          </p>
        </div>

        {/* City selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => onCityPick(c.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-150 ${
                (city ?? "mannheim") === c.id ? "pill-active scale-105" : "pill-inactive"
              }`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* AI interaction */}
        {!asked ? (
          <div className="space-y-3">
            <button onClick={() => ask(t("whereToGo"))}
              className="w-full flex items-center justify-between gap-3 px-6 py-5 rounded-2xl font-black text-lg transition-all duration-150 active:scale-[0.98] shadow-lg group text-white"
              style={{ backgroundColor: "var(--accent)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                {t("whereToGo")}
              </div>
              <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {QUICK_ASKS.map(q => (
                <button key={q} onClick={() => ask(q)}
                  className="flex-shrink-0 text-xs px-4 py-2 rounded-full transition-all vibe-inactive">
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Question chip */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-szene flex-1">{question}</p>
              <button onClick={() => { setAsked(false); setAnswer(""); setPicks([]) }}
                className="text-faint hover:text-szene text-xs transition-colors flex-shrink-0">✕</button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                <p className="text-sm text-muted">{t("findingNight")}</p>
              </div>
            ) : (
              <>
                {answer && <p className="text-sm leading-relaxed px-1 text-muted">{answer}</p>}

                {picks.length > 0 && (
                  <div className="space-y-3">
                    {picks.map((pick, i) => (
                      <div key={i}
                        className={`relative p-5 rounded-2xl bg-gradient-to-br ${getGrad(pick.vibe)} border border-white/[0.10] overflow-hidden`}>
                        <span className="absolute top-4 right-4 text-4xl font-black text-white/[0.07] select-none leading-none">{i + 1}</span>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="text-white font-black text-base leading-tight">{pick.name}</p>
                            <p className="text-white/50 text-xs mt-0.5">{pick.type}{pick.area ? ` · ${pick.area}` : ""}</p>
                          </div>
                          <span className="text-sm flex-shrink-0">{pick.vibe?.split(" ")[0]}</span>
                        </div>
                        <p className="text-white/65 text-sm leading-relaxed mb-3">{pick.why}</p>
                        <div className="flex items-center gap-3 text-xs text-white/45">
                          {pick.time  && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pick.time}</span>}
                          {pick.price && <span className={`font-semibold ${pick.price?.toLowerCase().includes("free") || pick.price === "Frei" ? "text-emerald-400" : "text-white/60"}`}>{pick.price}</span>}
                          {pick.area  && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pick.area}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <button onClick={() => ask(t("whereToGo"))}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-bold text-sm transition-all"
                    style={{ backgroundColor: "var(--accent)" }}>
                    <Sparkles className="w-4 h-4" /> {t("whereToGo")}
                  </button>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
                    {QUICK_ASKS.filter(q => q !== question).map(q => (
                      <button key={q} onClick={() => ask(q)}
                        className="flex-shrink-0 text-xs px-4 py-2 rounded-full transition-all vibe-inactive">{q}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom fade into shell */}
      <div className="h-6 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg-primary))" }} />
    </section>
  )
}
