export interface SocialMediaPost {
  id: string
  platform: "instagram" | "facebook" | "tiktok"
  author: string
  content: string
  hashtags: string[]
  location?: {
    name: string
    coordinates?: { lat: number; lng: number }
    city: string
  }
  engagement: {
    likes: number
    comments: number
    shares?: number
  }
  mediaUrl?: string
  timestamp: string
  eventIndicators: {
    isEvent: boolean
    confidence: number
    extractedInfo?: {
      title?: string
      date?: string
      time?: string
      price?: string
      venue?: string
    }
  }
}

export interface DiscoveredVenue {
  name: string
  location: string
  city: string
  category: string
  confidence: number
  socialProof: {
    mentionCount: number
    avgEngagement: number
    recentActivity: boolean
  }
  discoveredFrom: SocialMediaPost[]
  suggestedInfo: {
    description?: string
    estimatedCategory?: string
    popularTimes?: string[]
    priceRange?: string
  }
}

export class SocialMediaDiscovery {
  private instagramHashtags = [
    // Location-based
    "#mannheim",
    "#heidelberg",
    "#mannheimcity",
    "#heidelbergcity",
    "#mannheimlife",
    "#heidelberglife",
    "#rheinpfalz",
    "#badenwürttemberg",

    // Venue types
    "#mannheimbar",
    "#mannheimrestaurant",
    "#mannheimclub",
    "#mannheimnightlife",
    "#heidelbergbar",
    "#heidelbergrestaurant",
    "#heidelbergclub",
    "#heidelbergnightlife",

    // Activity-based
    "#mannheimparty",
    "#mannheimevent",
    "#mannheimfood",
    "#mannheimdrinks",
    "#heidelbergparty",
    "#heidelbergevent",
    "#heidelbergfood",
    "#heidelbergdrinks",

    // Specific areas
    "#mannheimquadrate",
    "#mannheimjungbusch",
    "#mannheimneckarstadt",
    "#heidelbergaltstadt",
    "#heidelbergbergheim",
    "#heidelbergrohrbach",

    // Event types
    "#livemusic",
    "#dj",
    "#cocktails",
    "#rooftop",
    "#terrace",
    "#biergarten",
    "#brunch",
    "#afterwork",
    "#weekend",
    "#party",
    "#event",
    "#konzert",
  ]

  private eventKeywords = [
    // German event keywords
    "event",
    "party",
    "konzert",
    "live",
    "dj",
    "musik",
    "show",
    "festival",
    "heute",
    "tonight",
    "weekend",
    "samstag",
    "freitag",
    "donnerstag",
    "ab",
    "uhr",
    "einlass",
    "eintritt",
    "tickets",
    "reservierung",

    // English event keywords
    "tonight",
    "this weekend",
    "live music",
    "dj set",
    "happy hour",
    "opening",
    "grand opening",
    "new",
    "special",
    "limited",

    // Time indicators
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "18 uhr",
    "19 uhr",
    "20 uhr",

    // Price indicators
    "€",
    "euro",
    "free",
    "kostenlos",
    "gratis",
    "eintritt frei",
  ]

  async discoverFromInstagramHashtags(hashtags: string[] = this.instagramHashtags): Promise<SocialMediaPost[]> {
    console.log(`📸 Discovering from ${hashtags.length} Instagram hashtags...`)

    const allPosts: SocialMediaPost[] = []

    for (const hashtag of hashtags) {
      try {
        // In production, you'd use Instagram Basic Display API or Instagram Graph API
        const posts = await this.scrapeInstagramHashtag(hashtag)
        allPosts.push(...posts)

        // Rate limiting - Instagram is strict about this
        await this.delay(2000)
      } catch (error) {
        console.error(`Error scraping hashtag ${hashtag}:`, error)
      }
    }

    return this.filterAndRankPosts(allPosts)
  }

