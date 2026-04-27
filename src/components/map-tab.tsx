"use client"

import dynamic from "next/dynamic"

const MapInner = dynamic(
  () => import("./map-inner").then(m => ({ default: m.MapInner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center rounded-2xl border border-szene" style={{ height: 420, background: "var(--bg-surface)" }}>
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
          <p className="text-xs text-muted">Loading map…</p>
        </div>
      </div>
    ),
  }
)

type VenuePin = { name: string; area: string; type: string; emoji: string; tag: string; vibe: string; id: string }

export function MapTab({ city, venues }: { city: string; venues: VenuePin[] }) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-[10px] text-violet-400 uppercase tracking-[0.2em] font-semibold mb-1">Venue Map</p>
        <h2 className="text-xl font-black text-szene tracking-tight">Where to go tonight</h2>
        <p className="text-xs text-muted mt-1">All venues in {city.charAt(0).toUpperCase() + city.slice(1)} — tap a pin for details</p>
      </div>
      <MapInner city={city} venues={venues} />
    </div>
  )
}
