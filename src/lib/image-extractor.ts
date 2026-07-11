export interface ExtractedImage {
  url: string
  alt?: string
  source: "website" | "facebook" | "instagram" | "generated"
  quality: "high" | "medium" | "low"
  width?: number
  height?: number
}

export class ImageExtractor {
  private readonly imageSelectors = [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    ".event-image img",
    ".hero-image img",
    ".banner img",
    ".featured-image img",
    ".event-photo img",
    ".gallery img",
    'img[alt*="event"]',
    'img[alt*="party"]',
    'img[alt*="concert"]',
    'img[alt*="venue"]',
    'img[src*="event"]',
    'img[src*="party"]',
    'img[src*="concert"]',
  ]

  async extractImagesFromWebsite(url: string, eventTitle: string): Promise<ExtractedImage[]> {
    console.log(`🖼️ Extracting images from ${url}`)

    try {
      // Real image extraction is not implemented in this app.
      return []
    } catch (error) {
      console.error(`Failed to extract images from ${url}:`, error)
      return []
    }
  }

  async extractFacebookEventImage(eventUrl: string): Promise<ExtractedImage | null> {
    console.log(`📘 Extracting Facebook event image from ${eventUrl}`)

    try {
      return null
    } catch (error) {
      console.error(`Failed to extract Facebook image:`, error)
      return null
    }
  }

  async extractInstagramPostImage(postUrl: string): Promise<ExtractedImage | null> {
    console.log(`📸 Extracting Instagram post image from ${postUrl}`)

    try {
      return null
    } catch (error) {
      console.error(`Failed to extract Instagram image:`, error)
      return null
    }
  }

  async getBestEventImage(
    event: any,
    websiteUrl?: string,
    facebookUrl?: string,
    instagramUrl?: string,
  ): Promise<ExtractedImage> {
    console.log(`🎯 Finding best image for event: ${event.title}`)

    const images: ExtractedImage[] = []

    // Try to extract from website first (highest quality)
    if (websiteUrl) {
      const websiteImages = await this.extractImagesFromWebsite(websiteUrl, event.title)
      images.push(...websiteImages)
    }

    // Try Facebook event image
    if (facebookUrl) {
      const facebookImage = await this.extractFacebookEventImage(facebookUrl)
      if (facebookImage) images.push(facebookImage)
    }

    // Try Instagram post image
    if (instagramUrl) {
      const instagramImage = await this.extractInstagramPostImage(instagramUrl)
      if (instagramImage) images.push(instagramImage)
    }

    // If we found images, return the best one
    if (images.length > 0) {
      // Prioritize by source quality: website > facebook > instagram
      const prioritized = images.sort((a, b) => {
        const sourceOrder = { website: 0, facebook: 1, instagram: 2, generated: 3 }
        return sourceOrder[a.source] - sourceOrder[b.source]
      })

      console.log(`✅ Found ${images.length} images, using: ${prioritized[0].source}`)
      return prioritized[0]
    }

    // Fallback to a generic placeholder image if no real image sources are available.
    console.log(`🎨 No images found for event: ${event.title}. Using placeholder image.`)
    return {
      url: "/placeholder.svg?height=800&width=600&query=event",
      alt: event.title ? `Placeholder image for ${event.title}` : "Event image placeholder",
      source: "generated",
      quality: "low",
      width: 800,
      height: 600,
    }
  }


  validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000)
    })
  }
}
