import Link from 'next/link';
import { Icon, type IconName } from './icon';

export type Metier = {
  slug: string; // ancre de la carte : id="metier-<slug>" (sélecteur « Je suis… » du hero)
  titre: string; // nom court du métier (h4 de la carte)
  precision?: string; // sous-titre facultatif (cartes 1, 4, 5, 6, 8)
  gruge: string; // « Ce qui vous gruge »
  ameliore: string; // « Pour vos clients »
  temps: string; // « Le temps retrouvé »
  tags: string[]; // 2 ou 3 étiquettes
  note?: string; // mention conformité (cartes 1 à 4)
  icon: IconName; // icône propre au métier (icon.tsx)
};

const NOTE_FINANCE =
  'Vos notes et vos suivis restent organisés dans le respect de vos obligations de conformité (AMF) et de la Loi 25. Vous validez tout.';

export const METIERS: Metier[] = [
  {
    slug: 'conseiller-financier',
    titre: 'Conseiller financier',
    precision: 'Conseiller en sécurité financière',
    gruge: 'Les suivis annuels, les notes de rencontre et les documents de conformité vous prennent des soirées entières.',
    ameliore: 'Chaque client reçoit son suivi au bon moment, et retrouve un conseiller qui se souvient de sa situation.',
    temps: 'Pour conseiller vos clients, au lieu de remplir des formulaires.',
    tags: ['Rappels de suivi', 'Notes de rencontre préparées', 'Dossier client unique'],
    note: NOTE_FINANCE,
    icon: 'briefcase-chart',
  },
  {
    slug: 'courtier-hypothecaire',
    titre: 'Courtier hypothécaire',
    gruge: 'Courir après les documents manquants et relancer les dossiers en attente vous occupe plus que le conseil lui-même.',
    ameliore: 'Vos clients savent exactement quoi fournir, et leur dossier est complet du premier coup.',
    temps: 'Pour accompagner vos clients, pas pour courir après les papiers.',
    tags: ['Liste de documents à fournir', 'Relances automatiques', 'Suivi des dossiers'],
    note: NOTE_FINANCE,
    icon: 'house-key',
  },
  {
    slug: 'clinique-dentaire',
    titre: 'Clinique dentaire',
    gruge: 'Les rappels de rendez-vous, les confirmations et les formulaires de nouveaux patients occupent votre réception toute la journée.',
    ameliore: "Vos patients reçoivent leur rappel à temps et remplissent leur formulaire avant d'arriver.",
    temps: "Pour une équipe à la réception qui a enfin le temps d'accueillir.",
    tags: ['Rappels de rendez-vous', 'Formulaires en ligne', 'Réponses aux questions courantes'],
    note: "Les dossiers de vos patients sont des renseignements sensibles, traités selon la Loi 25. Les outils s'occupent de l'administration, jamais des soins.",
    icon: 'tooth',
  },
  {
    slug: 'clinique-de-soins',
    titre: 'Clinique de soins',
    precision: 'Physio, chiro, esthétique, massothérapie',
    gruge: 'Entre deux traitements, vous rappelez des clients, confirmez des plages libres et répondez aux mêmes questions.',
    ameliore: 'Vos clients réservent facilement, reçoivent leur rappel et savent comment se préparer à leur rendez-vous.',
    temps: 'Pour vous consacrer à vos soins, pas à votre agenda.',
    tags: ['Prise de rendez-vous en ligne', 'Rappels automatiques', 'Suivi après la visite'],
    note: "Les dossiers de vos clients sont des renseignements sensibles, traités selon la Loi 25. Les outils s'occupent de l'administration, jamais des soins.",
    icon: 'heart-pulse',
  },
  {
    slug: 'cabinet-comptable',
    titre: 'Cabinet comptable',
    precision: 'Comptabilité et tenue de livres',
    gruge: 'En période de pointe, vous passez vos journées à réclamer des pièces justificatives à vos clients.',
    ameliore: "Vos clients savent ce qu'il manque, l'envoient au bon endroit et ont des nouvelles de leur dossier.",
    temps: 'Pour analyser et conseiller, plutôt que trier des reçus.',
    tags: ['Collecte de documents', 'Relances des pièces manquantes', 'Facturation simplifiée'],
    icon: 'calculator',
  },
  {
    slug: 'construction',
    titre: 'Entrepreneur en construction',
    precision: 'Construction et rénovation',
    gruge: 'Les soumissions se tapent le soir, et les relances de clients ou de paiements passent entre les mailles.',
    ameliore: 'Vos clients reçoivent leur soumission plus vite et savent où en est leur chantier.',
    temps: 'Pour être sur le chantier le jour, et à la maison le soir.',
    tags: ['Soumissions plus rapides', 'Suivi des chantiers', 'Relances de paiement'],
    icon: 'hammer',
  },
  {
    slug: 'agent-immobilier',
    titre: 'Agent immobilier',
    gruge: "Les demandes d'information arrivent à toute heure, et le suivi de chaque acheteur ou vendeur repose sur votre mémoire.",
    ameliore: "Chaque demande reçoit une réponse rapide, et personne n'est oublié en cours de route.",
    temps: 'Pour les visites et les gens, pas pour la paperasse.',
    tags: ['Réponses aux demandes', 'Suivi des acheteurs et vendeurs', 'Dossier client unique'],
    icon: 'house-sign',
  },
  {
    slug: 'commerce-restaurant',
    titre: 'Commerce ou restaurant',
    precision: 'Commerce de détail ou restauration',
    gruge: "Entre le comptoir et les fournisseurs, les courriels, les réservations et les avis en ligne s'accumulent.",
    ameliore: 'Vos clients ont une réponse rapide, une réservation confirmée et une bonne raison de revenir.',
    temps: 'Pour être avec vos clients et votre équipe, plutôt que derrière un écran.',
    tags: ['Réservations et commandes', 'Réponses aux courriels', 'Infolettre simple'],
    icon: 'storefront',
  },
];

