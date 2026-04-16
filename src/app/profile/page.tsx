"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, LogOut, Star, Users, CheckCircle2, Pencil, Instagram, MapPin } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ProfileData {
  id: string; email: string; name: string | null
  displayName: string | null; bio: string | null
  avatarEmoji: string; avatarColor: string
  neighborhood: string | null; musicTaste: string[]; vibes: string[]
  instagram: string | null; onboarded: boolean
}

interface Stats { checkIns: number; favorites: number; reviews: number; followers: number; following: number }

const MUSIC_LABELS: Record<string, string> = {
  techno: "Techno", house: "House", hiphop: "Hip-Hop", jazz: "Jazz",
  indie: "Indie", pop: "Pop", rnb: "R&B", classical: "Classical", everything: "Everything",
}
const VIBE_LABELS: Record<string, { label: string; emoji: string }> = {
  party: { label: "Party mode", emoji: "🔥" }, chill: { label: "Chill vibes", emoji: "🍷" },
  culture: { label: "Cultural", emoji: "🎨" },  music: { label: "Live music", emoji: "🎷" },
  food: { label: "Food lover", emoji: "🍜" },   outdoor: { label: "Outdoorsy", emoji: "🌿" },
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return

    // Load full profile
    fetch("/api/profile").then((r) => r.json()).then((d) => {
      if (d.user) {
        setProfile(d.user)
        // First-time user → go to onboarding
        if (!d.user.onboarded) router.replace("/onboarding")
      }
    }).catch(() => {})

    // Load stats
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
  }, [user, router])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const displayName = profile.displayName || profile.name || profile.email?.split("@")[0] || "You"

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <div className="max-w-xl mx-auto px-4 py-12">

        {/* Avatar + name + edit */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 transition-all"
              style={{ backgroundColor: profile.avatarColor + "22", borderColor: profile.avatarColor + "55" }}
            >
              {profile.avatarEmoji}
            </div>
            <Link
              href="/profile/edit"
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

          <h1 className="text-xl font-bold text-white">{displayName}</h1>

          {profile.bio && (
            <p className="text-sm text-zinc-400 mt-1.5 text-center max-w-xs leading-relaxed">{profile.bio}</p>
          )}

          <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
            {profile.neighborhood && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <MapPin className="w-3 h-3" /> {profile.neighborhood}
              </span>
            )}
            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
              >
                <Instagram className="w-3 h-3" /> @{profile.instagram}
              </a>
            )}
          </div>
        </div>

        {/* Vibes + music taste */}
        {(profile.vibes.length > 0 || profile.musicTaste.length > 0) && (
          <div className="bg-zinc-900 border border-white/8 rounded-2xl p-5 mb-5 space-y-4">
            {profile.vibes.length > 0 && (
              <div>
                <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Vibes</p>
                <div className="flex flex-wrap gap-2">
                  {profile.vibes.map((v) => {
                    const vd = VIBE_LABELS[v]
                    return vd ? (
                      <span key={v} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-300">
                        {vd.emoji} {vd.label}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}
            {profile.musicTaste.length > 0 && (
              <div>
                <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Music</p>
                <div className="flex flex-wrap gap-2">
                  {profile.musicTaste.map((m) => (
                    <span key={m} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-zinc-400">
                      {MUSIC_LABELS[m] ?? m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-5 gap-2 bg-zinc-900 border border-white/8 rounded-2xl p-5 mb-5">
            <StatBox value={stats.checkIns}  label="Check-ins" />
            <StatBox value={stats.favorites} label="Saved"     />
            <StatBox value={stats.reviews}   label="Reviews"   />
            <StatBox value={stats.followers} label="Followers" />
            <StatBox value={stats.following} label="Following" />
          </div>
        )}

        {/* Quick links */}
        <div className="bg-zinc-900 border border-white/8 rounded-2xl divide-y divide-white/6 mb-5">
          <Link href="/favorites" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">Saved venues</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">My check-ins</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">My reviews</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">Following</span>
          </Link>
        </div>

        {/* Edit + sign out */}
        <div className="flex gap-3">
          <Link
            href="/profile/edit"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 hover:border-violet-500/40 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit profile
          </Link>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/8 text-zinc-500 hover:text-white hover:border-white/20 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
