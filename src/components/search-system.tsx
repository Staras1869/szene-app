"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Calendar, Loader2, X, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface VenueResult {
  id: string; name: string; area: string; city: string; type: string; emoji: string; address: string; description: string
}
interface EventResult {
  id: string; title: string; venue: string; date: string; dateLabel: string; time: string; city: string; category: string; price: string; description: string
}
interface SearchResponse {
  venues: VenueResult[]
  events: EventResult[]
  summary: string
  query: string
}

const QUICK = [
  { label: "Student parties", q: "student party" },
  { label: "Techno tonight",  q: "techno club tonight" },
  { label: "Date night",      q: "romantic bar date" },
  { label: "Free events",     q: "free events" },
  { label: "Live music",      q: "live music concert" },
  { label: "Afrobeats",       q: "afrobeats afro" },
]

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function SearchSystem() {
  const router = useRouter()
  const [query, setQuery]     = useState("")
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>()

  // Auto-focus on mount
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50) }, [])

  function runSearch(q: string) {
    setQuery(q)
    clearTimeout(debounce.current)
    if (!q.trim()) { setResults(null); return }
    debounce.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        })
        setResults(await res.json())
      } catch {}
      setLoading(false)
    }, 350)
  }

  function goVenue(v: VenueResult) {
    router.push(`/venue/${toSlug(v.name)}`)
  }

  const hasResults = results && (results.venues.length > 0 || results.events.length > 0)
  const showDropdown = focused && (query.trim() || true)

  return (
    <div className="relative w-full">
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-faint pointer-events-none" />
        <input
          ref={inputRef}
          id="szene-search"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder='Try "techno tonight", "latin Heidelberg", "free events"…'
          className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm text-szene placeholder:text-faint focus:outline-none"
        />
        {loading && <Loader2 className="absolute right-4 w-4 h-4 text-faint animate-spin" />}
        {query && !loading && (
          <button onClick={() => { setQuery(""); setResults(null) }} className="absolute right-4 text-faint hover:text-muted">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-szene border border-szene rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[480px] overflow-y-auto" style={{ boxShadow: "var(--shadow)" }}>

          {/* AI summary */}
          {results?.summary && (
            <div className="px-4 py-3 border-b border-szene text-xs text-faint italic">
              {results.summary}
            </div>
          )}

          {/* Quick filters */}
          {!query.trim() && (
            <div className="p-4">
              <p className="text-[10px] text-faint uppercase tracking-wider mb-3 font-semibold">Quick search</p>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button key={q.q} onClick={() => runSearch(q.q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-szene text-muted hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/8 transition-all">
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query.trim() && !loading && results && !hasResults && (
            <div className="p-6 text-center text-faint text-sm">
              Nothing found for <span className="text-szene font-semibold">&ldquo;{query}&rdquo;</span> — try different keywords.
            </div>
          )}

          {/* Venues */}
          {results && results.venues.length > 0 && (
            <div className="p-3">
              <p className="text-[10px] text-faint uppercase tracking-wider px-2 mb-2 font-semibold">Venues</p>
              <div className="space-y-0.5">
                {results.venues.map((v) => (
                  <button key={v.id} onClick={() => goVenue(v)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface cursor-pointer transition-colors group text-left">
                    <span className="text-xl flex-shrink-0">{v.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-szene group-hover:text-violet-400 transition-colors truncate">{v.name}</p>
                      <p className="text-xs text-faint truncate">{v.type} · {v.area}, {v.city}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-violet-400 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {results && results.events.length > 0 && (
            <div className="p-3 border-t border-szene">
              <p className="text-[10px] text-faint uppercase tracking-wider px-2 mb-2 font-semibold">Events</p>
              <div className="space-y-0.5">
                {results.events.map((e) => (
                  <div key={e.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface cursor-pointer transition-colors group">
                    <div className="w-9 h-9 flex-shrink-0 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-szene group-hover:text-violet-400 transition-colors truncate">{e.title}</p>
                      <p className="text-xs text-faint truncate">{e.venue} · {e.dateLabel} {e.time}</p>
                    </div>
                    <span className="text-xs text-muted flex-shrink-0">{e.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
