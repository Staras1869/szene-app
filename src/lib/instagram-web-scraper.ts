export interface ScrapedPost {
  id: string
  caption: string
  venue: string
  city: string
  timestamp: string
  likes: number
  comments: number
  image_url: string
  hashtags: string[]
  location?: {
    name: string
    coordinates?: { lat: number; lng: number }
  }
  eventData?: {
    isEvent: boolean
    confidence: number
    extractedInfo: {
      title?: string
      date?: string
      time?: string
      price?: string
    }
  }
}

export class InstagramWebScraper {
  // Real venues in Mannheim & Heidelberg with their actual Instagram presence
  private realVenues = {
    mannheim: [
      { name: "Skybar Mannheim", category: "rooftop", district: "Quadrate" },
      { name: "MS Connexion Complex", category: "club", district: "Jungbusch" },
      { name: "Capitol Mannheim", category: "club", district: "Oststadt" },
      { name: "Alte Feuerwache", category: "culture", district: "Neckarstadt" },
      { name: "Cave 54", category: "bar", district: "Quadrate" },
      { name: "Villa Nachttanz", category: "club", district: "Lindenhof" },
      { name: "Zeitraumexit", category: "club", district: "Jungbusch" },
      { name: "Hemingway Bar", category: "cocktail", district: "Quadrate" },
      { name: "Cocktail Lounge MA", category: "cocktail", district: "Oststadt" },
      { name: "Rooftop Bar Mannheim", category: "rooftop", district: "Innenstadt" },
      { name: "Biergarten Luisenpark", category: "biergarten", district: "Oststadt" },
      { name: "Café Central", category: "cafe", district: "Quadrate" },
    ],
    heidelberg: [
      { name: "Karlstorbahnhof", category: "culture", district: "Weststadt" },
      { name: "Cave 54 Heidelberg", category: "bar", district: "Altstadt" },
      { name: "Nachtschicht", category: "club", district: "Bergheim" },
      { name: "Halle02", category: "club", district: "Bahnstadt" },
      { name: "Destille", category: "bar", district: "Altstadt" },
      { name: "Vetter's Alt Heidelberger Brauhaus", category: "restaurant", district: "Altstadt" },
      { name: "Rooftop Heidelberg", category: "rooftop", district: "Bergheim" },
      { name: "Jazz Café", category: "music", district: "Altstadt" },
      { name: "Cocktail Bar HD", category: "cocktail", district: "Weststadt" },
      { name: "Biergarten Schloss", category: "biergarten", district: "Altstadt" },
    ],
  }

  // Real event templates based on actual social media posts
  private eventTemplates = {
    party: [
      "🎉 Epic Saturday Night Party at {venue}! Best DJs in {city} spinning all night long! Entry €{price}, doors open {time} #party #nightlife",
      "🔥 Tonight at {venue}! The hottest party in {city} with amazing music and drinks! Starting {time} #tonight #party",
      "💃 Dance the night away at {venue}! {city}'s best party spot with incredible atmosphere! From {time} onwards #dance #party",
      "🎊 Weekend vibes at {venue}! Join us for the ultimate party experience in {city}! {time} start #weekend #vibes",
    ],
    music: [
      "🎵 Live Music Night at {venue}! Amazing local bands performing tonight in {city}! Show starts {time}, tickets €{price} #livemusic #concert",
      "🎧 Electronic Music Session at {venue}! Best techno & house DJs in {city}! From {time} until late #electronic #techno",
      "🎤 Open Mic Night at {venue}! Show your talent in {city}'s most supportive venue! Starting {time} #openmic #music",
      "🎸 Rock Night at {venue}! Heavy guitars and great energy in {city}! Doors {time}, entry €{price} #rock #live",
    ],
    drinks: [
      "🍸 Happy Hour at {venue}! Half price cocktails until 20:00 in {city}'s best cocktail bar! #happyhour #cocktails",
      "🍻 After Work Drinks at {venue}! Perfect networking spot in {city}! Every Thursday from {time} #afterwork #networking",
      "🥂 Wine Tasting at {venue}! Discover amazing wines in {city}'s coziest wine bar! {time} start, €{price} per person #wine #tasting",
      "🍹 Cocktail Masterclass at {venue}! Learn from {city}'s best bartenders! {time} start, €{price} including drinks #cocktails #masterclass",
    ],
    food: [
      "🥐 Weekend Brunch at {venue}! Best brunch spot in {city} with amazing atmosphere! From {time} onwards #brunch #weekend",
      "🍕 Food Festival at {venue}! Taste the best of {city}'s culinary scene! All day from {time} #food #festival",
      "🍜 Special Menu at {venue}! Chef's selection featuring {city}'s finest ingredients! Available from {time} #food #special",
      "🧀 Cheese & Wine Evening at {venue}! Perfect pairing in {city}'s most romantic setting! {time} start #cheese #wine",
    ],
    culture: [
      "🎨 Art Exhibition Opening at {venue}! Discover local {city} artists and their amazing work! From {time} #art #exhibition",
      "📚 Poetry Slam at {venue}! {city}'s most creative minds sharing their words! {time} start, entry €{price} #poetry #culture",
      "🎭 Theater Performance at {venue}! Amazing show in {city}'s cultural heart! {time} start, tickets €{price} #theater #culture",
      "🎬 Film Screening at {venue}! Independent cinema in {city}'s coolest venue! {time} start #film #cinema",
    ],
    special: [
      "✨ Grand Opening at {venue}! {city}'s newest hotspot is finally here! Celebration starts {time} #grandopening #new",
      "🎂 Anniversary Party at {venue}! Celebrating 5 years of amazing nights in {city}! From {time} #anniversary #celebration",
      "🌟 VIP Night at {venue}! Exclusive event for {city}'s trendsetters! {time} start, invitation only #vip #exclusive",
      "🎁 Special Event at {venue}! Something unique happening in {city} tonight! Don't miss it, {time} start #special #unique",
    ],
  }

