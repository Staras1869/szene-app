/**
 * GET /api/instagram/token
 *
 * Returns diagnostics for META_ACCESS_TOKEN + META_IG_BUSINESS_ID.
 * This is intended for local/dev validation only.
 */
import { type NextRequest, NextResponse } from "next/server"
import { debugMetaAccessToken } from "@/lib/instagram-graph"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Token diagnostics are disabled in production" }, { status: 403 })
    }

    const info = await debugMetaAccessToken()

    return NextResponse.json({ info }, {
        headers: { "Cache-Control": "no-store" },
    })
}
