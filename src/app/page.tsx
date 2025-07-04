import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Ready!</CardTitle>
          <CardDescription>Your Next.js app is running successfully.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have successfully fixed the setup issues. You can now start building your application.</p>
          <div className="flex gap-2 mt-4">
            <Badge>Next.js</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="destructive">Yarn</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Let's Build!</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
