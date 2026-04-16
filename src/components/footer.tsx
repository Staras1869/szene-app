"use client"

import Link from "next/link"
import { Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/6 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div>
            <p className="text-xl font-bold text-white mb-3 tracking-tight">Szene</p>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">
              Your guide to nightlife, events, and venues in Mannheim, Heidelberg, and beyond.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-zinc-600 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" aria-label="Twitter"   className="text-zinc-600 hover:text-white transition-colors"><Twitter   className="w-4 h-4" /></a>
              <a href="#" aria-label="Email"     className="text-zinc-600 hover:text-white transition-colors"><Mail      className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Discover</p>
            <ul className="space-y-2.5">
              {[
                { label: "Events this week", href: "#events" },
                { label: "Trending venues",  href: "#" },
                { label: "Student nights",   href: "#" },
                { label: "Map view",         href: "#" },
              ].map((l) => (
                <li key={l.label}><a href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Cities</p>
            <ul className="space-y-2.5">
              {["Mannheim", "Heidelberg", "Ludwigshafen", "Frankfurt"].map((c) => (
                <li key={c}><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">{c}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><Link href="/agb"         className="text-sm text-zinc-500 hover:text-white transition-colors">AGB</Link></li>
              <li><Link href="/datenschutz" className="text-sm text-zinc-500 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/impressum"   className="text-sm text-zinc-500 hover:text-white transition-colors">Impressum</Link></li>
              <li><a href="#"               className="text-sm text-zinc-500 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} Szene Digital Solutions UG (haftungsbeschränkt) · Planken 7, 68161 Mannheim</p>
          <p className="text-xs text-zinc-700">Made in Mannheim 🇩🇪</p>
        </div>
      </div>
    </footer>
  )
}
