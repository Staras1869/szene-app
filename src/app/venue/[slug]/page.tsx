"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft, MapPin, Clock, Globe, Phone, Moon, Beer,
  Utensils, Coffee, Star, Heart, ExternalLink, Calendar,
  CheckCircle2, Loader2, Send, Trash2,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import type { OSMVenue } from "@/lib/overpass-api"

const VenuesMap = dynamic(() => import("@/components/venues-map"), { ssr: false })

interface ScrapedEvent {
  id: string; title: string; date: string; time: string
  price: string; description: string; imageUrl?: string; sourceUrl?: string; subtitle?: string
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { name: string | null; email: string | null }
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  nightclub:  <Moon className="w-5 h-5" />,
  bar:        <Beer className="w-5 h-5" />,
  pub:        <Beer className="w-5 h-5" />,
  restaurant: <Utensils className="w-5 h-5" />,
  cafe:       <Coffee className="w-5 h-5" />,
  biergarten: <Beer className="w-5 h-5" />,
}
const AMENITY_COLORS: Record<string, string> = {
  nightclub:  "bg-purple-100 text-purple-700",
  bar:        "bg-amber-100 text-amber-700",
  pub:        "bg-amber-100 text-amber-700",
  restaurant: "bg-orange-100 text-orange-700",
  cafe:       "bg-sky-100 text-sky-700",
  biergarten: "bg-green-100 text-green-700",
}

function StarRow({
  value, onChange, size = "md",
}: {
  value: number
  onChange?: (v: number) => void
  size?: "sm" | "md"
}) {
  const px = size === "sm" ? "w-4 h-4" : "w-6 h-6"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          className={`${px} transition-colors ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`${px} ${n <= value ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
          />
        </button>
      ))}
    </div>
  )
}