  async discoverFromFacebookEvents(cities: string[] = ["Mannheim", "Heidelberg"]): Promise<SocialMediaPost[]> {
    console.log(`📘 Discovering Facebook events in ${cities.join(", ")}...`)

    const allPosts: SocialMediaPost[] = []

    for (const city of cities) {
      try {
        // Use Facebook Graph API to find events
        const events = await this.scrapeFacebookEvents(city)
        allPosts.push(...events)

        await this.delay(1500)
      } catch (error) {
        console.error(`Error scraping Facebook events in ${city}:`, error)
      }
    }

    return allPosts
  }

  async discoverFromLocationStories(locations: string[]): Promise<SocialMediaPost[]> {
    console.log(`📍 Discovering from location stories...`)

    const allPosts: SocialMediaPost[] = []

    for (const location of locations) {
      try {
        // Scrape Instagram/Facebook stories from specific locations
        const stories = await this.scrapeLocationStories(location)
        allPosts.push(...stories)

        await this.delay(3000) // Stories are more sensitive
      } catch (error) {
        console.error(`Error scraping stories from ${location}:`, error)
      }
    }

    return allPosts
  }

  private async scrapeInstagramHashtag(hashtag: string): Promise<SocialMediaPost[]> {
    console.warn(`[social-media-discovery] Instagram hashtag scraping not implemented; skipping #${hashtag}`)
    return []
  }

  private async scrapeFacebookEvents(city: string): Promise<SocialMediaPost[]> {
    console.warn(`[social-media-discovery] Facebook event scraping not implemented; skipping city ${city}`)
    return []
  }

  private async scrapeLocationStories(location: string): Promise<SocialMediaPost[]> {
    console.warn(`[social-media-discovery] Location story scraping not implemented; skipping location ${location}`)
    return []
  }

  private generateRealisticInstagramPost(_: string): SocialMediaPost {
    console.warn("[social-media-discovery] Instagram demo generation disabled. No fake posts will be returned.")
    return {
      id: `disabled_${Date.now()}`,
      platform: "instagram",
      author: "",
      content: "",
      hashtags: [],
      location: {
        name: "",
        city: "",
      },
      engagement: {
        likes: 0,
        comments: 0,
      },
      timestamp: new Date().toISOString(),
      eventIndicators: { isEvent: false, confidence: 0 },
    }
  }

