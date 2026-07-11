/**
 * Facebook Graph API — Page Events only.
 *
 * NOTE: Meta removed public event search (/search?type=event) from the Graph API.
 * Only events from pages you own/manage (via page access token) are accessible.
 *
 * Required env var: META_ACCESS_TOKEN — Long-lived Page Access Token
 */

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
  private baseUrl = "https://graph.facebook.com/v21.0"

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || ""
    if (!this.accessToken) {
      console.warn("[facebook-api] META_ACCESS_TOKEN not set — page event fetching disabled.")
    }
  }

  async getPageEvents(pageId: string, limit = 25): Promise<FacebookEvent[]> {
    if (!this.accessToken) return []

    const response = await fetch(
      `${this.baseUrl}/${pageId}/events?fields=id,name,description,start_time,end_time,place,cover,attending_count,interested_count,ticket_uri&limit=${limit}&access_token=${this.accessToken}`,
    )

    if (!response.ok) {
      console.error(`[facebook-api] getPageEvents(${pageId}) failed: ${response.status}`, await response.text().catch(() => ""))
      return []
    }

    const data: FacebookEventsResponse = await response.json()
    return data.data ?? []
  }
}
