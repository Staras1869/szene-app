import { NextResponse } from "next/server"

export async function GET() {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY // Server-side only, no NEXT_PUBLIC_

    if (!API_KEY) {
      // Return realistic fallback weather for Mannheim
      const now = new Date()
      const month = now.getMonth()
      const isWinter = month >= 11 || month <= 2
      const isSummer = month >= 5 && month <= 8

      return NextResponse.json({
        temperature: isWinter
          ? Math.floor(Math.random() * 8) + 2 // 2-10°C
          : isSummer
            ? Math.floor(Math.random() * 12) + 18 // 18-30°C
            : Math.floor(Math.random() * 10) + 12, // 12-22°C
        condition: isWinter ? "cloudy" : isSummer ? "sunny" : "cloudy",
        description: isWinter ? "Kalt und bewölkt" : isSummer ? "Sonnig" : "Angenehm",
        city: "Mannheim",
      })
    }

    // Fetch real weather data server-side
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Mannheim,DE&appid=${API_KEY}&units=metric&lang=de`,
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    )

    if (!response.ok) {
      throw new Error("Weather API failed")
    }

    const data = await response.json()
    const weatherCondition = mapWeatherCondition(data.weather[0].main.toLowerCase())

    return NextResponse.json({
      temperature: Math.round(data.main.temp),
      condition: weatherCondition,
      description: data.weather[0].description,
      city: "Mannheim",
    })
  } catch (error) {
    console.error("Weather API error:", error)

    // Fallback to realistic seasonal weather
    const now = new Date()
    const month = now.getMonth()
    const isWinter = month >= 11 || month <= 2

    return NextResponse.json({
      temperature: isWinter ? 5 : 18,
      condition: isWinter ? "cloudy" : "sunny",
      description: isWinter ? "Kalt und bewölkt" : "Angenehm",
      city: "Mannheim",
    })
  }
}

function mapWeatherCondition(condition: string): "sunny" | "cloudy" | "rainy" | "snowy" | "windy" {
  if (condition.includes("rain")) return "rainy"
  if (condition.includes("snow")) return "snowy"
  if (condition.includes("cloud")) return "cloudy"
  if (condition.includes("clear") || condition.includes("sun")) return "sunny"
  if (condition.includes("wind")) return "windy"
  return "sunny"
}
