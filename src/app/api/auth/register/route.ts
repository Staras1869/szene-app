import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"

const RegisterSchema = z.object({
  email:    z.string().email("Invalid email address").max(255),
  name:     z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "Invalid input."
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { email, name, password } = parsed.data
    const normalisedEmail = email.toLowerCase()

    const existing = await db.user.findUnique({ where: { email: normalisedEmail } })
    if (existing) {
      // Don't reveal existence — use same-sounding message
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: { email: normalisedEmail, name, hashedPassword },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
