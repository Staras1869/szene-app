import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request)
  if (!user) return NextResponse.json({ user: null }, { status: 200 })
  return NextResponse.json({ user: { id: user.userId, email: user.email } })
}
