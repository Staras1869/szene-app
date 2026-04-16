import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { CityPulse } from "@/components/city-pulse";
import { SearchSystem } from "@/components/search-system";
import { VibePicker } from "@/components/vibe-picker";
import { TrendingVenues } from "@/components/trending-venues";
import { CuratedEvents } from "@/components/curated-events";
import { Leaderboard } from "@/components/leaderboard";
import { FriendFeed } from "@/components/friend-feed";
import { DynamicEvents } from "@/components/dynamic-events";
import { TimeBasedSections } from "@/components/time-based-sections";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SignInPrompt } from "@/components/signin-prompt";
import { AiChat } from "@/components/ai-chat";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Timed popups */}
      <NewsletterPopup />
      <SignInPrompt />

      {/* Floating AI concierge */}
      <AiChat />

      <Header />

      {/* Hero */}
      <Hero />

      {/* Live city stats bar */}
      <CityPulse />

      {/* Search */}
      <section className="bg-zinc-950 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-900 rounded-2xl p-3 border border-white/8">
            <SearchSystem />
          </div>
        </div>
      </section>

      {/* Vibe / mood picker */}
      <VibePicker />

      {/* Trending right now */}
      <TrendingVenues />

      {/* Curated event picks with RSVP */}
      <CuratedEvents />

      {/* This week's leaderboard */}
      <Leaderboard />

      {/* Friend activity feed */}
      <FriendFeed />

      {/* Live-scraped venue events */}
      <DynamicEvents />

      {/* Time-aware venue sections */}
      <TimeBasedSections />

      {/* Newsletter */}
      <Newsletter />

      <Footer />
    </div>
  );
}
