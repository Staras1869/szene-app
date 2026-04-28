import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { z } from "zod"
import { db } from "@/lib/db"
import { sendEmail, verificationEmailHtml } from "@/lib/send-email"

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
    let body: unknown
    try { body = await request.json() } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }) }

    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 })
    }

    const { email, name, password } = parsed.data
    const normalisedEmail = email.toLowerCase().trim()

    const existing = await db.user.findUnique({ where: { email: normalisedEmail } })
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const verifyToken    = crypto.randomBytes(32).toString("hex")
    const verifyExpires  = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    const user = await db.user.create({
      data: {
        email: normalisedEmail,
        name,
        hashedPassword,
        emailVerified:  false,
        verifyToken,
        verifyExpires,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    // Send verification email — non-blocking, don't fail registration if email fails
    const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL ?? "https://szene.app"
    const verifyUrl = `${baseUrl}/api/auth/verify?token=${verifyToken}`
    sendEmail({
      to:      normalisedEmail,
      subject: "Bestätige deine E-Mail – Szene",
      html:    verificationEmailHtml(verifyUrl),
    }).catch(err => console.error("[register] email send failed:", err))

    return NextResponse.json(
      { user, message: "Account created. Please check your email to verify your account." },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
