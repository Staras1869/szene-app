"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LanguageSelector } from "./language-selector"
import { WeatherWidget } from "./weather-widget"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Szene
            </h1>
            <span className="ml-2 text-sm text-gray-500 hidden sm:inline">{t("location")}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t("events")}
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t("venues")}
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
              {t("about")}
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder={t("searchPlaceholder")} className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="text" placeholder={t("searchPlaceholder")} className="pl-10 pr-4 py-2 w-full" />
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-2">
                <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors py-2">
                  {t("events")}
                </a>
                <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors py-2">
                  {t("venues")}
                </a>
                <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors py-2">
                  {t("about")}
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
