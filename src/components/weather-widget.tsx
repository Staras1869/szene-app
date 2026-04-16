"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface WeatherData {
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
  description: string
  city: string
}

export function WeatherWidget() {
  const { t } = useLanguage()
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 18,
    condition: "sunny",
    description: "Clear sky",
    city: "Mannheim",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        // Fetch from our secure server-side API
        const response = await fetch("/api/weather")

        if (response.ok) {
          const data = await response.json()
          setWeather(data)
        } else {
          // Fallback to realistic weather
          const now = new Date()
          const month = now.getMonth()
          const isWinter = month >= 11 || month <= 2

          setWeather({
            temperature: isWinter ? 5 : 18,
            condition: isWinter ? "cloudy" : "sunny",
            description: isWinter ? "Kalt und bewölkt" : "Angenehm",
            city: "Mannheim",
          })
        }
      } catch (error) {
        console.error("Weather fetch error:", error)
        // Realistic fallback
        const now = new Date()
        const month = now.getMonth()
        const isWinter = month >= 11 || month <= 2

        setWeather({
          temperature: isWinter ? 5 : 18,
          condition: isWinter ? "cloudy" : "sunny",
          description: isWinter ? "Kalt und bewölkt" : "Angenehm",
          city: "Mannheim",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  function getWeatherIcon(condition: WeatherData["condition"]) {
    switch (condition) {
      case "sunny":
        return <Sun className="w-4 h-4 text-yellow-500" />
      case "cloudy":
        return <Cloud className="w-4 h-4 text-gray-500" />
      case "rainy":
        return <CloudRain className="w-4 h-4 text-blue-500" />
      case "snowy":
        return <Snowflake className="w-4 h-4 text-blue-300" />
      case "windy":
        return <Wind className="w-4 h-4 text-gray-600" />
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />
    }
  }

  function getDressCodeSuggestion() {
    if (weather.condition === "rainy") return t("bringUmbrella")
    if (weather.temperature < 10) return t("warmClothes")
    if (weather.temperature < 18) return t("lightJacket")
    return t("perfectWeather")
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
        <span className="font-medium">--°C</span>
        <span className="text-gray-600 hidden sm:inline">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
      {getWeatherIcon(weather.condition)}
      <span className="font-medium">{weather.temperature}°C</span>
      <span className="text-gray-600 hidden sm:inline">{getDressCodeSuggestion()}</span>
    </div>
  )
}
