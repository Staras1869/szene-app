import { type NextRequest, NextResponse } from "next/server"

// Helper to map OpenWeatherMap condition codes to simpler categories
function mapWeatherCondition(conditionCode: number): "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "unknown" {
  if (conditionCode >= 200 && conditionCode < 300) return "rainy" // Thunderstorm
  if (conditionCode >= 300 && conditionCode < 400) return "rainy" // Drizzle
  if (conditionCode >= 500 && conditionCode < 600) return "rainy" // Rain
  if (conditionCode >= 600 && conditionCode < 700) return "snowy" // Snow
  if (conditionCode >= 700 && conditionCode < 800) return "windy" // Atmosphere (fog, mist etc. - simplified to windy for now)
  if (conditionCode === 800) return "sunny" // Clear
  if (conditionCode === 801) return "sunny" // Few clouds
  if (conditionCode > 801 && conditionCode < 805) return "cloudy" // Clouds
  return "unknown"
}

// Helper to get a mock forecast
function getMockForecast(city: string, date: string) {
  const eventDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  let temp = 18
  let condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "unknown" = "sunny"
  let description = "Sonnig und angenehm"

  if (eventDate < today) {
    // Past event, maybe show actual historical if available, or just generic
    temp = 15
    condition = "cloudy"
    description = "Vergangenes Event"
  } else {
    const month = eventDate.getMonth()
    if (month >= 10 || month <= 2) {
      // Winter months
      temp = Math.floor(Math.random() * 8) + 2 // 2-10°C
      condition = Math.random() > 0.5 ? "cloudy" : "snowy"
      description = condition === "snowy" ? "Kalt und Schnee möglich" : "Kalt und bewölkt"
    } else if (month >= 5 && month <= 8) {
      // Summer months
      temp = Math.floor(Math.random() * 10) + 20 // 20-30°C
      condition = Math.random() > 0.3 ? "sunny" : "cloudy"
      description = condition === "sunny" ? "Warm und sonnig" : "Warm und leicht bewölkt"
    } else {
      // Spring/Autumn
      temp = Math.floor(Math.random() * 10) + 10 // 10-20°C
      condition = Math.random() > 0.5 ? "cloudy" : "rainy"
      description = condition === "rainy" ? "Kühl mit Regenrisiko" : "Mild und bewölkt"
    }
  }

  return {
    temperature: temp,
    condition,
    description,
    city,
    date,
    source: "mock",
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const date = searchParams.get("date") // Expected format YYYY-MM-DD
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if ((!city && (!lat || !lon)) || !date) {
    return NextResponse.json({ error: "City (or lat/lon) and date are required" }, { status: 400 })
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY
  if (!API_KEY) {
    console.warn("OPENWEATHER_API_KEY not found. Returning mock weather forecast.")
    return NextResponse.json(getMockForecast(city || "Unknown City", date))
  }

  try {
    // For simplicity, we'll use the 5 day / 3 hour forecast if the event is within 5 days.
    // OpenWeatherMap's free/startup tiers don't offer long-range daily forecasts easily via city name.
    // A more robust solution might use their OneCall API (requires lat/lon) or a paid plan.

    const eventDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(eventDate.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let forecastUrl: string

    if (lat && lon) {
      // Use One Call API if lat/lon are available (better for specific day forecast)
      // Note: OneCall API 3.0 might be needed. This example uses a common structure.
      // Adjust exclude parts as needed, e.g. exclude=current,minutely,hourly,alerts
      forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric&lang=de`
    } else if (city && diffDays <= 5) {
      // Use 5-day forecast if event is soon and only city is available
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=de`
    } else {
      // If event date is too far in the future for 5-day forecast or lat/lon is missing, return mock or a message
      console.log(
        `Event date ${date} is too far for 5-day forecast or lat/lon missing. Returning mock data for ${city}.`,
      )
      return NextResponse.json(getMockForecast(city || "Unknown City", date))
    }

    const response = await fetch(forecastUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenWeatherMap API error:", response.status, errorData)
      throw new Error(`Weather API failed with status ${response.status}`)
    }

    const data = await response.json()

    let relevantForecast
    if (lat && lon && data.daily) {
      // Handling OneCall API response
      const targetTimestamp = Math.floor(new Date(date + "T12:00:00Z").getTime() / 1000) // Target noon UTC on event date
      relevantForecast = data.daily.find((day: any) => {
        // Check if day.dt is for the target date
        const forecastDate = new Date(day.dt * 1000)
        return (
          forecastDate.getUTCFullYear() === eventDate.getUTCFullYear() &&
          forecastDate.getUTCMonth() === eventDate.getUTCMonth() &&
          forecastDate.getUTCDate() === eventDate.getUTCDate()
        )
      })
      if (relevantForecast) {
        return NextResponse.json({
          temperature: Math.round(relevantForecast.temp.day),
          condition: mapWeatherCondition(relevantForecast.weather[0].id),
          description: relevantForecast.weather[0].description,
          city: city || data.timezone?.split("/")[1]?.replace("_", " ") || "Unknown", // Attempt to get city from timezone
          date: date,
          source: "api",
        })
      }
    } else if (data.list) {
      // Handling 5-day forecast API response
      // Find the forecast closest to noon on the event day
      const targetTimestamp = new Date(date + "T12:00:00Z").getTime() / 1000 // Noon UTC
      relevantForecast = data.list.reduce((prev: any, curr: any) => {
        return Math.abs(curr.dt - targetTimestamp) < Math.abs(prev.dt - targetTimestamp) ? curr : prev
      })

      if (relevantForecast) {
        return NextResponse.json({
          temperature: Math.round(relevantForecast.main.temp),
          condition: mapWeatherCondition(relevantForecast.weather[0].id),
          description: relevantForecast.weather[0].description,
          city: data.city.name,
          date: date,
          source: "api",
        })
      }
    }

    // If no relevant forecast found in API response
    console.warn(`No relevant forecast found for ${city} on ${date}. Returning mock data.`)
    return NextResponse.json(getMockForecast(city || "Unknown City", date))
  } catch (error) {
    console.error("Error fetching event weather:", error)
    return NextResponse.json(getMockForecast(city || "Unknown City", date))
  }
}