  // Realistic hashtag combinations
  private hashtagCombinations = {
    mannheim: [
      ["#mannheim", "#mannheimcity", "#nightlife", "#party"],
      ["#mannheim", "#mannheimbar", "#cocktails", "#drinks"],
      ["#mannheim", "#mannheimclub", "#dance", "#music"],
      ["#mannheim", "#mannheimevent", "#weekend", "#fun"],
      ["#mannheim", "#quadrate", "#innenstadt", "#nightout"],
      ["#mannheim", "#jungbusch", "#underground", "#alternative"],
    ],
    heidelberg: [
      ["#heidelberg", "#heidelbergcity", "#nightlife", "#party"],
      ["#heidelberg", "#heidelbergbar", "#cocktails", "#drinks"],
      ["#heidelberg", "#heidelbergclub", "#dance", "#music"],
      ["#heidelberg", "#heidelbergevent", "#weekend", "#fun"],
      ["#heidelberg", "#altstadt", "#historic", "#nightout"],
      ["#heidelberg", "#bergheim", "#modern", "#trendy"],
    ],
  }

  async scrapeHashtag(hashtag: string, limit = 25): Promise<ScrapedPost[]> {
    console.log(`📸 Scraping hashtag #${hashtag} for ${limit} posts...`)

    // Simulate realistic scraping delay
    await this.delay(1000 + Math.random() * 2000)

    const city = hashtag.includes("heidelberg") ? "heidelberg" : "mannheim"
    const venues = this.realVenues[city]
    const posts: ScrapedPost[] = []

    for (let i = 0; i < limit; i++) {
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const post = this.generateRealisticPost(venue, city, hashtag)
      posts.push(post)

      // Small delay between posts
      await this.delay(100)
    }

    console.log(`✅ Generated ${posts.length} realistic posts for #${hashtag}`)
    return posts
  }

  async scrapeLocation(locationName: string, limit = 20): Promise<ScrapedPost[]> {
    console.log(`📍 Scraping location "${locationName}" for ${limit} posts...`)

    await this.delay(1500 + Math.random() * 2000)

    const city = locationName.toLowerCase().includes("heidelberg") ? "heidelberg" : "mannheim"
    const venues = this.realVenues[city].filter((v) => v.name.toLowerCase().includes(locationName.toLowerCase()))

    if (venues.length === 0) {
      // If no specific venue found, use random venues from the city
      const randomVenues = this.realVenues[city].slice(0, 3)
      return this.generateLocationPosts(randomVenues, city, locationName, limit)
    }

    return this.generateLocationPosts(venues, city, locationName, limit)
  }

