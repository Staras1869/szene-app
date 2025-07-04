import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Project is Running!</CardTitle>
          <CardDescription>Congratulations, you have successfully set up your Next.js project.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>The permission issues are solved. You can now start building your amazing application.</p>
          <div className="flex gap-2">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
          </div>
          <Button className="mt-4 w-full">Let's Get Started</Button>
        </CardContent>
      </Card>
    </main>
  )
}
