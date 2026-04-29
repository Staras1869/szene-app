/**
 * GET /api/instagram/hashtag?tag=berghain&limit=12&type=top_media
 *
 * Returns recent/top public posts for a hashtag.
 * Uses Meta Graph API Hashtag Search — legal, approved endpoint.
 * Note: limited to 30 unique hashtags per 7 days per app.
 */
import { type NextRequest, NextResponse } from "next/server"
import { searchHashtag } from "@/lib/instagram-graph"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const tag   = req.nextUrl.searchParams.get("tag")?.replace(/^#/, "").trim()
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "12", 10), 50)
  const type  = req.nextUrl.searchParams.get("type") === "recent_media" ? "recent_media" : "top_media"

  if (!tag) {
    return NextResponse.json({ error: "Missing tag parameter" }, { status: 400 })
  }

  const posts = await searchHashtag(tag, limit, type)

  return NextResponse.json({ tag, posts }, {
    headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=3600" },
  })
}
