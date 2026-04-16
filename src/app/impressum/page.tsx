"use client"

import { useLanguage } from "@/contexts/language-context"

export default function ImpressumPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("impressum")}</h1>

          <div className="space-y-8">
            {/* Company Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("companyInformation")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Szene Digital Solutions UG (haftungsbeschränkt)</strong>
                </p>
                <p>Planken 7</p>
                <p>68161 Mannheim</p>
                <p>Deutschland</p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("contact")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>{t("phone")}:</strong> +49 621 987 654 32
                </p>
                <p>
                  <strong>E-Mail:</strong> kontakt@szene-app.de
                </p>
                <p>
                  <strong>Website:</strong> www.szene-app.de
                </p>
              </div>
            </section>

            {/* Legal Representative */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("legalRepresentative")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>{t("managingDirector")}:</strong> Alexander Schmidt
                </p>
                <p>
                  <strong>{t("businessAddress")}:</strong> Planken 7, 68161 Mannheim
                </p>
              </div>
            </section>

            {/* Registration */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("registration")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>{t("commercialRegister")}:</strong> Amtsgericht Mannheim
                </p>
                <p>
                  <strong>{t("registrationNumber")}:</strong> HRB 735421
                </p>
                <p>
                  <strong>{t("vatId")}:</strong> DE345678901
                </p>
                <p>
                  <strong>{t("taxNumber")}:</strong> 38457/12345
                </p>
              </div>
            </section>

            {/* Responsible for Content */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("responsibleForContent")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>{t("responsibleContentText")}</p>
                <p className="mt-4">
                  <strong>Alexander Schmidt</strong>
                  <br />
                  Planken 7<br />
                  68161 Mannheim
                  <br />
                  Deutschland
                  <br />
                  E-Mail: redaktion@szene-app.de
                </p>
              </div>
            </section>

            {/* Professional Liability Insurance */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("professionalLiability")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>{t("insuranceCompany")}:</strong> Allianz Versicherungs-AG
                </p>
                <p>
                  <strong>{t("insuranceScope")}:</strong> Deutschland und EU
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("disclaimer")}</h2>
              <div className="space-y-4 text-gray-600 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t("contentLiability")}</h3>
                  <p>{t("contentLiabilityText")}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t("linkLiability")}</h3>
                  <p>{t("linkLiabilityText")}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t("copyright")}</h3>
                  <p>{t("copyrightText")}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t("trademarks")}</h3>
                  <p>{t("trademarksText")}</p>
                </div>
              </div>
            </section>

            {/* Data Protection Officer */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("dataProtectionOfficer")}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Dr. Maria Weber</strong>
                  <br />
                  Datenschutzbeauftragte
                  <br />
                  E-Mail: datenschutz@szene-app.de
                  <br />
                  Telefon: +49 621 987 654 35
                </p>
              </div>
            </section>

            {/* Online Dispute Resolution */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("onlineDisputeResolution")}</h2>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>{t("odrText")}</p>
                <p>
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p>{t("odrEmail")}: kontakt@szene-app.de</p>
                <p className="mt-4">{t("alternativeDispute")}</p>
              </div>
            </section>

            {/* Platform Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("platformInformation")}</h2>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>{t("platformText")}</p>
                <p className="mt-2">
                  <strong>{t("technicalSupport")}:</strong> support@szene-app.de
                </p>
              </div>
            </section>

            {/* Regulatory Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("regulatoryInformation")}</h2>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>
                  <strong>{t("supervisoryAuthority")}:</strong>
                  <br />
                  Landesanstalt für Medien Baden-Württemberg (LFK)
                  <br />
                  Reinsburgstraße 27
                  <br />
                  70178 Stuttgart
                  <br />
                  Deutschland
                </p>
                <p className="mt-4">
                  <strong>{t("applicableLaw")}:</strong> {t("germanLaw")}
                </p>
                <p>
                  <strong>{t("jurisdiction")}:</strong> Mannheim, Deutschland
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t("lastUpdated")}: {new Date().toLocaleDateString("de-DE")}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t("impressumVersion")}: 2.1 | {t("legalReview")}: Dezember 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
