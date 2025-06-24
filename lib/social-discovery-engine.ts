import { InstagramWebScraper, type ScrapedPost } from "./instagram-web-scraper"

export interface DiscoveredEvent {
  id: string
  title: string
  description: string
  venue: string
  city: string
  date: string
  time?: string
  price?: string
  image: string
  source: "instagram" | "facebook"
  sourceUrl: string
  engagement: {
    likes: number
    comments: number
  }
  confidence: number
  tags: string[]
}

export interface DiscoveredVenue {
  name: string
  city: string
  category: string
  mentions: number
  avgEngagement: number
  recentActivity: boolean
  confidence: number
  suggestedInfo: {
    description: string
    priceRange: string
    popularTimes: string[]
  }
}

export class SocialDiscoveryEngine {
  private scraper: InstagramWebScraper

  // Comprehensive hashtag strategy for Mannheim & Heidelberg
  private targetHashtags = [
    // Mannheim specific
    "#mannheim",
    "#mannheimcity",
    "#mannheimnightlife",
    "#mannheimbar",
    "#mannheimclub",
    "#mannheimparty",
    "#mannheimevent",
    "#quadrate",
    "#jungbusch",
    "#neckarstadt",

    // Heidelberg specific
    "#heidelberg",
    "#heidelbergcity",
    "#heidelbergnightlife",
    "#heidelbergbar",
    "#heidelbergclub",
    "#heidelbergparty",
    "#heidelbergevent",
    "#altstadt",
    "#bergheim",
    "#weststadt",

    // General activity hashtags
    "#nightlife",
    "#party",
    "#livemusic",
    "#dj",
    "#cocktails",
    "#rooftop",
    "#afterwork",
    "#weekend",
    "#drinks",
    "#food",
  ]

  constructor() {
    this.scraper = new InstagramWebScraper()
  }

  async runFullDiscovery(): Promise<{
    events: DiscoveredEvent[]
    venues: DiscoveredVenue[]
    stats: {
      totalPosts: number
      eventPosts: number
      uniqueVenues: number
      avgEngagement: number
      discoveryTime: number
      breakdown: {
        mannheim: number
        heidelberg: number
        highConfidence: number
      }
    }
  }> {
    console.log("🚀 Starting comprehensive social media discovery...")
    const startTime = Date.now()

    // 1. Scrape from multiple hashtags
    console.log("📸 Scraping Instagram hashtags...")
    const posts = await this.scraper.scrapeMultipleHashtags(this.targetHashtags, 12)

    // 2. Scrape specific locations
    console.log("📍 Scraping specific locations...")
    const locationPosts = await this.scrapePopularLocations()
    posts.push(...locationPosts)

    // 3. Convert posts to events
    console.log("🎉 Converting posts to events...")
    const events = this.convertPostsToEvents(posts)

    // 4. Discover venues
    console.log("🏢 Analyzing venues...")
    const venues = this.discoverVenues(posts)

    // 5. Generate stats
    const stats = {
      totalPosts: posts.length,
      eventPosts: events.length,
      uniqueVenues: venues.length,
      avgEngagement: posts.reduce((sum, p) => sum + p.likes + p.comments, 0) / posts.length,
      discoveryTime: Date.now() - startTime,
      breakdown: {
        mannheim: events.filter((e) => e.city === "Mannheim").length,
        heidelberg: events.filter((e) => e.city === "Heidelberg").length,
        highConfidence: events.filter((e) => e.confidence > 0.7).length,
      },
    }

    console.log("✅ Discovery complete:", stats)

    return {
      events: events.sort((a, b) => b.confidence - a.confidence),
      venues: venues.sort((a, b) => b.confidence - a.confidence),
      stats,
    }
  }

  private async scrapePopularLocations(): Promise<ScrapedPost[]> {
    const locations = [
      "Mannheim Quadrate",
      "Mannheim Jungbusch",
      "Heidelberg Altstadt",
      "Heidelberg Bergheim",
      "Skybar Mannheim",
      "MS Connexion",
      "Karlstorbahnhof",
    ]

    const allPosts: ScrapedPost[] = []

    for (const location of locations) {
      try {
        const posts = await this.scraper.scrapeLocation(location, 8)
        allPosts.push(...posts)
      } catch (error) {
        console.error(`Error scraping location ${location}:`, error)
      }
    }

    return allPosts
  }

