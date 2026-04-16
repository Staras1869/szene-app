"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { BrunchSection } from "./brunch-section"
import { WineSection } from "./wine-section"

// Mock sections for clubs, bars, cafes, etc.
function ClubsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t("clubsNightlife")}</h2>
          <p className="text-xl text-purple-200">The hottest clubs and nightlife spots in Mannheim & Heidelberg</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Tiffany Club", style: "Electronic", capacity: "500", until: "6:00" },
            { name: "MS Connexion", style: "Techno", capacity: "800", until: "5:00" },
            { name: "Palazzo", style: "Mixed", capacity: "400", until: "4:00" },
          ].map((club) => (
            <div
              key={club.name}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all"
            >
              <h3 className="text-xl font-bold mb-2">{club.name}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  🎵 {t("musicStyle")}: {club.style}
                </p>
                <p>
                  👥 {t("capacity")}: {club.capacity}
                </p>
                <p>
                  🕐 {t("openUntil")}: {club.until}:00
                </p>
                <p>🔞 {t("ageRestriction")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BarsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("barsLounges")}</h2>
          <p className="text-xl text-gray-600">Craft cocktails and sophisticated atmospheres</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Hemingway Bar", style: "Classic Cocktails", happy: "17:00-19:00", until: "2:00" },
            { name: "Skybar Mannheim", style: "Rooftop Views", happy: "18:00-20:00", until: "1:00" },
            { name: "The Parlour", style: "Speakeasy", happy: "16:00-18:00", until: "3:00" },
          ].map((bar) => (
            <div key={bar.name} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-2 text-gray-900">{bar.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🍸 {bar.style}</p>
                <p>
                  ⏰ {t("happyHour")}: {bar.happy}
                </p>
                <p>
                  🕐 {t("openUntil")}: {bar.until}:00
                </p>
                <p>🪑 {t("outdoorSeating")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CafesSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("cafesCoffee")}</h2>
          <p className="text-xl text-gray-600">Perfect spots for coffee, work, and relaxation</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Café Central", features: ["WiFi", "Outdoor"], until: "22:00", specialty: "Specialty Coffee" },
            { name: "Kaffeehaus", features: ["Pet Friendly", "WiFi"], until: "20:00", specialty: "Austrian Style" },
            { name: "Beans & Books", features: ["WiFi", "Quiet"], until: "19:00", specialty: "Reading Corner" },
          ].map((cafe) => (
            <div key={cafe.name} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-2 text-gray-900">{cafe.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>☕ {cafe.specialty}</p>
                <p>
                  🕐 {t("openUntil")}: {cafe.until}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {cafe.features.map((feature) => (
                    <span key={feature} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                      {feature === "WiFi"
                        ? t("wifiAvailable")
                        : feature === "Pet Friendly"
                          ? t("petFriendly")
                          : feature === "Outdoor"
                            ? t("outdoorSeating")
                            : feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DayDrinkingSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("dayDrinking")}</h2>
          <p className="text-xl text-gray-600">Beer gardens, outdoor bars, and sunny terraces</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Biergarten Luisenpark", type: "Beer Garden", open: "11:00", features: ["Outdoor", "Family"] },
            { name: "Rheinterrasse", type: "River Bar", open: "12:00", features: ["River View", "Outdoor"] },
            { name: "Sonnendeck", type: "Rooftop", open: "14:00", features: ["City View", "Cocktails"] },
          ].map((spot) => (
            <div key={spot.name} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-2 text-gray-900">{spot.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🌞 {spot.type}</p>
                <p>🕐 Open from: {spot.open}</p>
                <div className="flex gap-2 flex-wrap">
                  {spot.features.map((feature) => (
                    <span key={feature} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TimeBasedSections() {
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening" | "night">("morning")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now)

      const hour = now.getHours()
      if (hour >= 6 && hour < 12) setTimeOfDay("morning")
      else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon")
      else if (hour >= 18 && hour < 23) setTimeOfDay("evening")
      else setTimeOfDay("night")
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getTimeGreeting = () => {
    switch (timeOfDay) {
      case "morning":
        return t("goodMorning")
      case "afternoon":
        return t("goodAfternoon")
      case "evening":
        return t("goodEvening")
      case "night":
        return t("lateNight")
    }
  }

  const getTimeActivity = () => {
    switch (timeOfDay) {
      case "morning":
        return t("coffeeAndBrunch")
      case "afternoon":
        return t("dayDrinkingFun")
      case "evening":
        return t("cocktailsAndDinner")
      case "night":
        return t("clubsAndParties")
    }
  }

  const getSectionOrder = () => {
    switch (timeOfDay) {
      case "morning":
        return [
          <CafesSection key="cafes" />,
          <BrunchSection key="brunch" />,
          <WineSection key="wine" />,
          <BarsSection key="bars" />,
          <DayDrinkingSection key="day-drinking" />,
          <ClubsSection key="clubs" />,
        ]
      case "afternoon":
        return [
          <DayDrinkingSection key="day-drinking" />,
          <WineSection key="wine" />,
          <BarsSection key="bars" />,
          <CafesSection key="cafes" />,
          <BrunchSection key="brunch" />,
          <ClubsSection key="clubs" />,
        ]
      case "evening":
        return [
          <WineSection key="wine" />,
          <BarsSection key="bars" />,
          <ClubsSection key="clubs" />,
          <DayDrinkingSection key="day-drinking" />,
          <BrunchSection key="brunch" />,
          <CafesSection key="cafes" />,
        ]
      case "night":
        return [
          <ClubsSection key="clubs" />,
          <BarsSection key="bars" />,
          <WineSection key="wine" />,
          <DayDrinkingSection key="day-drinking" />,
          <BrunchSection key="brunch" />,
          <CafesSection key="cafes" />,
        ]
    }
  }

  return (
    <div>
      {/* Time-based header */}
      <section className="py-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{getTimeGreeting()}!</h2>
          <p className="text-xl text-purple-100">
            {t("perfectTimeFor")} {getTimeActivity()}
          </p>
          <p className="text-sm text-purple-200 mt-2">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </section>

      {/* Dynamic sections based on time */}
      {getSectionOrder()}
    </div>
  )
}
