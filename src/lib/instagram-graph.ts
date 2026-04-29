/**
 * Meta Instagram Graph API v21.0
 *
 * Two legal, approved methods:
 *  1. Business Discovery — look up any public Instagram Business/Creator account by username.
 *     Perfect for fetching venue posts (we already have their IG handles in venue data).
 *  2. Hashtag Search — find recent public posts for a hashtag.
 *     Limited to 30 unique hashtags per 7 days per app.
 *
 * Required env vars:
 *   META_ACCESS_TOKEN      — Long-lived Page Access Token (never expires if refreshed)
 *   META_IG_BUSINESS_ID    — Your Szene Instagram Business Account ID (numeric)
 *
 * Setup guide:
 *   1. developers.facebook.com → Create App → Business type
 *   2. Add "Instagram Graph API" product
 *   3. Connect a Facebook Page + Instagram Business Account
 *   4. Request permissions: instagram_basic, pages_read_engagement,
 *      instagram_manage_hashtags, instagram_manage_insights
 *   5. Generate a long-lived Page Access Token via Graph API Explorer
 *   6. Get your IG Business Account ID:
 *      GET /me/accounts → get page id → GET /{page-id}?fields=instagram_business_account
 */

const BASE = "https://graph.facebook.com/v21.0"

function token() {
  return process.env.META_ACCESS_TOKEN ?? ""
}
function igId() {
  return process.env.META_IG_BUSINESS_ID ?? ""
}

function isConfigured(): boolean {
  return Boolean(token() && igId())
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IGMedia {
  id:             string
  caption?:       string
  media_type:     "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url?:     string
  thumbnail_url?: string  // VIDEO only
  permalink:      string
  timestamp:      string
  like_count?:    number
  comments_count?: number
}

export interface IGBusinessProfile {
  id:              string
  username:        string
  name?:           string
  biography?:      string
  followers_count: number
  media_count:     number
  profile_picture_url?: string
  website?:        string
  media?:          { data: IGMedia[] }
}

// ─── Hashtag Search ───────────────────────────────────────────────────────────

const hashtagIdCache = new Map<string, { id: string; fetchedAt: number }>()
const HASHTAG_CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days — IDs are stable

/**
 * Get the internal IG hashtag ID for a tag string.
 * Results are cached for 7 days (IDs are stable and the 30-hashtag/week limit applies to lookups).
 */
async function getHashtagId(hashtag: string): Promise<string | null> {
  const clean = hashtag.replace(/^#/, "").toLowerCase()
  const cached = hashtagIdCache.get(clean)
  if (cached && Date.now() - cached.fetchedAt < HASHTAG_CACHE_TTL) return cached.id

  const url = `${BASE}/ig_hashtag_search?user_id=${igId()}&q=${encodeURIComponent(clean)}&access_token=${token()}`
  const res  = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) {
    console.error(`[ig] hashtag ID fetch failed: ${res.status}`, await res.text().catch(() => ""))
    return null
  }
  const data = await res.json()
  const id   = data.data?.[0]?.id
  if (id) hashtagIdCache.set(clean, { id, fetchedAt: Date.now() })
  return id ?? null
}

/**
 * Fetch recent public posts for a hashtag.
 * Uses TOP_MEDIA for quality signal (or RECENT_MEDIA for recency).
 */
export async function searchHashtag(
  hashtag: string,
  limit = 12,
  type: "top_media" | "recent_media" = "top_media"
): Promise<IGMedia[]> {
  if (!isConfigured()) return []

  const hashtagId = await getHashtagId(hashtag)
  if (!hashtagId) return []

  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count"
  const url = `${BASE}/${hashtagId}/${type}?user_id=${igId()}&fields=${fields}&limit=${limit}&access_token=${token()}`

  const res = await fetch(url, { next: { revalidate: 900 } }) // 15min cache
  if (!res.ok) {
    console.error(`[ig] hashtag media fetch failed: ${res.status}`)
    return []
  }
  const data = await res.json()
  return data.data ?? []
}

// ─── Business Discovery ───────────────────────────────────────────────────────

/**
 * Fetch public profile + recent posts from any Instagram Business/Creator account.
 * The target account must be a Business or Creator account (not personal).
 * Returns null if account not found or not a business account.
 */
export async function getBusinessProfile(
  username: string,
  postLimit = 6
): Promise<IGBusinessProfile | null> {
  if (!isConfigured()) return null

  const mediaFields = `media.limit(${postLimit}){id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count}`
  const fields      = `business_discovery.as(target){username,name,biography,followers_count,media_count,profile_picture_url,website,${mediaFields}}`

  const url = `${BASE}/${igId()}?fields=${fields}&business_discovery={"username":"${encodeURIComponent(username)}"}&access_token=${token()}`

  const res = await fetch(url, { next: { revalidate: 3600 } }) // 1h cache
  if (!res.ok) {
    // 400 usually means the account isn't a business account — not an error worth surfacing
    if (res.status !== 400) console.error(`[ig] business discovery failed for @${username}: ${res.status}`)
    return null
  }
  const data = await res.json()
  return data.target ?? null
}

// ─── City feed ────────────────────────────────────────────────────────────────

const CITY_HASHTAGS: Record<string, string[]> = {
  mannheim:   ["mannheimnightlife", "mannheimparty", "jungbusch", "msconnexion"],
  heidelberg: ["heidelbergnightlife", "heidelbergparty", "halle02", "cave54hd"],
  frankfurt:  ["frankfurtnightlife", "ffmnightlife", "robertjohnson"],
  stuttgart:  ["stuttgartnightlife", "stuttgartparty", "perkinspark"],
  karlsruhe:  ["karlsruhenightlife", "karlsruheparty", "substage"],
  berlin:     ["berghain", "berlinnightlife", "berlinclubs", "technoberlin"],
  munich:     ["muenchennightlife", "muenchenparty", "harryklein"],
  cologne:    ["koelnnightlife", "koelnparty", "bootshaus"],
}

/**
 * Fetch a blended city nightlife feed from top hashtags.
 * Returns up to `limit` posts, deduplicated by ID.
 */
export async function getCityFeed(city: string, limit = 20): Promise<IGMedia[]> {
  if (!isConfigured()) return []

  const tags = CITY_HASHTAGS[city] ?? CITY_HASHTAGS.mannheim
  // Fetch first 2 hashtags to stay within the 30/week limit
  const results = await Promise.allSettled(
    tags.slice(0, 2).map(tag => searchHashtag(tag, Math.ceil(limit / 2)))
  )

  const seen = new Set<string>()
  const posts: IGMedia[] = []
  for (const r of results) {
    if (r.status !== "fulfilled") continue
    for (const post of r.value) {
      if (!seen.has(post.id)) {
        seen.add(post.id)
        posts.push(post)
      }
    }
  }
  return posts.slice(0, limit)
}
