"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Sun, Umbrella, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const dayDrinkingSpots = [
  {
    id: 1,
    name: "Rhein Terrace",
    location: "Mannheim Rheinufer",
    rating: 4.7,
    reviews: 289,
    priceRange: "€4-12",
    openFrom: "11:00",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&h=600&fit=crop&auto=format",
    tags: ["River Views", "Beer Garden", "Outdoor"],
    description: "Riverside beer garden with stunning Rhine views, perfect for afternoon drinks and socializing.",
    specialty: "Rhine River Views",
    atmosphere: "relaxed",
    features: ["Outdoor Seating", "River Views", "Food Menu"],
  },
  {
    id: 2,
    name: "Heidelberg Brewery Garden",
    location: "Heidelberg Neuenheim",
    rating: 4.8,
    reviews: 356,
    priceRange: "€3-10",
    openFrom: "12:00",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
    tags: ["Local Beer", "Traditional", "Garden"],
    description: "Traditional German beer garden with local brews and authentic atmosphere under chestnut trees.",
    specialty: "Local Craft Beer",
    atmosphere: "traditional",
    features: ["Beer Garden", "Local Brews", "Traditional Food"],
  },
  {
    id: 3,
    name: "Sunset Lounge",
    location: "Mannheim Lindenhof",
    rating: 4.6,
    reviews: 234,
    priceRange: "€6-15",
    openFrom: "14:00",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format",
    tags: ["Rooftop", "Cocktails", "Sunset"],
    description: "Rooftop lounge perfect for afternoon cocktails with spectacular sunset views over the city.",
    specialty: "Sunset Cocktails",
    atmosphere: "chic",
    features: ["Rooftop", "City Views", "Cocktail Menu"],
  },
]

export function DayDrinkingSection() {
  const { t } = useLanguage()
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null)

  const handleSpotClick = (spot: any) => {
    const spotUrl =
      spot.website || `https://www.google.com/search?q=${encodeURIComponent(spot.name + " " + spot.location)}`
    window.open(spotUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="w-8 h-8 text-yellow-500" />
            <Umbrella className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{t("dayDrinking")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enjoy the sunshine with refreshing drinks at the best outdoor spots and beer gardens
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              ☀️ Outdoor Seating
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              🍺 Fresh Beer
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              🌅 Great Views
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dayDrinkingSpots.map((spot) => (
            <div
              key={spot.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-yellow-100 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredSpot(spot.id)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={() => handleSpotClick(spot)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={spot.image || "/placeholder.svg"}
                  alt={`${spot.name} outdoor drinking`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{spot.rating}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 text-white border-0">
                    <Sun className="w-3 h-3 mr-1" />
                    Outdoor
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    ✨ {spot.specialty}
                  </Badge>
                </div>

                {hoveredSpot === spot.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-white text-gray-900 hover:bg-yellow-50 rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Users className="w-4 h-4 mr-2" />
                      Join Friends
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {spot.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{spot.reviews} reviews</div>
                    <div className="text-sm font-medium text-yellow-600">{spot.atmosphere}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{spot.description}</p>

                <div className="flex flex-wrap gap-2">
                  {spot.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-yellow-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>From {spot.openFrom}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-yellow-600">
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
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full px-8 shadow-lg"
          >
            ☀️ Find Sunny Spots
          </Button>
        </div>
      </div>
    </section>
  )
}
