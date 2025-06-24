"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"

export function Newsletter() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">{t("neverMissScene")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("newsletterDescription")}</p>

          <div className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <Input
                type="email"
                placeholder={t("enterEmail")}
                className="flex-1 rounded-full border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
              <Button className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white rounded-full px-8">
                {t("subscribe")}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">{t("joinPartyEnthusiasts")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
