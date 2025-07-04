import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Star } from "lucide-react"
import Image from "next/image"

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
      description: "A variety of street food from around the world.",
      location: "Marktplatz G1, Mannheim",
      time: "12:00 - 22:00",
      date: "July 5-7, 2025",
      category: "Food",
      rating: 4.6,
      attendees: 500,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 sm:p-12 md:p-24 bg-gray-50">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Upcoming Events in Mannheim</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-2">
                  {event.category}
                </Badge>
                <CardTitle className="text-2xl font-bold mb-2">{event.title}</CardTitle>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.date} at {event.time}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">{event.attendees} going</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="text-sm font-semibold">{event.rating}</span>
                  </div>
                </div>
                <Button className="w-full mt-6">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
