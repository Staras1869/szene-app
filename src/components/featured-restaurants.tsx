"use client"

import { Star, MapPin, Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    id: 1,
    name: "Rooftop Summer Sessions",
    venue: "Skybar Mannheim",
    rating: 4.8,
    reviews: 127,
    priceRange: "€15",
    location: "Quadrate",
    openUntil: "03:00",
    image: "/images/elegant-rooftop-bar.png",
    tags: ["Rooftop", "Cocktails"],
    description:
      "Experience summer nights on our spectacular rooftop terrace with panoramic city views and craft cocktails.",
  },
  {
    id: 2,
    name: "Underground Electronic Night",
    venue: "MS Connexion",
    rating: 4.6,
    reviews: 89,
    priceRange: "€20",
    location: "Jungbusch",
    openUntil: "06:00",
    image: "/images/contemporary-club.png",
    tags: ["Electronic", "Underground"],
    description: "Deep electronic beats in Mannheim's premier underground venue with state-of-the-art sound system.",
  },
  {
    id: 3,
    name: "Jazz & Wine Evening",
    venue: "Heidelberg Castle",
    rating: 4.7,
    reviews: 156,
    priceRange: "€25",
    location: "Heidelberg",
    openUntil: "23:00",
    image: "/images/modern-jazz-venue.png",
    tags: ["Jazz", "Wine"],
    description: "Sophisticated evening with live jazz performances and premium wine selection in historic setting.",
  },
]

const handleEventClick = (event: any) => {
  const eventUrl =
    event.website || `https://www.google.com/search?q=${encodeURIComponent(event.name + " " + event.venue)}`
  window.open(eventUrl, "_blank", "noopener,noreferrer")
}

export function FeaturedRestaurants() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">This Week's Highlights</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked events that represent the best of the Rhein-Neckar nightlife scene
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={`${event.name} - ${event.venue}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=300&width=400&text=Venue+Image"
                  }}
                />
                {/* Clickable indicator */}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-500 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🔗 Learn More
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-gray-600">{event.venue}</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>

                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Until {event.openUntil}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Euro className="w-4 h-4" />
                    <span>{event.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  )
}
