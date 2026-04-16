import { EventScraper } from "./event-scraper"
import { AIContentEnhancer } from "./ai-content-enhancer"
import { EventDatabase } from "./database"

export class AutomationScheduler {
  private scraper: EventScraper
  private enhancer: AIContentEnhancer
  private database: EventDatabase
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  constructor(openaiApiKey?: string) {
    this.scraper = new EventScraper()
    this.enhancer = new AIContentEnhancer(openaiApiKey || "")
    this.database = new EventDatabase()
  }

  async startAutomation(): Promise<void> {
    if (this.isRunning) {
      console.log("Automation already running")
      return
    }

    this.isRunning = true
    console.log("🤖 Starting Szene automation...")

    // Load existing events
    await this.database.loadFromStorage()

    // Run initial scrape
    await this.runScrapingCycle()

    // Schedule regular scraping every 6 hours
    this.intervalId = setInterval(
      () => {
        this.runScrapingCycle()
      },
      6 * 60 * 60 * 1000,
    )

    console.log("✅ Automation started successfully")
  }

  async runScrapingCycle(): Promise<void> {
    try {
      console.log("🔍 Starting event scraping cycle...")

      // Scrape events from all sources
      const scrapedEvents = await this.scraper.scrapeEvents()
      console.log(`Found ${scrapedEvents.length} potential events`)

      let newEventsCount = 0

      for (const scrapedEvent of scrapedEvents) {
        // Check if event already exists
        const exists = await this.database.eventExists(scrapedEvent.title, scrapedEvent.venue, scrapedEvent.date)

        if (!exists) {
          // Enhance description with AI
          const enhancedDescription = await this.enhancer.enhanceEventDescription(scrapedEvent)

          // Generate image if none exists
          let imageUrl = scrapedEvent.imageUrl
          if (!imageUrl) {
            imageUrl = (await this.enhancer.generateEventImage(scrapedEvent)) || "/placeholder.svg"
          }

          // Save to database
          await this.database.saveEvent({
            ...scrapedEvent,
            description: enhancedDescription,
            imageUrl,
            sourceUrl: scrapedEvent.url,
          })

          newEventsCount++

          // Rate limiting for AI calls
          await this.delay(1000)
        }
      }

      console.log(`✅ Scraping cycle complete. Added ${newEventsCount} new events`)

      // Send notification about new events
      if (newEventsCount > 0) {
        await this.notifyAdmins(newEventsCount)
      }
    } catch (error) {
      console.error("❌ Error in scraping cycle:", error)
    }
  }

  async getAutomationStats(): Promise<{
    totalEvents: number
    pendingApproval: number
    approvedEvents: number
    lastUpdate: string
  }> {
    const allEvents = await this.database.getEvents()
    const pending = await this.database.getEvents({ status: "pending" })
    const approved = await this.database.getEvents({ status: "approved" })

    return {
      totalEvents: allEvents.length,
      pendingApproval: pending.length,
      approvedEvents: approved.length,
      lastUpdate: new Date().toISOString(),
    }
  }

  async approveEvent(eventId: string): Promise<void> {
    await this.database.updateEventStatus(eventId, "approved")
  }

  async rejectEvent(eventId: string): Promise<void> {
    await this.database.updateEventStatus(eventId, "rejected")
  }

  async getPendingEvents(): Promise<any[]> {
    return await this.database.getEvents({ status: "pending" })
  }

  async getApprovedEvents(filters?: any): Promise<any[]> {
    return await this.database.getEvents({
      status: "approved",
      ...filters,
    })
  }

  private async notifyAdmins(newEventsCount: number): Promise<void> {
    console.log(`📧 Notification: ${newEventsCount} new events found and need approval`)

    // In a real app, you would send email notifications here
    if (typeof window !== "undefined") {
      // Store notification for admin dashboard
      const notifications = JSON.parse(localStorage.getItem("szene_notifications") || "[]")
      notifications.push({
        id: Date.now(),
        message: `${newEventsCount} new events found and need approval`,
        timestamp: new Date().toISOString(),
        type: "new_events",
      })
      localStorage.setItem("szene_notifications", JSON.stringify(notifications))
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  stopAutomation(): void {
    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    console.log("🛑 Automation stopped")
  }

  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning }
  }
}
