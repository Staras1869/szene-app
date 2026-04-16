"use client"

import { useState, useCallback, useEffect, useRef } from "react"

const STORAGE_KEY = "szene-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)
  const isLoggedIn = useRef(false)

  // On mount: check auth, then load from DB (logged in) or localStorage (guest)
  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch("/api/auth/me")
        const { user } = await meRes.json()

        if (user) {
          isLoggedIn.current = true
          const favRes = await fetch("/api/favorites")
          if (favRes.ok) {
            const { venueIds } = await favRes.json()
            setFavorites(new Set(venueIds as string[]))
          }
        } else {
          isLoggedIn.current = false
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) setFavorites(new Set(JSON.parse(saved)))
        }
      } catch {
        // Fallback to localStorage on any error
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) setFavorites(new Set(JSON.parse(saved)))
        } catch {}
      } finally {
        setLoaded(true)
      }
    }
    init()
  }, [])

  const toggleFavorite = useCallback(async (id: string) => {
    // Optimistic local update
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      if (!isLoggedIn.current) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])) } catch {}
      }
      return next
    })

    // Persist to DB if logged in
    if (isLoggedIn.current) {
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ venueId: id }),
        })
      } catch {}
    }
  }, [])

  return {
    favorites,
    toggleFavorite,
    isFavorite: (id: string) => favorites.has(id),
    loaded,
    count: favorites.size,
  }
}
