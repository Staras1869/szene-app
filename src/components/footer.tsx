"use client"

import Link from "next/link"
import { Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.06] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div>
            <p className="text-xl font-black tracking-tight mb-3">SZENE</p>
            <p className="text-white/30 text-sm leading-relaxed mb-5">
              Your guide to nightlife, events, and venues in Mannheim, Heidelberg, and beyond.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/25 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="text-white/25 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-white/25 hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Discover</p>
            <ul className="space-y-2.5">
              {[
                { label: "Events this week", href: "#events" },
                { label: "Trending venues", href: "#venues" },
                { label: "Student nights", href: "#" },
                { label: "Map view", href: "#" },
              ].map(l => (
                <li key={l.label}><a href={l.href} className="text-sm text-white/30 hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Cities</p>
            <ul className="space-y-2.5">
              {["Mannheim", "Heidelberg", "Ludwigshafen", "Frankfurt"].map(c => (
                <li key={c}><a href="#" className="text-sm text-white/30 hover:text-white transition-colors">{c}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><Link href="/agb"         className="text-sm text-white/30 hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/datenschutz" className="text-sm text-white/30 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/impressum"   className="text-sm text-white/30 hover:text-white transition-colors">Impressum</Link></li>
              <li><a href="#"               className="text-sm text-white/30 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/15">&copy; {new Date().getFullYear()} Szene Digital Solutions UG (haftungsbeschränkt) · Planken 7, 68161 Mannheim</p>
          <p className="text-xs text-white/10">Made in Mannheim 🇩🇪</p>
        </div>
      </div>
    </footer>
  )
}
