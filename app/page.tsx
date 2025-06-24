"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Categories } from "@/components/categories"
import { DynamicEvents } from "@/components/dynamic-events"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { SimpleFunAutomation } from "@/components/simple-fun-automation"
import { SimpleActivityFeed } from "@/components/simple-activity-feed"
import { SimpleVenueStatus } from "@/components/simple-venue-status"
import { useLanguage } from "@/contexts/language-context"
import { TimeBasedSections } from "@/components/time-based-sections"
import { ComprehensiveBrunchSection } from "@/components/comprehensive-brunch-section"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Categories />

      {/* Simplified Fun Dashboard Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("aiEventDiscovery")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("aiDescription")}</p>
          </div>

          {/* Main Automation Status */}
          <div className="mb-8">
            <SimpleFunAutomation />
          </div>

          {/* Simple Dashboard Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            <SimpleActivityFeed />
            <SimpleVenueStatus />
          </div>
        </div>
      </section>

      <DynamicEvents />

      {/* Comprehensive Brunch Section - Always visible */}
      <ComprehensiveBrunchSection />

      {/* Time-based sections that reorder based on current time */}
      <TimeBasedSections />

      <Newsletter />
      <Footer />
    </main>
  )
}
