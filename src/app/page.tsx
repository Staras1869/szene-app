import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Szene App</h1>
        <p className="text-xl text-gray-600 mb-8">Your guide to the best spots in Mannheim.</p>
        <Button size="lg">Get Started</Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Find the best places to eat.</p>
            <Badge className="mt-4">Popular</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cafes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Discover cozy coffee shops.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bars</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Explore the nightlife scene.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
