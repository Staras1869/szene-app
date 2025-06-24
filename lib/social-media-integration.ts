import type { Venue } from "./venues-database"
import type { ScrapedEventData } from "./advanced-web-scraper"

export interface SocialMediaConfig {
  facebookAccessToken?: string
  instagramAccessToken?: string
  enableRealTimeMonitoring?: boolean
}

export class SocialMediaIntegration {
  private config: SocialMediaConfig

  constructor(config: SocialMediaConfig = {}) {
    this.config = config
  }

  async getFacebookEvents(venue: Venue): Promise<ScrapedEventData[]> {
    if (!venue.facebook) return []

    console.log(`📘 Fetching Facebook events for ${venue.name}`)

    try {
      if (this.config.facebookAccessToken) {
        // Real Facebook Graph API implementation
        return await this.fetchRealFacebookEvents(venue)
      } else {
        // Demo mode - generate realistic events
        return await this.generateFacebookStyleEvents(venue)
      }
    } catch (error) {
      console.error(`Facebook API error for ${venue.name}:`, error)
      return []
    }
  }

  async getInstagramEvents(venue: Venue): Promise<ScrapedEventData[]> {
    if (!venue.instagram) return []

    console.log(`📸 Fetching Instagram events for ${venue.name}`)

    try {
      if (this.config.instagramAccessToken) {
        // Real Instagram API implementation
        return await this.fetchRealInstagramEvents(venue)
      } else {
        // Demo mode - generate realistic events
        return await this.generateInstagramStyleEvents(venue)
      }
    } catch (error) {
      console.error(`Instagram API error for ${venue.name}:`, error)
      return []
    }
  }

