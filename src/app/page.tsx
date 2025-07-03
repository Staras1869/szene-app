import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold">Szene Mannheim</h1>
        <p className="text-muted-foreground">Your guide to the city's best spots</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Events</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Rooftop Bar Opening</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Enjoy the sunset with live music.</p>
              <Badge variant="secondary" className="mt-2">
                Music
              </Badge>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Street Food Festival</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Taste the world in the heart of Mannheim.</p>
              <Badge variant="secondary" className="mt-2">
                Food
              </Badge>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Art Gallery Night</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover local and international artists.</p>
              <Badge variant="secondary" className="mt-2">
                Art
              </Badge>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
