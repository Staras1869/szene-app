"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, translations } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.en) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en") // Default to 'en'

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("szene-language") as Language
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage)
      } else {
        const browserLang = navigator.language.split("-")[0] as Language
        if (translations[browserLang]) {
          setLanguage(browserLang)
        }
        // If no saved or browser lang, it remains 'en'
      }
    }
  }, []) // Empty dependency array ensures this runs once on mount

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("szene-language", lang)
    }
  }

  const t = (key: keyof typeof translations.en): string => {
    // Fallback to English if a translation is missing for the current language
    return translations[language]?.[key] || translations.en[key] || String(key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
