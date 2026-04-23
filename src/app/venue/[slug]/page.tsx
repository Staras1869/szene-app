"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Globe, Phone, Heart, Star, CheckCircle2, Loader2, Send, Trash2, Share2, Copy, Check, Navigation, ParkingCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { name: string | null; email: string | null }
}

const VENUE_DATA: Record<string, { name: string; area: string; type: string; emoji: string; city: string; description: string; address: string; opens: string; closes: string; tags: string[] }> = {
  "base-club":      { name: "BASE Club",           area: "Jungbusch",    type: "Club",      emoji: "🔊", city: "Mannheim",   description: "Bass music and club nights deep in Jungbusch. Known for its raw sound system and underground atmosphere.", address: "Jungbuschstraße, Mannheim", opens: "22:00", closes: "06:00", tags: ["Techno", "Bass", "Underground"] },
  "ms-connexion":   { name: "MS Connexion",         area: "Hafen",        type: "Club",      emoji: "🎧", city: "Mannheim",   description: "Multi-floor electronic music complex at the harbour. One of Germany's top electronic music venues.", address: "Hafenstraße 25-27, Mannheim", opens: "22:00", closes: "06:00", tags: ["Electronic", "Techno", "Multi-floor"] },
  "zeitraumexit":   { name: "Zeitraumexit",          area: "Jungbusch",    type: "Club",      emoji: "🖤", city: "Mannheim",   description: "Underground art and techno space. Where Mannheim's experimental scene lives.", address: "Hafenstraße 68, Mannheim", opens: "23:00", closes: "07:00", tags: ["Experimental", "Art", "Techno"] },
  "tiffany-club":   { name: "Tiffany Club",          area: "C-Quadrat",    type: "Club",      emoji: "💜", city: "Mannheim",   description: "Premium nightclub in the heart of the Quadrate. Dress code applies.", address: "C4 9-10, Mannheim", opens: "22:00", closes: "05:00", tags: ["Premium", "Party", "Dance"] },
  "ella-louis":     { name: "Ella & Louis",           area: "Jungbusch",    type: "Jazz bar",  emoji: "🎷", city: "Mannheim",   description: "Intimate jazz bar with live music. Named after the legends. Great cocktails, real soul.", address: "Jungbuschstraße 14, Mannheim", opens: "19:00", closes: "01:00", tags: ["Jazz", "Live music", "Cocktails"] },
  "hemingway-bar":  { name: "Hemingway Bar",          area: "Innenstadt",   type: "Bar",       emoji: "🍸", city: "Mannheim",   description: "Classic cocktail bar, great for dates. Curated spirits, dark wood, no nonsense.", address: "N7, Mannheim", opens: "18:00", closes: "02:00", tags: ["Cocktails", "Date", "Classic"] },
  "skybar-mannheim":{ name: "Skybar Mannheim",        area: "Quadrate",     type: "Rooftop",   emoji: "🏙️", city: "Mannheim",   description: "Rooftop bar with panoramic city views. Best spot for sunset drinks in Mannheim.", address: "Quadrate, Mannheim", opens: "18:00", closes: "01:00", tags: ["Rooftop", "Views", "Summer"] },
  "weinkeller":     { name: "Weinkeller Wasserturm",  area: "Wasserturm",   type: "Wine bar",  emoji: "🍷", city: "Mannheim",   description: "Upscale wine bar near the Wasserturm. Rhine Valley wines, candlelight, perfect for dates.", address: "Wasserturm, Mannheim", opens: "18:00", closes: "00:00", tags: ["Wine", "Romantic", "Date"] },
  "alte-feuerwache":{ name: "Alte Feuerwache",        area: "Jungbusch",    type: "Culture",   emoji: "🎭", city: "Mannheim",   description: "Cultural centre with concerts, theatre, and community events. The heart of Jungbusch culture.", address: "Alten Feuerwache 1, Mannheim", opens: "18:00", closes: "00:00", tags: ["Culture", "Music", "Art"] },
  "cave-54":        { name: "Cave 54",                area: "Altstadt",     type: "Club",      emoji: "🎸", city: "Heidelberg", description: "Heidelberg's legendary jazz and rock cellar. Been running since 1969.", address: "Krämergasse 2, Heidelberg", opens: "22:00", closes: "05:00", tags: ["Rock", "Jazz", "Student"] },
  "nachtschicht":   { name: "Nachtschicht",            area: "Bergheim",     type: "Club",      emoji: "🎶", city: "Heidelberg", description: "Heidelberg's biggest club. Electronic, house, and commercial nights across multiple floors.", address: "Bergheim, Heidelberg", opens: "22:00", closes: "06:00", tags: ["Electronic", "House", "Party"] },
  "robert-johnson": { name: "Robert Johnson",          area: "Offenbach",    type: "Club",      emoji: "🎛️", city: "Frankfurt",  description: "World-famous techno club. Pilgrimage destination for electronic music lovers globally.", address: "Nordring 131, Offenbach", opens: "23:00", closes: "12:00", tags: ["Techno", "World-class", "Electronic"] },
  "jazzkeller":     { name: "Jazzkeller Frankfurt",    area: "Innenstadt",   type: "Jazz",      emoji: "🎺", city: "Frankfurt",  description: "Frankfurt's oldest jazz club, running since 1952. Intimate and legendary.", address: "Kleine Bockenheimer Str. 18a, Frankfurt", opens: "20:00", closes: "02:00", tags: ["Jazz", "Live music", "Historic"] },
  "substage":       { name: "Substage",                area: "Südstadt",     type: "Club",      emoji: "🎸", city: "Karlsruhe",  description: "Karlsruhe's best live music and club venue. Indie, punk, electronic — it all happens here.", address: "Südweststraße 13, Karlsruhe", opens: "21:00", closes: "05:00", tags: ["Live music", "Indie", "Electronic"] },
}

