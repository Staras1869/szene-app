"use client"

import { ArrowRight, MapPin, Zap } from "lucide-react"
import Link from "next/link"
import { SearchSystem } from "./search-system"

export function Hero() {
  return (
    <section className="relative bg-black text-white overflow-hidden min-h-[92vh] flex flex-col justify-center">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-700/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-700/20 blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-indigo-700/15 blur-[80px]" />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[11px] text-white/40 uppercase tracking-[0.18em] font-medium">Live · Mannheim &amp; Rhine-Neckar</span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(3rem,10vw,8rem)] font-black tracking-tight leading-[0.9] mb-8">
          <span className="block text-white">Your city.</span>
          <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Tonight.
          </span>
        </h1>

        <p className="text-white/40 text-lg max-w-md leading-relaxed mb-12 font-light">
          Bars, clubs, rooftops, events — curated and live so you always know where the night is.
        </p>

        {/* Search bar */}
        <div className="max-w-xl mb-12">
          <div className="bg-white/[0.07] border border-white/[0.12] rounded-2xl px-4 backdrop-blur-sm hover:bg-white/[0.10] transition-colors">
            <SearchSystem />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-20">
          <Link href="#events"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
            Explore tonight
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/register"
            className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 px-6 py-3 rounded-full text-sm font-medium transition-colors">
            Join free
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-10 pt-8 border-t border-white/[0.07]">
          {[
            { value: "200+", label: "Venues", icon: MapPin },
            { value: "Live", label: "Updates", icon: Zap },
            { value: "Free", label: "Always", icon: null },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[11px] text-white/30 mt-0.5 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
