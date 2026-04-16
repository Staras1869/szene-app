"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Music, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const clubs = [
  {
    id: 1,
    name: "Tiffany Club",
    location: "Mannheim Jungbusch",
    rating: 4.6,
    reviews: 342,
    priceRange: "€15-25",
    openFrom: "23:00",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
    tags: ["Electronic", "House", "Techno"],
    description: "Mannheim's premier electronic music venue with world-class DJs and an incredible sound system.",
    specialty: "Underground Electronic",
    atmosphere: "energetic",
    capacity: "800+",
  },
  {
    id: 2,
    name: "MS Connexion",
    location: "Mannheim Neckarstadt",
    rating: 4.8,
    reviews: 567,
    priceRange: "€20-30",
    openFrom: "22:00",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format",
    tags: ["Live Music", "Concerts", "Alternative"],
    description: "Historic venue hosting international artists and the best alternative music scene in the region.",
    specialty: "Live Concerts",
    atmosphere: "alternative",
    capacity: "1200+",
  },
  {
    id: 3,
    name: "Capitol Mannheim",
    location: "Mannheim Innenstadt",
    rating: 4.7,
    reviews: 423,
    priceRange: "€18-28",
    openFrom: "21:00",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
    tags: ["Mixed Music", "Dancing", "Cocktails"],
    description: "Stylish club with multiple floors, each featuring different music styles and vibes.",
    specialty: "Multi-Floor Experience",
    atmosphere: "stylish",
    capacity: "600+",
  },
]

export function ClubsSection() {
  const { t } = useLanguage()
  const [hoveredClub, setHoveredClub] = useState<number | null>(null)

  const handleClubClick = (club: any) => {
    const clubUrl =
      club.website || `https://www.google.com/search?q=${encodeURIComponent(club.name + " " + club.location)}`
    window.open(clubUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-8 h-8 text-purple-400" />
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl font-bold text-white">{t("clubsNightlife")}</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the electric nightlife scene with world-class DJs and unforgettable nights
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-purple-900/50 text-purple-300 border-purple-400">
              🎵 Live DJs
            </Badge>
            <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-400">
              💃 Dance Floors
            </Badge>
            <Badge variant="outline" className="bg-pink-900/50 text-pink-300 border-pink-400">
              🍸 Premium Bars
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="group bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-purple-500/20 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredClub(club.id)}
              onMouseLeave={() => setHoveredClub(null)}
              onClick={() => handleClubClick(club)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={club.image || "/placeholder.svg"}
                  alt={`${club.name} nightclub`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-white">{club.rating}</span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-500 text-white border-0">👥 {club.capacity}</Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    ✨ {club.specialty}
                  </Badge>
                </div>

                {hoveredClub === club.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Users className="w-4 h-4 mr-2" />
                      Get Guest List
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-gray-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {club.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{club.reviews} reviews</div>
                    <div className="text-sm font-medium text-purple-400">{club.atmosphere}</div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">{club.description}</p>

                <div className="flex flex-wrap gap-2">
                  {club.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-purple-900/50 text-purple-300 border-purple-500/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>From {club.openFrom}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-purple-400">
                    <Euro className="w-4 h-4" />
                    <span>{club.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 shadow-lg"
          >
            🌙 Explore All Clubs
          </Button>
        </div>
      </div>
    </section>
  )
}
