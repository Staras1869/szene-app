"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { useState } from "react"
import Link from "next/link"

// ─── Venue coords ─────────────────────────────────────────────────────────────
const VENUE_COORDS: Record<string, Record<string, [number, number]>> = {
  mannheim: {
    "MS Connexion":        [49.4969, 8.4681],
    "BASE Club":           [49.4898, 8.4669],
    "Alte Feuerwache":     [49.4918, 8.4682],
    "Zeitraumexit":        [49.4902, 8.4668],
    "Tiffany Club":        [49.4856, 8.4763],
    "7Grad Mannheim":      [49.4905, 8.4672],
    "Kaizen":              [49.4875, 8.4660],
    "ZEPHYR Bar":          [49.4852, 8.4701],
    "Strandbar Rennwiese": [49.4820, 8.4598],
    "Ella & Louis":        [49.4908, 8.4671],
    "Hemingway Bar":       [49.4882, 8.4731],
    "Plan B":              [49.4896, 8.4675],
    "Capitol Mannheim":    [49.4891, 8.4736],
    "Galerie Kurzzeit":    [49.4900, 8.4678],
    "Weinkeller Wasserturm":[49.4870, 8.4698],
  },
  heidelberg: {
    "halle02":            [49.4038, 8.6770],
    "Cave 54":            [49.4098, 8.7018],
    "Nachtschicht":       [49.4083, 8.6953],
    "Destille":           [49.4095, 8.7012],
    "Schloss Biergarten": [49.4124, 8.7152],
    "Harmoniegarten":     [49.4060, 8.6885],
    "O'Brien's":          [49.4092, 8.7008],
    "Billy Blues":        [49.4091, 8.7007],
    "Karlstorbahnhof":    [49.4076, 8.7057],
    "Toniq Heidelberg":   [49.4089, 8.6993],
  },
  frankfurt: {
    "Robert Johnson":    [50.0988, 8.7648],
    "King Kamehameha":   [50.0978, 8.6665],
    "Cocoon Club":       [50.1091, 8.6597],
    "Metropol":          [50.0972, 8.6671],
    "Jazzkeller":        [50.1109, 8.6721],
    "Main Tower Lounge": [50.1116, 8.6757],
    "Club Voltaire":     [50.1118, 8.6824],
    "Zoom Frankfurt":    [50.1095, 8.6781],
  },
  stuttgart: {
    "Perkins Park":        [48.7936, 9.1659],
    "Climax Institutes":   [48.7785, 9.1801],
    "Im Wizemann":         [48.8155, 9.1768],
    "7GradX Stuttgart":    [48.7766, 9.1534],
    "MICA Club":           [48.7780, 9.1800],
    "Fridas Pier":         [48.7892, 9.1889],
    "Kowalski Stuttgart":  [48.7671, 9.1724],
    "Romantica":           [48.7782, 9.1798],
    "Club Schocken":       [48.7779, 9.1802],
    "Lerche 22":           [48.7783, 9.1797],
    "LKA Longhorn":        [48.7882, 9.2138],
    "BIX Jazzclub":        [48.7780, 9.1800],
  },
  karlsruhe: {
    "Substage":    [48.9869, 8.3808],
    "Tollhaus":    [49.0117, 8.4238],
    "Hemingway KA":[49.0069, 8.4037],
    "Kühler Krug": [49.0132, 8.3879],
  },
  berlin: {
    "Berghain":     [52.5113, 13.4433],
    "Watergate":    [52.5033, 13.4404],
    "Tresor":       [52.5067, 13.3933],
    "Sisyphos":     [52.5003, 13.4988],
    "Wilde Renate": [52.5110, 13.4521],
    "About Blank":  [52.5053, 13.4404],
    "KitKatClub":   [52.5064, 13.3931],
    "Prince Charles":[52.4997, 13.3899],
    "Yaam Club":    [52.5148, 13.4142],
  },
  munich: {
    "Harry Klein":    [48.1374, 11.5755],
    "Rote Sonne":     [48.1374, 11.5680],
    "P1 Munich":      [48.1415, 11.5878],
    "Muffatwerk":     [48.1311, 11.5878],
    "Blitz Club":     [48.1350, 11.5600],
    "Club Backstage": [48.1484, 11.5343],
    "MMA Club":       [48.1380, 11.5760],
    "Atomic Café":    [48.1374, 11.5755],
  },
  cologne: {
    "Bootshaus":              [50.9352, 6.9820],
    "Club Bahnhof Ehrenfeld": [50.9478, 6.9251],
    "Yuca Club":              [50.9466, 6.9240],
    "Gewölbe":                [50.9187, 7.0122],
    "Odonien":                [50.9472, 6.9233],
    "Stadtgarten":            [50.9391, 6.9358],
    "Luxor Cologne":          [50.9472, 6.9240],
  },
}

