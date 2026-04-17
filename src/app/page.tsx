"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AppShell } from "@/components/app-shell"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { AiChat } from "@/components/ai-chat"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [city, setCity] = useState<string | null>(null)
  const [tab, setTab]   = useState("foryou")

  function pickCity(c: string) {
    setCity(c)
    setTimeout(() => document.getElementById("app-shell-top")?.scrollIntoView({ behavior: "smooth" }), 60)
  }

  return (
    <div className="min-h-screen bg-black">
      <NewsletterPopup />
      <AiChat city={city ?? "mannheim"} />
      <Header onNavClick={(t) => { setTab(t); document.getElementById("app-shell-top")?.scrollIntoView({ behavior: "smooth" }) }} />
      <Hero city={city} onCityPick={pickCity} />
      <AppShell city={city ?? "mannheim"} setCity={pickCity} tab={tab} setTab={setTab} />
      <Footer setCity={pickCity} />
    </div>
  )
}
