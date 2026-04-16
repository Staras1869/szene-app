import { VenueDatabase } from "./venues-database"
import { AdvancedWebScraper } from "./advanced-web-scraper"
import { SocialMediaIntegration } from "./social-media-integration"
import { AIContentEnhancer } from "./ai-content-enhancer"
import { EventDatabase } from "./database"

export class ComprehensiveAutomation {
  private venueDb: VenueDatabase
  private webScraper: AdvancedWebScraper
  private socialMedia: SocialMediaIntegration
  private aiEnhancer: AIContentEnhancer
  private eventDb: EventDatabase
  private isRunning = false
  private mainIntervalId: NodeJS.Timeout | null = null
  private socialIntervalId: NodeJS.Timeout | null = null

  constructor(
    config: {
      openaiApiKey?: string
      facebookAccessToken?: string
      instagramAccessToken?: string
    } = {},
  ) {
    this.venueDb = new VenueDatabase()
    this.webScraper = new AdvancedWebScraper()
    this.socialMedia = new SocialMediaIntegration({
      facebookAccessToken: config.facebookAccessToken,
      instagramAccessToken: config.instagramAccessToken,
    })
    this.aiEnhancer = new AIContentEnhancer(config.openaiApiKey || "")
    this.eventDb = new EventDatabase()
  }

  async startComprehensiveAutomation(): Promise<void> {
    if (this.isRunning) {
      console.log("🤖 Automation already running")
      return
    }

    this.isRunning = true
    console.log("🚀 Starting HOURLY comprehensive event automation system...")

    // Load existing events
    await this.eventDb.loadFromStorage()

    // Run initial comprehensive scrape
    await this.runComprehensiveScrape()

    // Schedule main scraping every HOUR (3600000 ms)
    this.mainIntervalId = setInterval(
      () => {
        console.log("⏰ Hourly automation cycle starting...")
        this.runComprehensiveScrape()
      },
      60 * 60 * 1000,
    ) // 1 hour

    // Schedule social media monitoring every 30 minutes
    this.socialIntervalId = setInterval(
      () => {
        console.log("📱 30-minute social media check...")
        this.runSocialMediaMonitoring()
      },
      30 * 60 * 1000,
    ) // 30 minutes

    console.log("✅ HOURLY automation started successfully!")
    console.log("📅 Main scraping: Every 1 hour")
    console.log("📱 Social monitoring: Every 30 minutes")
  }

