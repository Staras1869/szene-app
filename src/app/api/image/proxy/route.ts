import { NextRequest, NextResponse } from "next/server"
import { getCachedImageBuffer } from "@/lib/image-cache"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url")
    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
    }

    try {
        const { buffer, contentType } = await getCachedImageBuffer(url)
        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
        })
    } catch (error) {
        console.error("/api/image/proxy error:", error)
        return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 })
    }
}
