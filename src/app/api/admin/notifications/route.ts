import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const id = body?.id
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

        const note = await prisma.adminNotification.update({
            where: { id },
            data: { resolved: true, resolvedAt: new Date() },
        })

        return NextResponse.json({ success: true, note })
    } catch (err) {
        console.error("[admin/notifications] resolve error:", err)
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}
