# Szene App — To-Do Roadmap

> Last updated: 2026-06-10

---

## 🔴 Data Accuracy — do these first

- [ ] Replace all fake/demo data fallbacks — `instagram-api.ts` and `instagram-scraper.ts` silently return made-up posts when token is missing
- [ ] Wire `META_ACCESS_TOKEN` end-to-end — test Business Discovery (venue IG profiles) + Page Events; confirm token is long-lived with correct scopes (`instagram_basic`, `pages_read_engagement`, `instagram_manage_hashtags`)
- [ ] Build venue → IG handle map — link each venue in the DB to its real Instagram username so Business Discovery fetches real posts
- [ ] Add event deduplication — same event from RA + Ticketmaster + Facebook should merge into one record, not duplicate
- [ ] Add data freshness labels — show users when each source was last synced (e.g. "Updated 2h ago via Resident Advisor")

---

## 🟠 Broken / Incomplete Features

- [ ] Fix leaderboard — remove hardcoded seed padding (`[24, 18, 41, 33, 12][i % 5]`), derive rankings from real check-ins + RSVPs
- [ ] Complete event submission pipeline — admin approval exists but approved events don't auto-publish to the DB
- [ ] Wire Resend email — partner applications and event submissions need real confirmation emails (`RESEND_API_KEY` is set but not fully used)
- [ ] Test push notifications end-to-end — VAPID keys are configured but never verified on real iOS/Android via Capacitor
- [ ] Remove `OPENAI_API_KEY` references — app uses Anthropic only; dead env var in `automation/route.ts` causes confusion

---

## 🟡 New Features

- [ ] Venue claiming flow — let owners verify via email domain or Meta Page link, then post events directly from a dashboard
- [ ] Error monitoring (Sentry) — get alerted when RA / Ticketmaster / Meta sync breaks silently
