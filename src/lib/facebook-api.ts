interface FacebookEvent {
  id: string
  name: string
  description?: string
  start_time: string
  end_time?: string
  place?: {
    name: string
    location?: {
      city: string
      country: string
      latitude: number
      longitude: number
      street: string
      zip: string
    }
  }
  cover?: {
    source: string
  }
  attending_count?: number
  interested_count?: number
  ticket_uri?: string
}

interface FacebookEventsResponse {
  data: FacebookEvent[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

export class FacebookAPI {
  private accessToken: string
  private baseUrl = "https://graph.facebook.com/v18.0"

  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || ""
    if (!this.accessToken) {
      console.warn("⚠️ Facebook access token not found. Using demo data.")
    }
  }

  async searchEvents(query: string, location: string, limit = 25): Promise<FacebookEvent[]> {
    if (!this.accessToken) {
      return this.generateDemoEvents(location, limit)
    }

    try {
      // Search for events using Facebook Graph API
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=event&location=${encodeURIComponent(location)}&fields=id,name,description,start_time,end_time,place,cover,attending_count,interested_count,ticket_uri&limit=${limit}&access_token=${this.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`)
      }

      const data: FacebookEventsResponse = await response.json()
      return data.data || []
    } catch (error) {
      console.error(`Error fetching Facebook events for ${query} in ${location}:`, error)
      return this.generateDemoEvents(location, limit)
    }
  }

  async getPageEvents(pageId: string, limit = 25): Promise<FacebookEvent[]> {
    if (!this.accessToken) {
      return this.generateDemoEvents("page_events", limit)
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${pageId}/events?fields=id,name,description,start_time,end_time,place,cover,attending_count,interested_count,ticket_uri&limit=${limit}&access_token=${this.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`Facebook Page API error: ${response.status}`)
      }

      const data: FacebookEventsResponse = await response.json()
      return data.data || []
    } catch (error) {
      console.error(`Error fetching page events for ${pageId}:`, error)
      return this.generateDemoEvents("page_events", limit)
    }
  }

  private generateDemoEvents(location: string, limit: number): FacebookEvent[] {
    const eventTitles = [
      "Saturday Night Fever Party 🎉",
      "Live Jazz Evening 🎵",
      "Cocktail Masterclass 🍸",
      "Rooftop Summer Session 🌅",
      "Underground Electronic Night 🎧",
      "Wine Tasting Event 🍷",
      "Speed Dating Night 💕",
      "Karaoke Competition 🎤",
      "Art Gallery Opening 🎨",
      "Food Festival 🍕",
      "Techno Thursday 🔊",
      "Salsa Dancing Night 💃",
      "Beer Tasting Tour 🍺",
      "Open Mic Night 🎙️",
      "Vintage Market 🛍️",
      "Comedy Show 😂",
      "Film Screening 🎬",
      "Yoga in the Park 🧘",
      "Street Food Festival 🌮",
      "DJ Workshop 🎛️",
    ]

    const venues = [
      "Skybar Mannheim",
      "MS Connexion",
      "Alte Feuerwache",
      "Capitol Mannheim",
      "Karlstorbahnhof",
      "Cave 54",
      "Villa Nachttanz",
      "Zeitraumexit",
      "Rooftop Bar MA",
      "Underground Club HD",
      "Jazz Lounge",
      "Cocktail Corner",
      "Heidelberg Castle",
      "Neckar Terrace",
      "Old Town Bar",
      "Student Club HD",
    ]

    const descriptions = [
      "Join us for an unforgettable evening of music, drinks, and great company! 🎉",
      "Experience the best of local talent in an intimate setting. Limited seats available! 🎵",
      "Learn from professional bartenders and create your own signature cocktails. 🍸",
      "Dance under the stars with the best DJs in town. Dress code: stylish casual. ✨",
      "Underground vibes with cutting-edge electronic music. 21+ only. 🎧",
      "Taste premium wines from local vineyards with expert sommelier guidance. 🍷",
      "Meet new people in a fun, relaxed environment. Ages 25-45. 💕",
      "Show off your singing skills and win amazing prizes! 🎤",
      "Discover emerging local artists in this exclusive gallery opening. 🎨",
      "Street food from around the world in one location. Family-friendly! 🍕",
    ]

    return Array.from({ length: limit }, (_, i) => {
      const title = eventTitles[Math.floor(Math.random() * eventTitles.length)]
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const description = descriptions[Math.floor(Math.random() * descriptions.length)]
      const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      const city = location.includes("Heidelberg") ? "Heidelberg" : "Mannheim"

      return {
        id: `demo_fb_${i}`,
        name: title,
        description,
        start_time: startDate.toISOString(),
        end_time: new Date(startDate.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        place: {
          name: venue,
          location: {
            city,
            country: "Germany",
            latitude: city === "Mannheim" ? 49.4875 : 49.4093,
            longitude: city === "Mannheim" ? 8.466 : 8.6937,
            street: `${Math.floor(Math.random() * 100) + 1} Main Street`,
            zip: city === "Mannheim" ? "68159" : "69117",
          },
        },
        cover: {
          source: `/images/${Math.random() > 0.5 ? "rooftop-bar" : "techno-club"}.jpg`,
        },
        attending_count: Math.floor(Math.random() * 200) + 20,
        interested_count: Math.floor(Math.random() * 500) + 50,
        ticket_uri: Math.random() > 0.5 ? "https://eventbrite.com/demo-event" : undefined,
      }
    })
  }
}
