import { type NextRequest, NextResponse } from "next/server"

/**
 * Edge middleware — runs before every request on Vercel's edge network.
 *
 * Responsibilities:
 *  1. Rate-limit auth + write endpoints (sliding-window, per IP)
 *  2. CORS — restrict API calls to same origin + app domain
 *  3. Block obviously malformed / attack requests
 *  4. Enforce request body size limits
 *  5. Strip server-identifying headers
 */

// ---------------------------------------------------------------------------
// Sliding-window rate-limiter (in-memory per edge instance)
// For production scale swap the Map for Upstash Redis:
//   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
// ---------------------------------------------------------------------------

interface RateEntry { count: number; windowStart: number }
const rateLimitStore = new Map<string, RateEntry>()

// Periodically clean up expired entries to prevent unbounded memory growth
let lastCleanup = Date.now()
function maybeCleanup(now: number) {
  if (now - lastCleanup < 120_000) return
  lastCleanup = now
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > 300_000) rateLimitStore.delete(key)
  }
}

const RULES: { pattern: RegExp; limit: number; windowMs: number }[] = [
  // Auth endpoints — tightest limits
  { pattern: /^\/api\/auth\/login/,    limit: 5,   windowMs: 60_000 },  // 5/min
  { pattern: /^\/api\/auth\/register/, limit: 3,   windowMs: 60_000 },  // 3/min
  // AI chat — expensive endpoint, limit tightly to prevent credit abuse
  { pattern: /^\/api\/chat/,           limit: 20,  windowMs: 60_000 },  // 20/min
  // Push subscribe — prevent spam subscriptions
  { pattern: /^\/api\/push/,           limit: 10,  windowMs: 60_000 },  // 10/min
  // Write endpoints — moderate
  { pattern: /^\/api\/reviews/,        limit: 30,  windowMs: 60_000 },
  { pattern: /^\/api\/checkins/,       limit: 20,  windowMs: 60_000 },
  { pattern: /^\/api\/favorites/,      limit: 60,  windowMs: 60_000 },
  { pattern: /^\/api\/rsvp/,           limit: 30,  windowMs: 60_000 },
  { pattern: /^\/api\/submit/,         limit: 10,  windowMs: 60_000 },
  { pattern: /^\/api\/newsletter/,     limit: 5,   windowMs: 60_000 },
  // Discovery / read endpoints — generous
  { pattern: /^\/api\//,               limit: 200, windowMs: 60_000 },
]

function rateLimit(ip: string, path: string): { ok: boolean; remaining: number; resetMs: number } {
  const rule = RULES.find((r) => r.pattern.test(path))
  if (!rule) return { ok: true, remaining: 999, resetMs: 0 }

  const key = `${ip}:${rule.pattern.source}`
  const now = Date.now()
  maybeCleanup(now)
  const entry = rateLimitStore.get(key)

  if (!entry || now - entry.windowStart > rule.windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return { ok: true, remaining: rule.limit - 1, resetMs: now + rule.windowMs }
  }

  entry.count += 1
  const remaining = Math.max(0, rule.limit - entry.count)
  const resetMs = entry.windowStart + rule.windowMs

  if (entry.count > rule.limit) {
    return { ok: false, remaining: 0, resetMs }
  }

  return { ok: true, remaining, resetMs }
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = new Set([
  "https://szene.app",
  "https://www.szene.app",
  // Allow Vercel preview deployments
])

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true // same-origin requests have no Origin header
  if (ALLOWED_ORIGINS.has(origin)) return true
  // Allow Vercel preview deployments (*.vercel.app)
  if (/^https:\/\/szene-[a-z0-9]+-stratos-projects-[a-z0-9]+\.vercel\.app$/.test(origin)) return true
  // Allow localhost in development
  if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) return true
  return false
}

// ---------------------------------------------------------------------------
// Attack pattern detection (URL-level — body is checked in each route handler)
// ---------------------------------------------------------------------------

// Path traversal, common LFI probes, XSS in URL, SQLi in URL
const URL_ATTACK = /(\.\.[/\\]|\/etc\/passwd|\/proc\/self|<script[\s>]|javascript:|union[\s+]select|drop[\s+]table|exec[\s+(]|0x[0-9a-f]{4,})/i

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get("origin")
  const method = request.method

  // ── CORS preflight ────────────────────────────────────────────────────────
  if (method === "OPTIONS" && pathname.startsWith("/api/")) {
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 })
    }
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin ?? "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin",
      },
    })
  }

  // ── Block cross-origin API calls from unknown origins ────────────────────
  if (pathname.startsWith("/api/") && origin && !isAllowedOrigin(origin)) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  const response = NextResponse.next()

  // ── CORS headers on actual API responses ─────────────────────────────────
  if (pathname.startsWith("/api/") && origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Vary", "Origin")
  }

  // ── Strip fingerprinting headers ──────────────────────────────────────────
  response.headers.delete("X-Powered-By")
  response.headers.delete("Server")

  // ── Block obvious URL-level attack patterns ───────────────────────────────
  const urlToCheck = pathname + (request.nextUrl.search ?? "")
  if (URL_ATTACK.test(decodeURIComponent(urlToCheck))) {
    return new NextResponse(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // ── Request body size guard (rejects oversized Content-Length before body is read) ──
  const contentLength = request.headers.get("content-length")
  if (contentLength) {
    const bytes = parseInt(contentLength, 10)
    const limit = pathname.startsWith("/api/chat") ? 32_768 : 65_536  // 32KB chat, 64KB others
    if (!isNaN(bytes) && bytes > limit) {
      return new NextResponse(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // ── Rate limiting (API routes only) ───────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown"

    const { ok, remaining, resetMs } = rateLimit(ip, pathname)

    response.headers.set("X-RateLimit-Remaining", String(remaining))
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)))

    if (!ok) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)",
  ],
}