export default function VenueDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()

  const [venue, setVenue] = useState<OSMVenue | null>(null)
  const [events, setEvents] = useState<ScrapedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Check-ins
  const [checkInCount, setCheckInCount] = useState(0)
  const [userCheckedIn, setUserCheckedIn] = useState(false)
  const [checkInLoading, setCheckInLoading] = useState(false)

  useEffect(() => {
    if (!slug) return
    Promise.all([
      fetch(`/api/venues/live/${slug}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/search?mode=events&q=${encodeURIComponent(slug.replace(/-/g, " ").split("-").slice(0, -1).join(" "))}`).then((r) => r.ok ? r.json() : { results: [] }),
    ]).then(([venueData, searchData]) => {
      if (venueData?.venue) setVenue(venueData.venue)
      else setNotFound(true)
      const scraped = (searchData?.results ?? []).filter((r: any) => r.type === "event").slice(0, 6)
      setEvents(scraped)
    }).catch(() => setNotFound(true))
    .finally(() => setLoading(false))
  }, [slug])

  const loadReviews = useCallback(async (venueId: string) => {
    const res = await fetch(`/api/reviews?venueId=${encodeURIComponent(venueId)}`)
    if (res.ok) {
      const data = await res.json()
      setReviews(data.reviews ?? [])
      setAvgRating(data.avg)
    }
  }, [])

  const loadCheckIns = useCallback(async (venueId: string) => {
    const res = await fetch(`/api/checkins?venueId=${encodeURIComponent(venueId)}`)
    if (res.ok) {
      const data = await res.json()
      setCheckInCount(data.count ?? 0)
      setUserCheckedIn(data.userCheckedIn ?? false)
    }
  }, [])

  useEffect(() => {
    if (!venue) return
    loadReviews(venue.id)
    loadCheckIns(venue.id)
  }, [venue, loadReviews, loadCheckIns])

  // Pre-fill form with user's existing review
  useEffect(() => {
    if (!user || reviews.length === 0) return
    const mine = reviews.find((r) => r.user.email === user.email)
    if (mine) {
      setMyRating(mine.rating)
      setMyComment(mine.comment ?? "")
      setReviewSubmitted(true)
    }
  }, [user, reviews])

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!venue || myRating === 0) return
    setReviewLoading(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: venue.id, rating: myRating, comment: myComment || null }),
      })
      if (res.ok) {
        setReviewSubmitted(true)
        loadReviews(venue.id)
      }
    } finally {
      setReviewLoading(false)
    }
  }

  async function handleDeleteReview() {
    if (!venue) return
    await fetch(`/api/reviews?venueId=${encodeURIComponent(venue.id)}`, { method: "DELETE" })
    setMyRating(0)
    setMyComment("")
    setReviewSubmitted(false)
    loadReviews(venue.id)
  }

  async function handleCheckIn() {
    if (!venue) return
    setCheckInLoading(true)
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: venue.id }),
      })
      if (res.ok) {
        setUserCheckedIn(true)
        setCheckInCount((c) => c + 1)
      }
    } finally {
      setCheckInLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (notFound || !venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🏠</div>
        <h1 className="text-2xl font-bold text-gray-900">Venue not found</h1>
        <p className="text-gray-500">This venue might not be in our database yet.</p>
        <Link href="/discover" className="flex items-center gap-2 text-purple-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to discover
        </Link>
      </div>
    )
  }

  const colorClass = AMENITY_COLORS[venue.amenity] ?? "bg-gray-100 text-gray-700"
  const isFav = isFavorite(venue.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/discover" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Discover</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Check-in count badge */}
            {checkInCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {checkInCount} here tonight
              </span>
            )}
            <button
              onClick={() => toggleFavorite(venue.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isFav ? "bg-red-50 text-red-500 border border-red-200" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
              {isFav ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-6 mb-4">
              <div className={`w-14 h-14 rounded-2xl border-4 border-white flex items-center justify-center shrink-0 ${colorClass} shadow-md`}>
                {AMENITY_ICONS[venue.amenity] ?? <Star className="w-5 h-5" />}
              </div>
              <div className="pb-1 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{venue.name}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className={`${colorClass} border-0 text-xs`}>{venue.category}</Badge>
                  <span className="text-sm text-gray-400">{venue.city}</span>
                  {avgRating !== null && (
                    <span className="flex items-center gap-1 text-sm text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {avgRating.toFixed(1)}
                      <span className="text-gray-400 font-normal text-xs">({reviews.length})</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {venue.address && (
                <InfoRow icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Address">
                  {venue.address}
                </InfoRow>
              )}
              {venue.openingHours && (
                <InfoRow icon={<Clock className="w-4 h-4 text-gray-400" />} label="Hours">
                  {venue.openingHours}
                </InfoRow>
              )}
              {venue.cuisine && (
                <InfoRow icon={<Utensils className="w-4 h-4 text-gray-400" />} label="Cuisine">
                  {venue.cuisine}
                </InfoRow>
              )}
              {venue.phone && (
                <InfoRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Phone">
                  <a href={`tel:${venue.phone}`} className="text-purple-600 hover:underline">{venue.phone}</a>
                </InfoRow>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <a href={venue.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
                <MapPin className="w-4 h-4" /> Open in Maps
              </a>
              {venue.website && (
                <a href={venue.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                  <Globe className="w-4 h-4" /> Website
                </a>
              )}
              {venue.phone && (
                <a href={`tel:${venue.phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
              {/* Check-in button */}
              {user && (
                <button
                  onClick={handleCheckIn}
                  disabled={userCheckedIn || checkInLoading}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    userCheckedIn
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-700"
                  }`}
                >
                  {checkInLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {userCheckedIn ? "Checked in!" : "Check in"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" /> Location
          </h2>
          <VenuesMap venues={[venue]} centerCity={venue.city} height="280px" />
        </div>

        {/* Reviews */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Reviews
            {reviews.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({reviews.length})</span>
            )}
          </h2>

          {/* Write a review */}
          {user ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              {reviewSubmitted ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Your review</p>
                    <StarRow value={myRating} size="sm" />
                    {myComment && <p className="text-sm text-gray-500 mt-1">{myComment}</p>}
                  </div>
                  <button
                    onClick={handleDeleteReview}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Leave a review</p>
                  <StarRow value={myRating} onChange={setMyRating} />
                  <textarea
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    placeholder="What did you think? (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={myRating === 0 || reviewLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    {reviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit review
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-4 text-center">
              <p className="text-sm text-gray-500">
                <Link href="/login" className="text-purple-600 font-medium hover:underline">Sign in</Link>
                {" "}to leave a review
              </p>
            </div>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No reviews yet — be the first!</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.user.name ?? review.user.email?.split("@")[0] ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <StarRow value={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming events */}
        {events.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Upcoming Events
            </h2>
            <div className="space-y-3">
              {events.map((event: any) => (
                <a key={event.id} href={event.sourceUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 group">
                  {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{event.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{event.subtitle ?? event.date}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 shrink-0 self-center" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Nearby venues */}
        <div className="bg-purple-50 rounded-2xl p-5 text-center">
          <p className="text-gray-600 text-sm mb-3">Explore more venues in {venue.city}</p>
          <Link
            href={`/discover?tab=venues&city=${venue.city}`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Browse {venue.city} venues
          </Link>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <span className="text-xs text-gray-400 uppercase tracking-wide block">{label}</span>
        <span className="text-gray-700">{children}</span>
      </div>
    </div>
  )
}