  private generateRealisticFacebookEvent(_: string): SocialMediaPost {
    console.warn("[social-media-discovery] Facebook demo generation disabled. No fake events will be returned.")
    return {
      id: `disabled_${Date.now()}`,
      platform: "facebook",
      author: "",
      content: "",
      hashtags: [],
      location: {
        name: "",
        city: "",
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
      timestamp: new Date().toISOString(),
      eventIndicators: { isEvent: false, confidence: 0 },
    }
  }

  private generateRealisticLocationStory(_: string): SocialMediaPost {
    console.warn("[social-media-discovery] Story demo generation disabled. No fake stories will be returned.")
    return {
      id: `disabled_${Date.now()}`,
      platform: "instagram",
      author: "",
      content: "",
      hashtags: [],
      location: {
        name: "",
        city: "",
      },
      engagement: {
        likes: 0,
        comments: 0,
      },
      timestamp: new Date().toISOString(),
      eventIndicators: { isEvent: false, confidence: 0 },
    }
  }

  private analyzeEventContent(content: string): { isEvent: boolean; confidence: number; extractedInfo?: any } {
    const lowerContent = content.toLowerCase()
    let confidence = 0
    let isEvent = false

    // Check for event keywords
    const eventKeywordMatches = this.eventKeywords.filter((keyword) =>
      lowerContent.includes(keyword.toLowerCase()),
    ).length

    confidence += eventKeywordMatches * 0.15

    // Check for time patterns
    const timePattern = /(\d{1,2}):(\d{2})|(\d{1,2})\s*uhr/gi
    if (timePattern.test(content)) {
      confidence += 0.3
      isEvent = true
    }

    // Check for price patterns
    const pricePattern = /€\s*\d+|euro|kostenlos|free|gratis/gi
    if (pricePattern.test(content)) {
      confidence += 0.2
      isEvent = true
    }

    // Check for date patterns
    const datePattern = /heute|tonight|weekend|samstag|freitag|saturday|friday/gi
    if (datePattern.test(content)) {
      confidence += 0.25
      isEvent = true
    }

    isEvent = isEvent || confidence > 0.4

    return {
      isEvent,
      confidence: Math.min(confidence, 1),
      extractedInfo: isEvent ? this.extractEventInfo(content) : undefined,
    }
  }

  private extractEventInfo(content: string): any {
    const timeMatch = content.match(/(\d{1,2}):(\d{2})|(\d{1,2})\s*uhr/i)
    const priceMatch = content.match(/€\s*(\d+)|(\d+)\s*euro/i)
    const venueMatch = content.match(/at\s+([^!.]+)|bei\s+([^!.]+)/i)

    return {
      time: timeMatch ? timeMatch[0] : undefined,
      price: priceMatch ? `€${priceMatch[1] || priceMatch[2]}` : undefined,
      venue: venueMatch ? (venueMatch[1] || venueMatch[2])?.trim() : undefined,
    }
  }

  private filterAndRankPosts(posts: SocialMediaPost[]): SocialMediaPost[] {
    // Filter for high-quality, recent posts
    const filtered = posts.filter((post) => {
      const daysSincePost = (Date.now() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      return (
        daysSincePost <= 7 && // Within last week
        post.engagement.likes >= 10 && // Minimum engagement
        post.content.length >= 20
      ) // Substantial content
    })

    // Rank by engagement and event confidence
    return filtered
      .sort((a, b) => {
        const scoreA = a.engagement.likes + a.eventIndicators.confidence * 100
        const scoreB = b.engagement.likes + b.eventIndicators.confidence * 100
        return scoreB - scoreA
      })
      .slice(0, 50) // Top 50 posts
  }

  async discoverNewVenues(posts: SocialMediaPost[]): Promise<DiscoveredVenue[]> {
    console.log(`🔍 Analyzing ${posts.length} posts for new venues...`)

    const venueMap = new Map<
      string,
      {
        posts: SocialMediaPost[]
        totalEngagement: number
        categories: string[]
      }
    >()

    // Group posts by venue/location
    posts.forEach((post) => {
      if (post.location?.name) {
        const venueName = post.location.name
        if (!venueMap.has(venueName)) {
          venueMap.set(venueName, {
            posts: [],
            totalEngagement: 0,
            categories: [],
          })
        }

        const venue = venueMap.get(venueName)!
        venue.posts.push(post)
        venue.totalEngagement += post.engagement.likes + post.engagement.comments

        // Infer category from content
        const category = this.inferVenueCategory(post.content)
        if (category && !venue.categories.includes(category)) {
          venue.categories.push(category)
        }
      }
    })

    // Convert to DiscoveredVenue objects
    const discoveredVenues: DiscoveredVenue[] = []

    venueMap.forEach((data, venueName) => {
      if (data.posts.length >= 2) {
        // Minimum 2 mentions to be considered
        discoveredVenues.push({
          name: venueName,
          location: data.posts[0].location?.name || venueName,
          city: data.posts[0].location?.city || "Unknown",
          category: data.categories[0] || "Social",
          confidence: Math.min(data.posts.length * 0.2 + data.totalEngagement / 1000, 1),
          socialProof: {
            mentionCount: data.posts.length,
            avgEngagement: data.totalEngagement / data.posts.length,
            recentActivity: data.posts.some((p) => Date.now() - new Date(p.timestamp).getTime() < 48 * 60 * 60 * 1000),
          },
          discoveredFrom: data.posts,
          suggestedInfo: {
            description: this.generateVenueDescription(data.posts),
            estimatedCategory: data.categories[0],
            popularTimes: this.extractPopularTimes(data.posts),
            priceRange: this.estimatePriceRange(data.posts),
          },
        })
      }
    })

    return discoveredVenues.sort((a, b) => b.confidence - a.confidence)
  }

  private inferVenueCategory(content: string): string | null {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes("bar") || lowerContent.includes("cocktail") || lowerContent.includes("drinks")) {
      return "Nightlife"
    }
    if (lowerContent.includes("restaurant") || lowerContent.includes("food") || lowerContent.includes("essen")) {
      return "Food"
    }
    if (lowerContent.includes("club") || lowerContent.includes("party") || lowerContent.includes("dj")) {
      return "Nightlife"
    }
    if (lowerContent.includes("music") || lowerContent.includes("concert") || lowerContent.includes("live")) {
      return "Music"
    }
    if (lowerContent.includes("art") || lowerContent.includes("gallery") || lowerContent.includes("culture")) {
      return "Culture"
    }

    return null
  }

  private generateVenueDescription(posts: SocialMediaPost[]): string {
    const keywords = posts.flatMap((p) =>
      p.content
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 3 && !["the", "and", "for", "with", "this", "that"].includes(word)),
    )

    const topKeywords = [...new Set(keywords)].slice(0, 5)
    return `Popular spot known for ${topKeywords.join(", ")}. Frequently mentioned on social media.`
  }