function StarRow({ value, onChange, size = "md" }: { value: number; onChange?: (v: number) => void; size?: "sm" | "md" }) {
  const px = size === "sm" ? "w-4 h-4" : "w-6 h-6"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)} disabled={!onChange} className={`${px} ${onChange ? "cursor-pointer" : "cursor-default"}`}>
          <Star className={`${px} ${n <= value ? "text-amber-400 fill-amber-400" : "text-white/10 fill-white/10"}`} />
        </button>
      ))}
    </div>
  )
}

function ShareButton({ name, slug }: { name: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const url = typeof window !== "undefined" ? `${window.location.origin}/venue/${slug}` : ""
  const text = `Check out ${name} on Szene 🎉`

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank")
  }

  function shareInstagram() {
    navigator.clipboard.writeText(url)
    alert("Link copied — paste it in your Instagram story or bio!")
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 hover:text-white hover:border-white/25 text-sm font-medium rounded-xl transition-colors">
        <Share2 className="w-4 h-4" /> Share
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/[0.18] rounded-2xl overflow-hidden shadow-2xl z-50 min-w-[180px]">
          <button onClick={shareWhatsApp} className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.10] transition-colors flex items-center gap-2">
            <span>💬</span> WhatsApp
          </button>
          <button onClick={shareInstagram} className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.10] transition-colors flex items-center gap-2">
            <span>📸</span> Instagram
          </button>
          <button onClick={copyLink} className="w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.10] transition-colors flex items-center gap-2 border-t border-white/[0.18]">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  )
}

