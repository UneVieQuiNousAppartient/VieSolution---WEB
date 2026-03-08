import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation',
  description: 'Conditions d\'utilisation du site VieSolution Web.',
};

export default function ConditionsUtilisationPage() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 prose prose-gray">
        <h1>Conditions d&apos;utilisation</h1>
        <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>

        <h2>1. Acceptation des conditions</h2>
        <p>
          En accédant et en utilisant le site web de VieSolution Web, vous acceptez d&apos;être lié
          par les présentes conditions d&apos;utilisation.
        </p>

        <h2>2. Services</h2>
        <p>
          VieSolution Web offre des services de développement web, d&apos;automatisation des processus,
          d&apos;intégration API et de création d&apos;outils internes. Les détails spécifiques de chaque
          projet sont définis dans des ententes séparées entre VieSolution Web et le client.
        </p>

        <h2>3. Propriété intellectuelle</h2>
        <p>
          Le contenu de ce site web, incluant les textes, images, logos et code source, est la propriété
          de VieSolution Web et est protégé par les lois sur la propriété intellectuelle.
        </p>

        <h2>4. Limitation de responsabilité</h2>
        <p>
          VieSolution Web s&apos;efforce de fournir des informations exactes sur son site web.
          Cependant, nous ne garantissons pas l&apos;exactitude, l&apos;exhaustivité ou la pertinence
          des informations présentées.
        </p>

        <h2>5. Estimations</h2>
        <p>
          Les estimations fournies via notre outil d&apos;estimation en ligne sont indicatives et
          ne constituent pas un engagement contractuel. Le prix final sera déterminé après une
          analyse détaillée de vos besoins.
        </p>

        <h2>6. Confidentialité</h2>
        <p>
          L&apos;utilisation de vos données personnelles est régie par notre politique de confidentialité.
        </p>

        <h2>7. Modifications</h2>
        <p>
          Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
          prendront effet dès leur publication sur le site.
        </p>

        <h2>8. Contact</h2>
        <p>
          Pour toute question concernant ces conditions, veuillez nous contacter à contact@viesolution.com.
        </p>
      </div>
    </section>
  );
}
