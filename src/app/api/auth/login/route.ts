import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production"

const LoginSchema = z.object({
  email:    z.string().email("Invalid email address").max(255),
  password: z.string().min(1).max(128),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 })
    }

    const { email, password } = parsed.data

    // Generic message — never reveal whether the email exists
    const INVALID = "Invalid email or password."

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user?.hashedPassword) {
      // Still compare a dummy hash so timing is consistent
      await bcrypt.compare(password, "$2b$12$dummyhashfortimingequalisation.")
      return NextResponse.json({ error: INVALID }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isValid) {
      return NextResponse.json({ error: INVALID }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    )

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
