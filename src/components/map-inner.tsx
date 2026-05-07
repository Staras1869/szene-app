"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { useState } from "react"
import Link from "next/link"

// ─── Venue coords — sourced from OpenStreetMap (Overpass API) ─────────────────
const VENUE_COORDS: Record<string, Record<string, [number, number]>> = {
  mannheim: {
    // Clubs (OSM verified)
    "MS Connexion":          [49.4494, 8.4962],
    "BASE Club":             [49.4898, 8.4669],
    "Alte Feuerwache":       [49.4918, 8.4682],
    "Zeitraumexit":          [49.4902, 8.4668],
    "Tiffany Club":          [49.4849, 8.4720],
    "7Grad Mannheim":        [49.4905, 8.4672],
    "Hafen 49":              [49.4985, 8.4569],
    "Soho Mannheim":         [49.4937, 8.4630],
    "CUBES":                 [49.4842, 8.4734],
    "7er-Club Mannheim":     [49.5056, 8.4594],
    "RUDE7":                 [49.5060, 8.4593],
    "Musikpark":             [49.4796, 8.4520],
    "Lagerhaus Mannheim":    [49.4870, 8.4698],
    // Bars
    "Kaizen":                [49.4875, 8.4660],
    "ZEPHYR Bar":            [49.4852, 8.4701],
    "Strandbar Rennwiese":   [49.4820, 8.4598],
    "Ella & Louis":          [49.4848, 8.4775],
    "Hemingway Bar":         [49.4882, 8.4731],
    "Plan B":                [49.4896, 8.4675],
    "Capitol Mannheim":      [49.4891, 8.4736],
    "Galerie Kurzzeit":      [49.4900, 8.4678],
    "Weinkeller Wasserturm": [49.4870, 8.4698],
    "Hotel Speicher7":       [49.4850, 8.4542],
    "Taproom Jungbusch":     [49.4936, 8.4594],
    "Gatsby Jungbuschbar":   [49.4938, 8.4578],
    "Hagestolz":             [49.4940, 8.4580],
    "Mono":                  [49.4933, 8.4602],
    "Filmriss":              [49.4935, 8.4620],
    "Kombinat":              [49.4922, 8.4727],
    "Lyftoh Bar":            [49.4956, 8.4588],
  },
  heidelberg: {
    "halle02":               [49.4022, 8.6705],
    "Cave 54":               [49.4117, 8.7097],
    "Toniq Heidelberg":      [49.4100, 8.6942],
    "Nachtschicht":          [49.4083, 8.6953],
    "Jazzhaus Heidelberg":   [49.4131, 8.7132],
    "Club 1900":             [49.4115, 8.7046],
    "Destille":              [49.4095, 8.7012],
    "Schloss Biergarten":    [49.4124, 8.7152],
    "Harmoniegarten":        [49.4060, 8.6885],
    "O'Brien's":             [49.4092, 8.7008],
    "Billy Blues":           [49.4091, 8.7007],
    "Karlstorbahnhof":       [49.4076, 8.7057],
  },
  frankfurt: {
    "Robert Johnson":        [50.0988, 8.7648],
    "King Kamehameha":       [50.0978, 8.6665],
    "Cocoon Club":           [50.1091, 8.6597],
    "Metropol":              [50.0972, 8.6671],
    "Jazzkeller":            [50.1144, 8.6737],
    "Main Tower Lounge":     [50.1116, 8.6757],
    "Club Voltaire":         [50.1118, 8.6824],
    "Zoom Frankfurt":        [50.1095, 8.6781],
    "Gibson":                [50.1142, 8.6822],
    "Tanzhaus West":         [50.0980, 8.6464],
    "Nachtleben":            [50.1141, 8.6875],
    "PRACHT":                [50.1095, 8.6635],
    "Das Bett":              [50.1037, 8.6185],
    "Orange Peel":           [50.1087, 8.6707],
    "Ponyhof":               [50.1053, 8.6911],
    "Velvet Club":           [50.1094, 8.6755],
    "Pik Dame":              [50.1089, 8.6673],
    "Freiheit 2112":         [50.1144, 8.7241],
    "Silbergold":            [50.1155, 8.6912],
    "La Louve Frankfurt":    [50.1161, 8.6831],
    "The Cave":              [50.1157, 8.6831],
  },
  stuttgart: {
    "Perkins Park":          [48.8052, 9.1745],
    "Climax Institutes":     [48.7761, 9.1741],
    "Im Wizemann":           [48.8155, 9.1768],
    "7GradX Stuttgart":      [48.7766, 9.1534],
    "MICA Club":             [48.7769, 9.1755],
    "Fridas Pier":           [48.7892, 9.1889],
    "Kowalski Stuttgart":    [48.7847, 9.1784],
    "Romantica":             [48.7726, 9.1782],
    "Club Schocken":         [48.7779, 9.1802],
    "Lerche 22":             [48.7783, 9.1797],
    "LKA Longhorn":          [48.7882, 9.2138],
    "BIX Jazzclub":          [48.7780, 9.1800],
    "Lehmann Club":          [48.7798, 9.1671],
    "Universum Stuttgart":   [48.7771, 9.1834],
    "Detroit Stuttgart":     [48.7737, 9.1777],
    "Laboratorium":          [48.7814, 9.2074],
    "Schräglage":            [48.7821, 9.1775],
    "White Noise":           [48.7730, 9.1784],
    "Club Zentral":          [48.7773, 9.1700],
    "proTON The Club":       [48.7737, 9.1754],
  },
  karlsruhe: {
    "Substage":              [49.0053, 8.4297],
    "Tollhaus":              [49.0117, 8.4238],
    "Hemingway KA":          [49.0069, 8.4037],
    "Kühler Krug":           [49.0132, 8.3879],
    "Fettschmelze":          [49.0046, 8.4290],
    "Agostea":               [49.0054, 8.4119],
    "Gotec Club+":           [49.0241, 8.3528],
    "Jazzclub Karlsruhe":    [49.0105, 8.3969],
    "Erdbeermund":           [49.0043, 8.4097],
    "Krokokeller":           [49.0081, 8.3959],
    "La Louve Karlsruhe":    [49.0104, 8.3923],
    "Cen Club":              [49.0102, 8.3976],
  },
  berlin: {
    "Berghain":              [52.5112, 13.4430],
    "Watergate":             [52.5033, 13.4404],
    "Tresor Berlin":         [52.5107, 13.4195],
    "Sisyphos":              [52.5003, 13.4988],
    "Zur Wilden Renate":     [52.4974, 13.4653],
    "://about blank":        [52.5025, 13.4663],
    "Kit Kat Club":          [52.5112, 13.4169],
    "Prince Charles":        [52.5033, 13.4087],
    "yaam":                  [52.5092, 13.4307],
    "SO36":                  [52.5004, 13.4222],
    "Kater Blau":            [52.5119, 13.4253],
    "Ohm":                   [52.5106, 13.4198],
    "Ritter Butzke":         [52.5030, 13.4081],
    "Sage":                  [52.5110, 13.4169],
    "Cassiopeia":            [52.5073, 13.4548],
    "Astra Kulturhaus":      [52.5073, 13.4518],
    "Weekend Club":          [52.5229, 13.4164],
    "Matrix":                [52.5047, 13.4490],
    "Lido":                  [52.4992, 13.4451],
    "Gretchen":              [52.4960, 13.3875],
    "Festsaal Kreuzberg":    [52.4968, 13.4516],
    "Clärchens Ballhaus":    [52.5265, 13.3969],
    "Privatclub":            [52.5001, 13.4348],
    "Golden Gate":           [52.5160, 13.4169],
    "Berghain Kantine":      [52.5115, 13.4425],
    "Else":                  [52.4952, 13.4628],
    "Arena Club":            [52.4971, 13.4529],
    "MS Hoppetosse":         [52.4975, 13.4547],
  },
  munich: {
    "Harry Klein":           [48.1374, 11.5755],
    "Rote Sonne":            [48.1422, 11.5701],
    "P1 Munich":             [48.1444, 11.5853],
    "Muffatwerk":            [48.1311, 11.5878],
    "Blitz Club":            [48.1315, 11.5860],
    "Club Backstage":        [48.1295, 11.5337],
    "MMA Club":              [48.1380, 11.5760],
    "Atomic Café":           [48.1374, 11.5755],
    "Neuraum":               [48.1423, 11.5512],
    "Milla Club":            [48.1289, 11.5679],
    "STROM":                 [48.1249, 11.5491],
    "Kranhalle":             [48.1295, 11.5334],
    "Pacha München":         [48.1421, 11.5698],
    "Sweet Munich":          [48.1422, 11.5706],
    "NY.Club":               [48.1414, 11.5628],
    "ABC Alte Börse Club":   [48.1409, 11.5677],
    "Palais Club & Bar":     [48.1420, 11.5582],
    "La Nuit":               [48.1418, 11.5722],
  },
  cologne: {
    "Bootshaus":             [50.9352, 6.9820],
    "Club Bahnhof Ehrenfeld":[50.9517, 6.9160],
    "Yuca Club":             [50.9517, 6.9162],
    "Gewölbe":               [50.9438, 6.9339],
    "Odonien":               [50.9549, 6.9400],
    "Stadtgarten":           [50.9391, 6.9358],
    "Luxor Cologne":         [50.9472, 6.9240],
    "MTC":                   [50.9300, 6.9386],
    "Das Ding":              [50.9317, 6.9408],
    "Klapsmühle":            [50.9392, 6.9394],
    "Club Z":                [50.9422, 6.9351],
    "JAKI":                  [50.9429, 6.9351],
    "Sonic Ballroom":        [50.9487, 6.9076],
    "Die Halle Tor 2":       [50.9488, 6.8801],
    "Helios 37":             [50.9503, 6.9134],
    "King Georg Jazz Club":  [50.9510, 6.9564],
    "Nachtflug":             [50.9419, 6.9400],
    "Bollwerk Cologne":      [50.9420, 6.9400],
    "Tomorrows":             [50.9422, 6.9407],
    "Petit Prince":          [50.9422, 6.9407],
    "Hidden Club":           [50.9377, 6.9373],
    "Trafic":                [50.9571, 6.9003],
    "Niehler Freiheit":      [50.9548, 6.8914],
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
