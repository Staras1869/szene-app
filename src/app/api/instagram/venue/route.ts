/**
 * GET /api/instagram/venue?handle=msconnexion_mannheim&limit=6
 *
 * Returns public profile + recent posts from an Instagram Business/Creator account.
 * Uses Meta Graph API Business Discovery — fully legal, no scraping.
 */
import { type NextRequest, NextResponse } from "next/server"
import { getBusinessProfile } from "@/lib/instagram-graph"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle")?.replace(/^@/, "").trim()
  const limit  = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "6", 10), 12)

  if (!handle) {
    return NextResponse.json({ error: "Missing handle parameter" }, { status: 400 })
  }

  const profile = await getBusinessProfile(handle, limit)

  if (!profile) {
    return NextResponse.json({ error: "Profile not found or not a business account" }, { status: 404 })
  }

  return NextResponse.json(profile, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
  })
}
