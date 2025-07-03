import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Szene App - Mannheim",
  description: "Entdecke die besten Events und Locations in Mannheim.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>{children}</body>
    </html>
  )
}
