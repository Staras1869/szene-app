import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { AppShell } from "@/components/app-shell";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SignInPrompt } from "@/components/signin-prompt";
import { AiChat } from "@/components/ai-chat";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <NewsletterPopup />
      <SignInPrompt />
      <AiChat />
      <Header />
      <Hero />
      <AppShell />
      <Footer />
    </div>
  );
}
