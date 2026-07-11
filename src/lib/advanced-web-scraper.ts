import type { Venue } from "./venues-database"
import { ImageExtractor, type ExtractedImage } from "./image-extractor"

export interface ScrapedEventData {
  title: string
  venue: string
  venueId: string
  date: string
  time: string
  city: string
  category: string
  price: string
  description: string
  url: string
  imageUrl?: string
  extractedImage?: ExtractedImage
  source: "website" | "facebook" | "instagram"
  rawData?: any
}

export class AdvancedWebScraper {
  private imageExtractor: ImageExtractor
  private userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

  constructor() {
    this.imageExtractor = new ImageExtractor()
  }

  async scrapeVenueWebsite(venue: Venue): Promise<ScrapedEventData[]> {
    console.log(`🔍 Scraping website for ${venue.name}...`)

    if (!venue.website) {
      console.log(`No website found for ${venue.name}`)
      return []
    }

    console.warn(`[advanced-web-scraper] Website scraping not implemented; skipping ${venue.name}`)
    return []
  }

  async scrapeFacebookEvents(venue: Venue): Promise<ScrapedEventData[]> {
    console.log(`📘 Scraping Facebook events for ${venue.name}...`)

    if (!venue.facebook) {
      console.log(`No Facebook page found for ${venue.name}`)
      return []
    }

    console.warn(`[advanced-web-scraper] Facebook event scraping not implemented; skipping ${venue.name}`)
    return []
  }

  async scrapeInstagramEvents(venue: Venue): Promise<ScrapedEventData[]> {
    console.log(`📸 Scraping Instagram events for ${venue.name}...`)

    if (!venue.instagram) {
      console.log(`No Instagram account found for ${venue.name}`)
      return []
    }

    console.warn(`[advanced-web-scraper] Instagram event scraping not implemented; skipping ${venue.name}`)
    return []
  }

  private async generateRealisticEventsWithImages(
    venue: Venue,
    source: "website" | "facebook" | "instagram",
  ): Promise<ScrapedEventData[]> {
    const events: ScrapedEventData[] = []
    const currentDate = new Date()

    // Generate 3-8 events per venue (much more realistic)
    const eventCount = Math.floor(Math.random() * 6) + 3

    for (let i = 0; i < eventCount; i++) {
      const eventDate = new Date(currentDate)
      // Spread events over next 30 days instead of just weekly
      eventDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 30))

