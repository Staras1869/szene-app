"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Heart, LogOut, Star, Users, CheckCircle2, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Stats {
  checkIns: number
  favorites: number
  reviews: number
  followers: number
  following: number
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch("/api/checkins").then((r) => r.json()).catch(() => ({ checkIns: [] })),
      fetch("/api/favorites").then((r) => r.json()).catch(() => ({ venueIds: [] })),
      fetch("/api/reviews").then((r) => r.json()).catch(() => ({ reviews: [] })),
      fetch(`/api/follow?userId=${user.id}`).then((r) => r.json()).catch(() => ({ followers: 0, following: 0 })),
    ]).then(([ci, fav, rev, follow]) => {
      setStats({
        checkIns: ci.checkIns?.length ?? 0,
        favorites: fav.venueIds?.length ?? 0,
        reviews: rev.reviews?.length ?? 0,
        followers: follow.followers ?? 0,
        following: follow.following ?? 0,
      })
    })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const displayName = user.email.split("@")[0]
  const initial = displayName[0]?.toUpperCase()

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <div className="max-w-xl mx-auto px-4 py-12">

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-violet-300">{initial}</span>
          </div>
          <h1 className="text-xl font-bold text-white">{displayName}</h1>
          <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-5 gap-2 bg-zinc-900 border border-white/8 rounded-2xl p-5 mb-6">
            <StatBox value={stats.checkIns}  label="Check-ins" />
            <StatBox value={stats.favorites} label="Saved" />
            <StatBox value={stats.reviews}   label="Reviews" />
            <StatBox value={stats.followers} label="Followers" />
            <StatBox value={stats.following} label="Following" />
          </div>
        )}

        {/* Quick links */}
        <div className="bg-zinc-900 border border-white/8 rounded-2xl divide-y divide-white/6 mb-6">
          <Link href="/favorites" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Saved venues</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">My check-ins</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">My reviews</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Following</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Explore map</span>
          </Link>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/8 text-zinc-500 hover:text-white hover:border-white/20 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      <Footer />
    </div>
  )
}
