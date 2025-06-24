import { InstagramAPI } from "./instagram-api"
import { FacebookAPI } from "./facebook-api"

export interface DiscoveredEvent {
  id: string
  title: string
  description: string
  venue: string
  city: string
  date: string
  time?: string
  price?: string
  image?: string
  source: "instagram" | "facebook"
  sourceUrl: string
  engagement: {
    likes: number
    comments: number
    attending?: number
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
  discoveredFrom: string[]
}

export class EnhancedSocialDiscovery {
  private instagram: InstagramAPI
  private facebook: FacebookAPI

  // Comprehensive hashtag strategy
  private hashtags = {
    mannheim: [
      "#mannheim",
      "#mannheimcity",
      "#mannheimlife",
      "#mannheimnightlife",
      "#mannheimbar",
      "#mannheimrestaurant",
      "#mannheimclub",
      "#mannheimparty",
      "#mannheimevent",
      "#mannheimfood",
      "#mannheimdrinks",
      "#quadrate",
      "#jungbusch",
      "#neckarstadt",
      "#mannheimtoday",
      "#mannheimweekend",
    ],
    heidelberg: [
      "#heidelberg",
      "#heidelbergcity",
      "#heidelberglife",
      "#heidelbergnightlife",
      "#heidelbergbar",
      "#heidelbergrestaurant",
      "#heidelbergclub",
      "#heidelbergparty",
      "#heidelbergevent",
      "#heidelbergfood",
      "#heidelbergdrinks",
      "#altstadt",
      "#bergheim",
      "#rohrbach",
      "#heidelbergtoday",
      "#heidelbergweekend",
    ],
    general: [
      "#badenwürttemberg",
      "#rheinpfalz",
      "#germany",
      "#deutschland",
      "#nightlife",
      "#party",
      "#event",
      "#livemusic",
      "#dj",
      "#cocktails",
      "#rooftop",
      "#terrace",
      "#biergarten",
      "#brunch",
      "#afterwork",
    ],
  }

  // Known venue pages to monitor
  private venuePagesIds = [
    // Add real Facebook page IDs here
    "skybar.mannheim",
    "msconnexion.complex",
    "altefeuerwache.mannheim",
    "capitol.mannheim",
    "karlstorbahnhof",
  ]

  constructor() {
    this.instagram = new InstagramAPI()
    this.facebook = new FacebookAPI()
  }

  async discoverEvents(): Promise<{
    events: DiscoveredEvent[]
    venues: DiscoveredVenue[]
    stats: any
  }> {
    console.log("🚀 Starting enhanced social media discovery...")

    const startTime = Date.now()
    const allEvents: DiscoveredEvent[] = []
    const venueData = new Map<string, any>()

    // 1. Instagram hashtag discovery
    console.log("📸 Discovering from Instagram hashtags...")
    const instagramEvents = await this.discoverFromInstagram()
    allEvents.push(...instagramEvents)

    // 2. Facebook event discovery
    console.log("📘 Discovering from Facebook events...")
    const facebookEvents = await this.discoverFromFacebook()
    allEvents.push(...facebookEvents)

    // 3. Venue page monitoring
    console.log("🏢 Monitoring venue pages...")
    const venueEvents = await this.monitorVenuePages()
    allEvents.push(...venueEvents)

    // 4. Analyze venues
    const venues = this.analyzeVenues(allEvents)

    const stats = {
      totalEvents: allEvents.length,
      instagramEvents: instagramEvents.length,
      facebookEvents: facebookEvents.length,
      venueEvents: venueEvents.length,
      uniqueVenues: venues.length,
      avgConfidence: allEvents.reduce((sum, e) => sum + e.confidence, 0) / allEvents.length,
      discoveryTime: Date.now() - startTime,
      cities: {
        mannheim: allEvents.filter((e) => e.city === "Mannheim").length,
        heidelberg: allEvents.filter((e) => e.city === "Heidelberg").length,
      },
    }

    console.log("✅ Discovery complete:", stats)

    return {
      events: allEvents.sort((a, b) => b.confidence - a.confidence),
      venues: venues.sort((a, b) => b.confidence - a.confidence),
      stats,
    }
  }

  private async discoverFromInstagram(): Promise<DiscoveredEvent[]> {
    const events: DiscoveredEvent[] = []
    const allHashtags = [...this.hashtags.mannheim, ...this.hashtags.heidelberg, ...this.hashtags.general]

    for (const hashtag of allHashtags.slice(0, 10)) {
      // Limit to avoid rate limits
      try {
        const posts = await this.instagram.searchHashtag(hashtag.replace("#", ""), 15)

        for (const post of posts) {
          const eventData = this.analyzeInstagramPost(post, hashtag)
          if (eventData) {
            events.push(eventData)
          }
        }

        // Rate limiting
        await this.delay(1000)
      } catch (error) {
        console.error(`Error processing hashtag ${hashtag}:`, error)
      }
    }

    return events
  }

