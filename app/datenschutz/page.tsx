const DatenschutzPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Verantwortliche Stelle</h2>
        <p>
          [Name des Unternehmens/der Organisation]
          <br />
          [Adresse]
          <br />
          [E-Mail-Adresse]
          <br />
          [Telefonnummer]
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Datenerfassung</h2>
        <p>
          Wir erfassen und verarbeiten personenbezogene Daten nur, wenn Sie uns diese freiwillig mitteilen, z.B. im
          Rahmen einer Anfrage per E-Mail oder Kontaktformular.
        </p>
        <p>Zu den erfassten Daten können gehören:</p>
        <ul>
          <li>Name</li>
          <li>E-Mail-Adresse</li>
          <li>Telefonnummer</li>
          <li>Nachricht</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Google Analytics</h2>

        <p>
          We use Google Analytics to analyze website usage and improve our services. Google Analytics uses cookies to
          collect information about how visitors use our website.
        </p>

        <p>
          <b>Data collected includes:</b>
        </p>
        <ul>
          <li>Pages visited and time spent</li>
          <li>Geographic location (country/city level)</li>
          <li>Device and browser information</li>
          <li>Traffic sources and referrals</li>
        </ul>

        <p>
          <b>Your rights:</b>
        </p>
        <ul>
          <li>You can opt-out of Google Analytics tracking</li>
          <li>You can delete analytics cookies at any time</li>
          <li>Data is anonymized and aggregated</li>
        </ul>

        <p>
          <b>Google Analytics opt-out:</b> You can install the Google Analytics opt-out browser add-on or use our cookie
          settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Zweck der Datenverarbeitung</h2>
        <p>
          Wir verwenden Ihre Daten ausschließlich zur Bearbeitung Ihrer Anfrage und zur Verbesserung unseres Angebots.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Weitergabe von Daten</h2>
        <p>
          Wir geben Ihre Daten nicht an Dritte weiter, es sei denn, dies ist zur Erfüllung Ihrer Anfrage erforderlich
          oder wir sind gesetzlich dazu verpflichtet.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Widerspruch gegen
          die Verarbeitung Ihrer personenbezogenen Daten.
        </p>
        <p>Bitte kontaktieren Sie uns unter den oben genannten Kontaktdaten, um Ihre Rechte auszuüben.</p>
      </section>
    </div>
  )
}

export default DatenschutzPage
