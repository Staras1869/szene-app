import "./globals.css";
import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/components/theme-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { MobileInit } from "@/components/mobile-init";

export const metadata: Metadata = {
  title: {
    default: "Szene — Mannheim, Heidelberg & Frankfurt Nightlife",
    template: "%s | Szene",
  },
  description:
    "Discover the best events, clubs, bars, and hidden gems in Mannheim, Heidelberg and Frankfurt. Updated every hour by our AI-powered discovery engine.",
  keywords: ["Mannheim", "Heidelberg", "Frankfurt", "nightlife", "events", "clubs", "bars", "concerts", "party"],
  authors: [{ name: "Szene Digital Solutions" }],
  creator: "Szene",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://szene-app.de",
    siteName: "Szene",
    title: "Szene — Mannheim, Heidelberg & Frankfurt Nightlife",
    description: "Discover the best events and venues in Mannheim, Heidelberg & Frankfurt.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Szene — Mannheim, Heidelberg & Frankfurt Nightlife",
    description: "Discover the best events and venues in Mannheim, Heidelberg & Frankfurt.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <MobileInit />
            {children}
            <InstallPrompt />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
