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
      console.warn("⚠️ Instagram access token not found. Instagram hashtag/location fetch is disabled.")
    }
  }

  async searchHashtag(hashtag: string, limit = 25): Promise<InstagramPost[]> {
    if (!this.accessToken) {
      return []
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
      return []
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
      return []
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
      return []
    }
  }
}
