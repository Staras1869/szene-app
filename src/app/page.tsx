import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Project Szene</CardTitle>
          <CardDescription>Your local scene, discovered.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Welcome to your new Next.js application. We've set up a few things for you to get started.</p>
            <div className="flex gap-2">
              <Badge variant="secondary">Next.js</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
            </div>
            <Button>Get Started</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