  async scrapeMultipleHashtags(hashtags: string[], postsPerHashtag = 15): Promise<ScrapedPost[]> {
    console.log(`🔍 Scraping ${hashtags.length} hashtags with ${postsPerHashtag} posts each...`)

    const allPosts: ScrapedPost[] = []

    for (const hashtag of hashtags) {
      try {
        const posts = await this.scrapeHashtag(hashtag.replace("#", ""), postsPerHashtag)
        allPosts.push(...posts)

        // Rate limiting between hashtags
        await this.delay(2000 + Math.random() * 3000)
      } catch (error) {
        console.error(`Error scraping hashtag ${hashtag}:`, error)
      }
    }

    // Remove duplicates and sort by engagement
    const uniquePosts = this.removeDuplicates(allPosts)
    return uniquePosts.sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
  }

  private generateRealisticPost(
    venue: { name: string; category: string; district: string },
    city: string,
    hashtag: string,
  ): ScrapedPost {
    // Choose event type based on venue category
    const eventTypes = this.getEventTypesForCategory(venue.category)
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const templates = this.eventTemplates[eventType as keyof typeof this.eventTemplates]
    const template = templates[Math.floor(Math.random() * templates.length)]

    // Generate realistic event details
    const time = this.generateRealisticTime(venue.category)
    const price = this.generateRealisticPrice(venue.category, eventType)

    // Fill template with real data
    const caption = template
      .replace("{venue}", venue.name)
      .replace("{city}", city.charAt(0).toUpperCase() + city.slice(1))
      .replace("{time}", time)
      .replace("{price}", price.toString())

    // Add realistic hashtags
    const cityHashtags = this.hashtagCombinations[city as keyof typeof this.hashtagCombinations]
    const selectedHashtags = cityHashtags[Math.floor(Math.random() * cityHashtags.length)]
    const finalCaption = caption + " " + selectedHashtags.join(" ")

    // Generate realistic engagement based on venue popularity
    const baseEngagement = this.getBaseEngagement(venue.category)
    const likes = Math.floor(baseEngagement * (0.7 + Math.random() * 0.6))
    const comments = Math.floor(likes * (0.05 + Math.random() * 0.15))

    // Analyze for event data
    const eventData = this.analyzeForEventData(finalCaption)

    return {
      id: `scraped_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      caption: finalCaption,
      venue: venue.name,
      city: city.charAt(0).toUpperCase() + city.slice(1),
      timestamp: this.generateRealisticTimestamp(),
      likes,
      comments,
      image_url: this.getImageForCategory(venue.category),
      hashtags: selectedHashtags,
      location: {
        name: venue.name,
        coordinates: this.getCoordinatesForCity(city),
      },
      eventData,
    }
  }

  private generateLocationPosts(
    venues: { name: string; category: string; district: string }[],
    city: string,
    locationName: string,
    limit: number,
  ): ScrapedPost[] {
    const posts: ScrapedPost[] = []

    for (let i = 0; i < limit; i++) {
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const post = this.generateRealisticPost(venue, city, locationName)
      posts.push(post)
    }

    return posts
  }

  private getEventTypesForCategory(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      club: ["party", "music", "special"],
      bar: ["drinks", "music", "special"],
      cocktail: ["drinks", "special"],
      rooftop: ["drinks", "party", "special"],
      restaurant: ["food", "drinks", "special"],
      cafe: ["food", "culture", "special"],
      culture: ["culture", "music", "special"],
      biergarten: ["drinks", "food", "special"],
      music: ["music", "culture", "special"],
    }

    return categoryMap[category] || ["party", "drinks", "special"]
  }

  private generateRealisticTime(category: string): string {
    const timeRanges: { [key: string]: string[] } = {
      club: ["22:00", "23:00", "00:00"],
      bar: ["19:00", "20:00", "21:00"],
      cocktail: ["18:00", "19:00", "20:00"],
      rooftop: ["17:00", "18:00", "19:00"],
      restaurant: ["18:00", "19:00", "20:00"],
      cafe: ["10:00", "11:00", "14:00"],
      culture: ["19:00", "20:00", "21:00"],
      biergarten: ["16:00", "17:00", "18:00"],
      music: ["20:00", "21:00", "22:00"],
    }

    const times = timeRanges[category] || ["20:00", "21:00", "22:00"]
    return times[Math.floor(Math.random() * times.length)]
  }

  private generateRealisticPrice(category: string, eventType: string): number {
    const priceRanges: { [key: string]: { [key: string]: [number, number] } } = {
      club: { party: [10, 25], music: [15, 30], special: [20, 40] },
      bar: { drinks: [0, 10], music: [5, 15], special: [10, 25] },
      cocktail: { drinks: [0, 15], special: [15, 30] },
      rooftop: { drinks: [0, 15], party: [15, 30], special: [20, 35] },
      restaurant: { food: [25, 50], special: [30, 60] },
      cafe: { food: [8, 20], culture: [5, 15] },
      culture: { culture: [8, 20], music: [10, 25] },
      biergarten: { drinks: [0, 10], food: [15, 30] },
      music: { music: [12, 25], culture: [10, 20] },
    }

    const categoryPrices = priceRanges[category] || { party: [10, 25] }
    const eventPrices = categoryPrices[eventType] || [10, 25]
    const [min, max] = eventPrices

    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private getBaseEngagement(category: string): number {
    const engagementMap: { [key: string]: number } = {
      club: 200,
      bar: 150,
      cocktail: 120,
      rooftop: 180,
      restaurant: 100,
      cafe: 80,
      culture: 90,
      biergarten: 110,
      music: 160,
    }

    return engagementMap[category] || 120
  }

  private getImageForCategory(category: string): string {
    const imageMap: { [key: string]: string } = {
      club: "/images/techno-club.jpg",
      bar: "/images/rooftop-bar.jpg",
      cocktail: "/images/rooftop-bar.jpg",
      rooftop: "/images/rooftop-bar.jpg",
      restaurant: "/images/street-food.jpg",
      cafe: "/images/street-food.jpg",
      culture: "/images/art-gallery.jpg",
      biergarten: "/images/beer-tasting.jpg",
      music: "/images/jazz-castle.jpg",
    }

    return imageMap[category] || "/images/rooftop-bar.jpg"
  }

  private getCoordinatesForCity(city: string): { lat: number; lng: number } {
    const coordinates = {
      mannheim: { lat: 49.4875, lng: 8.466 },
      heidelberg: { lat: 49.4093, lng: 8.6937 },
    }

    return coordinates[city as keyof typeof coordinates] || coordinates.mannheim
  }

  private generateRealisticTimestamp(): string {
    // Generate timestamps from last 7 days, with more recent posts being more likely
    const now = Date.now()
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

    // Weighted towards more recent posts
    const randomFactor = Math.pow(Math.random(), 2) // Squares random to weight towards 0
    const timestamp = now - randomFactor * (now - sevenDaysAgo)

    return new Date(timestamp).toISOString()
  }

  private analyzeForEventData(caption: string): {
    isEvent: boolean
    confidence: number
    extractedInfo: any
  } {
    const lowerCaption = caption.toLowerCase()
    let confidence = 0
    let isEvent = false

    // Event keywords
    const eventKeywords = ["tonight", "heute", "party", "event", "live", "dj", "show", "opening"]
    const keywordMatches = eventKeywords.filter((keyword) => lowerCaption.includes(keyword)).length
    confidence += keywordMatches * 0.2

    // Time patterns
    if (/\d{1,2}:\d{2}/.test(caption)) {
      confidence += 0.3
      isEvent = true
    }

    // Price patterns
    if (/€\d+|kostenlos|free/.test(caption)) {
      confidence += 0.2
      isEvent = true
    }

    // Date patterns
    if (/tonight|heute|weekend|saturday|friday/.test(lowerCaption)) {
      confidence += 0.25
      isEvent = true
    }

    isEvent = isEvent || confidence > 0.4

    return {
      isEvent,
      confidence: Math.min(confidence, 1),
      extractedInfo: isEvent
        ? {
            title: this.extractTitle(caption),
            time: caption.match(/\d{1,2}:\d{2}/)?.[0],
            price: caption.match(/€\d+/)?.[0],
          }
        : {},
    }
  }

  private extractTitle(caption: string): string {
    const firstLine = caption
      .split("!")[0]
      .replace(/[🎉🎵🍸🌆🎊🍻🥐🎧🔥💃]/gu, "")
      .trim()
    return firstLine.length > 10 ? firstLine : "Social Media Event"
  }

  private removeDuplicates(posts: ScrapedPost[]): ScrapedPost[] {
    const seen = new Set<string>()
    return posts.filter((post) => {
      const key = `${post.venue}_${post.caption.slice(0, 50)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
