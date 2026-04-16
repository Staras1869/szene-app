"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"

// ── Question config ────────────────────────────────────────────────────────────

const AVATAR_EMOJIS = ["🎭","🎧","🍸","🎷","🌙","🔥","🌿","🎨","🍜","⚡","🦋","🐺","🌊","🎸","🏙️","🍷"]
const AVATAR_COLORS = [
  { hex: "#7c3aed", label: "Violet"  },
  { hex: "#db2777", label: "Pink"    },
  { hex: "#0ea5e9", label: "Sky"     },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#f59e0b", label: "Amber"   },
  { hex: "#ef4444", label: "Red"     },
  { hex: "#6366f1", label: "Indigo"  },
  { hex: "#14b8a6", label: "Teal"    },
]

const NEIGHBORHOODS = [
  "Jungbusch","Quadrate","Wasserturm","Innenstadt","Neckarstadt",
  "Lindenhof","Feudenheim","Heidelberg","Ludwigshafen","Other",
]

const MUSIC_OPTIONS = [
  { id: "techno",    label: "Techno",      emoji: "🖤" },
  { id: "house",     label: "House",       emoji: "🎧" },
  { id: "hiphop",    label: "Hip-Hop",     emoji: "🎤" },
  { id: "jazz",      label: "Jazz",        emoji: "🎷" },
  { id: "indie",     label: "Indie",       emoji: "🎸" },
  { id: "pop",       label: "Pop",         emoji: "🎵" },
  { id: "rnb",       label: "R&B",         emoji: "💫" },
  { id: "classical", label: "Classical",   emoji: "🎼" },
  { id: "everything",label: "Everything",  emoji: "🌈" },
]

