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
      // In a real implementation, you would use a web scraping service like Puppeteer
      // For demo purposes, we'll simulate realistic image extraction
      return this.simulateWebsiteImageExtraction(url, eventTitle)
    } catch (error) {
      console.error(`Failed to extract images from ${url}:`, error)
      return []
    }
  }

  async extractFacebookEventImage(eventUrl: string): Promise<ExtractedImage | null> {
    console.log(`📘 Extracting Facebook event image from ${eventUrl}`)

    try {
      // In production, use Facebook Graph API
      // For demo, simulate realistic Facebook image extraction
      return this.simulateFacebookImageExtraction(eventUrl)
    } catch (error) {
      console.error(`Failed to extract Facebook image:`, error)
      return null
    }
  }

  async extractInstagramPostImage(postUrl: string): Promise<ExtractedImage | null> {
    console.log(`📸 Extracting Instagram post image from ${postUrl}`)

    try {
      // In production, use Instagram Basic Display API
      // For demo, simulate realistic Instagram image extraction
      return this.simulateInstagramImageExtraction(postUrl)
    } catch (error) {
      console.error(`Failed to extract Instagram image:`, error)
      return null
    }
  }

  private simulateWebsiteImageExtraction(url: string, eventTitle: string): ExtractedImage[] {
    // Simulate finding high-quality images from venue websites
    const venueImages = [
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
        alt: "Live concert with stage lighting",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        alt: "Elegant cocktail bar interior",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        alt: "Rooftop bar with city views",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
        alt: "Jazz club with live performance",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
        alt: "Electronic music event with DJ",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
        alt: "Art gallery exhibition opening",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop",
        alt: "Beer garden with traditional atmosphere",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop",
        alt: "Summer festival outdoor stage",
        source: "website" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
    ]

    // Return 1-3 relevant images based on event title
    const relevantImages = venueImages.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)

    return relevantImages
  }

  private simulateFacebookImageExtraction(eventUrl: string): ExtractedImage {
    const facebookImages = [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        alt: "Facebook event cover photo",
        source: "facebook" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
        alt: "Facebook event image",
        source: "facebook" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        alt: "Facebook event photo",
        source: "facebook" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
    ]

    return facebookImages[Math.floor(Math.random() * facebookImages.length)]
  }

  private simulateInstagramImageExtraction(postUrl: string): ExtractedImage {
    const instagramImages = [
      {
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
        alt: "Instagram event post",
        source: "instagram" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
        alt: "Instagram story image",
        source: "instagram" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
      {
        url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop",
        alt: "Instagram venue photo",
        source: "instagram" as const,
        quality: "high" as const,
        width: 800,
        height: 600,
      },
    ]

    return instagramImages[Math.floor(Math.random() * instagramImages.length)]
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

    // Fallback to category-based generated image
    console.log(`🎨 No images found, generating fallback for category: ${event.category}`)
    return this.generateCatchyFallbackImage(event)
  }

  private generateCatchyFallbackImage(event: any): ExtractedImage {
    const catchyImages = {
      Nightlife: {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
        alt: "Stylish nightclub with ambient lighting",
      },
      Music: {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&auto=format",
        alt: "Live music concert with stage lights",
      },
      Food: {
        url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop&auto=format",
        alt: "Traditional German beer garden",
      },
      Art: {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
        alt: "Contemporary art gallery exhibition",
      },
      Culture: {
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
        alt: "Cultural venue with elegant interior",
      },
      Social: {
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop&auto=format",
        alt: "Social gathering at outdoor venue",
      },
    }

    const categoryImage = catchyImages[event.category as keyof typeof catchyImages] || catchyImages.Social

    return {
      url: categoryImage.url,
      alt: categoryImage.alt,
      source: "generated",
      quality: "high",
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
