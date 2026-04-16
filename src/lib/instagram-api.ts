interface InstagramPost {
  id: string
  caption?: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  permalink: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

interface InstagramHashtagMedia {
  data: InstagramPost[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

export class InstagramAPI {
  private accessToken: string
  private baseUrl = "https://graph.instagram.com"

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || ""
    if (!this.accessToken) {
      console.warn("⚠️ Instagram access token not found. Using demo data.")
    }
  }

  async searchHashtag(hashtag: string, limit = 25): Promise<InstagramPost[]> {
    if (!this.accessToken) {
      return this.generateDemoData(hashtag, limit)
    }

    try {
      // Step 1: Get hashtag ID
      const hashtagId = await this.getHashtagId(hashtag)
      if (!hashtagId) return []

      // Step 2: Get recent media for hashtag
      const response = await fetch(
        `${this.baseUrl}/${hashtagId}/recent_media?user_id=${process.env.INSTAGRAM_USER_ID}&fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${this.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`)
      }

      const data: InstagramHashtagMedia = await response.json()
      return data.data || []
    } catch (error) {
      console.error(`Error fetching Instagram hashtag ${hashtag}:`, error)
      return this.generateDemoData(hashtag, limit)
    }
  }

  private async getHashtagId(hashtag: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ig_hashtag_search?user_id=${process.env.INSTAGRAM_USER_ID}&q=${hashtag}&access_token=${this.accessToken}`,
      )

      const data = await response.json()
      return data.data?.[0]?.id || null
    } catch (error) {
      console.error("Error getting hashtag ID:", error)
      return null
    }
  }

  async getLocationMedia(locationId: string, limit = 25): Promise<InstagramPost[]> {
    if (!this.accessToken) {
      return this.generateDemoLocationData(locationId, limit)
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${locationId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${this.accessToken}`,
      )

      if (!response.ok) {
        throw new Error(`Instagram Location API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error(`Error fetching location media ${locationId}:`, error)
      return this.generateDemoLocationData(locationId, limit)
    }
  }

  private generateDemoData(hashtag: string, limit: number): InstagramPost[] {
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
    ]

    const captions = [
      `Amazing night at {venue}! 🎉 The DJ was incredible ${hashtag} #nightlife #party`,
      `Best cocktails in town at {venue} 🍸 Perfect for date night! ${hashtag} #cocktails`,
      `Live music tonight at {venue}! 🎵 Starting at 21:00, entry €15 ${hashtag} #livemusic`,
      `Rooftop vibes at {venue} 🌆 Perfect weather! ${hashtag} #rooftop #friends`,
      `New event at {venue} this weekend! 🎊 Saturday 22:00 ${hashtag} #weekend #event`,
      `Happy hour at {venue} until 20:00! 🍻 Half price cocktails ${hashtag} #happyhour`,
      `Brunch special at {venue} this Sunday! 🥐 Book now ${hashtag} #brunch #sunday`,
      `DJ battle at {venue} tonight! 🎧 Three DJs competing ${hashtag} #djbattle #electronic`,
    ]

    return Array.from({ length: limit }, (_, i) => {
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const caption = captions[Math.floor(Math.random() * captions.length)].replace("{venue}", venue)

      return {
        id: `demo_${hashtag}_${i}`,
        caption,
        media_type: "IMAGE" as const,
        media_url: `/images/${Math.random() > 0.5 ? "rooftop-bar" : "techno-club"}.jpg`,
        permalink: `https://instagram.com/p/demo_${i}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        like_count: Math.floor(Math.random() * 500) + 50,
        comments_count: Math.floor(Math.random() * 50) + 5,
      }
    })
  }

  private generateDemoLocationData(locationId: string, limit: number): InstagramPost[] {
    return this.generateDemoData(`location_${locationId}`, limit)
  }
}