const CITY_CENTERS: Record<string, [number, number]> = {
  mannheim:   [49.4875, 8.4660],
  heidelberg: [49.4050, 8.6993],
  frankfurt:  [50.1038, 8.6647],
  stuttgart:  [48.7850, 9.1770],
  karlsruhe:  [49.0069, 8.4037],
  berlin:     [52.5080, 13.4310],
  munich:     [48.1380, 11.5740],
  cologne:    [50.9410, 6.9560],
}

const CITY_ZOOM: Record<string, number> = {
  mannheim: 14, heidelberg: 14, frankfurt: 13, stuttgart: 13,
  karlsruhe: 14, berlin: 13, munich: 13, cologne: 13,
}

const VIBE_COLORS: Record<string, string> = {
  party:   "#a855f7",
  afro:    "#10b981",
  latin:   "#f97316",
  hiphop:  "#6366f1",
  student: "#3b82f6",
  chill:   "#8b5cf6",
  music:   "#f59e0b",
  outside: "#22c55e",
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function makePin(emoji: string, color: string, hot: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${hot ? 44 : 38}px;height:${hot ? 44 : 38}px;
      border-radius:50%;
      background:${color}22;
      border:2.5px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:${hot ? 20 : 17}px;
      box-shadow:0 0 0 ${hot ? "6px" : "0px"} ${color}33,0 4px 12px rgba(0,0,0,0.5);
      backdrop-filter:blur(4px);
    ">${emoji}${hot ? `<span style="position:absolute;top:-3px;right:-3px;width:10px;height:10px;background:#f97316;border-radius:50%;border:2px solid #0d0d0f"></span>` : ""}</div>`,
    iconSize: [hot ? 44 : 38, hot ? 44 : 38],
    iconAnchor: [hot ? 22 : 19, hot ? 22 : 19],
  })
}

function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

type VenuePin = {
  name: string; area: string; type: string; emoji: string
  tag: string; vibe: string; id: string
}

export function MapInner({ city, venues }: { city: string; venues: VenuePin[] }) {
  const [filter, setFilter] = useState("all")
  const coords  = VENUE_COORDS[city] ?? {}
  const center  = CITY_CENTERS[city] ?? [51.1657, 10.4515]
  const zoom    = CITY_ZOOM[city] ?? 13

  const h        = new Date().getHours()
  const adjH     = h < 6 ? h + 24 : h

  const filtered = venues.filter(v => filter === "all" || v.vibe === filter)

  const VIBES = [
    { id: "all",     label: "All",     emoji: "✦" },
    { id: "party",   label: "Party",   emoji: "🎉" },
    { id: "afro",    label: "Afro",    emoji: "🌍" },
    { id: "latin",   label: "Latin",   emoji: "🔥" },
    { id: "hiphop",  label: "Hip-Hop", emoji: "🎤" },
    { id: "chill",   label: "Chill",   emoji: "🍷" },
    { id: "music",   label: "Live",    emoji: "🎷" },
    { id: "outside", label: "Outside", emoji: "🌿" },
  ]

  return (
    <div className="space-y-3">
      {/* Vibe filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        {VIBES.map(v => (
          <button key={v.id} onClick={() => setFilter(v.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-semibold transition-all ${
              filter === v.id ? "vibe-active" : "vibe-inactive"
            }`}>
            <span>{v.emoji}</span>{v.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-szene" style={{ height: 420 }}>
        <MapContainer
          center={center} zoom={zoom}
          style={{ height: "100%", width: "100%", background: "#0d0d0f" }}
          zoomControl={false}
          attributionControl={false}
        >
          <RecenterMap center={center} zoom={zoom} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {filtered.map(v => {
            const pos = coords[v.name]
            if (!pos) return null
            const color  = VIBE_COLORS[v.vibe] ?? "#a855f7"
            const isOpen = false // simplified — could check OPEN_NOW
            const pin    = makePin(v.emoji, color, isOpen)
            return (
              <Marker key={v.id} position={pos} icon={pin}>
                <Popup className="szene-popup">
                  <div style={{ minWidth: 180, fontFamily: "inherit" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 20 }}>{v.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, color: "#fff", margin: 0 }}>{v.name}</p>
                        <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{v.area} · {v.type}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: color, margin: "4px 0 8px", fontWeight: 600 }}>{v.tag}</p>
                    <a href={`/venue/${toSlug(v.name)}`}
                      style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#fff", background: color, padding: "4px 10px", borderRadius: 8, textDecoration: "none" }}>
                      View venue →
                    </a>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(VIBE_COLORS).map(([vibe, color]) => (
          <span key={vibe} className="flex items-center gap-1.5 text-[10px] text-muted font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: color + "18", border: `1px solid ${color}30` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
            {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
          </span>
        ))}
      </div>

      <p className="text-[10px] text-faint text-center">Tap a pin to see venue details · {filtered.length} venues shown</p>
    </div>
  )
}
