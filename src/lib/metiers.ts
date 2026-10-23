// Métiers accompagnés et situations « C'est pour vous si… » : une seule source pour l'accueil
// (section réunie autour du métier, maquette validée par Camille le 2026-10-23), le menu « Métiers »,
// les pages /metiers et l'assistant du site. Données pures, testées par tests/metiers.test.mjs.
import type { IconName } from '@/components/vsw/icon';

/**
 * Situations à cocher : les 6 de « C'est pour vous si… » et celle du rapport mensuel, venue
 * d'« Avant / après » (fusion du 2026-10-23 : rien n'est perdu). L'ordre sert d'index à Metier.situations.
 */
export const SITUATIONS: { icone: IconName; avant: string; apres: string }[] = [
  {
    icone: 'send',
    avant: 'Vous faites vos factures le soir ou la fin de semaine.',
    apres: 'La facture part toute seule à la fin du travail. Vous la vérifiez d’un clic.',
  },
  {
    icone: 'mail',
    avant: 'Vous répondez aux mêmes questions par courriel, encore et encore.',
    apres: 'Un assistant IA prépare la réponse. Vous la relisez et l’envoyez.',
  },
  {
    icone: 'users',
    avant: 'Vos clients sont notés un peu partout : un cahier, un fichier Excel, votre téléphone.',
    apres: 'Tous vos clients au même endroit, dans un carnet de clients en ligne.',
  },
  {
    icone: 'clock',
    avant: 'Vous oubliez parfois de relancer une soumission ou un paiement.',
    apres: 'Un rappel vous avertit, ou un courriel de relance est préparé pour vous.',
  },
  {
    icone: 'layout',
    avant: 'Vous refaites le même rapport chaque mois.',
    apres: 'Vos chiffres se mettent à jour seuls, sur un seul écran.',
  },
  {
    icone: 'bolt',
    avant: "Vous entendez parler de l'IA, mais vous ne savez pas par où commencer.",
    apres: 'On choisit avec vous un premier usage simple, et on vous forme.',
  },
  {
    icone: 'grid',
    avant: 'Vous voulez un logiciel de gestion, mais vous avez peur d’un gros projet compliqué.',
    apres: 'On commence petit : un premier pas, à votre rythme.',
  },
];

/** Les 3 bénéfices d'« Avant / après », gardés sous la fiche du métier. */
export const BENEFICES: [string, string][] = [
  ['Moins de ressaisie', 'chaque information entre une seule fois'],
  ['Tout est suivi', 'rappels et relances préparés pour vous'],
  ['Clients mieux servis', 'des réponses plus rapides, par les mêmes personnes'],
];

/** Étiquettes d'IA ajoutées à « Ce qu'on installe » (demande de Camille du 2026-10-23). */
export const IA_RDV = { libelle: 'IA qui prend les rendez-vous (clavardage ou téléphone)', href: '/accueil-ia' } as const;
export const IA_TACHES = { libelle: 'Assistant IA pour les petites tâches du quotidien', href: '/ia' } as const;

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
  resume: string; // ligne courte du menu « Métiers » (maquette validée par Camille le 2026-10-23)
  situations: number[]; // index dans SITUATIONS : les 3 situations à cocher de ce métier
  rdvIa: boolean; // étiquette « IA qui prend les rendez-vous » (métiers à rendez-vous)
  services: string[]; // pages de service liées (href de SERVICES_NAV)
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
    resume: 'Suivis annuels et conformité, sans y passer vos soirées',
    situations: [2, 3, 5],
    rdvIa: true,
    services: ['/ia', '/accueil-ia', '/zoho'],
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
    resume: 'Des dossiers complets du premier coup',
    situations: [3, 1, 2],
    rdvIa: true,
    services: ['/ia', '/accueil-ia', '/zoho'],
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
    resume: 'Rappels et formulaires envoyés tout seuls',
    situations: [1, 3, 5],
    rdvIa: true,
    services: ['/accueil-ia', '/ia'],
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
    resume: 'Réservations et rappels sans quitter vos soins',
    situations: [1, 2, 0],
    rdvIa: true,
    services: ['/accueil-ia', '/ia'],
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
    resume: 'Les pièces justificatives arrivent au bon endroit',
    situations: [0, 4, 6],
    rdvIa: false,
    services: ['/ia', '/zoho', '/crm-sur-mesure'],
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
    resume: 'Soumissions plus rapides, relances qui ne se perdent plus',
    situations: [0, 3, 6],
    rdvIa: false,
    services: ['/ia', '/zoho'],
  },
  {
    slug: 'agent-immobilier',
    titre: 'Agent immobilier',
    gruge: "Les demandes d'information arrivent à toute heure, et le suivi de chaque acheteur ou vendeur repose sur votre mémoire.",
    ameliore: "Chaque demande reçoit une réponse rapide, et chaque acheteur ou vendeur est suivi jusqu'au bout.",
    temps: 'Pour les visites et les gens, pas pour la paperasse.',
    tags: ['Réponses aux demandes', 'Suivi des acheteurs et vendeurs', 'Dossier client unique'],
    icon: 'house-sign',
    resume: 'Une réponse rapide à chaque demande',
    situations: [1, 2, 3],
    rdvIa: true,
    services: ['/accueil-ia', '/ia', '/zoho'],
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
    resume: 'Réservations, commandes et courriels sous contrôle',
    situations: [1, 4, 5],
    rdvIa: true,
    services: ['/accueil-ia', '/ia', '/sites-web'],
  },
];

export const metierParSlug = (slug: string) => METIERS.find((m) => m.slug === slug) ?? null;
