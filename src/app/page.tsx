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
      description: "A variety of street food from around the world.",
      location: "Marktplatz, Mannheim",
      time: "12:00 - 22:00",
      date: "July 5-7, 2025",
      category: "Food",
      rating: 4.5,
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
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{event.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {event.date} at {event.time}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-4">
                    <Badge>{event.category}</Badge>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{event.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                  <Button>Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
