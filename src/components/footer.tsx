"use client"

import Link from "next/link"
import { Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
  function scrollToApp() {
    document.getElementById("app-shell-top")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer className="bg-black border-t border-white/[0.10] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div>
            <p className="text-xl font-black tracking-tight mb-3">SZENE</p>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              Your guide to nightlife, events, and venues in Mannheim, Heidelberg, Frankfurt and beyond.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="mailto:hallo@szene-app.de"
                className="text-white/40 hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.2em] mb-4">Discover</p>
            <ul className="space-y-2.5">
              <li><button onClick={scrollToApp} className="text-sm text-white/45 hover:text-white transition-colors text-left">Events this week</button></li>
              <li><button onClick={scrollToApp} className="text-sm text-white/45 hover:text-white transition-colors text-left">Trending venues</button></li>
              <li><button onClick={scrollToApp} className="text-sm text-white/45 hover:text-white transition-colors text-left">Student nights</button></li>
              <li><Link href="/submit" className="text-sm text-white/45 hover:text-white transition-colors">Submit your venue</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.2em] mb-4">Cities</p>
            <ul className="space-y-2.5">
              {["Mannheim", "Heidelberg", "Frankfurt", "Ludwigshafen", "Karlsruhe"].map(c => (
                <li key={c}>
                  <button onClick={scrollToApp} className="text-sm text-white/45 hover:text-white transition-colors text-left">
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.2em] mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><Link href="/agb"         className="text-sm text-white/45 hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/datenschutz" className="text-sm text-white/45 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/impressum"   className="text-sm text-white/45 hover:text-white transition-colors">Impressum</Link></li>
              <li><a href="mailto:hallo@szene-app.de" className="text-sm text-white/45 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} Szene Digital Solutions UG (haftungsbeschränkt) · Planken 7, 68161 Mannheim</p>
          <p className="text-xs text-white/20">Made in Mannheim 🇩🇪</p>
        </div>
      </div>
    </footer>
  )
}
