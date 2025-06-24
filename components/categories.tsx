"use client"

import { Utensils, Coffee, Wine, Pizza, Fish, Leaf } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Categories() {
  const { t } = useLanguage()

  const categories = [
    { name: t("categoryNightlife"), icon: Wine, color: "from-purple-400 to-purple-600" },
    { name: t("categoryMusic"), icon: Utensils, color: "from-green-400 to-green-600" },
    { name: t("categoryFoodDrink"), icon: Coffee, color: "from-amber-400 to-amber-600" },
    { name: t("categoryArtCulture"), icon: Fish, color: "from-blue-400 to-blue-600" },
    { name: t("categorySocial"), icon: Leaf, color: "from-emerald-400 to-emerald-600" },
    { name: t("categoryOutdoor"), icon: Pizza, color: "from-red-400 to-red-600" },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t("browseCategoriesTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("browseCategoriesDescription")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.name} className="group cursor-pointer">
                <div className="text-center space-y-3">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