  private async discoverFromFacebook(): Promise<DiscoveredEvent[]> {
    const events: DiscoveredEvent[] = []
    const cities = ["Mannheim", "Heidelberg"]
    const queries = ["party", "event", "music", "nightlife", "bar", "club", "restaurant"]

    for (const city of cities) {
      for (const query of queries) {
        try {
          const fbEvents = await this.facebook.searchEvents(query, city, 10)

          for (const fbEvent of fbEvents) {
            const eventData = this.analyzeFacebookEvent(fbEvent)
            if (eventData) {
              events.push(eventData)
            }
          }

          await this.delay(1500)
        } catch (error) {
          console.error(`Error processing ${query} in ${city}:`, error)
        }
      }
    }

    return events
  }

  private async monitorVenuePages(): Promise<DiscoveredEvent[]> {
    const events: DiscoveredEvent[] = []

    for (const pageId of this.venuePagesIds) {
      try {
        const pageEvents = await this.facebook.getPageEvents(pageId, 10)

        for (const pageEvent of pageEvents) {
          const eventData = this.analyzeFacebookEvent(pageEvent)
          if (eventData) {
            eventData.confidence += 0.2 // Boost confidence for official venue pages
            events.push(eventData)
          }
        }

        await this.delay(2000)
      } catch (error) {
        console.error(`Error monitoring page ${pageId}:`, error)
      }
    }

    return events
  }

