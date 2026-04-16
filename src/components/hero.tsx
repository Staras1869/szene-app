"use client"

import { ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Purple glow — single, restrained */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40">
        {/* Location pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/50 mb-10 tracking-widest uppercase">
          <MapPin className="w-3 h-3 text-violet-400" />
          Mannheim &amp; Rhine-Neckar
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8 max-w-3xl">
          Your city.{" "}
          <span className="text-violet-400">Tonight.</span>
        </h1>

        <p className="text-white/50 text-lg max-w-xl leading-relaxed mb-12">
          Bars, clubs, rooftops, events — curated and updated in real time so you
          always know where the night is going.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="#events"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-colors"
          >
            Explore tonight
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-20 pt-10 border-t border-white/8 grid grid-cols-3 gap-8 max-w-sm">
          {[
            { value: "200+", label: "Venues" },
            { value: "Live", label: "Updates" },
            { value: "Free", label: "Always" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
