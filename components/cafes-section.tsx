"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Coffee, Wifi, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const cafes = [
  {
    id: 1,
    name: "Café Central",
    location: "Mannheim Innenstadt",
    rating: 4.6,
    reviews: 342,
    priceRange: "€3-8",
    openFrom: "07:00",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop&auto=format",
    tags: ["Specialty Coffee", "Pastries", "WiFi"],
    description: "Cozy café with artisanal coffee, fresh pastries, and a perfect atmosphere for work or relaxation.",
    specialty: "Single Origin Coffee",
    atmosphere: "cozy",
    features: ["Free WiFi", "Laptop Friendly", "Outdoor Seating"],
  },
  {
    id: 2,
    name: "Heidelberg Coffee Roasters",
    location: "Heidelberg Altstadt",
    rating: 4.8,
    reviews: 267,
    priceRange: "€4-10",
    openFrom: "06:30",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&auto=format",
    tags: ["Roastery", "Organic", "Local"],
    description: "Local coffee roastery with freshly roasted beans and expert baristas crafting perfect cups.",
    specialty: "Fresh Roasted Beans",
    atmosphere: "artisanal",
    features: ["Coffee Classes", "Bean Sales", "Tasting Sessions"],
  },
  {
    id: 3,
    name: "Book & Bean",
    location: "Mannheim Quadrate",
    rating: 4.7,
    reviews: 198,
    priceRange: "€3-9",
    openFrom: "08:00",
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&h=600&fit=crop&auto=format",
    tags: ["Bookstore", "Quiet", "Study"],
    description: "Unique combination of bookstore and café, perfect for reading, studying, or quiet conversations.",
    specialty: "Books & Coffee",
    atmosphere: "intellectual",
    features: ["Book Sales", "Reading Nooks", "Study Areas"],
  },
]

export function CafesSection() {
  const { t } = useLanguage()
  const [hoveredCafe, setHoveredCafe] = useState<number | null>(null)

  const handleCafeClick = (cafe: any) => {
    const cafeUrl =
      cafe.website || `https://www.google.com/search?q=${encodeURIComponent(cafe.name + " " + cafe.location)}`
    window.open(cafeUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
            <Book className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{t("cafesCoffee")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your day right with artisanal coffee and cozy atmospheres perfect for work or relaxation
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              ☕ Artisanal Coffee
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              📶 Free WiFi
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              🥐 Fresh Pastries
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cafes.map((cafe) => (
            <div
              key={cafe.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-amber-100 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredCafe(cafe.id)}
              onMouseLeave={() => setHoveredCafe(null)}
              onClick={() => handleCafeClick(cafe)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={cafe.image || "/placeholder.svg"}
                  alt={`${cafe.name} café`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{cafe.rating}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-500 text-white border-0">
                    <Wifi className="w-3 h-3 mr-1" />
                    Free WiFi
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    ✨ {cafe.specialty}
                  </Badge>
                </div>

                {hoveredCafe === cafe.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-white text-gray-900 hover:bg-amber-50 rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Coffee className="w-4 h-4 mr-2" />
                      Order Online
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {cafe.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {cafe.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{cafe.reviews} reviews</div>
                    <div className="text-sm font-medium text-amber-600">{cafe.atmosphere}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{cafe.description}</p>

                <div className="flex flex-wrap gap-2">
                  {cafe.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-amber-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>From {cafe.openFrom}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-amber-600">
                    <Euro className="w-4 h-4" />
                    <span>{cafe.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-8 shadow-lg"
          >
            ☕ Explore All Cafés
          </Button>
        </div>
      </div>
    </section>
  )
}