  private analyzeInstagramPost(post: any, hashtag: string): DiscoveredEvent | null {
    if (!post.caption) return null

    const content = post.caption.toLowerCase()
    const eventKeywords = [
      "tonight",
      "heute",
      "event",
      "party",
      "live",
      "dj",
      "concert",
      "show",
      "saturday",
      "friday",
      "weekend",
      "samstag",
      "freitag",
      "wochenende",
    ]

    let confidence = 0
    let isEvent = false

    // Check for event keywords
    const keywordMatches = eventKeywords.filter((keyword) => content.includes(keyword)).length
    confidence += keywordMatches * 0.15

    // Check for time patterns
    const timePattern = /(\d{1,2}):(\d{2})|(\d{1,2})\s*uhr/gi
    const timeMatch = post.caption.match(timePattern)
    if (timeMatch) {
      confidence += 0.3
      isEvent = true
    }

    // Check for price patterns
    const pricePattern = /€\s*\d+|euro|kostenlos|free|gratis/gi
    const priceMatch = post.caption.match(pricePattern)
    if (priceMatch) {
      confidence += 0.2
      isEvent = true
    }

    // Check for venue mentions
    const venuePattern = /at\s+([^!.@#]+)|bei\s+([^!.@#]+)/gi
    const venueMatch = post.caption.match(venuePattern)
    if (venueMatch) {
      confidence += 0.25
    }

    // Engagement boost
    const engagementScore = (post.like_count || 0) + (post.comments_count || 0) * 2
    confidence += Math.min(engagementScore / 1000, 0.3)

    if (!isEvent && confidence < 0.4) return null

    // Extract information
    const venue = venueMatch ? venueMatch[0].replace(/at\s+|bei\s+/gi, "").trim() : "Unknown Venue"
    const city = hashtag.includes("heidelberg") ? "Heidelberg" : "Mannheim"
    const time = timeMatch ? timeMatch[0] : undefined
    const price = priceMatch ? priceMatch[0] : undefined

    return {
      id: `ig_${post.id}`,
      title: this.extractEventTitle(post.caption),
      description: post.caption.slice(0, 200) + "...",
      venue,
      city,
      date: new Date(post.timestamp).toISOString().split("T")[0],
      time,
      price,
      image: post.media_url,
      source: "instagram",
      sourceUrl: post.permalink,
      engagement: {
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
      },
      confidence: Math.min(confidence, 1),
      tags: this.extractHashtags(post.caption),
    }
  }

  private analyzeFacebookEvent(fbEvent: any): DiscoveredEvent | null {
    const venue = fbEvent.place?.name || "Unknown Venue"
    const city = fbEvent.place?.location?.city || "Unknown"

    // Skip events not in our target cities
    if (!["Mannheim", "Heidelberg"].includes(city)) return null

    const startDate = new Date(fbEvent.start_time)
    const confidence = 0.8 + (fbEvent.attending_count || 0) / 1000 // High confidence for FB events

    return {
      id: `fb_${fbEvent.id}`,
      title: fbEvent.name,
      description: fbEvent.description || "No description available",
      venue,
      city,
      date: startDate.toISOString().split("T")[0],
      time: startDate.toTimeString().slice(0, 5),
      price: this.extractPrice(fbEvent.description || ""),
      image: fbEvent.cover?.source,
      source: "facebook",
      sourceUrl: `https://facebook.com/events/${fbEvent.id}`,
      engagement: {
        likes: 0,
        comments: 0,
        attending: fbEvent.attending_count || 0,
      },
      confidence: Math.min(confidence, 1),
      tags: this.extractTags(fbEvent.name + " " + (fbEvent.description || "")),
    }
  }

  private analyzeVenues(events: DiscoveredEvent[]): DiscoveredVenue[] {
    const venueMap = new Map<string, any>()

    events.forEach((event) => {
      const venueName = event.venue
      if (!venueMap.has(venueName)) {
        venueMap.set(venueName, {
          mentions: 0,
          totalEngagement: 0,
          events: [],
          cities: new Set(),
          categories: new Set(),
        })
      }

      const venue = venueMap.get(venueName)!
      venue.mentions++
      venue.totalEngagement += event.engagement.likes + event.engagement.comments
      venue.events.push(event)
      venue.cities.add(event.city)
      venue.categories.add(this.inferCategory(event.title + " " + event.description))
    })

    const venues: DiscoveredVenue[] = []

    venueMap.forEach((data, venueName) => {
      if (data.mentions >= 2) {
        // Minimum 2 mentions
        venues.push({
          name: venueName,
          city: Array.from(data.cities)[0],
          category: Array.from(data.categories)[0] || "Entertainment",
          mentions: data.mentions,
          avgEngagement: data.totalEngagement / data.mentions,
          recentActivity: data.events.some(
            (e: any) => new Date(e.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
          ),
          confidence: Math.min(data.mentions * 0.2 + data.totalEngagement / 1000, 1),
          suggestedInfo: {
            description: `Popular venue with ${data.mentions} recent mentions on social media`,
            priceRange: this.estimatePriceRange(data.events),
            popularTimes: this.extractPopularTimes(data.events),
          },
          discoveredFrom: data.events.map((e: any) => e.sourceUrl),
        })
      }
    })

    return venues
  }

  // Helper methods
  private extractEventTitle(content: string): string {
    const lines = content.split("\n")
    const firstLine = lines[0].replace(/[🎉🎵🍸🌆🎊🍻🥐🎧]/gu, "").trim()
    return firstLine.length > 5 ? firstLine.slice(0, 60) : "Social Media Event"
  }

  private extractHashtags(content: string): string[] {
    const hashtags = content.match(/#\w+/g) || []
    return hashtags.slice(0, 5)
  }

  private extractPrice(content: string): string | undefined {
    const priceMatch = content.match(/€\s*(\d+)|(\d+)\s*euro|kostenlos|free|gratis/i)
    return priceMatch ? priceMatch[0] : undefined
  }

  private extractTags(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/)
    const relevantWords = words.filter(
      (word) => word.length > 3 && !["the", "and", "for", "with", "this", "that", "will", "have"].includes(word),
    )
    return relevantWords.slice(0, 5)
  }

  private inferCategory(content: string): string {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes("bar") || lowerContent.includes("cocktail")) return "Bar"
    if (lowerContent.includes("restaurant") || lowerContent.includes("food")) return "Restaurant"
    if (lowerContent.includes("club") || lowerContent.includes("party")) return "Nightclub"
    if (lowerContent.includes("music") || lowerContent.includes("concert")) return "Music Venue"
    if (lowerContent.includes("art") || lowerContent.includes("gallery")) return "Art & Culture"

    return "Entertainment"
  }

  private estimatePriceRange(events: any[]): string {
    const prices = events
      .map((e) => e.price)
      .filter((p) => p && p.includes("€"))
      .map((p) => Number.parseInt(p.replace(/[€\s]/g, "")))
      .filter((p) => p > 0 && p < 100)

    if (prices.length === 0) return "€€"

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    if (avgPrice < 15) return "€"
    if (avgPrice < 30) return "€€"
    return "€€€"
  }

  private extractPopularTimes(events: any[]): string[] {
    const times = events
      .map((e) => e.time)
      .filter((t) => t)
      .slice(0, 3)

    return [...new Set(times)]
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
