"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AppShell } from "@/components/app-shell"
import { AiChat } from "@/components/ai-chat"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [city, setCity] = useState<string | null>(null)
  const [tab, setTab]   = useState("foryou")

  function go(opts: { city?: string; tab?: string }) {
    if (opts.city) setCity(opts.city)
    if (opts.tab)  setTab(opts.tab)
    setTimeout(() => document.getElementById("app-shell-top")?.scrollIntoView({ behavior: "smooth" }), 60)
  }

  return (
    <div className="min-h-screen bg-szene">
      <AiChat city={city ?? "mannheim"} />
      <Header go={go} />
      <Hero city={city} onCityPick={(c) => go({ city: c, tab: "foryou" })} />
      <AppShell city={city ?? "mannheim"} go={go} tab={tab} setTab={setTab} />
      <Footer go={go} />
    </div>
  )
}
