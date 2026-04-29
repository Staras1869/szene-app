/**
 * GET /api/instagram/feed?city=mannheim&limit=20
 *
 * Returns a blended city nightlife feed from top city hashtags.
 * Deduplicated, cached 15 minutes.
 */
import { type NextRequest, NextResponse } from "next/server"
import { getCityFeed } from "@/lib/instagram-graph"

export const runtime = "nodejs"

const VALID_CITIES = new Set(["mannheim","heidelberg","frankfurt","stuttgart","karlsruhe","berlin","munich","cologne"])

export async function GET(req: NextRequest) {
  const city  = req.nextUrl.searchParams.get("city")?.toLowerCase().trim() ?? "mannheim"
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10), 50)

  if (!VALID_CITIES.has(city)) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 })
  }

  const posts = await getCityFeed(city, limit)

  return NextResponse.json({ city, posts }, {
    headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=3600" },
  })
}
