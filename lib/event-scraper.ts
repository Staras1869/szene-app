export interface ScrapedEvent {
  title: string
  venue: string
  date: string
  time: string
  city: string
  category: string
  price: string
  description: string
  url: string
  imageUrl?: string
}

export class EventScraper {
  private sources = [
    {
      name: "Mannheim.de",
      url: "https://www.mannheim.de/de/veranstaltungen",
      selector: ".event-item",
      cityFilter: "Mannheim",
    },
    {
      name: "Heidelberg.de",
      url: "https://www.heidelberg.de/hd/HD/service/veranstaltungen.html",
      selector: ".event-card",
      cityFilter: "Heidelberg",
    },
  ]

  async scrapeEvents(): Promise<ScrapedEvent[]> {
    // Mock data for deployment - simulating real scraped events
    const mockEvents = [
      {
        title: "Summer Jazz Festival",
        venue: "Luisenpark Mannheim",
        date: "2024-07-15",
        time: "19:00",
        city: "Mannheim",
        category: "Music",
        price: "€25",
        description: "Ein wunderbarer Jazz-Abend im Park mit internationalen Künstlern",
        url: "https://example.com/jazz-festival",
        imageUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        title: "Heidelberg Food Market",
        venue: "Hauptstraße",
        date: "2024-07-20",
        time: "12:00",
        city: "Heidelberg",
        category: "Food",
        price: "Free",
        description: "Lokale Spezialitäten und internationale Küche in der Altstadt",
        url: "https://example.com/food-market",
        imageUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        title: "Techno Underground",
        venue: "MS Connexion",
        date: "2024-07-22",
        time: "23:00",
        city: "Mannheim",
        category: "Nightlife",
        price: "€20",
        description: "Die heißesten Techno-Beats in Mannheims Underground-Szene",
        url: "https://example.com/techno-night",
        imageUrl: "/placeholder.svg?height=400&width=600",
      },
      {
        title: "Rooftop Cinema",
        venue: "Skybar Heidelberg",
        date: "2024-07-25",
        time: "21:30",
        city: "Heidelberg",
        category: "Art",
        price: "€15",
        description: "Filme unter dem Sternenhimmel mit Blick über die Stadt",
        url: "https://example.com/rooftop-cinema",
        imageUrl: "/placeholder.svg?height=400&width=600",
      },
    ]

    // Simulate network delay
    await this.delay(1000)

    return mockEvents
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
