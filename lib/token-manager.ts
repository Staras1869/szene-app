export class TokenManager {
  async refreshFacebookToken(currentToken: string): Promise<string> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${currentToken}`,
      )

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error("Failed to refresh Facebook token:", error)
      throw error
    }
  }

  async refreshInstagramToken(currentToken: string): Promise<string> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`,
      )

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error("Failed to refresh Instagram token:", error)
      throw error
    }
  }
}
