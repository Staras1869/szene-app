"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Wine, Grape, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const wineVenues = [
  {
    id: 1,
    name: "Weinbar Heidelberg",
    location: "Heidelberg Castle District",
    rating: 4.9,
    reviews: 167,
    priceRange: "€8-15/glass",
    openUntil: "01:00",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop&auto=format",
    tags: ["Regional Wines", "Cheese Pairings", "Romantic"],
    description: "Intimate wine bar featuring the finest Baden-Württemberg wines with expert sommelier guidance.",
    specialty: "Baden Wine Selection",
    atmosphere: "romantic",
    wineCount: "200+",
  },
  {
    id: 2,
    name: "Vino Mannheim",
    location: "Mannheim Quadrate",
    rating: 4.7,
    reviews: 203,
    priceRange: "€6-12/glass",
    openUntil: "23:30",
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&auto=format",
    tags: ["Natural Wines", "Small Plates", "Modern"],
    description: "Modern wine bar with an impressive selection of natural and biodynamic wines from around the world.",
    specialty: "Natural Wine Collection",
    atmosphere: "modern",
    wineCount: "150+",
  },
  {
    id: 3,
    name: "Rhein Valley Cellar",
    location: "Heidelberg Altstadt",
    rating: 4.8,
    reviews: 145,
    priceRange: "€10-18/glass",
    openUntil: "00:00",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
    tags: ["Historic Cellar", "Wine Tastings", "Local Vintages"],
    description: "Historic wine cellar dating back to 1650, featuring exclusive tastings of Rhine Valley vintages.",
    specialty: "Historic Wine Tastings",
    atmosphere: "historic",
    wineCount: "300+",
  },
]

export function WineSection() {
  const { t } = useLanguage()
  const [hoveredVenue, setHoveredVenue] = useState<number | null>(null)

  const getAtmosphereTranslation = (atmosphere: string) => {
    const atmosphereMap = {
      romantic: t("romanticSophisticated"),
      modern: t("modernTrendy"),
      historic: t("historicExclusive"),
    }
    return atmosphereMap[atmosphere as keyof typeof atmosphereMap] || atmosphere
  }

  const handleWineClick = (venue: any) => {
    const wineUrl =
      venue.website || `https://www.google.com/search?q=${encodeURIComponent(venue.name + " " + venue.location)}`
    window.open(wineUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wine className="w-8 h-8 text-purple-600" />
            <Grape className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{t("exquisiteWineExperiences")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("wineDescription")}</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
              {t("localVintages")}
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
              {t("winePairings")}
            </Badge>
            <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">
              {t("expertSommeliers")}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wineVenues.map((venue) => (
            <div
              key={venue.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-purple-100 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredVenue(venue.id)}
              onMouseLeave={() => setHoveredVenue(null)}
              onClick={() => handleWineClick(venue)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={venue.image || "/placeholder.svg"}
                  alt={`${venue.name} wine selection`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{venue.rating}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-500 text-white border-0 shadow-lg">
                    🍷 {venue.wineCount} {t("winesAvailable")}
                  </Badge>
                </div>

                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-blue-500 text-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("bookNow")}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-red-500 text-white border-0 shadow-lg">
                    ✨ {venue.specialty}
                  </Badge>
                </div>

                {hoveredVenue === venue.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-white text-gray-900 hover:bg-purple-50 rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t("bookWineTasting")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {venue.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {venue.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {venue.reviews} {t("reviews")}
                    </div>
                    <div className="text-sm font-medium text-purple-600">
                      {getAtmosphereTranslation(venue.atmosphere)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{venue.description}</p>

                <div className="flex flex-wrap gap-2">
                  {venue.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-purple-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {t("until")} {venue.openUntil}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-purple-600">
                    <Euro className="w-4 h-4" />
                    <span>{venue.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("exploreWineCulture")}
          </Button>
        </div>
      </div>
    </section>
  )
}
