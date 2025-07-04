import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <header className="text-center my-8">
        <h1 className="text-5xl font-bold">Willkommen in Mannheim</h1>
        <p className="text-xl text-muted-foreground mt-2">Entdecke die besten Events und Locations der Stadt</p>
      </header>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Kommende Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Live-Musik im Park</CardTitle>
              <Badge variant="secondary" className="w-fit">
                Musik
              </Badge>
            </CardHeader>
            <CardContent>
              <p>Genieße einen Abend mit lokaler Live-Musik im Herzogenriedpark.</p>
              <p className="font-semibold mt-2">Datum: 15. Juli 2025</p>
              <Button className="mt-4">Mehr erfahren</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Street Food Festival</CardTitle>
              <Badge variant="secondary" className="w-fit">
                Essen
              </Badge>
            </CardHeader>
            <CardContent>
              <p>Probiere dich durch die kulinarische Vielfalt auf dem Marktplatz.</p>
              <p className="font-semibold mt-2">Datum: 20-22. Juli 2025</p>
              <Button className="mt-4">Mehr erfahren</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Kunstausstellung</CardTitle>
              <Badge variant="secondary" className="w-fit">
                Kultur
              </Badge>
            </CardHeader>
            <CardContent>
              <p>Entdecke Werke lokaler Künstler in der Kunsthalle Mannheim.</p>
              <p className="font-semibold mt-2">Datum: Ab 1. August 2025</p>
              <Button className="mt-4">Mehr erfahren</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
