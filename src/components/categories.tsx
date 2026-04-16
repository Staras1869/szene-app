"use client"

import { Music, Utensils, Palette, Users, TreePine, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Categories() {
  const { t } = useLanguage()

  const categories = [
    { name: t("categoryNightlife"),  icon: Sparkles, color: "from-purple-400 to-purple-600" },
    { name: t("categoryMusic"),      icon: Music,    color: "from-pink-400 to-pink-600"   },
    { name: t("categoryFoodDrink"),  icon: Utensils, color: "from-amber-400 to-amber-600" },
    { name: t("categoryArtCulture"), icon: Palette,  color: "from-blue-400 to-blue-600"   },
    { name: t("categorySocial"),     icon: Users,    color: "from-emerald-400 to-emerald-600" },
    { name: t("categoryOutdoor"),    icon: TreePine, color: "from-green-400 to-green-600" },
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
              <button
                key={category.name}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl"
              >
                <div className="text-center space-y-3">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors text-sm">
                    {category.name}
                  </h3>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
