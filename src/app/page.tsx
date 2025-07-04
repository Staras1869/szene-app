import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Szene App!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>This is your starting point. Let's build something amazing.</p>
          <div className="flex gap-2">
            <Badge>Next.js</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="outline">Shadcn/ui</Badge>
          </div>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </main>
  )
}
