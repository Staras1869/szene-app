import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Star } from "lucide-react"

export default function Home() {
  const events = [
    {
      id: 1,
      title: "Jazz Night at Alte Feuerwache",
      description: "Live jazz music with local and international artists",
      location: "Alte Feuerwache, Mannheim",
      time: "20:00",
      date: "2025-07-04",
      category: "Music",
      rating: 4.8,
      attendees: 120,
    },
    {
      id: 2,
      title: "Street Food Festival",
      description: "International street food vendors and live cooking shows",
      location: "Wasserturm, Mannheim",
      time: "12:00",
      date: "2025-07-05",
      category: "Food",
      rating: 4.6,
      attendees: 350,
    },
    {
      id: 3,
      title: "Rooftop Bar Opening",
      description: "New rooftop bar with panoramic city views",
      location: "Quadrate, Mannheim",
      time: "18:00",
      date: "2025-07-06",
      category: "Nightlife",
      rating: 4.9,
      attendees: 80,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Szene Mannheim</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the best events, restaurants, and nightlife in Mannheim. Your guide to the city's vibrant scene.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{event.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{event.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {event.attendees} attending
                </div>
              </div>
              <Button className="w-full">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to explore Mannheim?</h2>
        <p className="text-gray-600 mb-6">Join thousands of locals discovering the best the city has to offer.</p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Get Started
        </Button>
      </div>
    </div>
  )
}
