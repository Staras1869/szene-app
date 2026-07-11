/**
 * /api/events/sync
 *
 * POST — secured with CRON_SECRET, used by Vercel Cron (runs daily at 06:00).
 * GET  — dev-only (NODE_ENV !== production), no auth required.
 *
 * Sources synced: RA · Ticketmaster · Eventbrite · (Meta after Kleingewerbe is live)
 * All events are AI-validated by Claude before being written to the DB.
 *
 * vercel.json cron example:
 *   { "path": "/api/events/sync", "schedule": "0 6 * * *" }
 */
import { type NextRequest, NextResponse } from "next/server"
import { syncAllVenues } from "@/lib/event-sync"

export const maxDuration = 300 // 5 min — AI validation adds latency

async function runSync() {
  const results = await syncAllVenues()
  const totalFB = results.reduce((s, r) => s + r.fb, 0)
  const totalIG = results.reduce((s, r) => s + r.ig, 0)
  const totalRA = results.reduce((s, r) => s + r.ra, 0)
  const totalTM = results.reduce((s, r) => s + r.ticketmaster, 0)
  const totalEB = results.reduce((s, r) => s + r.eventbrite, 0)
  const errors  = results.flatMap((r) => r.errors.map((e) => `${r.venue}: ${e}`))
  const total   = totalFB + totalIG + totalRA + totalTM + totalEB

  return {
    ok: true,
    synced: { facebook: totalFB, instagram: totalIG, ra: totalRA, ticketmaster: totalTM, eventbrite: totalEB, total },
    venues: results,
    errors,
  }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    return NextResponse.json(await runSync())
  } catch (err) {
    console.error("[events/sync] Fatal error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// Dev-only GET — lets you trigger sync from the browser without a secret
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Use POST with CRON_SECRET in production" }, { status: 403 })
  }

  try {
    return NextResponse.json(await runSync())
  } catch (err) {
    console.error("[events/sync] Fatal error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
