import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SearchSystem } from "@/components/search-system";
import { DynamicEvents } from "@/components/dynamic-events";
import { Categories } from "@/components/categories";
import { TimeBasedSections } from "@/components/time-based-sections";
import { FunAutomationStatus } from "@/components/fun-automation-status";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero with gradient background */}
      <Hero />

      {/* Search bar centred below hero */}
      <section className="relative z-10 -mt-8 pb-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
            <SearchSystem />
          </div>
        </div>
      </section>

      {/* This week's events */}
      <DynamicEvents />

      {/* Category grid */}
      <Categories />

      {/* Time-aware venue sections (Clubs / Bars / Wine / Cafés / Brunch) */}
      <TimeBasedSections />

      {/* Automation bot status — shows real-time discovery stats */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FunAutomationStatus />
        </div>
      </section>

      {/* Newsletter sign-up */}
      <Newsletter />

      <Footer />
    </div>
  );
}
