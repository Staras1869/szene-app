"use client"

import { useLanguage, LANGUAGE_OPTIONS, type AppLanguage } from "@/contexts/language-context"

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()

  if (compact) {
    return (
      <div className="flex gap-1 flex-wrap">
        {LANGUAGE_OPTIONS.map(opt => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={language === opt.code
              ? { backgroundColor: "var(--accent)", color: "#fff" }
              : { backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }
            }
          >
            {opt.flag} {opt.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value as AppLanguage)}
      className="szene-input rounded-xl px-3 py-2 text-sm focus:outline-none"
    >
      {LANGUAGE_OPTIONS.map(opt => (
        <option key={opt.code} value={opt.code}>{opt.flag} {opt.label}</option>
      ))}
    </select>
  )
}
