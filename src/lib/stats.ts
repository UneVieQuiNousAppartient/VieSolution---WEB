// Statistiques (étape D, accord de Camille du 2026-10-23) — règles pures, testées par tests/stats.test.mjs.
// Visites : enregistrées par /api/visite (table vsw_page_views), sans cookie, sans IP, sans navigateur
// complet : la page, le domaine d'où vient le visiteur, le type d'appareil. Lues par l'onglet
// « Statistiques » de l'admin (/api/admin/stats), avec les avis et les courriels.

export type Appareil = 'mobile' | 'tablette' | 'ordinateur';
export type Visite = { chemin: string; source: string | null; appareil: string; created_at: string };
export type Courriel = { direction: string; received_at: string };

const ZONE = 'America/Toronto';
const JOUR_MS = 86_400_000;

/** Page vue envoyée par le navigateur : chemin simple du site, sans paramètres ; '' si à ignorer. */
export function cheminVisite(v: unknown) {
  if (typeof v !== 'string') return '';
  const chemin = v.split(/[?#]/)[0].trim();
  if (!/^\/(?![/\\])[A-Za-z0-9/_.%-]*$/.test(chemin) || chemin.length > 200) return '';
  if (/^\/(admin|api)(\/|$)/.test(chemin)) return '';
  return chemin.length > 1 ? chemin.replace(/\/+$/, '') : chemin;
}

/** D'où vient le visiteur : le domaine seulement (« google.com »), null s'il vient du site lui-même ou de nulle part. */
export function sourceVisite(referent: unknown, hoteSite: string) {
  if (typeof referent !== 'string' || !referent) return null;
  let hote: string;
  try {
    const u = new URL(referent);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    hote = u.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
  const site = hoteSite.toLowerCase().replace(/^www\./, '');
  if (!hote || hote === site || hote.endsWith('.vercel.app') || hote === 'localhost') return null;
  return hote.slice(0, 100);
}

/** Type d'appareil, à partir du navigateur (qui n'est pas gardé). */
export function appareilDe(ua: string): Appareil {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return 'tablette';
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return 'mobile';
  return 'ordinateur';
}

/** Robots et aperçus de liens : pas comptés comme des visites. */
export const estRobot = (ua: string) => !ua || /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|node-fetch/i.test(ua);

/** Jour local (heure de Montréal), « 2026-10-23 ». */
export const jourLocal = (d: Date | string) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date(d));

const top = (compte: Map<string, number>, n: number) =>
  [...compte.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([cle, total]) => ({ cle, total }));

const compter = (valeurs: string[]) => {
  const m = new Map<string, number>();
  for (const v of valeurs) m.set(v, (m.get(v) || 0) + 1);
  return m;
};

/** Les 30 derniers jours locaux, du plus ancien à aujourd'hui. */
export function derniersJours(maintenant: Date, n = 30) {
  // Calendrier pur (pas de pas de 24 h) : les changements d'heure ne font ni sauter ni doubler un jour.
  const [a, m, j] = jourLocal(maintenant).split('-').map(Number);
  return Array.from({ length: n }, (_, i) => new Date(Date.UTC(a, m - 1, j - (n - 1 - i))).toISOString().slice(0, 10));
}

/** Résumé des visites des 30 derniers jours : par jour, pages, articles du Blog, sources, appareils. */
export function resumeVisites(visites: Visite[], maintenant: Date) {
  const jours = derniersJours(maintenant, 30);
  const fenetre = new Set(jours);
  const semaine = new Set(jours.slice(-7));
  const dansFenetre = visites.filter((v) => fenetre.has(jourLocal(v.created_at)));
  const parJour = compter(dansFenetre.map((v) => jourLocal(v.created_at)));
  const articles = dansFenetre.map((v) => /^\/blog\/([a-z0-9-]+)$/.exec(v.chemin)?.[1]).filter((s): s is string => !!s);
  const appareils = compter(dansFenetre.map((v) => v.appareil));
  return {
    total30: dansFenetre.length,
    total7: dansFenetre.filter((v) => semaine.has(jourLocal(v.created_at))).length,
    parJour: jours.map((jour) => ({ jour, total: parJour.get(jour) || 0 })),
    pages: top(compter(dansFenetre.map((v) => v.chemin)), 8),
    articles: top(compter(articles), 6),
    sources: top(compter(dansFenetre.map((v) => v.source || 'Accès direct ou inconnu')), 5),
    appareils: { mobile: appareils.get('mobile') || 0, tablette: appareils.get('tablette') || 0, ordinateur: appareils.get('ordinateur') || 0 },
  };
}

/** Courriels envoyés (aux prospects) et reçus, sur 7 et 30 jours. */
export function chiffresCourriels(courriels: Courriel[], maintenant: Date) {
  const depuis = (jours: number) => maintenant.getTime() - jours * JOUR_MS;
  const n = (direction: string, jours: number) => courriels.filter((c) => c.direction === direction && new Date(c.received_at).getTime() >= depuis(jours)).length;
  return { envoyes7: n('out', 7), envoyes30: n('out', 30), recus7: n('in', 7), recus30: n('in', 30) };
}

/** Libellé d'une page pour l'admin : « / » → « Accueil ». */
export const libellePage = (chemin: string) => (chemin === '/' ? 'Accueil' : chemin);
