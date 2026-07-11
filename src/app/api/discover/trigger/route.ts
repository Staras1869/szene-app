import { type NextRequest, NextResponse } from "next/server"
import { SocialDiscoveryEngine } from "@/lib/social-discovery-engine"
import { prisma } from "@/lib/prisma"
import { validateAndUpsertBatch } from "@/lib/event-sync"

export const dynamic = "force-dynamic" // Ensures this route is not cached
export const maxDuration = 300

async function saveDiscoveryResults(results: Awaited<ReturnType<SocialDiscoveryEngine["runFullDiscovery"]>>) {
  let savedEvents = 0
  let savedVenues = 0

  // Prepare event rows for AI validation + upsert
  const rows = results.events.map((event) => ({
    title: event.title,
    description: event.description ?? null,
    date: event.date,
    time: event.time ?? null,
    venue: event.venue,
    city: event.city,
    category: event.tags[0] ?? "Other",
    price: event.price ?? null,
    imageUrl: event.image ?? null,
    sourceUrl: event.sourceUrl ?? null,
    lat: null,
    lon: null,
    status: "pending",
    source: event.source,
    externalId: event.id,
  }))

  // Validate with AI and upsert approved events
  savedEvents = await validateAndUpsertBatch(rows)

  for (const venue of results.venues) {
    await prisma.discoveredVenue.upsert({
      where: {
        name_city: {
          name: venue.name,
          city: venue.city,
        },
      },
      update: {
        category: venue.category,
        mentions: venue.mentions,
        avgEngagement: venue.avgEngagement,
        recentActivity: venue.recentActivity,
        confidence: venue.confidence,
        suggestedInfo: venue.suggestedInfo,
      },
      create: {
        name: venue.name,
        city: venue.city,
        category: venue.category,
        mentions: venue.mentions,
        avgEngagement: venue.avgEngagement,
        recentActivity: venue.recentActivity,
        confidence: venue.confidence,
        suggestedInfo: venue.suggestedInfo,
      },
    })
    savedVenues++
  }

  return { savedEvents, savedVenues }
}

async function runDiscovery() {
  const engine = new SocialDiscoveryEngine()
  const results = await engine.runFullDiscovery()
  const saved = await saveDiscoveryResults(results)
  console.log(`Saved ${saved.savedEvents} discovered events and ${saved.savedVenues} discovered venues to DB.`)
  return { results, saved }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  console.log("API: Received request to trigger social discovery...")
  try {
    const { results, saved } = await runDiscovery()
    console.log(
      `API: Social discovery complete. Found ${results.events.length} events, ${results.venues.length} venues.`,
    )
    return NextResponse.json({
      success: true,
      message: `Social discovery triggered. Found ${results.events.length} events and ${results.venues.length} venues.`,
      data: {
        eventCount: results.events.length,
        venueCount: results.venues.length,
        savedEvents: saved.savedEvents,
        savedVenues: saved.savedVenues,
        stats: results.stats,
      },
    })
  } catch (error) {
    console.error("API: Social discovery trigger error:", error)
    return NextResponse.json({ success: false, error: "Failed to trigger social discovery." }, { status: 500 })
  }
}

// You might want a GET route for manual triggering or cron jobs
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Use POST with CRON_SECRET in production" }, { status: 403 })
  }

  console.log("API: Received GET request to trigger social discovery (manual/cron)...")
  const { results, saved } = await runDiscovery()
  return NextResponse.json({
    success: true,
    message: `Social discovery triggered (dev GET). Found ${results.events.length} events and ${results.venues.length} venues.`,
    data: {
      eventCount: results.events.length,
      venueCount: results.venues.length,
      savedEvents: saved.savedEvents,
      savedVenues: saved.savedVenues,
      stats: results.stats,
    },
  })
}
