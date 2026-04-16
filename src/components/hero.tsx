"use client"

import { MapPin, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function Hero() {
  const { user, loading } = useAuth()

  return (
    <section className="relative bg-black text-white overflow-hidden pt-8 pb-6">
      {/* Gradient blob */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none">
        <div className="absolute top-[-60%] left-1/2 -translate-x-1/2 w-[80vw] h-[200px] rounded-full bg-violet-700/20 blur-[80px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-white/55 uppercase tracking-[0.2em]">Live · Mannheim</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95]">
              <span className="text-white">Your city.</span>{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Tonight.</span>
            </h1>
          </div>

          {!loading && !user && (
            <div className="flex flex-col gap-2 flex-shrink-0 ml-4">
              <Link href="/login" className="text-xs font-bold text-black bg-white px-4 py-2 rounded-full whitespace-nowrap hover:bg-white/90 transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="text-xs font-semibold text-white/50 hover:text-white text-center transition-colors">
                Join free
              </Link>
            </div>
          )}
          {!loading && user && (
            <Link href="/profile" className="flex-shrink-0 ml-4 w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-violet-400">{(user.displayName || user.email || "U")[0].toUpperCase()}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
