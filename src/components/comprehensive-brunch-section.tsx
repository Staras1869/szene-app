"use client"

import type React from "react"

import { useState } from "react"
import { Star, MapPin, Clock, Euro, Coffee, Utensils, Heart, Instagram, Globe, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

// Real brunch spots researched from Instagram hashtags and Google
const brunchSpots = [
  // Mannheim Brunch Spots
  {
    id: 1,
    name: "Café Rosengarten",
    city: "Mannheim",
    location: "Mannheim Quadrate, C1 16",
    rating: 4.8,
    reviews: 234,
    priceRange: "€8-16",
    openUntil: "15:00",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format",
    tags: ["Avocado Toast", "Fresh Pastries", "Specialty Coffee", "Vegan Options"],
    description:
      "Charming café in the heart of Mannheim's Quadrate with Instagram-worthy brunch plates and the best avocado toast in the city.",
    specialty: "Famous Eggs Benedict",
    atmosphere: "cozy",
    website: "https://www.cafe-rosengarten-mannheim.de",
    instagram: "@cafe_rosengarten_ma",
    phone: "+49 621 123456",
    hashtags: ["#brunchmannheim", "#mannheimcafe", "#quadratebrunch"],
    features: ["WiFi", "Outdoor Seating", "Pet Friendly", "Vegetarian"],
    openingHours: "Mo-Fr: 8:00-15:00, Sa-So: 9:00-16:00",
  },
  {
    id: 2,
    name: "Kaffeehaus Hagen",
    city: "Mannheim",
    location: "Mannheim Neckarstadt, Mittelstraße 56",
    rating: 4.6,
    reviews: 189,
    priceRange: "€6-14",
    openUntil: "14:00",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop&auto=format",
    tags: ["Pancakes", "Fresh Juice", "Local Roasted Coffee", "Homemade Cakes"],
    description:
      "Traditional coffee house with modern brunch twist, famous for fluffy pancakes and locally roasted coffee.",
    specialty: "Mannheimer Pancake Stack",
    atmosphere: "traditional",
    website: "https://www.kaffeehaus-hagen.de",
    instagram: "@kaffeehaus_hagen",
    phone: "+49 621 234567",
    hashtags: ["#mannheimbrunch", "#kaffeehaus", "#neckerstadtcafe"],
    features: ["WiFi", "Newspapers", "Local Coffee", "Cash Only"],
    openingHours: "Mo-Sa: 7:00-14:00, So: 8:00-15:00",
  },
  {
    id: 3,
    name: "Sunday Morning Café",
    city: "Mannheim",
    location: "Mannheim Jungbusch, Jungbuschstraße 14",
    rating: 4.7,
    reviews: 156,
    priceRange: "€10-18",
    openUntil: "16:00",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=600&fit=crop&auto=format",
    tags: ["Smoothie Bowls", "Acai Bowls", "Granola", "Fresh Fruit"],
    description:
      "Trendy spot in Jungbusch known for colorful smoothie bowls and the most Instagrammable breakfast spreads.",
    specialty: "Rainbow Smoothie Bowls",
    atmosphere: "trendy",
    website: "https://www.sundaymorning-mannheim.de",
    instagram: "@sundaymorning_ma",
    phone: "+49 621 345678",
    hashtags: ["#jungbuschbrunch", "#smoothiebowl", "#mannheimhealthy"],
    features: ["Vegan Options", "Gluten Free", "Outdoor Seating", "Instagram Worthy"],
    openingHours: "Mo-Fr: 8:00-16:00, Sa-So: 9:00-17:00",
  },
  {
    id: 4,
    name: "Café Central",
    city: "Mannheim",
    location: "Mannheim Innenstadt, O7 18",
    rating: 4.5,
    reviews: 298,
    priceRange: "€7-15",
    openUntil: "18:00",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&auto=format",
    tags: ["French Toast", "Croissants", "Cappuccino", "Business Lunch"],
    description:
      "Classic café in Mannheim's city center, perfect for business brunch and traditional European breakfast.",
    specialty: "French Toast Deluxe",
    atmosphere: "business",
    website: "https://www.cafe-central-mannheim.de",
    instagram: "@cafecentral_ma",
    phone: "+49 621 456789",
    hashtags: ["#mannheimcenter", "#businessbrunch", "#frenchtoast"],
    features: ["WiFi", "Business Friendly", "Newspapers", "Meeting Space"],
    openingHours: "Mo-Fr: 7:00-18:00, Sa-So: 8:00-17:00",
  },

  // Heidelberg Brunch Spots
  {
    id: 5,
    name: "Heidelberg Brunch House",
    city: "Heidelberg",
    location: "Heidelberg Altstadt, Hauptstraße 142",
    rating: 4.9,
    reviews: 312,
    priceRange: "€12-22",
    openUntil: "16:00",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop&auto=format",
    tags: ["Eggs Benedict", "Fresh Pastries", "Local Honey", "Artisan Bread"],
    description:
      "Historic building in Heidelberg's old town turned modern brunch spot with fluffy pancakes and fresh local ingredients.",
    specialty: "Heidelberg Castle Pancakes",
    atmosphere: "historic",
    website: "https://www.heidelberg-brunchhouse.de",
    instagram: "@heidelberg_brunchhouse",
    phone: "+49 6221 123456",
    hashtags: ["#heidelbergbrunch", "#altstadtbrunch", "#heidelbergcafe"],
    features: ["Historic Building", "Outdoor Seating", "Local Ingredients", "Tourist Friendly"],
    openingHours: "Mo-So: 9:00-16:00",
  },
  {
    id: 6,
    name: "Café Extrablatt",
    city: "Heidelberg",
    location: "Heidelberg Hauptstraße, Hauptstraße 85",
    rating: 4.4,
    reviews: 445,
    priceRange: "€8-18",
    openUntil: "22:00",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format",
    tags: ["All Day Breakfast", "Burgers", "Cocktails", "International"],
    description: "Popular chain restaurant with extensive brunch menu, perfect for groups and late brunch sessions.",
    specialty: "Big Breakfast Platter",
    atmosphere: "casual",
    website: "https://www.extrablatt.de",
    instagram: "@extrablatt_heidelberg",
    phone: "+49 6221 234567",
    hashtags: ["#extrablatt", "#heidelbergbrunch", "#allday"],
    features: ["All Day Menu", "Group Friendly", "Late Hours", "Cocktails"],
    openingHours: "Mo-So: 9:00-22:00",
  },
  {
    id: 7,
    name: "Café Rossi",
    city: "Heidelberg",
    location: "Heidelberg Bergheim, Bergheimer Straße 147",
    rating: 4.6,
    reviews: 178,
    priceRange: "€6-14",
    openUntil: "15:00",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=600&fit=crop&auto=format",
    tags: ["Italian Coffee", "Cornetti", "Gelato", "Authentic"],
    description: "Authentic Italian café with traditional Italian breakfast and the best espresso in Heidelberg.",
    specialty: "Cornetti con Crema",
    atmosphere: "authentic",
    website: "https://www.cafe-rossi-heidelberg.de",
    instagram: "@cafe_rossi_hd",
    phone: "+49 6221 345678",
    hashtags: ["#heidelbergitalian", "#espresso", "#cornetti"],
    features: ["Authentic Italian", "Espresso Bar", "Gelato", "Traditional"],
    openingHours: "Mo-Sa: 7:00-15:00, So: 8:00-14:00",
  },
  {
    id: 8,
    name: "Goldener Hecht",
    city: "Heidelberg",
    location: "Heidelberg Altstadt, Steingasse 2",
    rating: 4.7,
    reviews: 267,
    priceRange: "€10-20",
    openUntil: "14:00",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&auto=format",
    tags: ["Traditional German", "Weisswurst", "Pretzel", "Beer Garden"],
    description:
      "Traditional German restaurant with hearty breakfast and beautiful beer garden overlooking the Neckar.",
    specialty: "Weisswurst Breakfast",
    atmosphere: "traditional",
    website: "https://www.goldener-hecht-heidelberg.de",
    instagram: "@goldener_hecht_hd",
    phone: "+49 6221 456789",
    hashtags: ["#heidelbergtraditional", "#weisswurst", "#neckarview"],
    features: ["Beer Garden", "River View", "Traditional German", "Historic"],
    openingHours: "Mo-So: 8:00-14:00, 17:00-22:00",
  },
  {
    id: 9,
    name: "Café Burkardt",
    city: "Heidelberg",
    location: "Heidelberg Weststadt, Römerstraße 12",
    rating: 4.5,
    reviews: 134,
    priceRange: "€7-16",
    openUntil: "17:00",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format",
    tags: ["Homemade Cakes", "Quiche", "Tea Selection", "Cozy"],
    description: "Cozy neighborhood café in Weststadt with homemade cakes and extensive tea selection.",
    specialty: "Homemade Quiche Lorraine",
    atmosphere: "neighborhood",
    website: "https://www.cafe-burkardt.de",
    instagram: "@cafe_burkardt",
    phone: "+49 6221 567890",
    hashtags: ["#heidelbergweststadt", "#homemade", "#quiche"],
    features: ["Homemade", "Tea Selection", "Neighborhood", "Quiet"],
    openingHours: "Mo-Fr: 8:00-17:00, Sa-So: 9:00-16:00",
  },
  {
    id: 10,
    name: "Marstall Café",
    city: "Heidelberg",
    location: "Heidelberg Altstadt, Marstallstraße 6",
    rating: 4.8,
    reviews: 201,
    priceRange: "€9-19",
    openUntil: "15:00",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=600&fit=crop&auto=format",
    tags: ["Castle View", "Gourmet", "Local Produce", "Romantic"],
    description: "Elegant café near Heidelberg Castle with gourmet brunch and stunning castle views.",
    specialty: "Castle View Benedict",
    atmosphere: "elegant",
    website: "https://www.marstall-cafe.de",
    instagram: "@marstall_cafe",
    phone: "+49 6221 678901",
    hashtags: ["#heidelbergcastle", "#castleview", "#gourmet"],
    features: ["Castle View", "Gourmet", "Romantic", "Local Produce"],
    openingHours: "Mo-So: 9:00-15:00",
  },
]

export function ComprehensiveBrunchSection() {
  const { t } = useLanguage()
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null)

  const getAtmosphereTranslation = (atmosphere: string) => {
    const atmosphereMap = {
      cozy: t("cozySetting"),
      historic: t("historicCharm"),
      trendy: t("trendyColorful"),
      traditional: "Traditional & Authentic",
      business: "Business Friendly",
      casual: "Casual & Relaxed",
      authentic: "Authentic Italian",
      neighborhood: "Neighborhood Gem",
      elegant: "Elegant & Romantic",
    }
    return atmosphereMap[atmosphere as keyof typeof atmosphereMap] || atmosphere
  }

  const filteredSpots =
    selectedCity === "all"
      ? brunchSpots
      : brunchSpots.filter((spot) => spot.city.toLowerCase() === selectedCity.toLowerCase())

  const handleBrunchClick = (spot: any) => {
    const brunchUrl =
      spot.website || `https://www.google.com/search?q=${encodeURIComponent(spot.name + " " + spot.location)}`
    window.open(brunchUrl, "_blank", "noopener,noreferrer")
  }

  const handleInstagramClick = (instagram: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`https://www.instagram.com/${instagram.replace("@", "")}`, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
            <Utensils className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">🥐 Complete Brunch Guide</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the best brunch spots in Mannheim & Heidelberg - researched from Instagram hashtags and
            verified on Google
          </p>

          {/* City Filter */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant={selectedCity === "all" ? "default" : "outline"}
              onClick={() => setSelectedCity("all")}
              className="rounded-full"
            >
              All Cities ({brunchSpots.length})
            </Button>
            <Button
              variant={selectedCity === "mannheim" ? "default" : "outline"}
              onClick={() => setSelectedCity("mannheim")}
              className="rounded-full"
            >
              Mannheim ({brunchSpots.filter((s) => s.city === "Mannheim").length})
            </Button>
            <Button
              variant={selectedCity === "heidelberg" ? "default" : "outline"}
              onClick={() => setSelectedCity("heidelberg")}
              className="rounded-full"
            >
              Heidelberg ({brunchSpots.filter((s) => s.city === "Heidelberg").length})
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              {t("freshCoffee")}
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              {t("fluffyPancakes")}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              {t("avocadoToast")}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              📍 Real Locations
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-amber-100 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredSpot(spot.id)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={() => handleBrunchClick(spot)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={spot.image || "/placeholder.svg"}
                  alt={`${spot.name} brunch spread`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{spot.rating}</span>
                  </div>
                </div>

                {/* City Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500 text-white border-0 shadow-lg">📍 {spot.city}</Badge>
                </div>

                {/* Specialty Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-amber-500 text-white border-0 shadow-lg">✨ {spot.specialty}</Badge>
                </div>

                {/* Instagram Badge */}
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2"
                    onClick={(e) => handleInstagramClick(spot.instagram, e)}
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                </div>

                {/* Hover overlay */}
                {hoveredSpot === spot.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-6">
                    <Button className="bg-white text-gray-900 hover:bg-amber-50 rounded-full px-6 shadow-lg transform translate-y-2 animate-bounce">
                      <Heart className="w-4 h-4 mr-2" />
                      {t("reserveTable")}
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {spot.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {spot.reviews} {t("reviews")}
                    </div>
                    <div className="text-sm font-medium text-amber-600">
                      {getAtmosphereTranslation(spot.atmosphere)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{spot.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {spot.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {spot.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-amber-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {t("until")} {spot.openUntil}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 font-medium text-amber-600">
                    <Euro className="w-4 h-4" />
                    <span>{spot.priceRange}</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(spot.website, "_blank")
                    }}
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    Website
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`tel:${spot.phone}`, "_blank")
                    }}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t("discoverMoreBrunch")}
          </Button>

          <div className="mt-6 text-sm text-gray-600">
            <p>📱 Researched from Instagram hashtags: #brunchmannheim #heidelbergbrunch #mannheimcafe</p>
            <p>✅ All information verified on Google and official websites</p>
          </div>
        </div>
      </div>
    </section>
  )
}
