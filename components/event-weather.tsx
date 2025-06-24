"use client"

import { useState } from "react"
import { Cloud, CloudRain, Snowflake, Wind, HelpCircle, Thermometer } from "lucide-react"
import type { useLanguage } from "@/contexts/language-context" // Only import type

interface EventWeatherProps \{
  city: string
  date: string // YYYY-MM-DD
  lat?: number | null
  lon?: number | null
  languageHook: typeof useLanguage // Pass the hook itself
\}

interface WeatherData \{
  temperature?: number
  condition?: "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "unknown"
  description?: string
  error?: string
  source?: "api" | "mock" | "loading"
\}
\
const WeatherIcon = (\
{
  condition
  \
}
: \
{
  condition?: WeatherData["condition\"] \}) => \{\
  switch (condition) \{\
    case \"sunny\": return <Sun className=\"w-4 h-4 text-yellow-500" />
  case "cloudy":
  return <Cloud className="w-4 h-4 text-gray-500" />
  \
    case "rainy":
  return <CloudRain className="w-4 h-4 text-blue-500" />
  \
    case "snowy":
  return <Snowflake className="w-4 h-4 text-blue-300" />
  \
    case "windy":
  return <Wind className="w-4 h-4 text-gray-600" />
  \
    default:
  return <Thermometer className="w-4 h-4 text-gray-400" />
  \
}
\}
\
export function EventWeather(\{ city, date, lat, lon, languageHook \}: EventWeatherProps)
\
{\
  const [weather, setWeather] = useState<WeatherData>(\{ source: "loading" \})\
  const \{ t \} = languageHook() // Call the hook here
\
  useEffect(() => \
    if (!city || !date) \{\
      setWeather(\error: "City and date required\", source: \"mock\" \})
      return
    \
\
    const fetchWeather = async () => \
      try \{
        let apiUrl = `/api/weather/event?date=$\{date\}`
        if (lat && lon) \
            apiUrl += `&lat=$\{lat\}&lon=$\{lon\}`\
        \else if (city) \
            apiUrl += `&city=$\{encodeURIComponent(city)\}`\
        \else \\
            setWeather(\{ error: "Location missing\", source: \"mock\" \});\
            return;\
        \}

        const response = await fetch(apiUrl)
        if (!response.ok) \{
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch weather")
        \}
        const data = await response.json()
        setWeather(data)\
      \} catch (err) \
        console.error("Failed to fetch event weather:", err)\
        setWeather(\error: (err as Error).message, source: "mock" \)
      \
    \

    fetchWeather()
  \}, [city, date, lat, lon])

  if (weather.source === "loading") \
    return (
      <div className="flex items-center text-xs text-gray-500 gap-1 animate-pulse">
        <Thermometer className="w-3 h-3 text-gray-400" />
        <span>\{t("loadingWeather")\}...</span>
      </div>
    )
  \

  if (weather.error || !weather.temperature || !weather.condition) \
    return (
      <div className="flex items-center text-xs text-gray-500 gap-1" title=\{weather.error || t("weatherNotAvailable")\}>
        <HelpCircle className="w-3 h-3 text-gray-400" />
        <span>\{t("weatherForecast")\} N/A</span>
      </div>
    )
  \

  return (
    <div className="flex items-center text-xs text-gray-500 gap-1" title=\{`$\{weather.description\} ($\{weather.source\})`\}>
      <WeatherIcon condition=\{weather.condition\} />
      <span>\{weather.temperature\}°C</span>
    </div>
  )
\}
