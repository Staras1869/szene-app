import { PrismaClient } from "@prisma/client"
import { seedVenues } from "./seed-venues"
import { seedEvents } from "./seed-events"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔄 Starting database initialization...")

    // Check database connection
    await prisma.$connect()
    console.log("✅ Connected to Neon PostgreSQL database")

    // Seed venues
    console.log("🏙️ Seeding venues...")
    const venuesCount = await seedVenues(prisma)
    console.log(`✅ Added ${venuesCount} venues to the database`)

    // Seed events
    console.log("🎭 Seeding events...")
    const eventsCount = await seedEvents(prisma)
    console.log(`✅ Added ${eventsCount} events to the database`)

    console.log("✨ Database initialization complete!")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
