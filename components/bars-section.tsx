"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Wine, CoffeeIcon as Cocktail, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const bars = [
  {
    id: 1,
    name: "Hemingway Bar",
    location: "Mannheim Quadrate",
    rating: 4.8,
    reviews: 234,
    priceRange: "€8-15",
    openUntil: "02:00",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&auto=format",
    tags: ["Cocktails", "Classic", "Intimate"],
    description: "Classic cocktail bar with expert mixologists and a sophisticated atmosphere.",
    specialty: "Classic Cocktails",
    atmosphere: "sophisticated",
    happyHour: "17:00-19:00",
  },
  {
    id: 2,
    name: "Rooftop 23",
    location: "Heidelberg Altstadt",
    rating: 4.7,
    reviews: 189,
    priceRange: "€10-18",
    openUntil: "01:00",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format",
    tags: ["Rooftop", "Views", "Modern"],
    description: "Stunning rooftop bar with panoramic views of Heidelberg Castle and the Rhine Valley.",
    specialty: "Panoramic Views",
    atmosphere: "scenic",
    happyHour: "18:00-20:00",
  },
  {
    id: 3,
    name: "Speakeasy 1920",
    location: "Mannheim Jungbusch",
    rating: 4.9,
    reviews: 156,
    priceRange: "€12-20",
    openUntil: "03:00",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop&auto=format",
    tags: ["Speakeasy", "Craft", "Hidden"],
    description: "Hidden speakeasy with craft cocktails and a mysterious 1920s atmosphere.",
    specialty: "Craft Cocktails",
    atmosphere: "mysterious",
    happyHour: "19:00-21:00",
  },
]

export function BarsSection() {
  const { t } = useLanguage()
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const handleBarClick = (bar: any) => {
    const barUrl = bar.website || `https://www.google.com/search?q=${encodeURIComponent(bar.name + " " + bar.location)}`
    window.open(barUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cocktail className="w-8 h-8 text-amber-600" />
            <Wine className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{t("barsLounges")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover sophisticated bars and lounges with expert mixologists and unique atmospheres
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              🍸 Expert Mixologists
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              🌅 Happy Hours
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
              🎭 Unique Atmospheres
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bars.map((bar) => (
            <div
              key={bar.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-amber-100 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredBar(bar.id)}
              onMouseLeave={() => setHoveredBar(null)}
              onClick={() => handleBarClick(bar)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={bar.image || "/placeholder.svg"}
                  alt={`${bar.name} bar`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{bar.rating}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-500 text-white border-0">🕐 Happy Hour: {bar.happyHour}</Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-red-500 text-white border-0">
                    ✨ {bar.specialty}
                  </Badge>
                </div>

                {hoveredBar === bar.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-white text-gray-900 hover:bg-amber-50 rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Users className="w-4 h-4 mr-2" />
                      Reserve Table
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {bar.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {bar.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{bar.reviews} reviews</div>
                    <div className="text-sm font-medium text-amber-600">{bar.atmosphere}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{bar.description}</p>

                <div className="flex flex-wrap gap-2">
                  {bar.tags.map((tag) => (
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
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Until {bar.openUntil}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-amber-600">
                    <Euro className="w-4 h-4" />
                    <span>{bar.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white rounded-full px-8 shadow-lg"
          >
            🍸 Discover All Bars
          </Button>
        </div>
      </div>
    </section>
  )
}
