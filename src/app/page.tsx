import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SearchSystem } from "@/components/search-system";
import { CuratedEvents } from "@/components/curated-events";
import { Categories } from "@/components/categories";
import { DynamicEvents } from "@/components/dynamic-events";
import { TimeBasedSections } from "@/components/time-based-sections";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SignInPrompt } from "@/components/signin-prompt";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Timed popups (client-side only) */}
      <NewsletterPopup />
      <SignInPrompt />

      <Header />

      {/* Hero — dark, minimal */}
      <Hero />

      {/* Search bar */}
      <section className="bg-zinc-950 pb-4 -mt-2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900 rounded-2xl shadow-2xl p-3 border border-white/8">
            <SearchSystem />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <Categories />

      {/* Curated event picks */}
      <CuratedEvents />

      {/* Live-scraped venue events */}
      <DynamicEvents />

      {/* Time-aware venue sections */}
      <TimeBasedSections />

      {/* Newsletter section */}
      <Newsletter />

      <Footer />
    </div>
  );
}
