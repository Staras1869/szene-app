import "dotenv/config"
import { readFile } from "node:fs/promises"
import { neon } from "@neondatabase/serverless"

interface Venue {
    osm_id: string
    name: string
    city: string
    category: string
    latitude: number
    longitude: number
    address?: string | null
    website?: string | null
    phone?: string | null
    opening_hours?: string | null
    raw_tags: Record<string, string>
}

async function main() {
    const filePath = "data/venues.json"
    const raw = await readFile(filePath, "utf-8")
    const venues = JSON.parse(raw) as Venue[]

    if (!Array.isArray(venues)) {
        throw new Error(`${filePath} does not contain an array of venues`)
    }

    const connectionString = process.env.DATABASE_URL?.trim()
    if (!connectionString) {
        throw new Error("DATABASE_URL must be set in .env.local before loading venues")
    }

    const db = neon(connectionString) as any
    let insertedCount = 0
    let updatedCount = 0

    for (const venue of venues) {
        try {
            const result = await db.sql`
        INSERT INTO venues (
          osm_id,
          name,
          city,
          category,
          latitude,
          longitude,
          address,
          website,
          phone,
          opening_hours,
          data_source,
          verified,
          last_verified_at,
          raw_tags
        ) VALUES (
          ${venue.osm_id},
          ${venue.name},
          ${venue.city},
          ${venue.category},
          ${venue.latitude},
          ${venue.longitude},
          ${venue.address ?? null},
          ${venue.website ?? null},
          ${venue.phone ?? null},
          ${venue.opening_hours ?? null},
          ${"osm"},
          ${false},
          ${null},
          ${JSON.stringify(venue.raw_tags)}
        )
        ON CONFLICT (osm_id) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          category = EXCLUDED.category,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          address = COALESCE(EXCLUDED.address, venues.address),
          website = COALESCE(EXCLUDED.website, venues.website),
          phone = COALESCE(EXCLUDED.phone, venues.phone),
          opening_hours = COALESCE(EXCLUDED.opening_hours, venues.opening_hours),
          raw_tags = COALESCE(EXCLUDED.raw_tags, venues.raw_tags),
          updated_at = NOW()
        RETURNING (xmax = 0) AS inserted;
      `

            const inserted = result?.rows?.[0]?.inserted === true
            if (inserted) {
                insertedCount += 1
            } else {
                updatedCount += 1
            }
        } catch (error) {
            console.error(`Failed to load venue ${venue.osm_id}:`, error)
        }
    }

    console.log(`\n✅ Venue load complete: ${insertedCount} inserted, ${updatedCount} updated`)

    if (typeof db.end === "function") {
        await db.end()
    }
}

main().catch((error) => {
    console.error("Loading venues to DB failed:", error)
    process.exit(1)
})
