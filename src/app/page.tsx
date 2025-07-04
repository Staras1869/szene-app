import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Welcome to Szene App</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">Your ultimate guide to the Mannheim scene.</p>
          <div className="flex gap-4">
            <Button>Explore Events</Button>
            <Button variant="secondary">View Venues</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge>Nightlife</Badge>
            <Badge variant="secondary">Food</Badge>
            <Badge variant="outline">Music</Badge>
            <Badge variant="destructive">Art</Badge>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
