import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <Rocket className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Project Setup Complete!</CardTitle>
          <CardDescription>You have successfully configured your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground mb-6">
            All the necessary files and folders are in place. You are now ready to install the dependencies and start
            the development server.
          </p>
          <div className="flex justify-center gap-2">
            <Badge>Next.js</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="outline">shadcn/ui</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Let's Get Started</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