const VIBE_OPTIONS = [
  { id: "party",    label: "Party mode",    emoji: "🔥", sub: "Clubs & late nights" },
  { id: "chill",    label: "Chill vibes",   emoji: "🍷", sub: "Bars & wine spots"   },
  { id: "culture",  label: "Cultural",      emoji: "🎨", sub: "Art, theatre & film" },
  { id: "music",    label: "Live music",    emoji: "🎷", sub: "Concerts & gigs"     },
  { id: "food",     label: "Food lover",    emoji: "🍜", sub: "Restaurants & markets"},
  { id: "outdoor",  label: "Outdoorsy",     emoji: "🌿", sub: "Parks & rooftops"    },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

function Chip({ label, emoji, selected, onClick }: { label: string; emoji?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
        selected
          ? "bg-violet-600 border-violet-500 text-white scale-105"
          : "bg-white/[0.03] border-white/10 text-zinc-400 hover:border-violet-500/40 hover:text-white"
      }`}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  )
}

// ── Wizard ─────────────────────────────────────────────────────────────────────

interface WizardState {
  displayName: string
  bio: string
  avatarEmoji: string
  avatarColor: string
  neighborhood: string
  musicTaste: string[]
  vibes: string[]
  instagram: string
}

const INITIAL: WizardState = {
  displayName: "", bio: "", avatarEmoji: "🎭", avatarColor: "#7c3aed",
  neighborhood: "", musicTaste: [], vibes: [], instagram: "",
}

export function OnboardingWizard({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardState>(INITIAL)
  const [saving, setSaving] = useState(false)

  const STEPS = [
    {
      title: "Pick your look",
      sub: "Choose an emoji and colour for your profile",
      content: (
        <div className="space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 border-white/10 transition-all"
              style={{ backgroundColor: data.avatarColor + "33", borderColor: data.avatarColor + "66" }}
            >
              {data.avatarEmoji}
            </div>
          </div>

          {/* Emoji grid */}
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Emoji</p>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e} type="button"
                  onClick={() => setData((d) => ({ ...d, avatarEmoji: e }))}
                  className={`text-2xl py-1.5 rounded-xl transition-all ${data.avatarEmoji === e ? "bg-violet-600/30 scale-110" : "hover:bg-white/5"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Colour</p>
            <div className="flex flex-wrap gap-3">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.hex} type="button"
                  onClick={() => setData((d) => ({ ...d, avatarColor: c.hex }))}
                  className={`w-8 h-8 rounded-full transition-all ${data.avatarColor === c.hex ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-zinc-900" : "hover:scale-110"}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "What's your name?",
      sub: "How should people know you on Szene?",
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Display name</label>
            <input
              type="text" maxLength={40}
              value={data.displayName}
              onChange={(e) => setData((d) => ({ ...d, displayName: e.target.value }))}
              placeholder="e.g. Max, DJ_Maxi, nightowl42"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Bio <span className="text-zinc-700">— optional</span></label>
            <textarea
              maxLength={160} rows={3}
              value={data.bio}
              onChange={(e) => setData((d) => ({ ...d, bio: e.target.value }))}
              placeholder="One line about you — your vibe, what you're into…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
            <p className="text-xs text-zinc-700 mt-1 text-right">{data.bio.length}/160</p>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Instagram <span className="text-zinc-700">— optional</span></label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-violet-500 transition-colors">
              <span className="text-zinc-600 mr-1">@</span>
              <input
                type="text" maxLength={40}
                value={data.instagram}
                onChange={(e) => setData((d) => ({ ...d, instagram: e.target.value.replace("@","") }))}
                placeholder="yourhandle"
                className="flex-1 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your neighbourhood?",
      sub: "Where do you usually go out?",
      content: (
        <div className="flex flex-wrap gap-2">
          {NEIGHBORHOODS.map((n) => (
            <Chip key={n} label={n} selected={data.neighborhood === n}
              onClick={() => setData((d) => ({ ...d, neighborhood: d.neighborhood === n ? "" : n }))}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Your music taste?",
      sub: "Pick up to 3 — we'll personalise your feed",
      content: (
        <div className="flex flex-wrap gap-2">
          {MUSIC_OPTIONS.map((m) => (
            <Chip key={m.id} label={m.label} emoji={m.emoji}
              selected={data.musicTaste.includes(m.id)}
              onClick={() => {
                if (data.musicTaste.includes(m.id) || data.musicTaste.length < 3)
                  setData((d) => ({ ...d, musicTaste: toggle(d.musicTaste, m.id) }))
              }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "What's your vibe?",
      sub: "Pick up to 3 that describe your nights out",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {VIBE_OPTIONS.map((v) => (
            <button
              key={v.id} type="button"
              onClick={() => {
                if (data.vibes.includes(v.id) || data.vibes.length < 3)
                  setData((d) => ({ ...d, vibes: toggle(d.vibes, v.id) }))
              }}
              className={`flex flex-col gap-1 p-4 rounded-2xl border text-left transition-all ${
                data.vibes.includes(v.id)
                  ? "bg-violet-600/20 border-violet-500/50 scale-[1.02]"
                  : "bg-white/[0.02] border-white/8 hover:border-white/16"
              }`}
            >
              <span className="text-2xl">{v.emoji}</span>
              <span className="text-sm font-semibold text-white">{v.label}</span>
              <span className="text-xs text-zinc-500">{v.sub}</span>
            </button>
          ))}
        </div>
      ),
    },
  ]

  const isLast = step === STEPS.length - 1

  async function finish() {
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, onboarded: true }),
      })
    } catch {}
    setSaving(false)
    onComplete?.()
    router.push("/profile")
    router.refresh()
  }

  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-violet-500" : "bg-white/10"}`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/8 rounded-3xl p-8">
          <p className="text-xs text-violet-400 uppercase tracking-widest mb-2">Step {step + 1} of {STEPS.length}</p>
          <h2 className="text-2xl font-bold text-white mb-1">{current.title}</h2>
          <p className="text-zinc-500 text-sm mb-8">{current.sub}</p>

          {current.content}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={isLast ? finish : () => setStep((s) => s + 1)}
            disabled={saving}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            {saving ? "Saving…" : isLast ? <><Check className="w-4 h-4" /> Done</> : <>Next <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

        {/* Skip */}
        {!isLast && (
          <p className="text-center mt-4">
            <button
              type="button"
              onClick={finish}
              className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              Skip for now
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
