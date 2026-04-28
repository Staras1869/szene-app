import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { db } from "@/lib/db"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error("[security] JWT_SECRET is not set — auth will not work correctly in production.")
    return "dev-only-insecure-secret-do-not-use-in-prod"
  }
  if (secret.length < 32) {
    console.warn("[security] JWT_SECRET is shorter than 32 characters — consider rotating to a stronger secret.")
  }
  return secret
}

const JWT_SECRET = getJwtSecret()

// ---------------------------------------------------------------------------
// In-memory account lockout (per email, per process)
// Locks account for LOCKOUT_MS after MAX_FAILURES consecutive failures.
// For multi-instance deployments, move this to Redis/DB.
// ---------------------------------------------------------------------------
const LOCKOUT_MAP = new Map<string, { failures: number; lockedUntil: number }>()
const MAX_FAILURES = 5
const LOCKOUT_MS   = 15 * 60 * 1000  // 15 minutes

function checkLockout(email: string): { locked: boolean; retryAfterSec: number } {
  const entry = LOCKOUT_MAP.get(email)
  if (!entry) return { locked: false, retryAfterSec: 0 }
  if (entry.lockedUntil > Date.now()) {
    return { locked: true, retryAfterSec: Math.ceil((entry.lockedUntil - Date.now()) / 1000) }
  }
  return { locked: false, retryAfterSec: 0 }
}

function recordFailure(email: string) {
  const entry = LOCKOUT_MAP.get(email) ?? { failures: 0, lockedUntil: 0 }
  entry.failures += 1
  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS
  }
  LOCKOUT_MAP.set(email, entry)
}

function clearFailures(email: string) {
  LOCKOUT_MAP.delete(email)
}

const LoginSchema = z.object({
  email:    z.string().email("Invalid email address").max(255),
  password: z.string().min(1).max(128),
})

const INVALID = "Invalid email or password."

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try { body = await request.json() } catch { return NextResponse.json({ error: INVALID }, { status: 400 }) }

    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    const { email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    // ── Lockout check ────────────────────────────────────────────────────────
    const lockout = checkLockout(normalizedEmail)
    if (lockout.locked) {
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${Math.ceil(lockout.retryAfterSec / 60)} minutes.` },
        { status: 429, headers: { "Retry-After": String(lockout.retryAfterSec) } }
      )
    }

    const user = await db.user.findUnique({ where: { email: normalizedEmail } })

    if (!user?.hashedPassword) {
      // Always run bcrypt so timing is constant whether user exists or not
      await bcrypt.compare(password, "$2b$12$dummyhashfortimingconstantequal.")
      recordFailure(normalizedEmail)
      return NextResponse.json({ error: INVALID }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isValid) {
      recordFailure(normalizedEmail)
      return NextResponse.json({ error: INVALID }, { status: 401 })
    }

    // Success — clear lockout
    clearFailures(normalizedEmail)

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    )

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    })

    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return res
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
