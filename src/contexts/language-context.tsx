"use client"

import React, { createContext, useContext, useMemo, useState } from "react"
import { translations, extraTranslations } from "@/lib/translations"
import type { Language, TranslationKey } from "@/lib/translations"

export type AppLanguage = Language | "es" | "it"

const ALL_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: translations.en as unknown as Record<string, string>,
  de: translations.de as unknown as Record<string, string>,
  es: extraTranslations.es as unknown as Record<string, string>,
  it: extraTranslations.it as unknown as Record<string, string>,
}

// Fallback chain: current lang → de → key


function detectLanguage(): AppLanguage {
  if (typeof navigator === "undefined") return "de"
  const lang = navigator.language?.slice(0, 2).toLowerCase()
  if (lang === "de") return "de"
  if (lang === "es") return "es"
  if (lang === "it") return "it"
  return "en"
}

export const LANGUAGE_OPTIONS: { code: AppLanguage; label: string; flag: string }[] = [
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
]

type Ctx = {
  language: AppLanguage
  setLanguage: (l: AppLanguage) => void
  t: (key: TranslationKey | string) => string
}

const LanguageContext = createContext<Ctx>({
  language: "de",
  setLanguage: () => {},
  t: (key) => (translations.de as any)[key] ?? String(key),
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("de")

  React.useEffect(() => {
    const saved = localStorage.getItem("szene_lang") as AppLanguage | null
    const valid: AppLanguage[] = ["de", "en", "es", "it"]
    if (saved && valid.includes(saved)) {
      setLanguageState(saved)
    } else {
      setLanguageState(detectLanguage())
    }
  }, [])

  function setLanguage(l: AppLanguage) {
    setLanguageState(l)
    localStorage.setItem("szene_lang", l)
  }

  const t = useMemo(
    () => (key: string) => {
      const dict = ALL_TRANSLATIONS[language]
      const fallback = ALL_TRANSLATIONS["de"]
      return dict?.[key] ?? fallback?.[key] ?? key
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)