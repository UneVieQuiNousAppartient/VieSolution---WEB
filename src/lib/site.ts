/**
 * Adresse publique du site — confirmée par Camille le 2026-10-21 (« viesolutionweb.ca »).
 * Seul endroit où le domaine est écrit : plan du site, robots.txt, métadonnées, données structurées.
 */
export const SITE_URL = 'https://viesolutionweb.ca';
export const SITE_NAME = 'Vie Solution Web';

/** Pages publiques indexables (les anciennes URL redirigées dans next.config.ts et /admin en sont exclues). */
export const PUBLIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/ia', priority: 0.9 },
  { path: '/zoho', priority: 0.9 },
  { path: '/sites-web', priority: 0.8 },
  { path: '/crm-sur-mesure', priority: 0.8 },
  { path: '/referencement', priority: 0.8 },
  { path: '/devis', priority: 0.8 },
  { path: '/realisations', priority: 0.7 },
  { path: '/a-propos', priority: 0.7 },
  { path: '/rdv', priority: 0.8 },
  { path: '/contact', priority: 0.8 },
  { path: '/postuler-stagiaire', priority: 0.4 },
  { path: '/politique-confidentialite', priority: 0.2 },
  { path: '/conditions-utilisation', priority: 0.2 },
];
