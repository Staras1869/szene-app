export interface Event {
  id: string
  title: string
  venue: string
  date: string
  time: string
  city: string
  category: string
  price: string
  description: string
  imageUrl: string
  sourceUrl: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  scrapedAt?: string
}

export class EventDatabase {
  private events: Event[] = []

  async saveEvent(eventData: any): Promise<Event> {
    const event: Event = {
      id: this.generateId(),
      ...eventData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
    }

    this.events.push(event)
    await this.persistToStorage()
    return event
  }

  async getEvents(filters?: {
    city?: string
    category?: string
    status?: string
    limit?: number
  }): Promise<Event[]> {
    let filtered = [...this.events]

    if (filters?.city && filters.city !== "all") {
      filtered = filtered.filter((e) => e.city.toLowerCase() === filters.city?.toLowerCase())
    }

    if (filters?.category && filters.category !== "all") {
      filtered = filtered.filter((e) => e.category.toLowerCase() === filters.category?.toLowerCase())
    }

    if (filters?.status) {
      filtered = filtered.filter((e) => e.status === filters.status)
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  async updateEventStatus(id: string, status: "approved" | "rejected"): Promise<void> {
    const event = this.events.find((e) => e.id === id)
    if (event) {
      event.status = status
      event.updatedAt = new Date().toISOString()
      await this.persistToStorage()
    }
  }

  async deleteEvent(id: string): Promise<void> {
    this.events = this.events.filter((e) => e.id !== id)
    await this.persistToStorage()
  }

  async eventExists(title: string, venue: string, date: string): Promise<boolean> {
    return this.events.some((e) => e.title === title && e.venue === venue && e.date === date)
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private async persistToStorage(): Promise<void> {
    // In a real app, this would save to a database
    // For demo purposes, we'll use localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("szene_events", JSON.stringify(this.events))
    }
  }

  async loadFromStorage(): Promise<void> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("szene_events")
      if (stored) {
        this.events = JSON.parse(stored)
      }
    }
  }
}
