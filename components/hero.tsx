"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
                <span className="text-purple-600 font-medium">{t("liveEventDiscovery")}</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t("discoverTitle")}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-gradient">
                  {t("discoverSubtitle")}
                </span>
                {t("discoverLocation")}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">{t("heroDescription")}</p>
            </div>

            <div className="flex items-center space-x-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("exploreEvents")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>{t("trustedBy")}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-gradient-to-br from-orange-200 to-red-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400/80 to-red-500/80">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🏙️</div>
                      <div className="font-bold">Rooftop Venues</div>
                      <div className="text-sm opacity-90">City Views & Cocktails</div>
                    </div>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-red-200 to-pink-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-400/80 to-pink-500/80">
                    <div className="text-center text-white">
                      <div className="text-3xl mb-1">🎷</div>
                      <div className="font-bold text-sm">Jazz & Wine</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square bg-gradient-to-br from-yellow-200 to-orange-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400/80 to-orange-500/80">
                    <div className="text-center text-white">
                      <div className="text-3xl mb-1">🎵</div>
                      <div className="font-bold text-sm">Electronic Music</div>
                    </div>
                  </div>
                </div>
                <div className="aspect-[4/5] bg-gradient-to-br from-green-200 to-blue-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/80 to-blue-500/80">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🎨</div>
                      <div className="font-bold">Art & Culture</div>
                      <div className="text-sm opacity-90">Galleries & Events</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-700"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
