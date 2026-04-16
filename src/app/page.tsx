"use client"

import { useState } from "react"
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { AppShell } from "@/components/app-shell";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { AiChat } from "@/components/ai-chat";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [tab, setTab] = useState("tonight")

  return (
    <div className="min-h-screen bg-black">
      <NewsletterPopup />
      <AiChat />
      <Header onNavClick={(t) => { setTab(t); setTimeout(() => document.getElementById("app-shell-top")?.scrollIntoView({ behavior: "smooth" }), 50) }} />
      <Hero />
      <AppShell tab={tab} setTab={setTab} />
      <Footer />
    </div>
  );
}
