import type { PrismaClient } from "@prisma/client"

export async function seedEvents(prisma: PrismaClient): Promise<number> {
  // Check if events already exist
  const existingCount = await prisma.event.count()
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing events, skipping seed`)
    return existingCount
  }

  // First, get venue IDs
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true },
  })

  if (venues.length === 0) {
    console.log("No venues found, skipping event seeding")
    return 0
  }

  // Map venue names to IDs for easier reference
  const venueMap = venues.reduce(
    (acc, venue) => {
      acc[venue.name] = venue.id
      return acc
    },
    {} as Record<string, string>,
  )

  // Sample events data
  const events = [
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
      tags: JSON.stringify(["DJ", "Rooftop", "Summer", "Cocktails"]),
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop",
      ]),
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
      description: "Deep electronic beats in Mannheim's premier underground venue with state-of-the-art sound system.",
      shortDescription: "Deep electronic music night",
      eventDate: new Date("2024-07-20"),
      startTime: new Date("2024-07-20T23:00:00"),
      endTime: new Date("2024-07-21T06:00:00"),
      price: "€20",
      category: "Music",
      tags: JSON.stringify(["Electronic", "Techno", "Underground", "DJ"]),
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
      description: "Sophisticated evening with live jazz performances and premium wine selection in historic setting.",
      shortDescription: "Jazz music with wine tasting",
      eventDate: new Date("2024-07-22"),
      startTime: new Date("2024-07-22T19:30:00"),
      endTime: new Date("2024-07-22T23:00:00"),
      price: "€25",
      category: "Art",
      tags: JSON.stringify(["Jazz", "Wine", "Live Music", "Cultural"]),
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop",
      ]),
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
      tags: JSON.stringify(["Art", "Festival", "Workshops", "Performances"]),
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
      description: "Relaxed afternoon concert in beautiful beer garden setting with local craft beers and live music.",
      shortDescription: "Outdoor concert with craft beers",
      eventDate: new Date("2024-07-28"),
      startTime: new Date("2024-07-28T16:00:00"),
      endTime: new Date("2024-07-28T22:00:00"),
      price: "€8",
      category: "Social",
      tags: JSON.stringify(["Beer", "Live Music", "Outdoor", "Summer"]),
      imageUrl: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop&auto=format",
      ticketUrl: "https://www.luisenpark.de/biergartenkonzert",
      capacity: 250,
      attendeesCount: 0,
      rsvpCount: 65,
      ageRestriction: 0,
      dressCode: "Casual",
    },
  ]

  // Insert events
  const result = await prisma.event.createMany({
    data: events,
    skipDuplicates: true,
  })

  return result.count
}
