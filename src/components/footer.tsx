"use client"

import Link from "next/link"
import { Instagram, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type Go = (opts: { city?: string; tab?: string }) => void

export function Footer({ go }: { go?: Go }) {
  const { t } = useLanguage()
  return (
    <footer className="bg-szene border-t border-szene text-szene py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          <div>
            <p className="text-xl font-black tracking-tight mb-3">SZENE</p>
            <p className="text-muted text-sm leading-relaxed mb-5">
              {t("footerDescription")}
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-faint hover:text-szene transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="mailto:hallo@szene-app.de" className="text-faint hover:text-szene transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-whisper uppercase tracking-[0.2em] mb-4">Explore</p>
            <ul className="space-y-3">
              <li><button onClick={() => go?.({ tab: "foryou" })}  className="text-sm text-muted hover:text-szene transition-colors text-left w-full">For You — Recommendations</button></li>
              <li><button onClick={() => go?.({ tab: "events" })}  className="text-sm text-muted hover:text-szene transition-colors text-left w-full">Events this week</button></li>
              <li><button onClick={() => go?.({ tab: "tonight" })} className="text-sm text-muted hover:text-szene transition-colors text-left w-full">Open now — Tonight</button></li>
              <li><button onClick={() => go?.({ tab: "venues" })}  className="text-sm text-muted hover:text-szene transition-colors text-left w-full">Trending venues</button></li>
              <li><Link href="/submit-event" className="text-sm text-muted hover:text-szene transition-colors">Event einreichen →</Link></li>
              <li><Link href="/partner" className="text-sm text-violet-400/70 hover:text-violet-300 transition-colors font-semibold">Partner with Szene →</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-whisper uppercase tracking-[0.2em] mb-4">Cities</p>
            <ul className="space-y-3">
              {[
                { label: "Mannheim",     id: "mannheim" },
                { label: "Heidelberg",   id: "heidelberg" },
                { label: "Frankfurt",    id: "frankfurt" },
                { label: "Ludwigshafen", id: "ludwigshafen" },
                { label: "Karlsruhe",    id: "karlsruhe" },
              ].map(c => (
                <li key={c.id}>
                  <button onClick={() => go?.({ city: c.id, tab: "foryou" })}
                    className="text-sm text-muted hover:text-szene transition-colors text-left w-full">
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-whisper uppercase tracking-[0.2em] mb-4">Legal</p>
            <ul className="space-y-3">
              <li><Link href="/agb"         className="text-sm text-muted hover:text-szene transition-colors">AGB</Link></li>
              <li><Link href="/datenschutz" className="text-sm text-muted hover:text-szene transition-colors">Datenschutz</Link></li>
              <li><Link href="/impressum"   className="text-sm text-muted hover:text-szene transition-colors">Impressum</Link></li>
              <li><a href="mailto:hallo@szene-app.de" className="text-sm text-muted hover:text-szene transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-szene pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-whisper">&copy; {new Date().getFullYear()} Efstratios Kampourakis · Szene Digital Solutions UG (i.G.) · Roonstraße 29, 67061 Ludwigshafen</p>
          <p className="text-xs text-whisper opacity-60">Made in Mannheim 🇩🇪</p>
        </div>
      </div>
    </footer>
  )
}
