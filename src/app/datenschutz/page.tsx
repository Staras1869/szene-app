import Link from "next/link"

export const metadata = {
  title: "Datenschutzerklärung – Szene",
  description: "DSGVO-konforme Datenschutzerklärung der Szene Digital Solutions UG (haftungsbeschränkt)",
}

const LAST_UPDATED = "16. April 2026"
const COMPANY = "Szene Digital Solutions UG (haftungsbeschränkt)"
const ADDRESS = "Planken 7, 68161 Mannheim, Deutschland"
const EMAIL = "kontakt@szene-app.de"

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
          <p className="text-sm text-gray-400 mb-10">Stand: {LAST_UPDATED}</p>

          <Section title="1. Verantwortliche Stelle">
            <p>
              Verantwortlich für die Verarbeitung personenbezogener Daten im Sinne der DSGVO ist:
            </p>
            <address className="not-italic bg-gray-50 rounded-xl p-4 text-sm">
              <strong>{COMPANY}</strong><br />
              {ADDRESS}<br />
              E-Mail: <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>
            </address>
          </Section>

          <Section title="2. Erhobene Daten und Verarbeitungszwecke">
            <SubSection title="2.1 Nutzerkonto (Registrierung)">
              <p><strong>Daten:</strong> E-Mail-Adresse, Name, verschlüsseltes Passwort, Registrierungsdatum.</p>
              <p><strong>Zweck:</strong> Erstellung und Verwaltung des Nutzerkontos, Authentifizierung.</p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
              <p><strong>Speicherdauer:</strong> Bis zur Konto-Löschung durch den Nutzer oder durch Szene; danach
                innerhalb von 30 Tagen, sofern keine gesetzliche Aufbewahrungspflicht besteht.</p>
            </SubSection>

            <SubSection title="2.2 Bewertungen und Check-ins">
              <p><strong>Daten:</strong> Venue-ID, Bewertungspunkte (1–5), optionaler Freitext, Zeitstempel.</p>
              <p><strong>Zweck:</strong> Darstellung von Nutzerbewertungen, Betrieb der Check-in-Funktion.</p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.</p>
              <p><strong>Speicherdauer:</strong> Bis zur Löschung durch den Nutzer oder Konto-Löschung.</p>
            </SubSection>

            <SubSection title="2.3 Favoriten">
              <p><strong>Daten:</strong> Nutzer-ID, Venue-ID, Zeitstempel der Speicherung.</p>
              <p><strong>Zweck:</strong> Persistente Merklistenfunktion über Geräte hinweg.</p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.</p>
            </SubSection>

            <SubSection title="2.4 Server- und Zugriffslogs">
              <p><strong>Daten:</strong> IP-Adresse (anonymisiert nach 7 Tagen), Zeitstempel, aufgerufene URL,
                HTTP-Statuscode, Referrer, User-Agent.</p>
              <p><strong>Zweck:</strong> Sicherheit, Fehlerdiagnose, Missbrauchserkennung, Rate-Limiting.</p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
                Betriebssicherheit).</p>
              <p><strong>Speicherdauer:</strong> 7 Tage (danach Anonymisierung).</p>
            </SubSection>

            <SubSection title="2.5 Standortdaten (optional, nur mit Einwilligung)">
              <p><strong>Daten:</strong> GPS-Koordinaten (Längen-/Breitengrad) zum Zeitpunkt der Nutzung.</p>
              <p><strong>Zweck:</strong> Standortbasierte Venue-Empfehlungen.</p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Die Einwilligung
                kann jederzeit in den Geräteeinstellungen widerrufen werden. Szene speichert Standortdaten
                nicht dauerhaft auf Servern.</p>
            </SubSection>

            <SubSection title="2.6 Push-Benachrichtigungen (optional)">
              <p><strong>Daten:</strong> Geräte-Token für Push-Dienste (Apple APNs / Google FCM).</p>
              <p><strong>Zweck:</strong> Versand von Event-Benachrichtigungen.</p>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Widerruf jederzeit
                in den App-Einstellungen.</p>
            </SubSection>
          </Section>

          <Section title="3. Weitergabe an Dritte">
            <p>Personenbezogene Daten werden nur in folgenden Fällen an Dritte weitergegeben:</p>
            <ul>
              <li>
                <strong>Neon Inc. (Datenbankbetreiber)</strong> – Hosting der PostgreSQL-Datenbank in der EU
                (Region Frankfurt/eu-central-1). Verarbeitung auf Basis eines
                Auftragsverarbeitungsvertrags (Art. 28 DSGVO).
              </li>
              <li>
                <strong>Vercel Inc.</strong> – Hosting der Webanwendung und serverloser API-Funktionen.
                Verarbeitung auf Basis von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
              </li>
              <li>
                <strong>OpenWeatherMap</strong> – Für Wetteranfragen wird die Stadt (kein Standort) übermittelt.
              </li>
              <li>
                <strong>OpenStreetMap / Overpass API</strong> – Öffentliche, anonymisierte Venue-Abfragen.
              </li>
              <li>
                <strong>Behörden</strong> – Bei gesetzlicher Verpflichtung oder zur Strafverfolgung.
              </li>
            </ul>
            <p>Eine Weitergabe zu Werbezwecken an Dritte erfolgt <strong>nicht</strong>.</p>
          </Section>

          <Section title="4. Cookies und lokale Speicherung">
            <p>Szene verwendet folgende Speichermechanismen:</p>
            <ul>
              <li>
                <strong>auth-token (HTTP-Only-Cookie):</strong> Sitzungs-Token nach Login. Läuft nach 7 Tagen ab.
                Notwendig für die Nutzung des Kontos – keine Einwilligung erforderlich (Art. 6 Abs. 1 lit. b DSGVO).
              </li>
              <li>
                <strong>localStorage (szene-favorites):</strong> Favoriten nicht-eingeloggter Nutzer.
                Wird ausschließlich lokal im Browser gespeichert, nicht an Server übertragen.
              </li>
              <li>
                <strong>localStorage (lang):</strong> Spracheinstellung. Kein Personenbezug.
              </li>
            </ul>
            <p>Es werden <strong>keine Tracking- oder Werbe-Cookies</strong> gesetzt.</p>
          </Section>

          <Section title="5. Ihre Rechte">
            <p>Sie haben gegenüber Szene folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
            <ul>
              <li><strong>Auskunft</strong> (Art. 15 DSGVO) – welche Daten wir über Sie verarbeiten</li>
              <li><strong>Berichtigung</strong> (Art. 16 DSGVO) – Korrektur unrichtiger Daten</li>
              <li><strong>Löschung</strong> (Art. 17 DSGVO) – „Recht auf Vergessenwerden"</li>
              <li><strong>Einschränkung</strong> (Art. 18 DSGVO) – Einschränkung der Verarbeitung</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO) – Erhalt Ihrer Daten in maschinenlesbarem Format</li>
              <li><strong>Widerspruch</strong> (Art. 21 DSGVO) – gegen auf berechtigtem Interesse basierende Verarbeitung</li>
              <li><strong>Widerruf</strong> – von Einwilligungen jederzeit mit Wirkung für die Zukunft</li>
            </ul>
            <p>
              Zur Ausübung Ihrer Rechte wenden Sie sich per E-Mail an{" "}
              <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>.
              Wir bearbeiten Anfragen innerhalb von 30 Tagen.
            </p>
            <p>
              Sie haben zudem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
              Für Baden-Württemberg:{" "}
              <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer"
                className="text-purple-600 hover:underline">
                Landesbeauftragter für den Datenschutz und die Informationsfreiheit Baden-Württemberg
              </a>.
            </p>
          </Section>

          <Section title="6. Datensicherheit">
            <p>
              Alle Verbindungen zur Plattform sind TLS-verschlüsselt (HTTPS). Passwörter werden ausschließlich
              als bcrypt-Hash (Kostenfaktor 12) gespeichert – kein Klartext. Authentifizierungs-Tokens werden
              als HTTP-Only-Cookies übertragen und sind für JavaScript nicht zugänglich.
              API-Endpunkte sind durch Rate-Limiting gegen Brute-Force-Angriffe geschützt.
            </p>
          </Section>

          <Section title="7. Änderungen dieser Erklärung">
            <p>
              Bei wesentlichen Änderungen dieser Datenschutzerklärung werden eingeloggte Nutzer per E-Mail
              informiert. Die jeweils aktuelle Fassung ist stets auf dieser Seite abrufbar.
            </p>
          </Section>

          <div className="mt-10 pt-8 border-t border-gray-100 text-sm text-gray-400">
            <p>{COMPANY} · {ADDRESS}</p>
            <p className="mt-1">
              Kontakt Datenschutz:{" "}
              <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>
            </p>
            <p className="mt-2">
              <Link href="/agb" className="text-purple-600 hover:underline mr-4">AGB</Link>
              <Link href="/impressum" className="text-purple-600 hover:underline">Impressum</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
      <p className="font-semibold text-gray-800 text-sm">{title}</p>
      {children}
    </div>
  )
}
