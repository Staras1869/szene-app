import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  await prisma.event.deleteMany()
  await prisma.venue.deleteMany()
  console.log("🧹 Cleared existing data")

  // Seed venues
  const venues = await prisma.venue.createMany({
    data: [
      {
        name: "Skybar Mannheim",
        slug: "skybar-mannheim",
        category: "Nightlife",
        subcategory: "Rooftop Bar",
        city: "Mannheim",
        district: "Quadrate",
        address: "Q7 17-21, 68161 Mannheim",
        latitude: 49.4873,
        longitude: 8.466,
        phone: "+49 621 12345678",
        email: "info@skybar-mannheim.de",
        website: "https://www.skybar-mannheim.de",
        instagram: "skybar_mannheim",
        description:
          "Experience summer nights on our spectacular rooftop terrace with panoramic city views and craft cocktails.",
        shortDescription: "Rooftop bar with panoramic city views",
        priceRange: "€€",
        openingHours: {
          monday: "18:00-01:00",
          tuesday: "18:00-01:00",
          wednesday: "18:00-01:00",
          thursday: "18:00-02:00",
          friday: "18:00-03:00",
          saturday: "18:00-03:00",
          sunday: "16:00-00:00",
        },
        features: ["Rooftop", "Cocktails", "City View", "DJ"],
        amenities: ["Outdoor Seating", "Reservations", "Card Payment"],
        images: [
          "/images/rooftop-bar.jpg",
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop",
        ],
        menuUrl: "https://www.skybar-mannheim.de/menu",
        reservationUrl: "https://www.skybar-mannheim.de/reservations",
        rating: 4.7,
        reviewCount: 128,
        checkInCount: 345,
        favoriteCount: 89,
        verified: true,
        featured: true,
      },
      {
        name: "MS Connexion",
        slug: "ms-connexion",
        category: "Music",
        subcategory: "Club",
        city: "Mannheim",
        district: "Jungbusch",
        address: "Angelstraße 33, 68199 Mannheim",
        latitude: 49.4913,
        longitude: 8.4553,
        phone: "+49 621 87654321",
        website: "https://www.msconnexion.de",
        instagram: "msconnexion",
        description:
          "Deep electronic beats in Mannheim's premier underground venue with state-of-the-art sound system.",
        shortDescription: "Premier electronic music venue",
        priceRange: "€€",
        openingHours: {
          friday: "23:00-06:00",
          saturday: "23:00-08:00",
        },
        features: ["Live Music", "DJ Sets", "Dance Floor"],
        amenities: ["Bar", "Smoking Area", "Coat Check"],
        images: ["https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop"],
        rating: 4.5,
        reviewCount: 210,
        checkInCount: 780,
        favoriteCount: 156,
        verified: true,
      },
      {
        name: "Heidelberg Castle",
        slug: "heidelberg-castle",
        category: "Art",
        subcategory: "Historic Venue",
        city: "Heidelberg",
        address: "Schlosshof 1, 69117 Heidelberg",
        latitude: 49.4106,
        longitude: 8.7153,
        phone: "+49 6221 538431",
        website: "https://www.heidelberg-castle.de",
        description:
          "Historic castle hosting sophisticated evening with live jazz performances and premium wine selection.",
        shortDescription: "Historic castle with cultural events",
        priceRange: "€€€",
        openingHours: {
          monday: "08:00-18:00",
          tuesday: "08:00-18:00",
          wednesday: "08:00-18:00",
          thursday: "08:00-18:00",
          friday: "08:00-18:00",
          saturday: "08:00-18:00",
          sunday: "08:00-18:00",
        },
        features: ["Historic Site", "Cultural Events", "Scenic Views"],
        amenities: ["Guided Tours", "Restaurant", "Gift Shop"],
        images: [
          "/images/jazz-castle.jpg",
          "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
        ],
        rating: 4.9,
        reviewCount: 342,
        checkInCount: 1245,
        favoriteCount: 278,
        verified: true,
        featured: true,
      },
      {
        name: "Alte Feuerwache",
        slug: "alte-feuerwache",
        category: "Culture",
        subcategory: "Event Space",
        city: "Mannheim",
        district: "Neckarstadt",
        address: "Brückenstraße 2, 68167 Mannheim",
        latitude: 49.5003,
        longitude: 8.4778,
        phone: "+49 621 1566055",
        email: "info@altefeuerwache.com",
        website: "https://www.altefeuerwache.com",
        description:
          "Celebrate local and international artists with exhibitions, performances, and interactive workshops.",
        shortDescription: "Cultural center in historic fire station",
        priceRange: "€€",
        openingHours: {
          monday: "Closed",
          tuesday: "10:00-22:00",
          wednesday: "10:00-22:00",
          thursday: "10:00-22:00",
          friday: "10:00-00:00",
          saturday: "10:00-00:00",
          sunday: "12:00-20:00",
        },
        features: ["Live Performances", "Art Exhibitions", "Workshops"],
        amenities: ["Café", "Wheelchair Accessible", "Bike Parking"],
        images: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"],
        rating: 4.6,
        reviewCount: 187,
        checkInCount: 523,
        favoriteCount: 112,
        verified: true,
      },
      {
        name: "Luisenpark",
        slug: "luisenpark",
        category: "Social",
        subcategory: "Beer Garden",
        city: "Mannheim",
        address: "Theodor-Heuss-Anlage 2, 68165 Mannheim",
        latitude: 49.4786,
        longitude: 8.5008,
        phone: "+49 621 4100950",
        website: "https://www.luisenpark.de",
        description:
          "Relaxed afternoon concert in beautiful beer garden setting with local craft beers and live music.",
        shortDescription: "Beautiful park with beer garden",
        priceRange: "€",
        openingHours: {
          monday: "09:00-21:00",
          tuesday: "09:00-21:00",
          wednesday: "09:00-21:00",
          thursday: "09:00-21:00",
          friday: "09:00-21:00",
          saturday: "09:00-21:00",
          sunday: "09:00-21:00",
        },
        features: ["Beer Garden", "Live Music", "Park", "Family Friendly"],
        amenities: ["Food Stalls", "Playground", "Boat Rental"],
        images: [
          "/images/beer-tasting.jpg",
          "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop",
        ],
        rating: 4.8,
        reviewCount: 412,
        checkInCount: 1876,
        favoriteCount: 324,
        verified: true,
      },
    ],
  })

  console.log(`✅ Created ${venues.count} venues`)

  // Get the created venues to use their IDs for events
  const createdVenues = await prisma.venue.findMany({
    select: { id: true, name: true },
  })

  const venueMap = createdVenues.reduce(
    (acc, venue) => {
      acc[venue.name] = venue.id
      return acc
    },
    {} as Record<string, string>,
  )

  // Seed events
  const events = await prisma.event.createMany({
    data: [
      {
        venueId: venueMap["Skybar Mannheim"],
        title: "🌆 Rooftop Summer Sessions",
        slug: "rooftop-summer-sessions",
        description:
          "Experience summer nights on our spectacular rooftop terrace with panoramic city views and craft cocktails.",
        shortDescription: "Summer DJ sessions with city views",
        eventDate: new Date("2024-07-15"),
        startTime: new Date("2024-07-15T21:00:00"),
        endTime: new Date("2024-07-16T02:00:00"),
        price: "€15",
        category: "Nightlife",
        tags: ["DJ", "Rooftop", "Summer", "Cocktails"],
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
        images: [
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop",
        ],
        ticketUrl: "https://www.skybar-mannheim.de/events/rooftop-sessions",
        capacity: 200,
        attendeesCount: 0,
        rsvpCount: 45,
        ageRestriction: 18,
        dressCode: "Smart Casual",
        featured: true,
      },
      {
        venueId: venueMap["MS Connexion"],
        title: "🎵 Underground Electronic Night",
        slug: "underground-electronic-night",
        description:
          "Deep electronic beats in Mannheim's premier underground venue with state-of-the-art sound system.",
        shortDescription: "Deep electronic music night",
        eventDate: new Date("2024-07-20"),
        startTime: new Date("2024-07-20T23:00:00"),
        endTime: new Date("2024-07-21T06:00:00"),
        price: "€20",
        category: "Music",
        tags: ["Electronic", "Techno", "Underground", "DJ"],
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format",
        ticketUrl: "https://www.msconnexion.de/events/electronic-night",
        capacity: 500,
        attendeesCount: 0,
        rsvpCount: 120,
        ageRestriction: 18,
        dressCode: "Casual",
      },
      {
        venueId: venueMap["Heidelberg Castle"],
        title: "🎷 Jazz & Wine Evening",
        slug: "jazz-wine-evening",
        description:
          "Sophisticated evening with live jazz performances and premium wine selection in historic setting.",
        shortDescription: "Jazz music with wine tasting",
        eventDate: new Date("2024-07-22"),
        startTime: new Date("2024-07-22T19:30:00"),
        endTime: new Date("2024-07-22T23:00:00"),
        price: "€25",
        category: "Art",
        tags: ["Jazz", "Wine", "Live Music", "Cultural"],
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
        images: [
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop",
        ],
        ticketUrl: "https://www.heidelberg-castle.de/events/jazz-wine",
        capacity: 150,
        attendeesCount: 0,
        rsvpCount: 78,
        ageRestriction: 18,
        dressCode: "Smart",
        featured: true,
      },
      {
        venueId: venueMap["Alte Feuerwache"],
        title: "🎨 Cultural Arts Festival",
        slug: "cultural-arts-festival",
        description:
          "Celebrate local and international artists with exhibitions, performances, and interactive workshops.",
        shortDescription: "Multi-day arts and culture festival",
        eventDate: new Date("2024-07-25"),
        startTime: new Date("2024-07-25T18:00:00"),
        endTime: new Date("2024-07-25T23:00:00"),
        price: "€12",
        category: "Culture",
        tags: ["Art", "Festival", "Workshops", "Performances"],
        imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
        ticketUrl: "https://www.altefeuerwache.com/kulturfestival",
        capacity: 300,
        attendeesCount: 0,
        rsvpCount: 95,
        ageRestriction: 0,
        featured: true,
      },
      {
        venueId: venueMap["Luisenpark"],
        title: "🍺 Beer Garden Concert",
        slug: "beer-garden-concert",
        description:
          "Relaxed afternoon concert in beautiful beer garden setting with local craft beers and live music.",
        shortDescription: "Outdoor concert with craft beers",
        eventDate: new Date("2024-07-28"),
        startTime: new Date("2024-07-28T16:00:00"),
        endTime: new Date("2024-07-28T22:00:00"),
        price: "€8",
        category: "Social",
        tags: ["Beer", "Live Music", "Outdoor", "Summer"],
        imageUrl: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop&auto=format",
        ticketUrl: "https://www.luisenpark.de/biergartenkonzert",
        capacity: 250,
        attendeesCount: 0,
        rsvpCount: 65,
        ageRestriction: 0,
        dressCode: "Casual",
      },
    ],
  })

  console.log(`✅ Created ${events.count} events`)
  console.log("🎉 Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
