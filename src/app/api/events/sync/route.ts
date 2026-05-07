/**
 * POST /api/events/sync
 *
 * Triggers a full sync of venue events from Meta (Facebook + Instagram).
 * Secured with CRON_SECRET header. Safe to run from a Vercel Cron Job.
 *
 * Example cron (vercel.json):
 *   { "path": "/api/events/sync", "schedule": "0 6 * * *" }
 */
import { type NextRequest, NextResponse } from "next/server"
import { syncAllVenues } from "@/lib/event-sync"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const results = await syncAllVenues()
    const totalFB = results.reduce((s, r) => s + r.fb, 0)
    const totalIG = results.reduce((s, r) => s + r.ig, 0)
    const totalRA = results.reduce((s, r) => s + r.ra, 0)
    const totalTM = results.reduce((s, r) => s + r.ticketmaster, 0)
    const errors  = results.flatMap((r) => r.errors.map((e) => `${r.venue}: ${e}`))

    return NextResponse.json({
      ok: true,
      synced: { facebook: totalFB, instagram: totalIG, ra: totalRA, ticketmaster: totalTM, total: totalFB + totalIG + totalRA + totalTM },
      venues: results,
      errors,
    })
  } catch (err) {
    console.error("[events/sync] Fatal error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
