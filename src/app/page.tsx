import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hello from Mannheim!</CardTitle>
          <CardDescription>This is your new Next.js application.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have successfully set up your project. Now you can start building amazing things.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge variant="secondary">Getting Started</Badge>
          <Button>Click Me</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
