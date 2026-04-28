import "./globals.css"
import type { Metadata, Viewport } from "next"
import { LanguageProvider } from "@/contexts/language-context"
import { SzeneThemeProvider } from "@/components/szene-theme-provider"
import { InstallPrompt } from "@/components/install-prompt"
import { MobileInit } from "@/components/mobile-init"
import { PushPrompt } from "@/components/push-prompt"
import { EventToastManager } from "@/components/event-toast"
import { GuestCTA } from "@/components/guest-cta"
import { BrowseGate } from "@/components/browse-gate"
import { CookieConsent } from "@/components/cookie-consent"

export const metadata: Metadata = {
  title: {
    default: "Szene — Nightlife in Germany",
    template: "%s | Szene",
  },
  description:
    "Entdecke die besten Events, Clubs, Bars in Mannheim, Heidelberg, Frankfurt, Stuttgart, Berlin, München, Köln und Karlsruhe. KI-gestützte Nightlife-Discovery mit Live-Map.",
  keywords: [
    "Mannheim Nightlife", "Heidelberg Party", "Frankfurt Club", "Karlsruhe",
    "Berlin Club", "München Nightlife", "Köln Party", "Stuttgart Club",
    "Berghain", "Bootshaus", "MS Connexion", "halle02",
    "Afrobeats", "Latin Night", "Techno", "Reggaeton", "Uni Party", "Jungbusch",
    "Events heute", "Club tonight", "Bar empfehlung", "Nightlife Map",
  ],
  authors: [{ name: "Szene" }],
  creator: "Szene",
  metadataBase: new URL("https://www.szene.app"),
  alternates: { canonical: "https://www.szene.app" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.szene.app",
    siteName: "Szene",
    title: "Szene — Nightlife in Mannheim, Heidelberg & Frankfurt",
    description: "Dein KI-Concierge für die beste Nacht. Events, Clubs, Bars — personalisiert für dich.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Szene — Nightlife Discovery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Szene — Nightlife Discovery",
    description: "Dein KI-Concierge für die beste Nacht. Events, Clubs, Bars.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-theme="night" suppressHydrationWarning>
      <body>
        <SzeneThemeProvider>
          <LanguageProvider>
            <MobileInit />
            {children}
            <PushPrompt />
            <EventToastManager />
            <GuestCTA />
            <BrowseGate />
            <InstallPrompt />
            <CookieConsent />
          </LanguageProvider>
        </SzeneThemeProvider>
      </body>
    </html>
  )
}
