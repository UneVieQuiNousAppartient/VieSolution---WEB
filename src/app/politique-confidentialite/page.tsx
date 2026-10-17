import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité de VieSolution Web. Découvrez comment nous protégeons vos données personnelles.',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto px-4 prose prose-invert">
        <h1>Politique de confidentialité</h1>
        <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>

        <h2>1. Collecte des informations</h2>
        <p>
          Nous collectons les informations que vous nous fournissez directement via nos formulaires
          de contact, notre chatbot, notre formulaire « Décrivez-nous votre situation » et nos demandes d&apos;audit. Ces informations
          peuvent inclure votre nom, adresse e-mail, numéro de téléphone, nom d&apos;entreprise et description de votre projet.
        </p>

        <h2>2. Utilisation des informations</h2>
        <p>Les informations collectées sont utilisées pour :</p>
        <ul>
          <li>Répondre à vos demandes de contact</li>
          <li>Vous proposer un premier pas et un prix sur mesure</li>
          <li>Réaliser des audits et diagnostics gratuits</li>
          <li>Vous contacter au sujet de nos services</li>
          <li>Améliorer nos services</li>
        </ul>

        <h2>3. Protection des données</h2>
        <p>
          Nous prenons la protection de vos données au sérieux. Vos informations sont stockées de manière
          sécurisée et ne sont accessibles qu&apos;aux membres autorisés de notre équipe.
        </p>

        <h2>4. Partage des informations</h2>
        <p>
          Nous ne vendons, n&apos;échangeons ni ne transférons vos informations personnelles à des tiers
          sans votre consentement, sauf si la loi l&apos;exige.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Notre site peut utiliser des cookies pour améliorer votre expérience de navigation.
          Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
        </p>

        <h2>6. Vos droits</h2>
        <p>
          Vous avez le droit de demander l&apos;accès, la correction ou la suppression de vos données
          personnelles. Pour exercer ces droits, contactez-nous à contact@viesolution.com.
        </p>

        <h2>7. Contact</h2>
        <p>
          Pour toute question concernant cette politique, veuillez nous contacter à contact@viesolution.com.
        </p>
      </div>
    </section>
  );
}
