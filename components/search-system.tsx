"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Star, Plus, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { MANNHEIM_HEIDELBERG_VENUES, type Venue } from "@/lib/venues-database"

interface SearchResult extends Venue {
  score: number
  matchType: "name" | "category" | "description" | "address"
}

interface WebSearchResult {
  title: string
  url: string
  description: string
  category?: string
  address?: string
  rating?: number
  hours?: string
}

export function SearchSystem() {
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [webResults, setWebResults] = useState<WebSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestionForm, setShowSuggestionForm] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Search through existing venues
  const searchVenues = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const normalizedQuery = searchQuery.toLowerCase().trim()
    const searchResults: SearchResult[] = []

    MANNHEIM_HEIDELBERG_VENUES.forEach((venue) => {
      let score = 0
      let matchType: SearchResult["matchType"] = "description"

      // Exact name match (highest priority)
      if (venue.name.toLowerCase() === normalizedQuery) {
        score += 100
        matchType = "name"
      }
      // Partial name match
      else if (venue.name.toLowerCase().includes(normalizedQuery)) {
        score += 80
        matchType = "name"
      }

      // Category exact match
      if (venue.category.toLowerCase() === normalizedQuery) {
        score += 70
        matchType = "category"
      }
      // Category partial match
      else if (venue.category.toLowerCase().includes(normalizedQuery)) {
        score += 60
        matchType = "category"
      }

      // City match
      if (venue.city.toLowerCase().includes(normalizedQuery)) {
        score += 50
      }

      // Address match
      if (venue.address.toLowerCase().includes(normalizedQuery)) {
        score += 40
        matchType = "address"
      }

      // Description match
      if (venue.description.toLowerCase().includes(normalizedQuery)) {
        score += 30
        matchType = "description"
      }

      // Search terms that should match multiple venues
      const searchTerms = {
        bar: ["Nightlife", "bar", "cocktail", "drink"],
        restaurant: ["Food", "restaurant", "essen", "food"],
        club: ["Nightlife", "club", "party", "dance"],
        music: ["Music", "concert", "live", "band"],
        culture: ["Culture", "art", "museum", "theater"],
        mannheim: ["Mannheim"],
        heidelberg: ["Heidelberg"],
      }

      Object.entries(searchTerms).forEach(([term, keywords]) => {
        if (normalizedQuery.includes(term)) {
          keywords.forEach((keyword) => {
            if (
              venue.category.toLowerCase().includes(keyword.toLowerCase()) ||
              venue.name.toLowerCase().includes(keyword.toLowerCase()) ||
              venue.description.toLowerCase().includes(keyword.toLowerCase()) ||
              venue.city.toLowerCase().includes(keyword.toLowerCase())
            ) {
              score += 25
            }
          })
        }
      })

      if (score > 0) {
        searchResults.push({ ...venue, score, matchType })
      }
    })

    return searchResults.sort((a, b) => b.score - a.score).slice(0, 12)
  }

  // Web search for venues not in our database
  const searchWeb = async (searchQuery: string): Promise<WebSearchResult[]> => {
    // More realistic web search results based on actual Mannheim/Heidelberg venues
    const webSearchTemplates = [
      {
        title: `${searchQuery} - Mannheim Restaurant Guide`,
        url: `https://tripadvisor.com/mannheim/${searchQuery.replace(/\s+/g, "-").toLowerCase()}`,
        description: `Discover ${searchQuery} in Mannheim. Highly rated venue with excellent reviews and authentic atmosphere.`,
        category: "Restaurant",
        address: "Mannheim Innenstadt",
        rating: 4.2 + Math.random() * 0.6,
        hours: "11:00 - 23:00",
      },
      {
        title: `${searchQuery} Heidelberg - Altstadt`,
        url: `https://yelp.com/heidelberg/${searchQuery.replace(/\s+/g, "-").toLowerCase()}`,
        description: `Popular ${searchQuery} location in Heidelberg's historic old town. Known for great service and unique ambiance.`,
        category: "Bar & Restaurant",
        address: "Heidelberg Altstadt",
        rating: 4.0 + Math.random() * 0.8,
        hours: "17:00 - 01:00",
      },
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return webSearchTemplates
  }

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([])
        setWebResults([])
        setShowSuggestionForm(false)
        return
      }

      setIsSearching(true)

      // Search existing venues
      const venueResults = searchVenues(query)
      setResults(venueResults)

      // If no results found, search the web
      if (venueResults.length === 0) {
        const webSearchResults = await searchWeb(query)
        setWebResults(webSearchResults)
        setShowSuggestionForm(true)
      } else {
        setWebResults([])
        setShowSuggestionForm(false)
      }

      setIsSearching(false)
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmitVenue = async (venueName: string) => {
    // Here you would typically send to your backend
    console.log(`Submitting venue suggestion: ${venueName}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert(t("venueSubmitted"))
    setShowSuggestionForm(false)
    setQuery("")
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0 || webResults.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-xl border-2">
          <CardContent className="p-0">
            {/* Existing Venue Results */}
            {results.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t("foundVenues")}</h3>
                <div className="space-y-3">
                  {results.map((venue) => (
                    <div
                      key={venue.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setIsOpen(false)
                        setQuery("")
                        // Navigate to venue or show details
                      }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{venue.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{venue.address}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {venue.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{venue.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.{Math.floor(Math.random() * 5) + 3}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Web Search Results */}
            {webResults.length > 0 && (
              <div className="p-4 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">{t("webSearchResults")}</h3>
                <div className="space-y-3">
                  {webResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{result.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {result.category && (
                            <Badge variant="outline" className="text-xs">
                              {result.category}
                            </Badge>
                          )}
                          {result.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500">{result.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results - Suggestion Form */}
            {showSuggestionForm && results.length === 0 && webResults.length === 0 && (
              <div className="p-4">
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("venueNotFound")}</h3>
                  <p className="text-gray-600 mb-4">{t("suggestVenue")}</p>
                  <Button
                    onClick={() => handleSubmitVenue(query)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("addToSzene")}
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Categories */}
            {!query.trim() && (
              <div className="p-4 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">{t("quickSearch")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: t("categoryNightlife"), query: "nightlife" },
                    { name: t("categoryMusic"), query: "music" },
                    { name: t("categoryFoodDrink"), query: "restaurant" },
                    { name: t("categoryArtCulture"), query: "culture" },
                  ].map((category) => (
                    <Button
                      key={category.query}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(category.query)
                        setIsOpen(true)
                      }}
                      className="justify-start text-left"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