  private async fetchRealFacebookEvents(venue: Venue): Promise<ScrapedEventData[]> {
    // Real Facebook Graph API implementation
    const url = `https://graph.facebook.com/v18.0/${venue.facebook}/events`
    const params = new URLSearchParams({
      access_token: this.config.facebookAccessToken!,
      fields: "name,description,start_time,end_time,place,cover,ticket_uri",
      time_filter: "upcoming",
      limit: "25",
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`)
      }

      return data.data?.map((event: any) => this.transformFacebookEvent(event, venue)) || []
    } catch (error) {
      console.error("Facebook API request failed:", error)
      return []
    }
  }

  private async fetchRealInstagramEvents(venue: Venue): Promise<ScrapedEventData[]> {
    // Real Instagram Basic Display API implementation
    const url = `https://graph.instagram.com/me/media`
    const params = new URLSearchParams({
      access_token: this.config.instagramAccessToken!,
      fields: "id,caption,media_type,media_url,permalink,timestamp",
      limit: "25",
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(`Instagram API Error: ${data.error.message}`)
      }

      // Filter posts that look like events (contain event keywords)
      const eventPosts = data.data?.filter((post: any) => this.isEventPost(post.caption)) || []

      return eventPosts.map((post: any) => this.transformInstagramPost(post, venue))
    } catch (error) {
      console.error("Instagram API request failed:", error)
      return []
    }
  }

  private generateFacebookStyleEvents(venue: Venue): Promise<ScrapedEventData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.createSocialMediaEvents(venue, "facebook", 2)
        resolve(events)
      }, 1000)
    })
  }

  private generateInstagramStyleEvents(venue: Venue): Promise<ScrapedEventData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.createSocialMediaEvents(venue, "instagram", 1)
        resolve(events)
      }, 800)
    })
  }

  private createSocialMediaEvents(venue: Venue, platform: "facebook" | "instagram", count: number): ScrapedEventData[] {
    const events: ScrapedEventData[] = []
    const currentDate = new Date()

    for (let i = 0; i < count; i++) {
      const eventDate = new Date(currentDate)
      eventDate.setDate(currentDate.getDate() + i * 7 + Math.floor(Math.random() * 14))

      const templates = this.getSocialMediaTemplates(venue.category, platform)
      const template = templates[Math.floor(Math.random() * templates.length)]

      events.push({
        title: template.title,
        venue: venue.name,
        venueId: venue.id,
        date: eventDate.toISOString().split("T")[0],
        time: template.time,
        city: venue.city,
        category: venue.category,
        price: template.price,
        description: template.description,
        url: `https://${platform}.com/${venue[platform]}/events/${Date.now()}`,
        imageUrl: this.getEventImage(venue.category),
        source: platform,
        rawData: {
          platform,
          scrapedAt: new Date().toISOString(),
          engagement: Math.floor(Math.random() * 500) + 50,
        },
      })
    }

    return events
  }

  private getSocialMediaTemplates(category: string, platform: "facebook" | "instagram") {
    const facebookTemplates = {
      Nightlife: [
        {
          title: "🎉 Weekend Party Extravaganza",
          description: "Join us for the ultimate weekend party! 🕺💃 Best DJs, amazing drinks, unforgettable night!",
          time: "23:00",
          price: "€15",
        },
        {
          title: "🌟 VIP Night Experience",
          description: "Exclusive VIP treatment with premium service and the hottest beats in town! 🥂✨",
          time: "22:30",
          price: "€25",
        },
      ],
      Music: [
        {
          title: "🎵 Live Music Session",
          description: "Amazing live performances by talented local and international artists! 🎸🎤",
          time: "20:00",
          price: "€18",
        },
        {
          title: "🎧 Electronic Beats Night",
          description: "Electronic music at its finest! Come dance to the rhythm! 🎛️🔊",
          time: "21:00",
          price: "€16",
        },
      ],
      Culture: [
        {
          title: "🎨 Art & Culture Evening",
          description: "Immerse yourself in art, culture, and creativity! 🖼️🎭",
          time: "19:00",
          price: "€12",
        },
      ],
    }

    const instagramTemplates = {
      Nightlife: [
        {
          title: "✨ Tonight's the Night ✨",
          description: "Ready to party? 🎉 See you on the dancefloor! #nightlife #party #mannheim",
          time: "23:00",
          price: "€15",
        },
      ],
      Music: [
        {
          title: "🎶 Music Vibes Tonight",
          description: "Feel the beat! 🎵 #livemusic #electronicbeats #heidelberg",
          time: "21:00",
          price: "€18",
        },
      ],
      Culture: [
        {
          title: "🎨 Cultural Experience",
          description: "Art meets music! 🖼️🎵 #culture #art #events",
          time: "19:00",
          price: "€14",
        },
      ],
    }

    const templates = platform === "facebook" ? facebookTemplates : instagramTemplates
    return templates[category as keyof typeof templates] || templates.Nightlife
  }

  private transformFacebookEvent(event: any, venue: Venue): ScrapedEventData {
    return {
      title: event.name,
      venue: venue.name,
      venueId: venue.id,
      date: new Date(event.start_time).toISOString().split("T")[0],
      time: new Date(event.start_time).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      city: venue.city,
      category: venue.category,
      price: "€15", // Facebook events don't always have price info
      description: event.description || "Exciting event at " + venue.name,
      url: event.ticket_uri || `https://facebook.com/events/${event.id}`,
      imageUrl: event.cover?.source || this.getEventImage(venue.category),
      source: "facebook",
      rawData: event,
    }
  }

  private transformInstagramPost(post: any, venue: Venue): ScrapedEventData {
    const eventInfo = this.extractEventInfoFromCaption(post.caption)

    return {
      title: eventInfo.title || "Instagram Event",
      venue: venue.name,
      venueId: venue.id,
      date: eventInfo.date || new Date().toISOString().split("T")[0],
      time: eventInfo.time || "21:00",
      city: venue.city,
      category: venue.category,
      price: eventInfo.price || "€15",
      description: post.caption || "Check out this event!",
      url: post.permalink,
      imageUrl: post.media_url || this.getEventImage(venue.category),
      source: "instagram",
      rawData: post,
    }
  }

  private isEventPost(caption: string): boolean {
    if (!caption) return false

    const eventKeywords = [
      "event",
      "party",
      "concert",
      "show",
      "night",
      "tonight",
      "weekend",
      "live",
      "dj",
      "music",
      "dance",
      "club",
      "bar",
      "festival",
    ]

    const lowerCaption = caption.toLowerCase()
    return eventKeywords.some((keyword) => lowerCaption.includes(keyword))
  }

  private extractEventInfoFromCaption(caption: string): {
    title?: string
    date?: string
    time?: string
    price?: string
  } {
    // Simple extraction logic - in production, use more sophisticated NLP
    const timeMatch = caption.match(/(\d{1,2}):(\d{2})/)
    const priceMatch = caption.match(/€(\d+)/)

    return {
      title: caption.split("\n")[0]?.substring(0, 50),
      time: timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : undefined,
      price: priceMatch ? `€${priceMatch[1]}` : undefined,
    }
  }

  private getEventImage(category: string): string {
    const images = {
      Nightlife: "/images/techno-club.jpg",
      Music: "/images/jazz-castle.jpg",
      Culture: "/images/art-gallery.jpg",
    }
    return images[category as keyof typeof images] || "/images/rooftop-bar.jpg"
  }

  async monitorSocialMediaUpdates(venues: Venue[]): Promise<ScrapedEventData[]> {
    console.log("🔄 Starting social media monitoring for all venues...")

    const allEvents: ScrapedEventData[] = []

    for (const venue of venues) {
      try {
        const [facebookEvents, instagramEvents] = await Promise.all([
          this.getFacebookEvents(venue),
          this.getInstagramEvents(venue),
        ])

        allEvents.push(...facebookEvents, ...instagramEvents)

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error monitoring ${venue.name}:`, error)
      }
    }

    console.log(`✅ Social media monitoring complete: ${allEvents.length} events found`)
    return allEvents
  }
}