  async runComprehensiveScrape(): Promise<void> {
    const startTime = Date.now()
    console.log("🔍 Starting COMPREHENSIVE scraping cycle...")

    try {
      const venues = this.venueDb.getVenues()
      console.log(`🏢 Found ${venues.length} venues to scrape`)

      let totalNewEvents = 0
      let totalProcessedEvents = 0

      // Process venues in batches to avoid overwhelming the system
      const batchSize = 3
      for (let i = 0; i < venues.length; i += batchSize) {
        const batch = venues.slice(i, i + batchSize)
        console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(venues.length / batchSize)}`)

        await Promise.all(
          batch.map(async (venue) => {
            try {
              console.log(`🏢 Processing ${venue.name} (${venue.city})...`)

              // Scrape all sources for this venue
              const scrapedEvents = await this.webScraper.scrapeAllSources(venue)
              totalProcessedEvents += scrapedEvents.length

              // Get social media events
              const [facebookEvents, instagramEvents] = await Promise.all([
                this.socialMedia.getFacebookEvents(venue),
                this.socialMedia.getInstagramEvents(venue),
              ])

              const allEvents = [...scrapedEvents, ...facebookEvents, ...instagramEvents]
              console.log(`📊 ${venue.name}: ${allEvents.length} total events found`)

              // Process each event
              for (const event of allEvents) {
                const exists = await this.eventDb.eventExists(event.title, event.venue, event.date)

                if (!exists) {
                  // Enhance with AI
                  const enhancedDescription = await this.aiEnhancer.enhanceEventDescription(event)
                  let imageUrl = event.imageUrl

                  if (!imageUrl || imageUrl.includes("placeholder")) {
                    imageUrl = (await this.aiEnhancer.generateEventImage(event)) || event.imageUrl
                  }

                  // Save to database
                  await this.eventDb.saveEvent({
                    ...event,
                    description: enhancedDescription,
                    imageUrl,
                    sourceUrl: event.url,
                    scrapedFrom: event.source,
                    lastScraped: new Date().toISOString(),
                  })

                  totalNewEvents++
                  console.log(`✅ Added: ${event.title} (${event.source})`)

                  // Rate limiting for AI calls
                  await this.delay(300)
                }
              }
            } catch (error) {
              console.error(`❌ Error processing ${venue.name}:`, error)
            }
          }),
        )

        // Delay between batches
        await this.delay(1000)
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`\n🎉 COMPREHENSIVE SCRAPING COMPLETE!`)
      console.log(`⏱️  Duration: ${duration} seconds`)
      console.log(`📊 Processed: ${totalProcessedEvents} events`)
      console.log(`✨ New events: ${totalNewEvents}`)

      if (totalNewEvents > 0) {
        await this.notifyAdmins(totalNewEvents, "hourly_comprehensive_scrape")
      }

      // Update stats
      await this.updateSystemStats(totalNewEvents, totalProcessedEvents)
    } catch (error) {
      console.error("❌ Error in comprehensive scraping cycle:", error)
    }
  }

  async runSocialMediaMonitoring(): Promise<void> {
    console.log("📱 Starting social media monitoring...")

    try {
      const venues = this.venueDb.getVenues()
      const socialEvents = await this.socialMedia.monitorSocialMediaUpdates(venues)

      let newSocialEvents = 0

      for (const event of socialEvents) {
        const exists = await this.eventDb.eventExists(event.title, event.venue, event.date)

        if (!exists) {
          const enhancedDescription = await this.aiEnhancer.enhanceEventDescription(event)

          await this.eventDb.saveEvent({
            ...event,
            description: enhancedDescription,
            scrapedFrom: event.source,
            lastScraped: new Date().toISOString(),
          })

          newSocialEvents++
        }
      }

      console.log(`📱 Social media monitoring complete: ${newSocialEvents} new events`)

      if (newSocialEvents > 0) {
        await this.notifyAdmins(newSocialEvents, "social_media_monitoring")
      }
    } catch (error) {
      console.error("❌ Error in social media monitoring:", error)
    }
  }

  async getComprehensiveStats(): Promise<{
    totalEvents: number
    pendingApproval: number
    approvedEvents: number
    eventsBySource: Record<string, number>
    eventsByVenue: Record<string, number>
    eventsByCity: Record<string, number>
    lastUpdate: string
    venuesMonitored: number
    systemStatus: string
    updateFrequency: string
    nextUpdate: string
  }> {
    const allEvents = await this.eventDb.getEvents()
    const pending = await this.eventDb.getEvents({ status: "pending" })
    const approved = await this.eventDb.getEvents({ status: "approved" })

    // Count events by source
    const eventsBySource: Record<string, number> = {}
    const eventsByVenue: Record<string, number> = {}
    const eventsByCity: Record<string, number> = {}

    allEvents.forEach((event) => {
      const source = (event as any).scrapedFrom || "unknown"
      eventsBySource[source] = (eventsBySource[source] || 0) + 1

      eventsByVenue[event.venue] = (eventsByVenue[event.venue] || 0) + 1
      eventsByCity[event.city] = (eventsByCity[event.city] || 0) + 1
    })

    // Calculate next update time
    const nextUpdate = new Date()
    nextUpdate.setHours(nextUpdate.getHours() + 1)

    return {
      totalEvents: allEvents.length,
      pendingApproval: pending.length,
      approvedEvents: approved.length,
      eventsBySource,
      eventsByVenue,
      eventsByCity,
      lastUpdate: new Date().toISOString(),
      venuesMonitored: this.venueDb.getVenues().length,
      systemStatus: this.isRunning ? "Active - Hourly Updates" : "Stopped",
      updateFrequency: "Every 1 hour (Social: 30 min)",
      nextUpdate: nextUpdate.toISOString(),
    }
  }

  async searchSpecificVenue(venueName: string): Promise<any[]> {
    console.log(`🔍 Searching specifically for ${venueName} events...`)

    const venues = this.venueDb.getVenues().filter((v) => v.name.toLowerCase().includes(venueName.toLowerCase()))

    if (venues.length === 0) {
      console.log(`No venues found matching "${venueName}"`)
      return []
    }

    const allEvents = []

    for (const venue of venues) {
      console.log(`🏢 Scraping ${venue.name}...`)
      const events = await this.webScraper.scrapeAllSources(venue)
      const socialEvents = await Promise.all([
        this.socialMedia.getFacebookEvents(venue),
        this.socialMedia.getInstagramEvents(venue),
      ])

      allEvents.push(...events, ...socialEvents.flat())
    }

    console.log(`✅ Found ${allEvents.length} events for "${venueName}"`)
    return allEvents
  }

  async forceUpdateAllVenues(): Promise<void> {
    console.log("🚀 FORCE UPDATE: Scraping all venues immediately...")
    await this.runComprehensiveScrape()
    await this.runSocialMediaMonitoring()
    console.log("✅ Force update complete!")
  }

  private async updateSystemStats(newEvents: number, processedEvents: number): Promise<void> {
    if (typeof window !== "undefined") {
      const stats = {
        lastRun: new Date().toISOString(),
        newEventsThisRun: newEvents,
        processedEventsThisRun: processedEvents,
        totalRuns: (Number.parseInt(localStorage.getItem("szene_total_runs") || "0") + 1).toString(),
      }
      localStorage.setItem("szene_automation_stats", JSON.stringify(stats))
      localStorage.setItem("szene_total_runs", stats.totalRuns)
    }
  }

  private async notifyAdmins(eventCount: number, source: string): Promise<void> {
    const timestamp = new Date().toLocaleString("de-DE")
    console.log(`📧 NOTIFICATION: ${eventCount} new events found from ${source} at ${timestamp}`)

    if (typeof window !== "undefined") {
      const notifications = JSON.parse(localStorage.getItem("szene_notifications") || "[]")
      notifications.unshift({
        // Add to beginning for latest first
        id: Date.now(),
        message: `${eventCount} new events found from ${source}`,
        timestamp: new Date().toISOString(),
        type: "new_events",
        source,
        count: eventCount,
      })

      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50)
      }

      localStorage.setItem("szene_notifications", JSON.stringify(notifications))
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  stopAutomation(): void {
    this.isRunning = false
    if (this.mainIntervalId) {
      clearInterval(this.mainIntervalId)
      this.mainIntervalId = null
    }
    if (this.socialIntervalId) {
      clearInterval(this.socialIntervalId)
      this.socialIntervalId = null
    }
    console.log("🛑 HOURLY automation stopped")
  }

  getStatus(): { isRunning: boolean; frequency: string } {
    return {
      isRunning: this.isRunning,
      frequency: "Every 1 hour (Social: 30 min)",
    }
  }

  // Delegate methods to maintain compatibility
  async startAutomation(): Promise<void> {
    return this.startComprehensiveAutomation()
  }

  async runScrapingCycle(): Promise<void> {
    return this.runComprehensiveScrape()
  }

  async getAutomationStats() {
    return this.getComprehensiveStats()
  }

  async approveEvent(eventId: string): Promise<void> {
    return this.eventDb.updateEventStatus(eventId, "approved")
  }

  async rejectEvent(eventId: string): Promise<void> {
    return this.eventDb.updateEventStatus(eventId, "rejected")
  }

  async getPendingEvents(): Promise<any[]> {
    return this.eventDb.getEvents({ status: "pending" })
  }

  async getApprovedEvents(filters?: any): Promise<any[]> {
    return this.eventDb.getEvents({
      status: "approved",
      ...filters,
    })
  }
}