  private extractPopularTimes(posts: SocialMediaPost[]): string[] {
    const times: string[] = []
    posts.forEach((post) => {
      const timeMatch = post.content.match(/(\d{1,2}):(\d{2})|(\d{1,2})\s*uhr/gi)
      if (timeMatch) {
        times.push(...timeMatch)
      }
    })
    return [...new Set(times)].slice(0, 3)
  }

  private estimatePriceRange(posts: SocialMediaPost[]): string {
    const prices: number[] = []
    posts.forEach((post) => {
      const priceMatch = post.content.match(/€\s*(\d+)|(\d+)\s*euro/gi)
      if (priceMatch) {
        priceMatch.forEach((match) => {
          const num = Number.parseInt(match.replace(/[€euro\s]/g, ""))
          if (num > 0 && num < 100) prices.push(num)
        })
      }
    })

    if (prices.length === 0) return "€€"

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    if (avgPrice < 15) return "€"
    if (avgPrice < 30) return "€€"
    return "€€€"
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Main discovery method
  async runComprehensiveDiscovery(): Promise<{
    posts: SocialMediaPost[]
    events: SocialMediaPost[]
    newVenues: DiscoveredVenue[]
    stats: any
  }> {
    console.log("🚀 Starting comprehensive social media discovery...")

    const [instagramPosts, facebookEvents, locationStories] = await Promise.all([
      this.discoverFromInstagramHashtags(),
      this.discoverFromFacebookEvents(),
      this.discoverFromLocationStories([
        "Mannheim Quadrate",
        "Heidelberg Altstadt",
        "Mannheim Jungbusch",
        "Heidelberg Bergheim",
        "Mannheim Neckarstadt",
      ]),
    ])

    const allPosts = [...instagramPosts, ...facebookEvents, ...locationStories]
    const events = allPosts.filter((post) => post.eventIndicators.isEvent)
    const newVenues = await this.discoverNewVenues(allPosts)

    const stats = {
      totalPosts: allPosts.length,
      eventPosts: events.length,
      newVenuesFound: newVenues.length,
      avgEngagement: allPosts.length ? allPosts.reduce((sum, post) => sum + post.engagement.likes, 0) / allPosts.length : 0,
      platforms: {
        instagram: allPosts.filter((p) => p.platform === "instagram").length,
        facebook: allPosts.filter((p) => p.platform === "facebook").length,
      },
    }

    console.log("✅ Discovery complete:", stats)

    return { posts: allPosts, events, newVenues, stats }
  }
}
