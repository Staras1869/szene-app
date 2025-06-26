import { Header } from "@/components/header"
import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { DynamicEvents } from "@/components/dynamic-events"
import { TimeBasedSections } from "@/components/time-based-sections"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { InstallPrompt } from "@/components/install-prompt"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Show mobile header on mobile, regular header on desktop */}
      <div className="block md:hidden">
        <MobileOptimizedHeader />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>

      <main>
        <Hero />
        <Categories />
        <DynamicEvents />
        <TimeBasedSections />
        <Newsletter />
      </main>

      <Footer />
      <InstallPrompt />
    </div>
  )
}
