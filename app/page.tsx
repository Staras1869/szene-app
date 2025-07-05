import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { FeaturedRestaurants } from "@/components/featured-restaurants"
import { DynamicEvents } from "@/components/dynamic-events"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { InstallPrompt } from "@/components/install-prompt"

export default function HomePage() {
  const events = [
    {
      id: 1,
      title: "Jazz Night at Alte Feuerwache",
      description: "Live jazz music with local and international artists",
      location: "Alte Feuerwache, Mannheim",
      time: "20:00",
      date: "2025-07-04",
      category: "Music",
      rating: 4.8,
      attendees: 120,
    },
    {
      id: 2,
      title: "Street Food Festival",
      description: "International street food vendors and live cooking shows",
      location: "Wasserturm, Mannheim",
      time: "12:00",
      date: "2025-07-05",
      category: "Food",
      rating: 4.6,
      attendees: 350,
    },
    {
      id: 3,
      title: "Rooftop Bar Opening",
      description: "New rooftop bar with panoramic city views",
      location: "Quadrate, Mannheim",
      time: "18:00",
      date: "2025-07-06",
      category: "Nightlife",
      rating: 4.9,
      attendees: 80,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileOptimizedHeader />
      <main className="flex-grow">
        <Hero />
        <Categories />
        <FeaturedRestaurants />
        <DynamicEvents events={events} />
        <Newsletter />
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  )
}
