"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

const STORAGE_KEY = "szene-signin-prompt-dismissed"

export function SignInPrompt() {
  const { user, loading } = useAuth()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading) return
    if (user) return
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setVisible(true), 8_000) // 8 s
    return () => clearTimeout(timer)
  }, [user, loading])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible || user) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Panel */}
      <div className="fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] w-full sm:w-[400px] bg-zinc-900 border border-white/10 sm:rounded-2xl shadow-2xl p-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-300">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">✦</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Save your favorites.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Sign in to save venues, track check-ins, and get a feed tailored to your scene.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={dismiss}
              className="block w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl text-sm font-semibold transition-colors text-center"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={dismiss}
              className="block w-full border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white py-3 rounded-xl text-sm font-semibold transition-colors text-center"
            >
              Create account — it's free
            </Link>
            <button
              onClick={dismiss}
              className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors mt-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