export function MetiersSection() {
  return (
    <section id="metiers" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'Pour votre métier'}</div>
            <h2>Un meilleur service pour vos clients.<br />Plus de temps pour vous.</h2>
          </div>
          <p className="desc">
            On ne vous vend pas de l&apos;IA. On regarde ce qui vous gruge dans votre métier, on
            améliore le service que vous offrez à vos clients, et vous retrouvez du temps.
            L&apos;IA, Zoho et l&apos;automatisation ne sont que les moyens.
          </p>
        </div>
        <div className="benefits-grid metiers-grid reveal">
          {METIERS.map((m) => (
            <div className="benefit metier-card" id={`metier-${m.slug}`} key={m.slug}>
              <div className="benefit-icon">
                <Icon name={m.icon} size={20} />
              </div>
              <div className="metier-titres">
                <h4>{m.titre}</h4>
                {m.precision && <p className="metier-precision">{m.precision}</p>}
              </div>
              <div className="metier-gruge">
                <div className="metier-label">Ce qui vous gruge</div>
                <p>{m.gruge}</p>
              </div>
              <details className="metier-plus">
                <summary>Voir ce qu&apos;on améliore pour vous</summary>
                <div className="metier-plus-body">
                  <div>
                    <div className="metier-label">Pour vos clients</div>
                    <p>{m.ameliore}</p>
                  </div>
                  <div>
                    <div className="metier-label">Le temps retrouvé</div>
                    <p>{m.temps}</p>
                  </div>
                  <div className="service-tags">
                    {m.tags.map((t) => (
                      <span className="service-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  {m.note && <p className="metier-note">{m.note}</p>}
                </div>
              </details>
            </div>
          ))}
        </div>
        <div className="pv-outro reveal">
          <p>
            Votre métier n&apos;est pas dans la liste ? Si vous servez des clients, on regarde
            ensemble ce qui vous gruge et ce qu&apos;on peut améliorer.
          </p>
          <Link href="/rdv" className="btn btn-ghost">
            Parler de mon métier <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