      const event = await this.createRealisticEventWithImage(venue, eventDate, source)
      events.push(event)
    }

    return events
  }

  private async createRealisticEventWithImage(
    venue: Venue,
    date: Date,
    source: "website" | "facebook" | "instagram",
  ): Promise<ScrapedEventData> {
    const category = venue.category // Declare the category variable
    const eventTemplates = this.getEventTemplates(category)
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]

    const dayOfWeek = date.toLocaleDateString("de-DE", { weekday: "long" })
    const isWeekend = date.getDay() === 5 || date.getDay() === 6

    const eventData = {
      title: template.title.replace("{venue}", venue.name).replace("{day}", dayOfWeek),
      venue: venue.name,
      venueId: venue.id,
      date: date.toISOString().split("T")[0],
      time: isWeekend ? template.weekendTime : template.weekdayTime,
      city: venue.city,
      category: venue.category,
      price: template.price,
      description: template.description.replace("{venue}", venue.name),
      url: this.generateEventUrl(venue, source),
      source,
      rawData: {
        scrapedAt: new Date().toISOString(),
        source: source,
        venueWebsite: venue.website,
      },
    }

    // Extract the best image for this event
    console.log(`🖼️ Finding catchy image for: ${eventData.title}`)
    const extractedImage = await this.imageExtractor.getBestEventImage(
      eventData,
      venue.website,
      venue.facebook ? `https://facebook.com/${venue.facebook}/events` : undefined,
      venue.instagram ? `https://instagram.com/${venue.instagram}` : undefined,
    )

    return {
      ...eventData,
      imageUrl: extractedImage.url,
      extractedImage,
    }
  }

  private getEventTemplates(category: string) {
    const templates = {
      Nightlife: [
        {
          title: "Saturday Night Fever 🎉",
          description: "Die heißeste Party der Woche mit den besten DJs und Drinks bis spät in die Nacht.",
          weekdayTime: "22:00",
          weekendTime: "23:00",
          price: "€15",
        },
        {
          title: "Ladies Night ✨",
          description: "Exklusiver Abend für alle Ladies mit speziellen Cocktails und großartiger Musik.",
          weekdayTime: "21:00",
          weekendTime: "22:00",
          price: "€12",
        },
        {
          title: "VIP Club Experience 🥂",
          description: "Premium Clubbing mit exklusivem Service und den angesagtesten Beats.",
          weekdayTime: "23:00",
          weekendTime: "23:30",
          price: "€25",
        },
        {
          title: "Rooftop Summer Sessions 🌆",
          description: "Spektakuläre Rooftop-Party mit Panoramablick über die Stadt.",
          weekdayTime: "21:00",
          weekendTime: "22:00",
          price: "€18",
        },
        {
          title: "Cocktail Masterclass 🍸",
          description: "Lerne von Profi-Barkeepern die Kunst des Cocktail-Mixens.",
          weekdayTime: "19:00",
          weekendTime: "20:00",
          price: "€35",
        },
        {
          title: "After Work Party 🍻",
          description: "Entspannter Feierabend mit Kollegen und neuen Leuten.",
          weekdayTime: "18:00",
          weekendTime: "19:00",
          price: "€8",
        },
        {
          title: "Karaoke Night 🎤",
          description: "Sing deine Lieblingssongs und hab Spaß mit Freunden.",
          weekdayTime: "20:00",
          weekendTime: "21:00",
          price: "€10",
        },
        {
          title: "Speed Dating Event 💕",
          description: "Lerne interessante Singles in entspannter Atmosphäre kennen.",
          weekdayTime: "19:30",
          weekendTime: "20:00",
          price: "€20",
        },
      ],
      Music: [
        {
          title: "Electronic Beats Night 🎵",
          description: "Elektronische Musik vom Feinsten mit lokalen und internationalen DJs.",
          weekdayTime: "20:00",
          weekendTime: "21:00",
          price: "€18",
        },
        {
          title: "Live Concert Series 🎸",
          description: "Authentische Live-Musik von aufstrebenden und etablierten Künstlern.",
          weekdayTime: "19:30",
          weekendTime: "20:00",
          price: "€22",
        },
        {
          title: "Underground Session 🎧",
          description: "Experimentelle Sounds und Underground-Vibes für echte Musikliebhaber.",
          weekdayTime: "21:00",
          weekendTime: "22:00",
          price: "€16",
        },
        {
          title: "Jazz & Blues Evening 🎷",
          description: "Entspannte Jazz- und Blues-Klänge in intimer Atmosphäre.",
          weekdayTime: "19:00",
          weekendTime: "20:00",
          price: "€20",
        },
        {
          title: "Acoustic Sessions 🎻",
          description: "Unplugged-Konzerte mit Singer-Songwritern und Akustik-Bands.",
          weekdayTime: "18:30",
          weekendTime: "19:30",
          price: "€15",
        },
        {
          title: "DJ Battle Night 🎛️",
          description: "Die besten DJs der Region kämpfen um den Titel des Abends.",
          weekdayTime: "21:30",
          weekendTime: "22:30",
          price: "€12",
        },
        {
          title: "Open Mic Night 🎤",
          description: "Zeig dein Talent! Offene Bühne für alle Musikrichtungen.",
          weekdayTime: "20:00",
          weekendTime: "20:30",
          price: "€5",
        },
      ],
      Culture: [
        {
          title: "Kultureller {day} 🎭",
          description: "Vielfältiges Kulturprogramm mit Kunst, Musik und Performance.",
          weekdayTime: "19:00",
          weekendTime: "18:00",
          price: "€14",
        },
        {
          title: "Art & Wine Evening 🎨",
          description: "Kunstausstellung kombiniert mit Weinverkostung in entspannter Atmosphäre.",
          weekdayTime: "18:30",
          weekendTime: "19:00",
          price: "€20",
        },
        {
          title: "Theater & Performance 🎪",
          description: "Innovative Theateraufführungen und Performance-Kunst.",
          weekdayTime: "20:00",
          weekendTime: "19:00",
          price: "€16",
        },
        {
          title: "Poetry Slam 📝",
          description: "Wortakrobatik und Slam Poetry von lokalen und überregionalen Künstlern.",
          weekdayTime: "20:00",
          weekendTime: "19:30",
          price: "€12",
        },
        {
          title: "Film Screening 🎬",
          description: "Indie-Filme und Dokumentationen mit anschließender Diskussion.",
          weekdayTime: "19:30",
          weekendTime: "18:30",
          price: "€10",
        },
        {
          title: "Book Club Meeting 📚",
          description: "Literaturliebhaber diskutieren über aktuelle Bücher bei Wein und Snacks.",
          weekdayTime: "19:00",
          weekendTime: "17:00",
          price: "€8",
        },
      ],
      Food: [
        {
          title: "Culinary Festival 🍽️",
          description: "Kulinarische Reise durch lokale und internationale Spezialitäten.",
          weekdayTime: "18:00",
          weekendTime: "17:00",
          price: "€25",
        },
        {
          title: "Beer Garden Session 🍺",
          description: "Traditionelle Biergarten-Atmosphäre mit lokalen Bieren und Snacks.",
          weekdayTime: "17:00",
          weekendTime: "16:00",
          price: "€12",
        },
        {
          title: "Wine Tasting 🍷",
          description: "Verkostung regionaler Weine mit Käse und kleinen Häppchen.",
          weekdayTime: "19:00",
          weekendTime: "18:00",
          price: "€30",
        },
        {
          title: "Cooking Workshop 👨‍🍳",
          description: "Lerne von Profi-Köchen neue Rezepte und Techniken.",
          weekdayTime: "18:30",
          weekendTime: "17:30",
          price: "€45",
        },
        {
          title: "Brunch Special 🥐",
          description: "Ausgiebiger Brunch mit frischen, lokalen Zutaten.",
          weekdayTime: "10:00",
          weekendTime: "10:00",
          price: "€18",
        },
        {
          title: "Street Food Market 🌮",
          description: "Internationale Street Food Vielfalt von verschiedenen Anbietern.",
          weekdayTime: "17:00",
          weekendTime: "16:00",
          price: "€15",
        },
      ],
      Social: [
        {
          title: "Networking Event 🤝",
          description: "Entspanntes Networking in gemütlicher Atmosphäre.",
          weekdayTime: "18:30",
          weekendTime: "19:00",
          price: "€10",
        },
        {
          title: "Community Gathering 👥",
          description: "Geselliges Beisammensein für alle Altersgruppen.",
          weekdayTime: "19:00",
          weekendTime: "18:00",
          price: "€8",
        },
        {
          title: "Game Night 🎲",
          description: "Brettspiele, Kartenspiele und Spaß mit neuen Leuten.",
          weekdayTime: "19:30",
          weekendTime: "20:00",
          price: "€5",
        },
        {
          title: "Language Exchange 🗣️",
          description: "Sprachen lernen und üben in entspannter Runde.",
          weekdayTime: "19:00",
          weekendTime: "18:30",
          price: "€7",
        },
        {
          title: "Singles Meetup 💫",
          description: "Ungezwungenes Kennenlernen für Singles jeden Alters.",
          weekdayTime: "20:00",
          weekendTime: "19:30",
          price: "€12",
        },
      ],
    }

    return templates[category as keyof typeof templates] || templates.Social
  }

  private generateEventUrl(venue: Venue, source: string): string {
    const baseUrl = venue.website || `https://example.com/${venue.id}`
    return `${baseUrl}/events/${Date.now()}`
  }

  async scrapeAllSources(venue: Venue): Promise<ScrapedEventData[]> {
    console.log(`🚀 Starting comprehensive scraping for ${venue.name}`)

    const results = await Promise.allSettled([
      this.scrapeVenueWebsite(venue),
      this.scrapeFacebookEvents(venue),
      this.scrapeInstagramEvents(venue),
    ])

    const allEvents: ScrapedEventData[] = []

    results.forEach((result, index) => {
      const source = ["website", "facebook", "instagram"][index]
      if (result.status === "fulfilled") {
        allEvents.push(...result.value)
        console.log(`✅ ${source} scraping successful for ${venue.name}: ${result.value.length} events`)
      } else {
        console.error(`❌ ${source} scraping failed for ${venue.name}:`, result.reason)
      }
    })

    return this.deduplicateEvents(allEvents)
  }

  private deduplicateEvents(events: ScrapedEventData[]): ScrapedEventData[] {
    const seen = new Set<string>()
    return events.filter((event) => {
      const key = `${event.title}-${event.date}-${event.venue}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}
