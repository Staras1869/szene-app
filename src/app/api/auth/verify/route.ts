import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token || token.length !== 64 || !/^[a-f0-9]+$/.test(token)) {
    return NextResponse.redirect(new URL("/verify?status=invalid", request.url))
  }

  const user = await db.user.findUnique({ where: { verifyToken: token } })

  if (!user) {
    return NextResponse.redirect(new URL("/verify?status=invalid", request.url))
  }

  if (user.emailVerified) {
    return NextResponse.redirect(new URL("/verify?status=already", request.url))
  }

  if (!user.verifyExpires || user.verifyExpires < new Date()) {
    return NextResponse.redirect(new URL("/verify?status=expired", request.url))
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verifyToken:   null,
      verifyExpires: null,
    },
  })

  return NextResponse.redirect(new URL("/verify?status=ok", request.url))
}
