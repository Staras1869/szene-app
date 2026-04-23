import Link from "next/link"

export const metadata = {
  title: "AGB – Allgemeine Geschäftsbedingungen",
  description: "Allgemeine Geschäftsbedingungen der Szene Digital Solutions UG (haftungsbeschränkt)",
}

const LAST_UPDATED = "20. April 2026"
const COMPANY = "Efstratios Kampourakis (Szene Digital Solutions UG in Gründung)"
const ADDRESS = "Roonstraße 29, 67061 Ludwigshafen am Rhein, Deutschland"
const EMAIL = "hallo@szene.app"

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-sm text-gray-400 mb-10">Stand: {LAST_UPDATED}</p>

          <Section title="§ 1 Geltungsbereich">
            <p>
              Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für die Nutzung der Plattform
              Szene (nachfolgend „Plattform"), die als Website unter <strong>szene.app</strong>
              betrieben wird.
            </p>
            <p>
              Betreiberin der Plattform ist die <strong>{COMPANY}</strong>, {ADDRESS}
              (nachfolgend „Szene" oder „wir").
            </p>
            <p>
              Mit der Registrierung eines Nutzerkontos oder der fortgesetzten Nutzung der Plattform erklärt der
              Nutzer sein Einverständnis mit diesen AGB. Entgegenstehende oder abweichende Bedingungen des
              Nutzers werden nicht anerkannt.
            </p>
          </Section>

          <Section title="§ 2 Leistungsbeschreibung">
            <p>Szene ist eine digitale Entdeckungsplattform für Gastronomie, Nachtleben und Veranstaltungen in
              Mannheim, Heidelberg, Frankfurt und umliegenden Regionen. Die Plattform bietet:</p>
            <ul>
              <li>Suche und Entdeckung von Venues (Bars, Clubs, Restaurants, Cafés u. a.)</li>
              <li>Anzeige von Veranstaltungen und Events</li>
              <li>Nutzerbewertungen und Check-in-Funktionen</li>
              <li>Merklisten (Favoriten) für registrierte Nutzer</li>
              <li>Wetterinformationen und standortbasierte Empfehlungen</li>
            </ul>
            <p>
              Venue- und Eventdaten werden automatisiert aus öffentlichen Quellen (u. a. OpenStreetMap,
              öffentliche Veranstaltungswebsites) aggregiert. Szene übernimmt keine Gewähr für die
              Vollständigkeit, Aktualität oder Richtigkeit dieser Daten.
            </p>
            <p>
              Die Grundfunktionen der Plattform sind kostenlos. Szene behält sich vor, zukünftig kostenpflichtige
              Premium-Funktionen anzubieten; bestehende Nutzer werden rechtzeitig informiert.
            </p>
          </Section>

          <Section title="§ 3 Nutzerkonto und Registrierung">
            <p>
              Für bestimmte Funktionen (Bewertungen, Check-ins, Favoriten) ist eine Registrierung erforderlich.
              Bei der Registrierung sind wahrheitsgemäße Angaben zu machen. Jede natürliche Person darf nur ein
              Nutzerkonto anlegen.
            </p>
            <p>
              Der Nutzer ist verpflichtet, seine Zugangsdaten vertraulich zu behandeln und Szene unverzüglich zu
              informieren, sofern Anzeichen für einen Missbrauch des Kontos vorliegen (E-Mail:{" "}
              <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>).
            </p>
            <p>
              Szene ist berechtigt, Nutzerkonten zu sperren oder zu löschen, wenn ein begründeter Verdacht auf
              Verstoß gegen diese AGB oder geltendes Recht besteht.
            </p>
            <p>
              Der Nutzer kann sein Konto jederzeit durch schriftliche Mitteilung an {EMAIL} löschen lassen.
              Mit Löschung werden alle personenbezogenen Daten innerhalb von 30 Tagen entfernt, soweit keine
              gesetzliche Aufbewahrungspflicht besteht.
            </p>
          </Section>

          <Section title="§ 4 Nutzungsbedingungen / Pflichten des Nutzers">
            <p>Der Nutzer verpflichtet sich, die Plattform ausschließlich zu rechtmäßigen Zwecken zu nutzen.
              Insbesondere ist es untersagt:</p>
            <ul>
              <li>Falsche, irreführende oder beleidigende Bewertungen zu verfassen</li>
              <li>Inhalte Dritter ohne Genehmigung zu verwenden oder Rechte Dritter zu verletzen</li>
              <li>Automatisierte Zugriffe (Bots, Scraper) ohne vorherige schriftliche Genehmigung von Szene durchzuführen</li>
              <li>Die Infrastruktur der Plattform zu belasten oder zu stören (z. B. DDoS-Angriffe)</li>
              <li>Spam, Werbung oder kommerzielle Inhalte ohne Genehmigung zu verbreiten</li>
              <li>Minderj&auml;hrigen den Zugang zu altersbeschränkten Inhalten zu ermöglichen</li>
              <li>Persönliche Daten anderer Nutzer ohne deren Einwilligung zu erheben oder weiterzugeben</li>
            </ul>
            <p>
              Nutzer, die Bewertungen oder sonstige Inhalte auf der Plattform veröffentlichen, räumen Szene ein
              nicht-exklusives, weltweites, gebührenfreies Nutzungsrecht zur Anzeige, Speicherung und
              Verarbeitung dieser Inhalte im Rahmen des Plattformbetriebs ein.
            </p>
          </Section>

          <Section title="§ 5 Alterserfordernis">
            <p>
              Die Nutzung der Plattform setzt ein Mindestalter von <strong>18 Jahren</strong> voraus, da ein
              erheblicher Teil der aufgeführten Venues und Veranstaltungen der Altersbeschränkung nach § 28
              JuSchG unterliegt. Mit der Registrierung bestätigt der Nutzer, das 18. Lebensjahr vollendet zu
              haben.
            </p>
          </Section>

          <Section title="§ 6 Verfügbarkeit und Wartung">
            <p>
              Szene strebt eine möglichst hohe Verfügbarkeit der Plattform an, übernimmt jedoch keine
              Garantie für eine ununterbrochene Erreichbarkeit. Geplante Wartungsarbeiten werden nach
              Möglichkeit vorab bekannt gegeben. Szene haftet nicht für Schäden, die durch vorübergehende
              Nichtverfügbarkeit entstehen.
            </p>
          </Section>

          <Section title="§ 7 Haftungsausschluss">
            <p>
              Szene haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der
              Gesundheit sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit von Szene oder ihrer
              gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen.
            </p>
            <p>
              Für leichte Fahrlässigkeit haftet Szene nur bei Verletzung wesentlicher Vertragspflichten
              (Kardinalpflichten) und beschränkt auf den vorhersehbaren, vertragstypischen Schaden.
            </p>
            <p>
              Szene übernimmt keine Haftung für:
            </p>
            <ul>
              <li>Die Richtigkeit, Vollständigkeit oder Aktualität von Venue- und Eventdaten</li>
              <li>Inhalte, die von Nutzern auf der Plattform veröffentlicht werden</li>
              <li>Verlinkung auf externe Websites (Haftung der jeweiligen Betreiber)</li>
              <li>Schäden durch unbefugten Zugriff Dritter auf Nutzerkonten infolge unsachgemäßer Passwortverwahrung</li>
            </ul>
          </Section>

          <Section title="§ 8 Gewerbliche Nutzung / Venue-Betreiber">
            <p>
              Venue-Betreiber, die eigene Inhalte auf der Plattform einstellen möchten, können dies über das
              Einreichungsformular tun. Szene behält sich vor, eingereichte Inhalte zu prüfen, zu bearbeiten oder
              abzulehnen. Ein Rechtsanspruch auf Veröffentlichung besteht nicht.
            </p>
            <p>
              Für kommerzielle Kooperationen, gesponserte Inhalte oder Partnerschaften wenden Sie sich bitte
              an <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>.
            </p>
          </Section>

          <Section title="§ 9 Datenschutz">
            <p>
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
              <Link href="/datenschutz" className="text-purple-600 hover:underline">Datenschutzerklärung</Link>,
              die Bestandteil dieser AGB ist. Die Datenschutzerklärung entspricht den Anforderungen der
              Datenschutz-Grundverordnung (DSGVO) sowie des Bundesdatenschutzgesetzes (BDSG).
            </p>
          </Section>

          <Section title="§ 10 Änderungen der AGB">
            <p>
              Szene behält sich vor, diese AGB jederzeit mit Wirkung für die Zukunft zu ändern.
              Änderungen werden den Nutzern per E-Mail oder durch einen deutlichen Hinweis auf der Plattform
              mindestens <strong>30 Tage</strong> vor Inkrafttreten mitgeteilt.
            </p>
            <p>
              Widerspricht der Nutzer den geänderten AGB nicht innerhalb von 30 Tagen nach Bekanntgabe,
              gelten die geänderten AGB als akzeptiert. Auf das Widerspruchsrecht und die Folgen des
              Schweigens wird im Rahmen der Änderungsmitteilung gesondert hingewiesen.
            </p>
          </Section>

          <Section title="§ 11 Kündigung">
            <p>
              Beide Parteien können die Nutzungsvereinbarung jederzeit ohne Angabe von Gründen kündigen.
              Der Nutzer kündigt durch Löschung seines Kontos oder schriftliche Mitteilung an {EMAIL}.
              Szene kann die Nutzungsvereinbarung mit einer Frist von 14 Tagen per E-Mail kündigen; das Recht
              zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
            </p>
          </Section>

          <Section title="§ 12 Anwendbares Recht und Gerichtsstand">
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).
            </p>
            <p>
              Sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
              Sondervermögen ist, ist ausschließlicher Gerichtsstand Mannheim.
            </p>
            <p>
              Die EU-Kommission stellt unter{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                className="text-purple-600 hover:underline">
                https://ec.europa.eu/consumers/odr
              </a>{" "}
              eine Plattform zur Online-Streitbeilegung (OS) bereit. Szene ist nicht verpflichtet und nicht
              bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>

          <Section title="§ 13 Salvatorische Klausel">
            <p>
              Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein oder werden, berührt
              dies die Wirksamkeit der übrigen Bestimmungen nicht. Anstelle der unwirksamen Bestimmung gilt die
              gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am
              nächsten kommt.
            </p>
          </Section>

          <div className="mt-10 pt-8 border-t border-gray-100 text-sm text-gray-400">
            <p>{COMPANY} · {ADDRESS}</p>
            <p className="mt-1">
              Kontakt: <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>
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
