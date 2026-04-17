"use client"

import { useState } from "react"
import { Sparkles, Loader2, ArrowRight, MapPin, Clock, ExternalLink } from "lucide-react"

const CITIES = [
  { id: "mannheim",     label: "Mannheim" },
  { id: "heidelberg",   label: "Heidelberg" },
  { id: "frankfurt",    label: "Frankfurt" },
  { id: "ludwigshafen", label: "Ludwigshafen" },
  { id: "karlsruhe",    label: "Karlsruhe" },
]

const QUICK_ASKS = [
  "Where should I go tonight?",
  "Best afrobeats night this weekend?",
  "Chill bar for a date?",
  "Any uni parties tonight?",
  "Reggaeton — where?",
]

interface Pick {
  name: string
  type: string
  why: string
  vibe: string
  time?: string
  price?: string
  area?: string
}

export function Hero({ city, onCityPick }: { city: string | null; onCityPick: (c: string) => void }) {
  const [asked, setAsked]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer]   = useState("")
  const [picks, setPicks]     = useState<Pick[]>([])

  async function ask(q: string) {
    const activeCity = city ?? "mannheim"
    setQuestion(q)
    setAsked(true)
    setLoading(true)
    setAnswer("")
    setPicks([])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${q} (city: ${activeCity}). Reply in this JSON format ONLY — no markdown, no explanation outside JSON:
{"answer":"2-sentence concierge reply","picks":[{"name":"Venue or Event","type":"Club/Bar/Event","why":"one line reason","vibe":"emoji + vibe word","time":"e.g. 22:00","price":"e.g. €8 or Free","area":"neighbourhood"}]}
Give exactly 3 picks.`,
        }),
      })
      const d = await res.json()
      try {
        // Try to parse JSON from the reply
        const raw = d.reply ?? ""
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          setAnswer(parsed.answer ?? "")
          setPicks(parsed.picks ?? [])
        } else {
          setAnswer(raw)
        }
      } catch {
        setAnswer(d.reply ?? "")
      }
    } catch {
      setAnswer("Network error — try again.")
    }
    setLoading(false)
  }

  const VIBE_COLORS: Record<string, string> = {
    afro: "from-green-800 to-emerald-900",
    latin: "from-orange-800 to-red-900",
    hiphop: "from-zinc-700 to-zinc-900",
    student: "from-blue-800 to-indigo-900",
    party: "from-violet-800 to-purple-900",
    chill: "from-stone-800 to-zinc-900",
    jazz: "from-amber-800 to-orange-900",
    techno: "from-fuchsia-800 to-violet-900",
    default: "from-zinc-800 to-neutral-900",
  }

  function getGrad(vibe: string) {
    const key = Object.keys(VIBE_COLORS).find(k => vibe?.toLowerCase().includes(k))
    return VIBE_COLORS[key ?? "default"]
  }

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-violet-700/12 blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-14 pb-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-white leading-none">SZENE</h1>
          <p className="text-white/35 text-xs mt-3 tracking-[0.35em] uppercase">Your city · Tonight</p>
        </div>

        {/* City pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CITIES.map(c => (
            <button
              key={c.id}
              onClick={() => onCityPick(c.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-150 ${
                city === c.id
                  ? "bg-white text-black scale-105"
                  : "border border-white/20 text-white/60 hover:border-white/50 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* ── THE MAIN BUTTON ── */}
        {!asked ? (
          <div className="space-y-4">
            <button
              onClick={() => ask("Where should I go tonight?")}
              className="w-full flex items-center justify-between gap-3 px-6 py-5 bg-violet-600 hover:bg-violet-500 rounded-2xl text-white font-black text-lg transition-all duration-150 active:scale-[0.98] shadow-2xl shadow-violet-900/40 group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                Where should I go tonight?
              </div>
              <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick asks */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {QUICK_ASKS.slice(1).map(q => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="flex-shrink-0 text-xs px-4 py-2 rounded-full border border-white/[0.15] text-white/50 hover:border-white/35 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Question shown */}
            <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.05] border border-white/[0.10] rounded-2xl">
              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <p className="text-white font-semibold text-sm">{question}</p>
              <button
                onClick={() => { setAsked(false); setAnswer(""); setPicks([]) }}
                className="ml-auto text-white/30 hover:text-white text-xs transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                <p className="text-white/40 text-sm">Finding your perfect night…</p>
              </div>
            ) : (
              <>
                {/* AI answer */}
                {answer && (
                  <p className="text-white/70 text-sm leading-relaxed px-1">{answer}</p>
                )}

                {/* Picks */}
                {picks.length > 0 && (
                  <div className="space-y-3">
                    {picks.map((pick, i) => (
                      <div
                        key={i}
                        className={`relative p-5 rounded-2xl bg-gradient-to-br ${getGrad(pick.vibe)} border border-white/[0.10] overflow-hidden group`}
                      >
                        {/* Number */}
                        <span className="absolute top-4 right-4 text-4xl font-black text-white/[0.07] select-none leading-none">
                          {i + 1}
                        </span>

                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="text-white font-black text-base leading-tight">{pick.name}</p>
                            <p className="text-white/50 text-xs mt-0.5">{pick.type}{pick.area ? ` · ${pick.area}` : ""}</p>
                          </div>
                          <span className="text-sm flex-shrink-0">{pick.vibe?.split(" ")[0]}</span>
                        </div>

                        <p className="text-white/65 text-sm leading-relaxed mb-3">{pick.why}</p>

                        <div className="flex items-center gap-3 text-xs text-white/45">
                          {pick.time && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pick.time}</span>
                          )}
                          {pick.price && (
                            <span className={`font-semibold ${pick.price?.toLowerCase().includes("free") || pick.price === "Frei" ? "text-emerald-400" : "text-white/60"}`}>
                              {pick.price}
                            </span>
                          )}
                          {pick.area && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pick.area}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ask again */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => ask("Where should I go tonight?")}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold text-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Ask again
                  </button>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
                    {QUICK_ASKS.filter(q => q !== question).map(q => (
                      <button key={q} onClick={() => ask(q)}
                        className="flex-shrink-0 text-xs px-4 py-2 rounded-full border border-white/[0.15] text-white/50 hover:border-white/35 hover:text-white transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
