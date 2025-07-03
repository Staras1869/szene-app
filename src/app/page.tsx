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
      description: "Explore a variety of delicious street food from around the world.",
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-gray-100">
          Events in Mannheim
        </h1>
        <div className="grid gap-6 sm:gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="h-48 w-full object-cover md:h-full md:w-48"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      <p>{event.description}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {event.date}, {event.time}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Badge variant="secondary">{event.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{event.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{event.attendees} attendees</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  <div className="mt-6">
                    <Button>View Details</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
