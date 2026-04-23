# Szene App — Claude Instructions

## Project Overview
Szene is a nightlife discovery app for Mannheim, Heidelberg & Frankfurt. It surfaces events, clubs, bars, cafés, and brunch spots powered by an AI discovery engine.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark theme — `bg-black` / `bg-zinc-950`, violet accent `violet-600`)
- **UI Components:** Radix UI primitives via shadcn/ui (`src/components/ui/`)
- **Database:** PostgreSQL via Prisma (`src/lib/db.ts`)
- **Auth:** JWT (`jsonwebtoken`) + bcrypt, `httpOnly` cookie `auth-token`
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`)
- **Mobile:** Capacitor (iOS + Android)
- **Forms/Validation:** Zod + react-hook-form
- **Email:** Resend

## Project Structure
```
src/
  app/               # Next.js App Router pages & API routes
    api/             # REST API routes
      auth/login     # POST — JWT login
      auth/register  # POST — user registration
  components/        # React components
    ui/              # shadcn/ui primitives (don't modify directly)
    app-shell.tsx    # Main tabbed shell (foryou / discover / map / social)
    ai-chat.tsx      # Floating AI chat overlay
    header.tsx       # Sticky header with go() navigation
    hero.tsx         # Hero section with city picker
    footer.tsx       # Footer with go() navigation
  contexts/          # React contexts (language-context)
  hooks/             # Custom hooks (use-auth, use-favorites, use-mobile)
  lib/               # Utilities, DB client, AI, scrapers
  prisma/            # Prisma schema & migrations
```

## Navigation Pattern
The homepage uses a central `go({ city?, tab? })` function passed as a prop to every major component. Use this instead of `router.push` for in-page navigation.

## Design System
- **Background:** `bg-black` (page) / `bg-zinc-900` (cards)
- **Accent:** `violet-600` / `violet-500` (hover)
- **Text:** `text-white` (primary), `text-zinc-400` (secondary), `text-zinc-600` (muted)
- **Borders:** `border-white/8` or `border-white/10`
- **Rounded:** `rounded-xl` or `rounded-2xl`
- **Glow effects:** `blur-[120px]` divs with low-opacity violet/blue backgrounds

## Key Rules
- Always use the dark theme — no `bg-white` or light-mode classes.
- Prefer editing existing files over creating new ones.
- Don't add unnecessary comments, docstrings, or type annotations to unchanged code.
- Don't add error handling for impossible scenarios.
- API routes use Zod for input validation.
- Auth API returns generic error messages to avoid user enumeration.
- Run `yarn dev` (not `npm run dev`) to start the dev server.

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWTs
- `ANTHROPIC_API_KEY` — Anthropic API key for AI features

## Cities Supported
`mannheim` | `heidelberg` | `frankfurt`
