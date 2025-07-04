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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Mannheim Events</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-2">
                  {event.category}
                </Badge>
                <CardTitle className="text-2xl font-bold mb-2">{event.title}</CardTitle>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
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
                    <span>{event.attendees} attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{event.rating} / 5.0</span>
                  </div>
                </div>
                <Button className="mt-6 w-full">View Event</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
