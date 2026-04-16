"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Coffee, Utensils, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const brunchSpots = [
  {
    id: 1,
    name: "Café Rosengarten",
    location: "Mannheim Quadrate",
    rating: 4.8,
    reviews: 234,
    priceRange: "€12-18",
    openUntil: "15:00",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format",
    tags: ["Avocado Toast", "Fresh Pastries", "Specialty Coffee"],
    description: "Charming café with Instagram-worthy brunch plates and the best avocado toast in the city.",
    specialty: "Famous Eggs Benedict",
    atmosphere: "cozy",
  },
  {
    id: 2,
    name: "Heidelberg Brunch House",
    location: "Heidelberg Altstadt",
    rating: 4.7,
    reviews: 189,
    priceRange: "€15-22",
    openUntil: "16:00",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop&auto=format",
    tags: ["Pancakes", "Fresh Juice", "Vegan Options"],
    description: "Historic building turned modern brunch spot with fluffy pancakes and fresh local ingredients.",
    specialty: "Heidelberg Stack Pancakes",
    atmosphere: "historic",
  },
  {
    id: 3,
    name: "Sunday Morning Café",
    location: "Mannheim Jungbusch",
    rating: 4.6,
    reviews: 156,
    priceRange: "€10-16",
    openUntil: "14:30",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=600&fit=crop&auto=format",
    tags: ["Homemade Granola", "Smoothie Bowls", "Local Honey"],
    description: "Trendy spot known for colorful smoothie bowls and the most Instagrammable breakfast spreads.",
    specialty: "Rainbow Smoothie Bowls",
    atmosphere: "trendy",
  },
]

export function BrunchSection() {
  const { t } = useLanguage()
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null)

  const getAtmosphereTranslation = (atmosphere: string) => {
    const atmosphereMap = {
      cozy: t("cozySetting"),
      historic: t("historicCharm"),
      trendy: t("trendyColorful"),
    }
    return atmosphereMap[atmosphere as keyof typeof atmosphereMap] || atmosphere
  }

  const handleBrunchClick = (spot: any) => {
    const brunchUrl =
      spot.website || `https://www.google.com/search?q=${encodeURIComponent(spot.name + " " + spot.location)}`
    window.open(brunchUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
            <Utensils className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{t("weekendBrunchSpots")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("brunchDescription")}</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              {t("freshCoffee")}
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              {t("fluffyPancakes")}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              {t("avocadoToast")}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brunchSpots.map((spot) => (
            <div
              key={spot.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-amber-100 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredSpot(spot.id)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={() => handleBrunchClick(spot)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={spot.image || "/placeholder.svg"}
                  alt={`${spot.name} brunch spread`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{spot.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-amber-500 text-white border-0 shadow-lg">✨ {spot.specialty}</Badge>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500 text-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("visitWebsite")}
                  </Badge>
                </div>

                {hoveredSpot === spot.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-white text-gray-900 hover:bg-amber-50 rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Heart className="w-4 h-4 mr-2" />
                      {t("reserveTable")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {spot.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {spot.reviews} {t("reviews")}
                    </div>
                    <div className="text-sm font-medium text-amber-600">
                      {getAtmosphereTranslation(spot.atmosphere)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{spot.description}</p>

                <div className="flex flex-wrap gap-2">
                  {spot.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-amber-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {t("until")} {spot.openUntil}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-amber-600">
                    <Euro className="w-4 h-4" />
                    <span>{spot.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("discoverMoreBrunch")}
          </Button>
        </div>
      </div>
    </section>
  )
}
