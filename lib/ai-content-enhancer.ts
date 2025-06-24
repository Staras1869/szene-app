export class AIContentEnhancer {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async enhanceEventDescription(event: any): Promise<string> {
    // Return enhanced description if no API key or in development
    if (!this.apiKey || process.env.NODE_ENV === "development") {
      return this.generateMockDescription(event)
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Du bist ein Experte für Events in Mannheim und Heidelberg. Schreibe ansprechende, kurze Beschreibungen für Events (max 150 Wörter) auf Deutsch. Halte dich an soziale Richtlinien und vermeide kontroverse Inhalte.",
            },
            {
              role: "user",
              content: `Event: ${event.title}
Venue: ${event.venue}
Stadt: ${event.city}
Kategorie: ${event.category}
Originale Beschreibung: ${event.description}

Schreibe eine ansprechende, familienfreundliche Beschreibung für dieses Event.`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      return data.choices[0]?.message?.content || this.generateMockDescription(event)
    } catch (error) {
      console.error("AI enhancement error:", error)
      return this.generateMockDescription(event)
    }
  }

  async generateEventImage(event: any): Promise<string | null> {
    // Return themed placeholder in development or if no API key
    if (!this.apiKey || process.env.NODE_ENV === "development") {
      return this.generateThemedPlaceholder(event)
    }

    try {
      // Create appropriate, professional prompts that comply with social guidelines
      const safePrompt = this.createSafeImagePrompt(event)

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: safePrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        }),
      })

      const data = await response.json()
      return data.data[0]?.url || this.generateThemedPlaceholder(event)
    } catch (error) {
      console.error("Image generation error:", error)
      return this.generateThemedPlaceholder(event)
    }
  }

  private createSafeImagePrompt(event: any): string {
    const safePrompts = {
      Music: `Professional concert venue interior with stage lighting, modern sound equipment, and elegant seating. Clean, sophisticated atmosphere for ${event.title}. No people visible, architectural photography style.`,
      Nightlife: `Elegant upscale bar interior with ambient lighting, modern furniture, and sophisticated decor. Professional venue photography, no people, clean and tasteful design for ${event.venue}.`,
      Food: `Beautiful restaurant interior with elegant table settings, warm lighting, and modern decor. Professional food venue photography, no people, sophisticated dining atmosphere.`,
      Art: `Contemporary art gallery space with white walls, professional lighting, and modern exhibition setup. Clean, minimalist interior design, no people, cultural venue photography.`,
      Culture: `Modern cultural center interior with elegant architecture, professional lighting, and sophisticated design. Clean venue photography, no people, contemporary cultural space.`,
      Social: `Elegant event space with modern furniture, warm lighting, and sophisticated decor. Professional venue photography, clean and welcoming atmosphere, no people visible.`,
    }

    const category = event.category as keyof typeof safePrompts
    return safePrompts[category] || safePrompts.Social
  }

  private generateMockDescription(event: any): string {
    const templates = {
      Music: `Erlebe ${event.title} im ${event.venue} - ein unvergesslicher Musikabend mit erstklassigen Künstlern und perfekter Atmosphäre in familiärer Umgebung.`,
      Nightlife: `Genieße einen eleganten Abend bei ${event.title} im ${event.venue}. Hochwertige Getränke und stilvolle Atmosphäre für einen besonderen Abend.`,
      Food: `Kulinarische Genüsse erwarten dich bei ${event.title}. Entdecke lokale Spezialitäten und internationale Küche im ${event.venue} in entspannter Atmosphäre.`,
      Art: `Kunst und Kultur treffen sich bei ${event.title}. Lass dich inspirieren von diesem besonderen kulturellen Event im ${event.venue}.`,
      Culture: `Erlebe Kultur pur bei ${event.title} im ${event.venue}. Ein bereicherndes Event für alle Altersgruppen in wunderschöner Umgebung.`,
      Social: `Vernetze dich und hab Spaß bei ${event.title}. Ein geselliges, familienfreundliches Event im ${event.venue} für alle, die neue Leute kennenlernen möchten.`,
    }

    return (
      templates[event.category as keyof typeof templates] ||
      event.description ||
      "Ein spannendes, familienfreundliches Event erwartet dich!"
    )
  }

  private generateThemedPlaceholder(event: any): string {
    const themes = {
      Music: "/images/concert-hall.png",
      Nightlife: "/images/elegant-rooftop-bar.png",
      Food: "/images/beer-garden-venue.png",
      Art: "/images/cultural-center.png",
      Culture: "/images/modern-jazz-venue.png",
      Social: "/images/beer-garden-venue.png",
    }

    const theme = themes[event.category as keyof typeof themes] || "/images/cultural-center.png"
    return theme
  }
}
