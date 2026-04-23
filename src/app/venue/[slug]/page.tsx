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

const VENUE_DATA: Record<string, {
  name: string; area: string; type: string; emoji: string; city: string
  description: string; address: string; opens: string; closes: string; tags: string[]
  image?: string; instagram?: string; website?: string; phone?: string
}> = {
  "base-club":      {
    name: "BASE Club", area: "Jungbusch", type: "Club", emoji: "🔊", city: "Mannheim",
    description: "Jungbusch's grittiest bass music floor. Raw concrete walls, a Funktion-One sound system and a crowd that knows their music. Latin on Fridays, underground on Saturdays.",
    address: "Jungbuschstraße 16, 68159 Mannheim", opens: "23:00", closes: "06:00",
    tags: ["Latin", "Bass", "Underground", "Funktion-One"],
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&h=500&fit=crop&auto=format",
    instagram: "baseclub_mannheim", website: "https://www.base-club.de",
  },
  "ms-connexion":   {
    name: "MS Connexion", area: "Hafen", type: "Club", emoji: "🎧", city: "Mannheim",
    description: "Three floors, 2,000 capacity, right on the harbour. Germany's top Afrobeats and electronic venue outside Berlin. The Connexion stage has hosted international DJs for over two decades.",
    address: "Hafenstraße 25-27, 68159 Mannheim", opens: "22:00", closes: "06:00",
    tags: ["Afrobeats", "Electronic", "Multi-floor", "Harbour"],
    image: "https://www.msconnexion.com/assets/images/8/MSCC_Aussen_Highlight-7c0aff06.jpg",
    instagram: "msconnexion", website: "https://www.msconnexion.de",
  },
  "zeitraumexit":   {
    name: "Zeitraumexit", area: "Jungbusch", type: "Club", emoji: "🖤", city: "Mannheim",
    description: "Mannheim's underground art-meets-techno bunker since 2001. Gallery by day, club by night. The experimental scene's home — expect the unexpected.",
    address: "Hafenstraße 68, 68159 Mannheim", opens: "23:00", closes: "07:00",
    tags: ["Experimental", "Art", "Techno", "Hip-Hop"],
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=900&h=500&fit=crop&auto=format",
    instagram: "zeitraumexit", website: "https://www.zeitraumexit.de",
  },
  "tiffany-club":   {
    name: "Tiffany Club", area: "C4-Quadrat", type: "Club", emoji: "💜", city: "Mannheim",
    description: "Mannheim's most central premium club in the Quadrate grid. Dress code strictly enforced. Known for R&B, Hip-Hop and themed nights that sell out weeks in advance.",
    address: "C4, 9-10, 68159 Mannheim", opens: "22:00", closes: "05:00",
    tags: ["R&B", "Hip-Hop", "Premium", "Dress code"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&h=500&fit=crop&auto=format",
    instagram: "tiffany.mannheim",
  },
  "ella-louis":     {
    name: "Ella & Louis", area: "Jungbusch", type: "Jazz bar", emoji: "🎷", city: "Mannheim",
    description: "Named after the legends. Intimate 60-seat jazz bar with live sessions every Thursday–Saturday. Best rum selection in Mannheim, a crowd that actually listens.",
    address: "Jungbuschstraße 14, 68159 Mannheim", opens: "19:00", closes: "01:00",
    tags: ["Jazz", "Live music", "Cocktails", "Intimate"],
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=900&h=500&fit=crop&auto=format",
    instagram: "ellaandlouis.mannheim",
  },
  "hemingway-bar":  {
    name: "Hemingway Bar", area: "Innenstadt", type: "Bar", emoji: "🍸", city: "Mannheim",
    description: "Dark wood, brass fixtures, and a bartender who takes classics seriously. The best Old Fashioned in Mannheim. No cocktail menu on the wall — just ask.",
    address: "N7 13, 68161 Mannheim", opens: "18:00", closes: "02:00",
    tags: ["Cocktails", "Classic", "Date night", "Whisky"],
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&h=500&fit=crop&auto=format",
  },
  "skybar-mannheim": {
    name: "Skybar Mannheim", area: "Quadrate", type: "Rooftop bar", emoji: "🏙️", city: "Mannheim",
    description: "Ten floors up with a 360° view over the Quadrate grid and Rhine valley. Best spot to watch the sun go down before the night begins.",
    address: "Collinistraße 1, 68161 Mannheim", opens: "18:00", closes: "01:00",
    tags: ["Rooftop", "Views", "Cocktails", "Sunset"],
    image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=900&h=500&fit=crop&auto=format",
  },
  "weinkeller":     {
    name: "Weinkeller Wasserturm", area: "Wasserturm", type: "Wine bar", emoji: "🍷", city: "Mannheim",
    description: "Candlelit cellar wine bar a stone's throw from the Wasserturm. 200+ Rhine Valley and German labels, knowledgeable staff, and a date atmosphere that rarely fails.",
    address: "Augustaanlage 4, 68165 Mannheim", opens: "18:00", closes: "00:00",
    tags: ["Wine", "Rhine Valley", "Romantic", "Date"],
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&h=500&fit=crop&auto=format",
  },
  "alte-feuerwache": {
    name: "Alte Feuerwache", area: "Jungbusch", type: "Culture venue", emoji: "🎭", city: "Mannheim",
    description: "A former fire station turned Mannheim's most beloved cultural hub. Concerts, theatre, Afro nights, comedy — the full spectrum. Community-run and proud of it.",
    address: "Alten Feuerwache 1, 68159 Mannheim", opens: "18:00", closes: "00:00",
    tags: ["Culture", "Afro", "Live music", "Community"],
    image: "https://altefeuerwache.com/wp-content/uploads/2026/02/jean-philippe-kindler-2025_-10.jpg",
    instagram: "altefeuerwache.mannheim", website: "https://www.altefeuerwache.com",
  },
  "cave-54":        {
    name: "Cave 54", area: "Altstadt", type: "Club", emoji: "🎸", city: "Heidelberg",
    description: "Heidelberg's oldest club, open since 1969 in a medieval cellar beneath the Altstadt. Jazz, funk, soul and student nights. A bucket-list venue for any music lover.",
    address: "Krämergasse 2, 69117 Heidelberg", opens: "22:00", closes: "05:00",
    tags: ["Jazz", "Rock", "Student", "Historic", "1969"],
    image: "https://static.wixstatic.com/media/11062b_1bca6513d1444afca6a2a1c0aae87b6df000.png/v1/fill/w_1920,h_1080,al_c,q_95,enc_avif,quality_auto/11062b_1bca6513d1444afca6a2a1c0aae87b6df000.png",
    instagram: "cave54heidelberg", website: "https://www.cave54.de",
  },
  "nachtschicht":   {
    name: "Nachtschicht", area: "Bergheim", type: "Club", emoji: "🎶", city: "Heidelberg",
    description: "Heidelberg's biggest and longest-running club. Three rooms, 1,200 capacity — electronic and house in the main room, commercial on the second floor, hip-hop in the basement.",
    address: "Bergheimer Straße 147, 69115 Heidelberg", opens: "22:00", closes: "06:00",
    tags: ["Electronic", "House", "Hip-Hop", "Multi-room"],
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900&h=500&fit=crop&auto=format",
    instagram: "nachtschicht.hd", website: "https://www.nachtschicht.com",
  },
  "halle02":        {
    name: "halle02", area: "Bahnstadt", type: "Event hall", emoji: "🏭", city: "Heidelberg",
    description: "A converted industrial hall that hosts everything from Afro nights to techno raves to sold-out concerts. Biggest capacity in Heidelberg — 2,500 people.",
    address: "Güteramtstraße 4, 69115 Heidelberg", opens: "21:00", closes: "06:00",
    tags: ["Afro", "Electronic", "Concerts", "Large format"],
    image: "https://b3310012.smushcdn.com/3310012/wp-content/uploads/2026/03/halle02_3000_felix-aspect-ratio-1920-1080.jpeg?lossy=2&strip=1&webp=1",
    instagram: "halle02.heidelberg", website: "https://www.halle02.de",
  },
  "robert-johnson": {
    name: "Robert Johnson", area: "Offenbach", type: "Club", emoji: "🎛️", city: "Frankfurt",
    description: "Consistently ranked one of the world's best clubs by Resident Advisor. No photos, no hype — just world-class selectors and a sound system that hits you in the chest. Arrive after 02:00.",
    address: "Nordring 131, 63067 Offenbach am Main", opens: "23:00", closes: "12:00",
    tags: ["Techno", "World top 10", "Afrohouse", "No cameras"],
    image: "https://images.unsplash.com/photo-1598387181032-a3103d8f5797?w=900&h=500&fit=crop&auto=format",
    instagram: "robertjohnsonclub", website: "https://www.robert-johnson.de",
  },
  "jazzkeller":     {
    name: "Jazzkeller Frankfurt", area: "Innenstadt", type: "Jazz club", emoji: "🎺", city: "Frankfurt",
    description: "Frankfurt's oldest jazz club — underground since 1952. Intimate brick cellar, live acts every week, a crowd that ranges from 20 to 80. A real institution.",
    address: "Kleine Bockenheimer Str. 18a, 60313 Frankfurt", opens: "20:00", closes: "02:00",
    tags: ["Jazz", "Live music", "Historic", "Since 1952"],
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=900&h=500&fit=crop&auto=format",
    instagram: "jazzkeller_frankfurt", website: "https://www.jazzkeller.com",
  },
  "substage":       {
    name: "Substage", area: "Südstadt", type: "Club / Live", emoji: "🎸", city: "Karlsruhe",
    description: "Karlsruhe's best-kept secret — live concerts, KIT student nights, and underground electronic in a raw basement venue. The university crowd keeps it unpretentious.",
    address: "Südweststraße 13, 76135 Karlsruhe", opens: "21:00", closes: "05:00",
    tags: ["Live music", "Student", "Indie", "Electronic"],
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=900&h=500&fit=crop&auto=format",
    instagram: "substage_ka", website: "https://www.substage.de",
  },
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
          <div className="h-48 relative overflow-hidden flex items-center justify-center"
            style={venue.image
              ? { backgroundImage: `url(${venue.image})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(135deg, #4c1d95, #6d28d9, #000)" }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            {!venue.image && <span className="relative text-7xl z-10">{venue.emoji}</span>}
            {venue.image && (
              <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2">
                <span className="text-2xl">{venue.emoji}</span>
                <span className="text-white font-black text-lg tracking-tight drop-shadow">{venue.name}</span>
              </div>
            )}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] text-white/70 uppercase tracking-widest drop-shadow">Open</span>
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
              {venue.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-3.5 h-3.5 flex-shrink-0 text-white/35" />
                  <a href={venue.website} target="_blank" rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 transition-colors truncate">
                    {venue.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {venue.instagram && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/35 text-xs">📸</span>
                  <a href={`https://instagram.com/${venue.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300 transition-colors">
                    @{venue.instagram}
                  </a>
                </div>
              )}
              {venue.phone && (
                <div className="flex items-center gap-2 text-sm text-white/35">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`tel:${venue.phone}`} className="hover:text-white/60 transition-colors">{venue.phone}</a>
                </div>
              )}
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
