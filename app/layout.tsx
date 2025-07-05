import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context" // This is the line you need to add

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Szene - Discover Mannheim",
  description: "Discover the best events and venues in Mannheim.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

export const dynamic = "force-dynamic"
