import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const events = [
    {
      title: "Jazz im Park",
      category: "Musik",
      location: "Herzogenriedpark",
      date: "15. Juli 2025",
      attendees: 80,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Mannheimer Weinfest",
      category: "Genuss",
      location: "Friedrichsplatz",
      date: "22. Juli 2025",
      attendees: 150,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Open-Air-Kino",
      category: "Film",
      location: "Schlosshof",
      date: "5. August 2025",
      attendees: 200,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Willkommen bei Szene Mannheim
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Dein Guide für die besten Events und Locations der Stadt.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Aktuelle Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                  <CardTitle className="text-xl font-bold mb-2">{event.title}</CardTitle>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} Zusagen</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6">Details ansehen</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