  private convertPostsToEvents(posts: ScrapedPost[]): DiscoveredEvent[] {
    return posts
      .filter((post) => post.eventData?.isEvent)
      .map((post) => ({
        id: post.id,
        title: post.eventData?.extractedInfo?.title || this.extractTitle(post.caption),
        description: post.caption,
        venue: post.venue,
        city: post.city,
        date: new Date(post.timestamp).toISOString().split("T")[0],
        time: post.eventData?.extractedInfo?.time,
        price: post.eventData?.extractedInfo?.price,
        image: post.image_url,
        source: "instagram" as const,
        sourceUrl: `https://instagram.com/p/${post.id}`,
        engagement: {
          likes: post.likes,
          comments: post.comments,
        },
        confidence: post.eventData?.confidence || 0.5,
        tags: post.hashtags,
      }))
  }

  private discoverVenues(posts: ScrapedPost[]): DiscoveredVenue[] {
    const venueMap = new Map<string, any>()

    posts.forEach((post) => {
      if (!venueMap.has(post.venue)) {
        venueMap.set(post.venue, {
          mentions: 0,
          totalEngagement: 0,
          posts: [],
          city: post.city,
          categories: new Set(),
        })
      }

      const venue = venueMap.get(post.venue)!
      venue.mentions++
      venue.totalEngagement += post.likes + post.comments
      venue.posts.push(post)

      // Infer category from post content
      const category = this.inferVenueCategory(post.caption)
      if (category) venue.categories.add(category)
    })

    const venues: DiscoveredVenue[] = []

    venueMap.forEach((data, venueName) => {
      if (data.mentions >= 2) {
        // Minimum 2 mentions to be considered
        venues.push({
          name: venueName,
          city: data.city,
          category: Array.from(data.categories)[0] || "Entertainment",
          mentions: data.mentions,
          avgEngagement: data.totalEngagement / data.mentions,
          recentActivity: data.posts.some(
            (p: ScrapedPost) => Date.now() - new Date(p.timestamp).getTime() < 48 * 60 * 60 * 1000,
          ),
          confidence: Math.min(data.mentions * 0.25 + data.totalEngagement / 1000, 1),
          suggestedInfo: {
            description: `Popular venue with ${data.mentions} recent social media mentions`,
            priceRange: this.estimatePriceRange(data.posts),
            popularTimes: this.extractPopularTimes(data.posts),
          },
        })
      }
    })

    return venues
  }

  private extractTitle(caption: string): string {
    const firstLine = caption
      .split("!")[0]
      .replace(/[🎉🎵🍸🌆🎊🍻🥐🎧🔥💃]/gu, "")
      .trim()
    return firstLine.length > 10 ? firstLine.slice(0, 60) : "Social Media Event"
  }

  private inferVenueCategory(content: string): string | null {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes("bar") || lowerContent.includes("cocktail")) return "Bar"
    if (lowerContent.includes("club") || lowerContent.includes("party")) return "Nightclub"
    if (lowerContent.includes("restaurant") || lowerContent.includes("food")) return "Restaurant"
    if (lowerContent.includes("music") || lowerContent.includes("concert")) return "Music Venue"
    if (lowerContent.includes("rooftop")) return "Rooftop Bar"
    if (lowerContent.includes("cafe") || lowerContent.includes("coffee")) return "Cafe"

    return null
  }

  private estimatePriceRange(posts: ScrapedPost[]): string {
    const prices = posts
      .map((p) => p.caption.match(/€(\d+)/))
      .filter((match) => match)
      .map((match) => Number.parseInt(match![1]))
      .filter((price) => price > 0 && price < 100)

    if (prices.length === 0) return "€€"

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    if (avgPrice < 15) return "€"
    if (avgPrice < 30) return "€€"
    return "€€€"
  }

  private extractPopularTimes(posts: ScrapedPost[]): string[] {
    const times = posts
      .map((p) => p.caption.match(/(\d{1,2}:\d{2})/))
      .filter((match) => match)
      .map((match) => match![1])

    return [...new Set(times)].slice(0, 3)
  }
}
