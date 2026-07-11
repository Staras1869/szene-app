import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

interface OsmElement {
    id: number
    type: "node" | "way" | "relation"
    tags?: Record<string, string>
    lat?: number
    lon?: number
    center?: {
        lat: number
        lon: number
    }
}

interface Venue {
    osm_id: string
    name: string
    city: string
    category: string
    latitude: number
    longitude: number
    address: string | null
    website: string | null
    phone: string | null
    opening_hours: string | null
    raw_tags: Record<string, string>
    data_source: string
    verified: false
    last_verified_at: null
}

const cities = [
    "Mannheim",
    "Heidelberg",
    "Frankfurt am Main",
    "Stuttgart",
    "Karlsruhe",
    "Berlin",
    "München",
    "Köln",
] as const

const cityCenters: Record<string, { lat: number; lon: number; radius: number }> = {
    Mannheim: { lat: 49.4875, lon: 8.4660, radius: 12000 },
    Heidelberg: { lat: 49.3988, lon: 8.6724, radius: 12000 },
    "Frankfurt am Main": { lat: 50.1109, lon: 8.6821, radius: 17000 },
    Stuttgart: { lat: 48.7758, lon: 9.1829, radius: 15000 },
    Karlsruhe: { lat: 49.0069, lon: 8.4037, radius: 12000 },
    Berlin: { lat: 52.5200, lon: 13.4050, radius: 22000 },
    München: { lat: 48.1351, lon: 11.5820, radius: 19000 },
    Köln: { lat: 50.9375, lon: 6.9603, radius: 16000 },
}

const outputFile = join(process.cwd(), "data", "venues.json")

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildQuery(city: string): string {
    if (cityCenters[city]) {
        const { lat, lon, radius } = cityCenters[city]
        return `[out:json][timeout:120];\n(\n  node["amenity"~"^(nightclub|bar|pub|biergarten)$"](around:${radius},${lat},${lon});\n  way["amenity"~"^(nightclub|bar|pub|biergarten)$"](around:${radius},${lat},${lon});\n);\nout center tags;`
    }

    return `[out:json][timeout:120];\narea["name"="${city}"]["boundary"="administrative"];\n(\n  node["amenity"~"^(nightclub|bar|pub|biergarten)$"](area);\n  way["amenity"~"^(nightclub|bar|pub|biergarten)$"](area);\n);\nout center tags;`
}

function buildAddress(tags: Record<string, string>): string | null {
    const street = tags["addr:street"]
    const houseNumber = tags["addr:housenumber"]
    const postcode = tags["addr:postcode"]
    const city = tags["addr:city"]

    const streetSegment = [street, houseNumber].filter(Boolean).join(" ").trim()
    const citySegment = [postcode, city].filter(Boolean).join(" ").trim()

    const address = [streetSegment, citySegment].filter(Boolean).join(", ").trim()
    return address.length > 0 ? address : null
}

function parseVenue(element: OsmElement, city: string): Venue | null {
    const tags = element.tags ?? {}
    const name = tags.name?.trim()
    if (!name) return null

    const coordinate =
        element.type === "node"
            ? element.lat != null && element.lon != null
                ? { lat: element.lat, lon: element.lon }
                : null
            : element.center ?? null

    if (!coordinate) return null

    return {
        osm_id: `${element.type}/${element.id}`,
        name,
        city,
        category: tags.amenity ?? "nightlife",
        latitude: coordinate.lat,
        longitude: coordinate.lon,
        address: buildAddress(tags),
        website: tags.website ?? tags["contact:website"] ?? tags.url ?? null,
        phone: tags.phone ?? tags["contact:phone"] ?? null,
        opening_hours: tags.opening_hours ?? null,
        raw_tags: tags,
        data_source: "osm",
        verified: false,
        last_verified_at: null,
    }
}

async function fetchCityVenues(city: string) {
    const query = buildQuery(city)
    const endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.openstreetmap.fr/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
    ]
    let lastError: Error | null = null

    for (const endpoint of endpoints) {
        const url = new URL(endpoint)
        url.searchParams.set("data", query)

        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Accept: "text/plain, */*",
                    "User-Agent": "SzeneApp/1.0 (+https://github.com/Staras1869)",
                },
            })

            if (!response.ok) {
                const errorMessage = `Overpass request failed for ${city} at ${endpoint}: ${response.status} ${response.statusText}`
                console.warn(errorMessage)
                lastError = new Error(errorMessage)
                await sleep(1000)
                continue
            }

            const json = (await response.json()) as { elements?: OsmElement[] }
            const elements = json.elements ?? []

            const venues = elements
                .map((element) => parseVenue(element, city))
                .filter((venue): venue is Venue => venue !== null)

            return {
                totalElements: elements.length,
                venues,
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.warn(`Overpass request error for ${city} at ${endpoint}: ${errorMessage}`)
            lastError = error instanceof Error ? error : new Error(String(error))
            await sleep(1000)
        }
    }

    throw lastError ?? new Error(`Overpass request failed for ${city}`)
}

async function main() {
    const cityReports: Array<{
        city: string
        queried: number
        imported: number
        skipped: number
        error?: string
    }> = []

    const venues: Venue[] = []

    for (const city of cities) {
        try {
            console.log(`🔎 Fetching OSM venues for ${city}...`)
            const { totalElements, venues: cityVenues } = await fetchCityVenues(city)
            venues.push(...cityVenues)
            cityReports.push({
                city,
                queried: totalElements,
                imported: cityVenues.length,
                skipped: totalElements - cityVenues.length,
            })
        } catch (error) {
            cityReports.push({
                city,
                queried: 0,
                imported: 0,
                skipped: 0,
                error: error instanceof Error ? error.message : String(error),
            })
            console.error(`❌ Error fetching ${city}:`, error)
        }

        await sleep(2000)
    }

    mkdirSync(join(process.cwd(), "data"), { recursive: true })
    writeFileSync(outputFile, JSON.stringify(venues, null, 2), "utf-8")

    console.log(`\n✅ Wrote ${venues.length} venues to ${outputFile}`)
    console.table(cityReports)
}

main().catch((error) => {
    console.error("Seed pipeline failed:", error)
    process.exit(1)
})
