"use client"

import { useEffect, useRef } from "react"
import type { OSMVenue } from "@/lib/overpass-api"

interface Props {
  venues: OSMVenue[]
  centerCity?: string
  height?: string
  onVenueClick?: (venue: OSMVenue) => void
}

const CITY_CENTERS: Record<string, [number, number]> = {
  Mannheim:   [49.4875, 8.4660],
  Heidelberg: [49.4093, 8.6942],
  Frankfurt:  [50.1109, 8.6821],
  All:        [49.8200, 8.5700],
}

const AMENITY_COLORS: Record<string, string> = {
  nightclub:  "#7c3aed",
  bar:        "#d97706",
  pub:        "#b45309",
  biergarten: "#16a34a",
  restaurant: "#ea580c",
  cafe:       "#0284c7",
}

function markerHtml(amenity: string) {
  const color = AMENITY_COLORS[amenity] ?? "#6b7280"
  return `<div style="
    background:${color};
    width:11px;height:11px;
    border-radius:50%;
    border:2px solid white;
    box-shadow:0 1px 4px rgba(0,0,0,.35);
    cursor:pointer;
  "></div>`
}

// Limit markers rendered for performance
const MAX_MARKERS = 600

export default function VenuesMap({ venues, centerCity = "All", height = "500px", onVenueClick }: Props) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const [lat, lng] = CITY_CENTERS[centerCity] ?? CITY_CENTERS.All
      const zoom = centerCity === "All" ? 10 : 13

      const map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom,
        zoomControl: true,
        attributionControl: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
      layerRef.current = L.layerGroup().addTo(map)

      renderMarkers(L, venues, layerRef.current, onVenueClick)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers when venues change
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return
    import("leaflet").then((L) => {
      layerRef.current.clearLayers()
      renderMarkers(L, venues, layerRef.current, onVenueClick)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues])

  // Re-center when city changes
  useEffect(() => {
    if (!mapRef.current) return
    const [lat, lng] = CITY_CENTERS[centerCity] ?? CITY_CENTERS.All
    const zoom = centerCity === "All" ? 10 : 13
    mapRef.current.flyTo([lat, lng], zoom, { duration: 0.8 })
  }, [centerCity])

  return (
    <>
      {/* Leaflet CSS */}
      <style>{`
        @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        .leaflet-popup-content-wrapper { border-radius: 12px; padding: 0; overflow: hidden; }
        .leaflet-popup-content { margin: 0; }
        .szene-popup { padding: 12px 14px; min-width: 180px; }
        .szene-popup h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #111; }
        .szene-popup p  { margin: 0 0 2px; font-size: 12px; color: #666; }
        .szene-popup a  { font-size: 12px; color: #7c3aed; text-decoration: none; font-weight: 500; }
        .szene-popup a:hover { text-decoration: underline; }
      `}</style>
      <div ref={containerRef} style={{ height, width: "100%", borderRadius: "16px", overflow: "hidden" }} />
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 px-1">
        {Object.entries(AMENITY_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
            <span style={{ background: color }} className="w-2.5 h-2.5 rounded-full inline-block shrink-0" />
            {type === "biergarten" ? "Beer Garden" : type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        ))}
      </div>
    </>
  )
}

function renderMarkers(L: any, venues: OSMVenue[], layer: any, onVenueClick?: (v: OSMVenue) => void) {
  const limited = venues.slice(0, MAX_MARKERS)
  for (const venue of limited) {
    if (!venue.lat || !venue.lon) continue

    const icon = L.divIcon({
      html: markerHtml(venue.amenity),
      className: "",
      iconSize: [11, 11],
      iconAnchor: [5, 5],
      popupAnchor: [0, -8],
    })

    const marker = L.marker([venue.lat, venue.lon], { icon })

    const popup = L.popup({ maxWidth: 240 }).setContent(`
      <div class="szene-popup">
        <h4>${escHtml(venue.name)}</h4>
        <p>${venue.category}${venue.cuisine ? " · " + escHtml(venue.cuisine) : ""}</p>
        ${venue.address ? `<p>${escHtml(venue.address)}</p>` : ""}
        ${venue.openingHours ? `<p>🕐 ${escHtml(venue.openingHours)}</p>` : ""}
        <div style="margin-top:8px;display:flex;gap:8px;">
          <a href="${venue.googleMapsUrl}" target="_blank" rel="noopener">Maps ↗</a>
          ${venue.website ? `<a href="${escHtml(venue.website)}" target="_blank" rel="noopener">Website ↗</a>` : ""}
        </div>
      </div>
    `)

    marker.bindPopup(popup)
    if (onVenueClick) marker.on("click", () => onVenueClick(venue))
    marker.addTo(layer)
  }
}

function escHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c))
}
