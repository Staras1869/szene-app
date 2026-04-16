"use client";

// src/contexts/language-context.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { translations } from "@/lib/translations";
import type { Language, TranslationKey } from "@/lib/translations";

type Ctx = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<Ctx>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // (Optional) restore saved language safely
  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved === "en" || saved === "de") setLanguage(saved);
  }, []);

  const t = useMemo(
    () => (key: TranslationKey) => translations[language][key] ?? translations.en[key],
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);