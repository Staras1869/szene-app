import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Star } from "lucide-react"

export default function Home() {
  const events = [
    {
      id: 1,
      title: "Jazz Night at Alte Feuerwache",
      description: "Live jazz music with local and international artists.",
      location: "Alte Feuerwache, Mannheim",
      time: "20:00",
      date: "July 4, 2025",
      category: "Music",
      rating: 4.8,
      attendees: 120,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Street Food Festival",
      description: "International street food vendors and live cooking shows.",
      location: "Wasserturm, Mannheim",
      time: "12:00",
      date: "July 5, 2025",
      category: "Food",
      rating: 4.6,
      attendees: 350,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "Rooftop Bar Opening",
      description: "New rooftop bar with panoramic city views and cocktails.",
      location: "Quadrate, Mannheim",
      time: "18:00",
      date: "July 6, 2025",
      category: "Nightlife",
      rating: 4.9,
      attendees: 80,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Szene Mannheim</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your ultimate guide to the city's vibrant events and nightlife.
          </p>
        </header>

        <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            >
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-blue-100 text-blue-800">{event.category}</Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm font-bold text-gray-700">{event.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {event.date} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-700">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </main>

        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2025 Szene App. Discover more.</p>
        </footer>
      </div>
    </div>
  )
}
