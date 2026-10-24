import type { Metadata } from 'next';
import Link from 'next/link';

/* Page « Sécurité et Loi 25 » (accord de Camille du 2026-10-24). Uniquement ce qui est réellement en
   place, vérifié dans le code et l'évaluation docs/loi25/EFVP-fournisseurs.md. Aucune promesse nouvelle :
   les délais et avis cités sont ceux de la loi. À relire par Camille. */
export const metadata: Metadata = {
  title: 'Sécurité et Loi 25',
  description: 'Comment Vie Solution Web protège vos renseignements personnels : où ils sont gardés, qui y a accès, et comment exercer vos droits (Loi 25).',
  alternates: { canonical: '/securite' },
};

export default function SecuritePage() {
  return (
    <section className="section avis-page" style={{ borderTop: 'none', paddingTop: 72 }}>
      <div className="container legal-colonne">
        <div className="eyebrow">Sécurité et Loi 25</div>
        <h1 className="avis-titre">Vos renseignements, protégés et à vous.</h1>
        <p className="avis-intro">
          Vous nous confiez votre nom, votre courriel, parfois votre téléphone et quelques mots sur votre entreprise.
          Voici, en mots simples, ce que nous en faisons et comment nous les protégeons.
        </p>

        <h2>Qui est responsable</h2>
        <p>
          Camille Yvan, fondateur de Vie Solution Web, est responsable de la protection des renseignements personnels.
          Pour toute question ou demande : <a href="mailto:info@viesolutionweb.ca">info@viesolutionweb.ca</a> ou le (438) 506-5243.
        </p>

        <h2>Ce que nous recueillons, et pourquoi</h2>
        <ul>
          <li>Ce que vous écrivez dans nos formulaires (demande, rendez-vous, avis, inscription à un atelier) : pour vous répondre et assurer le suivi.</li>
          <li>Votre accord, avec sa date et son texte, quand nous vous le demandons (avis publié, inscription, « prochains ateliers »).</li>
          <li>Des statistiques de visite sans cookie : la page vue, le site d&apos;où vous arrivez et le type d&apos;appareil. Ni votre adresse IP, ni votre nom.</li>
        </ul>
        <p>Nous ne demandons aucun renseignement sensible (santé, finances, numéro d&apos;identité). Merci de ne pas en écrire dans les formulaires ou la bulle de clavardage.</p>

        <h2>Où vos renseignements sont gardés</h2>
        <p>
          Notre base de données est hébergée <strong>au Canada, à Montréal</strong>. Certains services que nous utilisons sont
          situés hors du Québec, surtout aux États-Unis : l&apos;hébergement du site, l&apos;envoi de nos courriels, Google Agenda et
          Google Meet pour les rendez-vous réservés en ligne, et l&apos;assistant de la bulle de clavardage. Ces communications font
          l&apos;objet d&apos;une évaluation en cours, comme la Loi 25 le demande, et chacun de ces services ne reçoit que ce qu&apos;il faut pour
          rendre le service. Voir aussi notre <Link href="/politique-confidentialite">politique de confidentialité</Link>.
        </p>

        <h2>Comment nous les protégeons</h2>
        <ul>
          <li>Connexion chiffrée (HTTPS) sur tout le site.</li>
          <li>Vos demandes ne sont jamais lisibles par le public : elles ne s&apos;ouvrent qu&apos;avec une clé secrète, côté serveur.</li>
          <li>Notre espace d&apos;administration est protégé par un code et une double vérification (application d&apos;authentification).</li>
          <li>Les clés d&apos;accès les plus sensibles sont chiffrées dans notre base.</li>
          <li>Nos formulaires sont protégés contre les robots et les envois en masse.</li>
          <li>Chaque courriel de suivi contient un lien pour ne plus en recevoir.</li>
        </ul>

        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander à voir les renseignements que nous avons sur vous, à les faire corriger, ou à les faire supprimer,
          et retirer votre accord en tout temps. Écrivez-nous à <a href="mailto:info@viesolutionweb.ca">info@viesolutionweb.ca</a> :
          nous vous répondons dans les 30 jours, comme la loi le prévoit.
        </p>

        <h2>En cas d&apos;incident</h2>
        <p>
          Si un incident touchait vos renseignements et risquait de vous causer un préjudice sérieux, nous vous en aviserions,
          ainsi que la Commission d&apos;accès à l&apos;information du Québec, comme la loi l&apos;exige.
        </p>
      </div>
    </section>
  );
}
