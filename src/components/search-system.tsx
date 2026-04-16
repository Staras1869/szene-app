"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Calendar, Loader2, X } from "lucide-react"

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
  { label: "Student parties", q: "student party unma" },
  { label: "Techno tonight", q: "techno club tonight" },
  { label: "Date night",     q: "romantic bar date" },
  { label: "Free events",    q: "free events" },
  { label: "Jungbusch",      q: "jungbusch bar" },
  { label: "Live music",     q: "live music concert" },
]

export function SearchSystem() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function runSearch(q: string) {
    setQuery(q)
    setOpen(true)
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

  const hasResults = results && (results.venues.length > 0 || results.events.length > 0)
  const showDropdown = open && (query.trim() || hasResults)

  return (
    <div ref={ref} className="relative w-full">
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search venues, events, vibes… try 'unma party' or 'techno tonight'"
          className="w-full bg-transparent pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        {loading && <Loader2 className="absolute right-4 w-4 h-4 text-gray-400 animate-spin" />}
        {query && !loading && (
          <button onClick={() => { setQuery(""); setResults(null) }} className="absolute right-4 text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-[480px] overflow-y-auto">

          {/* AI summary */}
          {results?.summary && (
            <div className="px-4 py-3 border-b border-gray-100 text-xs text-gray-500 italic">
              {results.summary}
            </div>
          )}

          {/* Quick filters — shown when no query */}
          {!query.trim() && (
            <div className="p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Quick search</p>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q.q}
                    onClick={() => runSearch(q.q)}
                    className="text-xs px-3 py-1.5 rounded-full border-2 border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query.trim() && !loading && results && !hasResults && (
            <div className="p-6 text-center text-gray-500 text-sm">
              Nothing found for <span className="text-gray-900 font-semibold">"{query}"</span> — try different keywords.
            </div>
          )}

          {/* Venues */}
          {results && results.venues.length > 0 && (
            <div className="p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2">Venues</p>
              <div className="space-y-1">
                {results.venues.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => { setOpen(false); setQuery(v.name) }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors group"
                  >
                    <span className="text-xl flex-shrink-0">{v.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-violet-600 transition-colors truncate">{v.name}</p>
                      <p className="text-xs text-gray-500 truncate">{v.type} · {v.area}, {v.city}</p>
                    </div>
                    <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {results && results.events.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-2">Events</p>
              <div className="space-y-1">
                {results.events.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors group"
                  >
                    <div className="w-9 h-9 flex-shrink-0 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-violet-600 transition-colors truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 truncate">{e.venue} · {e.dateLabel} {e.time}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{e.price}</span>
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
