export interface Venue {
  id: string
  name: string
  city: string
  category: string
  website?: string
  facebook?: string
  instagram?: string
  address: string
  description: string
  eventSelectors?: {
    title?: string
    date?: string
    time?: string
    description?: string
    price?: string
  }
}

export const MANNHEIM_HEIDELBERG_VENUES: Venue[] = [
  // Mannheim Venues
  {
    id: "tiffany-club",
    name: "Tiffany Club",
    city: "Mannheim",
    category: "Nightlife",
    website: "https://www.tiffany-club.de",
    facebook: "TiffanyClubMannheim",
    instagram: "tiffanyclubmannheim",
    address: "C4 9-10, 68159 Mannheim",
    description: "Premium nightclub in Mannheim's city center",
    eventSelectors: {
      title: ".event-title, h3",
      date: ".event-date, .date",
      time: ".event-time, .time",
      description: ".event-description, p",
      price: ".price, .entry",
    },
  },
  {
    id: "ms-connexion",
    name: "MS Connexion Complex",
    city: "Mannheim",
    category: "Music",
    website: "https://www.msconnexion.de",
    facebook: "msconnexion",
    instagram: "msconnexion",
    address: "Hafenstraße 25-27, 68159 Mannheim",
    description: "Multi-venue complex for electronic music and events",
  },
  {
    id: "capitol-mannheim",
    name: "Capitol Mannheim",
    city: "Mannheim",
    category: "Music",
    website: "https://www.capitol-mannheim.de",
    facebook: "CapitolMannheim",
    instagram: "capitolmannheim",
    address: "Waldhofstraße 2, 68169 Mannheim",
    description: "Concert hall and event venue",
  },
  {
    id: "alte-feuerwache",
    name: "Alte Feuerwache",
    city: "Mannheim",
    category: "Culture",
    website: "https://www.altefeuerwache.com",
    facebook: "AlteFeuerwachemannheim",
    instagram: "altefeuerwache_mannheim",
    address: "Brückenstraße 2, 68167 Mannheim",
    description: "Cultural center with diverse events",
  },
  {
    id: "zeitraumexit",
    name: "Zeitraumexit",
    city: "Mannheim",
    category: "Nightlife",
    website: "https://www.zeitraumexit.de",
    facebook: "zeitraumexit",
    instagram: "zeitraumexit",
    address: "Hafenstraße 25-27, 68159 Mannheim",
    description: "Underground club for electronic music",
  },

  // Heidelberg Venues
  {
    id: "karlstorbahnhof",
    name: "Karlstorbahnhof",
    city: "Heidelberg",
    category: "Culture",
    website: "https://www.karlstorbahnhof.de",
    facebook: "karlstorbahnhof",
    instagram: "karlstorbahnhof",
    address: "Marlene-Dietrich-Platz 3, 69126 Heidelberg",
    description: "Cultural center in former train station",
  },
  {
    id: "halle02",
    name: "halle02",
    city: "Heidelberg",
    category: "Music",
    website: "https://www.halle02.de",
    facebook: "halle02heidelberg",
    instagram: "halle02_heidelberg",
    address: "Zollhofgarten 2, 69115 Heidelberg",
    description: "Concert venue and club",
  },
  {
    id: "cave54",
    name: "Cave 54",
    city: "Heidelberg",
    category: "Nightlife",
    website: "https://www.cave54.de",
    facebook: "Cave54Heidelberg",
    instagram: "cave54heidelberg",
    address: "Krämergasse 7, 69117 Heidelberg",
    description: "Underground club in Heidelberg's old town",
  },
  {
    id: "villa-nachttanz",
    name: "Villa Nachttanz",
    city: "Heidelberg",
    category: "Nightlife",
    website: "https://www.villa-nachttanz.de",
    facebook: "VillaNachttanz",
    instagram: "villanachttanz",
    address: "Lauerstraße 1, 69117 Heidelberg",
    description: "Elegant nightclub with multiple floors",
  },
  {
    id: "schwimmbad-club",
    name: "Schwimmbad Club",
    city: "Heidelberg",
    category: "Music",
    website: "https://www.schwimmbad-club.de",
    facebook: "SchwimmbadClub",
    instagram: "schwimmbadclub",
    address: "Tiergartenstraße 13, 69121 Heidelberg",
    description: "Alternative music venue",
  },
]

export class VenueDatabase {
  getVenues(city?: string, category?: string): Venue[] {
    let venues = MANNHEIM_HEIDELBERG_VENUES

    if (city && city !== "all") {
      venues = venues.filter((v) => v.city.toLowerCase() === city.toLowerCase())
    }

    if (category && category !== "all") {
      venues = venues.filter((v) => v.category.toLowerCase() === category.toLowerCase())
    }

    return venues
  }

  getVenueById(id: string): Venue | undefined {
    return MANNHEIM_HEIDELBERG_VENUES.find((v) => v.id === id)
  }

  getVenuesByCategory(category: string): Venue[] {
    return MANNHEIM_HEIDELBERG_VENUES.filter((v) => v.category.toLowerCase() === category.toLowerCase())
  }
}
