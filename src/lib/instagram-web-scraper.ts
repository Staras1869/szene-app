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
    console.warn(`[instagram-web-scraper] Hashtag scraping not implemented; skipping #${hashtag}`)
    return []
  }

  async scrapeLocation(locationName: string, limit = 20): Promise<ScrapedPost[]> {
    console.warn(`[instagram-web-scraper] Location scraping not implemented; skipping location ${locationName}`)
    return []
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
