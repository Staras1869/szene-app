"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Globe, Phone, Mail, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface VenueSubmissionData {
  name: string
  category: string
  address: string
  city: string
  description: string
  website?: string
  phone?: string
  email?: string
  openingHours?: string
  priceRange?: string
  features: string[]
}

export function VenueSubmissionForm({ venueName, onClose }: { venueName?: string; onClose: () => void }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<VenueSubmissionData>({
    name: venueName || "",
    category: "",
    address: "",
    city: "Mannheim",
    description: "",
    website: "",
    phone: "",
    email: "",
    openingHours: "",
    priceRange: "",
    features: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { id: "nightlife", name: t("categoryNightlife") },
    { id: "music", name: t("categoryMusic") },
    { id: "food", name: t("categoryFoodDrink") },
    { id: "culture", name: t("categoryArtCulture") },
    { id: "social", name: t("categorySocial") },
    { id: "outdoor", name: t("categoryOutdoor") },
  ]

  const features = [
    "WiFi",
    "Outdoor Seating",
    "Live Music",
    "Happy Hour",
    "Pet Friendly",
    "Wheelchair Accessible",
    "Parking",
    "Late Night",
    "Rooftop",
    "Dance Floor",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would send to your backend API
      const response = await fetch("/api/venues/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(t("venueSubmittedSuccess"))
        onClose()
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      alert(t("venueSubmissionError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <span>{t("addNewVenue")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t("venueName")}</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("category")}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">{t("selectCategory")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t("address")}
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("city")}</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="Mannheim">Mannheim</option>
                <option value="Heidelberg">Heidelberg</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("description")}</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                {t("website")}
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                {t("phone")}
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                {t("email")}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {t("openingHours")}
              </label>
              <Input
                value={formData.openingHours}
                onChange={(e) => setFormData((prev) => ({ ...prev, openingHours: e.target.value }))}
                placeholder="Mo-Fr 18:00-02:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("priceRange")}</label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData((prev) => ({ ...prev, priceRange: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="">{t("selectPriceRange")}</option>
                <option value="€">€ - {t("budget")}</option>
                <option value="€€">€€ - {t("moderate")}</option>
                <option value="€€€">€€€ - {t("expensive")}</option>
                <option value="€€€€">€€€€ - {t("luxury")}</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("features")}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.map((feature) => (
                <Badge
                  key={feature}
                  variant={formData.features.includes(feature) ? "default" : "outline"}
                  className="cursor-pointer justify-center py-2"
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isSubmitting ? t("submitting") : t("submitVenue")}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
