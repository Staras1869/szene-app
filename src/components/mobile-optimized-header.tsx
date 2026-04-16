"use client"

import { useState } from "react"
import { Search, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LanguageSelector } from "./language-selector"
import { WeatherWidget } from "./weather-widget"
import { useLanguage } from "@/contexts/language-context"

export function MobileOptimizedHeader() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Szene</h1>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* Search Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Weather (hidden on small screens) */}
            <div className="hidden sm:block">
              <WeatherWidget />
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Menu Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder={t("searchPlaceholder")} className="pl-10 pr-4 py-2 w-full" autoFocus />
            </div>
          </div>
        )}

        {/* Desktop Search Bar */}
        <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder={t("searchPlaceholder")} className="pl-10 pr-4 py-2 w-full" />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="pb-4 border-t border-gray-200 mt-2">
            <nav className="flex flex-col space-y-3 pt-4">
              <a href="#events" className="text-gray-700 hover:text-purple-600 transition-colors py-2 font-medium">
                {t("events")}
              </a>
              <a href="#venues" className="text-gray-700 hover:text-purple-600 transition-colors py-2 font-medium">
                {t("venues")}
              </a>
              <a href="#categories" className="text-gray-700 hover:text-purple-600 transition-colors py-2 font-medium">
                {t("categories")}
              </a>
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors py-2 font-medium">
                {t("about")}
              </a>

              {/* Mobile Weather */}
              <div className="sm:hidden pt-2 border-t border-gray-100">
                <WeatherWidget />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
