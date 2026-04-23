"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Login failed"); return }
      router.push("/")
      router.refresh()
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none" style={{ backgroundColor: "var(--accent)", opacity: 0.06, filter: "blur(120px)" }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Szene</Link>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Welcome back</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors mt-2"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-faint)" }}>
          No account?{" "}
          <Link href="/register" className="font-medium transition-colors" style={{ color: "var(--accent)" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