export default function VenuePage() {
  const params = useParams()
  const slug   = params.slug as string
  const { user } = useAuth()

  const venue = VENUE_DATA[slug]

  const [reviews, setReviews]               = useState<Review[]>([])
  const [avgRating, setAvgRating]           = useState<number | null>(null)
  const [myRating, setMyRating]             = useState(0)
  const [myComment, setMyComment]           = useState("")
  const [reviewLoading, setReviewLoading]   = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [checkInCount, setCheckInCount]     = useState(0)
  const [userCheckedIn, setUserCheckedIn]   = useState(false)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [saved, setSaved]                   = useState(false)

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?venueId=${encodeURIComponent(slug)}`)
      if (res.ok) { const d = await res.json(); setReviews(d.reviews ?? []); setAvgRating(d.avg) }
    } catch {}
  }, [slug])

  useEffect(() => { loadReviews() }, [loadReviews])

  useEffect(() => {
    if (!user || reviews.length === 0) return
    const mine = reviews.find(r => r.user.email === user.email)
    if (mine) { setMyRating(mine.rating); setMyComment(mine.comment ?? ""); setReviewSubmitted(true) }
  }, [user, reviews])

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (myRating === 0) return
    setReviewLoading(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: slug, rating: myRating, comment: myComment || null }),
      })
      if (res.ok) { setReviewSubmitted(true); loadReviews() }
    } finally { setReviewLoading(false) }
  }

  async function handleDeleteReview() {
    await fetch(`/api/reviews?venueId=${encodeURIComponent(slug)}`, { method: "DELETE" })
    setMyRating(0); setMyComment(""); setReviewSubmitted(false); loadReviews()
  }

  async function handleCheckIn() {
    if (!user) return
    setCheckInLoading(true)
    try {
      await fetch("/api/checkins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ venueId: slug }) })
      setUserCheckedIn(true); setCheckInCount(c => c + 1)
    } finally { setCheckInLoading(false) }
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🏠</div>
        <h1 className="text-xl font-bold text-white">Venue not found</h1>
        <Link href="/" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to app
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.18]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton name={venue.name} slug={slug} />
            <button onClick={() => setSaved(s => !s)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                saved ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "border border-white/[0.18] text-white/40 hover:text-white hover:border-white/25"
              }`}>
              <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="rounded-2xl border border-white/[0.15] overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-violet-900 via-purple-900 to-black flex items-center justify-center relative">
            <span className="text-7xl">{venue.emoji}</span>
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Open</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{venue.name}</h1>
                <p className="text-white/40 text-sm mt-0.5">{venue.type} · {venue.area}, {venue.city}</p>
              </div>
              {avgRating !== null && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-white/55 text-xs">({reviews.length})</span>
                </div>
              )}
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-4">{venue.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {venue.tags.map(t => (
                <span key={t} className="text-[11px] text-violet-400/70 border border-violet-500/20 px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-white/35">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {venue.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/35">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                {venue.opens} — {venue.closes}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(venue.address)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors">
                <Navigation className="w-4 h-4" /> Directions
              </a>
              <a href={`https://maps.google.com/maps?q=${encodeURIComponent(`parking near ${venue.address}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-500/30 text-sm font-semibold rounded-xl transition-colors">
                <ParkingCircle className="w-4 h-4" /> Parking
              </a>
              {user && (
                <button onClick={handleCheckIn} disabled={userCheckedIn || checkInLoading}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    userCheckedIn ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "border border-white/20 text-white/60 hover:text-white hover:border-white/25"
                  }`}>
                  {checkInLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {userCheckedIn ? `Checked in${checkInCount > 1 ? ` · ${checkInCount} here` : ""}` : "Check in"}
                </button>
              )}
            </div>
          </div>

          {/* Embedded map */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.12]" style={{ height: 220 }}>
            <iframe
              title={`Map — ${venue.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed&z=15`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-lg font-black text-white mb-4 tracking-tight">Reviews</h2>

          {user ? (
            <div className="rounded-2xl border border-white/[0.15] bg-white/[0.10] p-5 mb-4">
              {reviewSubmitted ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/55 uppercase tracking-widest mb-2">Your review</p>
                    <StarRow value={myRating} size="sm" />
                    {myComment && <p className="text-sm text-white/50 mt-2">{myComment}</p>}
                  </div>
                  <button onClick={handleDeleteReview} className="text-white/40 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <p className="text-xs text-white/55 uppercase tracking-widest">Leave a review</p>
                  <StarRow value={myRating} onChange={setMyRating} />
                  <textarea
                    value={myComment} onChange={e => setMyComment(e.target.value)}
                    placeholder="What did you think? (optional)"
                    rows={3}
                    className="w-full bg-white/[0.10] border border-white/[0.15] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                  />
                  <button type="submit" disabled={myRating === 0 || reviewLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
                    {reviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.15] p-5 mb-4 text-center">
              <p className="text-sm text-white/55">
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">Sign in</Link> to leave a review
              </p>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-6">No reviews yet — be the first.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="rounded-2xl border border-white/[0.15] bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-bold text-white">{r.user.name ?? r.user.email?.split("@")[0] ?? "Anonymous"}</p>
                      <p className="text-xs text-white/40">{new Date(r.createdAt).toLocaleDateString("de-DE")}</p>
                    </div>
                    <StarRow value={r.rating} size="sm" />
                  </div>
                  {r.comment && <p className="text-sm text-white/50 leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to explore */}
        <div className="rounded-2xl border border-white/[0.15] p-6 text-center">
          <p className="text-white/55 text-sm mb-3">More in {venue.city}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-full transition-colors">
            Explore {venue.city}
          </Link>
        </div>
      </div>
    </div>
  )
}
