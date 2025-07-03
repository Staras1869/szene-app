import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Mock data for events
const events = [
  {
    id: 1,
    title: "Mannheimer Weinfest",
    date: "15. Juli 2025",
    location: "Friedrichsplatz",
    category: "Food & Drink",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Live Jazz im Schloss",
    date: "22. Juli 2025",
    location: "Barockschloss Mannheim",
    category: "Music",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Open-Air-Kino",
    date: "29. Juli 2025",
    location: "Luisenpark",
    category: "Film",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Street Food Festival",
    date: "5. August 2025",
    location: "Alter Messplatz",
    category: "Food & Drink",
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Szene Mannheim</h1>
          <Button>Event vorschlagen</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Was geht in Mannheim?</h2>
          <p className="text-lg text-gray-600">Entdecke die besten Events und Locations in deiner Stadt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                <CardDescription className="text-gray-600 mb-4">
                  {event.date} - {event.location}
                </CardDescription>
                <Button variant="outline" className="w-full bg-transparent">
                  Details ansehen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2025 Szene App. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
