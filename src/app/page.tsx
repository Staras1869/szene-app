import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { CityPulse } from "@/components/city-pulse";
import { VibePicker } from "@/components/vibe-picker";
import { TrendingVenues } from "@/components/trending-venues";
import { CuratedEvents } from "@/components/curated-events";
import { Leaderboard } from "@/components/leaderboard";
import { FriendFeed } from "@/components/friend-feed";
import { Tonight } from "@/components/tonight";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SignInPrompt } from "@/components/signin-prompt";
import { AiChat } from "@/components/ai-chat";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <NewsletterPopup />
      <SignInPrompt />
      <AiChat />
      <Header />
      <CityPulse />
      <Hero />
      <VibePicker />
      <TrendingVenues />
      <CuratedEvents />
      <Tonight />
      <Leaderboard />
      <FriendFeed />
      <Newsletter />
      <Footer />
    </div>
  );
}
