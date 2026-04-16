import { NextResponse } from "next/server"
import { SocialDiscoveryEngine } from "@/lib/social-discovery-engine"
// import { prisma } from "@/lib/prisma"; // Assuming you have Prisma for DB

export const dynamic = "force-dynamic" // Ensures this route is not cached

export async function POST() {
  console.log("API: Received request to trigger social discovery...")
  try {
    const engine = new SocialDiscoveryEngine()
    const results = await engine.runFullDiscovery()

    // --- TODO: Save results to your database ---
    // Example:
    // for (const event of results.events) {
    //   await prisma.event.create({ data: { ...event, status: 'discovered' } });
    // }
    // for (const venue of results.venues) {
    //   await prisma.venue.upsert({ where: { name: venue.name }, update: venue, create: venue });
    // }
    // console.log(`Saved ${results.events.length} events and ${results.venues.length} venues to DB.`);
    // --- End of TODO ---

    console.log(
      `API: Social discovery complete. Found ${results.events.length} events, ${results.venues.length} venues.`,
    )
    return NextResponse.json({
      success: true,
      message: `Social discovery triggered. Found ${results.events.length} events and ${results.venues.length} venues.`,
      data: {
        eventCount: results.events.length,
        venueCount: results.venues.length,
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
  // For security, you might want to protect this GET route
  // e.g., with a secret key in the query params or an auth check
  console.log("API: Received GET request to trigger social discovery (manual/cron)...")
  return POST() // Re-use POST logic for now
}
