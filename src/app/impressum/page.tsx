import Link from "next/link"

export const metadata = {
  title: "Impressum – Szene",
  description: "Impressum der Szene-Plattform gemäß § 5 TMG",
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="max-w-2xl mx-auto px-4">

        <Link href="/" className="text-sm mb-8 inline-block transition-colors" style={{ color: "var(--text-muted)" }}>← Zurück</Link>

        <h1 className="text-3xl font-black tracking-tight mb-2">Impressum</h1>
        <p className="text-sm mb-12" style={{ color: "var(--text-muted)" }}>Angaben gemäß § 5 TMG</p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Verantwortlich</h2>
            <p>Efstratios Kampourakis</p>
            <p>Roonstraße 29</p>
            <p>67061 Ludwigshafen am Rhein</p>
            <p>Deutschland</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Kontakt</h2>
            <p>E-Mail: <a href="mailto:hallo@szene.app" className="transition-colors" style={{ color: "var(--accent)" }}>hallo@szene.app</a></p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Unternehmensform</h2>
            <p>
              Die Szene Digital Solutions UG (haftungsbeschränkt) befindet sich derzeit in Gründung.
              Bis zur Eintragung ins Handelsregister handelt es sich um ein Einzelunternehmen
              des oben genannten Inhabers.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV</h2>
            <p>Efstratios Kampourakis</p>
            <p>Roonstraße 29</p>
            <p>67061 Ludwigshafen am Rhein</p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Haftungsausschluss</h2>
            <p>
              Die Inhalte dieser Plattform wurden mit größtmöglicher Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte — insbesondere
              von Venue- und Eventdaten — wird keine Gewähr übernommen.
            </p>
            <p className="mt-3">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die
              Inhalte externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich
              deren Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Online-Streitbeilegung</h2>
            <p>
              Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"
                className="transition-colors" style={{ color: "var(--accent)" }}>
                ec.europa.eu/consumers/odr
              </a>.
              Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Datenschutz</h2>
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <Link href="/datenschutz" className="transition-colors" style={{ color: "var(--accent)" }}>
                Datenschutzerklärung
              </Link>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-faint)" }}>
          <p>Stand: April 2026</p>
        </div>
      </div>
    </div>
  )
}
