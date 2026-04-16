/**
 * OpenStreetMap Overpass API integration.
 * Returns real venues (bars, clubs, restaurants, cafes) in
 * Mannheim, Heidelberg & Frankfurt.
 * No API key required — completely free.
 */

export interface OSMVenue {
  id: string
  name: string
  amenity: "bar" | "pub" | "nightclub" | "restaurant" | "cafe" | "biergarten" | string
  category: string
  address: string
  city: "Mannheim" | "Heidelberg" | "Frankfurt" | string
  lat: number
  lon: number
  website?: string
  phone?: string
  openingHours?: string
  cuisine?: string
  description?: string
  googleMapsUrl: string
}

// Bounding box covers Mannheim, Heidelberg AND Frankfurt area
// lat: 49.35 (Heidelberg south) → 50.25 (Frankfurt north)
// lon: 8.30 (Mannheim west)    → 8.95 (Frankfurt east)
const BBOX = "49.35,8.30,50.25,8.95"
const OVERPASS_URL = "https://overpass-api.de/api/interpreter"

/**
 * Detect the nearest main city from coordinates.
 * Frankfurt:   lat > 49.80
 * Mannheim:    lat ≤ 49.80 AND lon < 8.56
 * Heidelberg:  lat ≤ 49.80 AND lon ≥ 8.56
 */
function detectCity(lat: number, lon: number): string {
  if (lat > 49.80) return "Frankfurt"
  if (lon < 8.56) return "Mannheim"
  return "Heidelberg"
}

function mapAmenityToCategory(amenity: string): string {
  const map: Record<string, string> = {
    bar: "Bar",
    pub: "Bar",
    nightclub: "Nightlife",
    restaurant: "Restaurant",
    cafe: "Café",
    biergarten: "Bar",
    fast_food: "Food",
    food_court: "Food",
  }
  return map[amenity] ?? "Venue"
}

function buildAddress(tags: Record<string, string>): string {
  const parts: string[] = []
  if (tags["addr:street"]) {
    parts.push(tags["addr:street"] + (tags["addr:housenumber"] ? " " + tags["addr:housenumber"] : ""))
  }
  if (tags["addr:postcode"] && tags["addr:city"]) {
    parts.push(tags["addr:postcode"] + " " + tags["addr:city"])
  } else if (tags["addr:city"]) {
    parts.push(tags["addr:city"])
  }
  return parts.join(", ")
}

function cleanWebsite(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url)
    return u.href
  } catch {
    return undefined
  }
}

export async function getVenuesFromOSM(amenityFilter?: string): Promise<OSMVenue[]> {
  const amenities = amenityFilter
    ? amenityFilter
    : "bar|pub|nightclub|restaurant|cafe|biergarten"

  const query = `[out:json][timeout:25];
(
  node["amenity"~"^(${amenities})$"]["name"](${BBOX});
  way["amenity"~"^(${amenities})$"]["name"](${BBOX});
);
out center tags;`

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
      // Cache for 1 hour at the Next.js level
      next: { revalidate: 3600 },
    } as RequestInit & { next?: { revalidate: number } })

    if (!res.ok) throw new Error(`Overpass API ${res.status}`)

    const data = await res.json()
    const elements: any[] = data.elements ?? []

    const venues: OSMVenue[] = elements
      .map((el) => {
        const tags: Record<string, string> = el.tags ?? {}
        const lat: number = el.lat ?? el.center?.lat
        const lon: number = el.lon ?? el.center?.lon

        if (!tags.name || !lat || !lon) return null

        const city = detectCity(lat, lon)
        const website = cleanWebsite(tags.website ?? tags["contact:website"] ?? tags["contact:url"])

        return {
          id: `osm-${el.type}-${el.id}`,
          name: tags.name,
          amenity: tags.amenity,
          category: mapAmenityToCategory(tags.amenity),
          address: buildAddress(tags),
          city,
          lat,
          lon,
          website,
          phone: tags.phone ?? tags["contact:phone"],
          openingHours: tags.opening_hours,
          cuisine: tags.cuisine?.replace(/;/g, ", "),
          description: tags.description,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
        } satisfies OSMVenue
      })
      .filter(Boolean) as OSMVenue[]

    // Deduplicate by name + city (OSM sometimes has duplicate entries)
    const seen = new Set<string>()
    return venues.filter((v) => {
      const key = `${v.name.toLowerCase()}-${v.city}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  } catch (err) {
    console.error("Overpass API error:", err)
    return []
  }
}

export async function searchOSMVenues(query: string): Promise<OSMVenue[]> {
  const all = await getVenuesFromOSM()
  const q = query.toLowerCase()
  return all.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.cuisine?.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q)
  )
}
