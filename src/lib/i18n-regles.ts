// Anglais du site (étape 1, accord de Camille du 2026-10-24 : « par étapes », « comme KHI ») — règles
// pures, testées par tests/i18n.test.mjs. Même principe que KHI : la phrase française EST la clé ; la
// traduction anglaise est rangée dans src/i18n/en.po (lisible dans Poedit), compilée dans src/i18n/en.ts
// par scripts/i18n.mjs (sans dépendance). Sans import.

export type Lang = 'fr' | 'en';
export const LANGS: readonly Lang[] = ['fr', 'en'];

/** Pages publiées en anglais (étape 1). Les autres restent en français, même depuis l'anglais. */
export const PAGES_ANGLAISES: readonly string[] = ['/', '/ia', '/zoho', '/sites-web', '/devis', '/a-propos', '/contact', '/rdv'];

/** Marque une phrase française rangée dans une constante (relevée par scripts/i18n.mjs) ; t(lang, x) la traduit à l'affichage. */
export const phrase = (fr: string) => fr;

const remplacer = (texte: string, vars?: Record<string, string | number>) =>
  vars ? texte.replace(/\{(\w+)\}/g, (m, k: string) => (vars[k] !== undefined ? String(vars[k]) : m)) : texte;

/** Phrase dans la langue voulue ; sans traduction, la phrase française (jamais une clé ni un vide). */
export function traduire(dico: Record<string, string>, lang: Lang, fr: string, vars?: Record<string, string | number>) {
  const texte = lang === 'en' ? dico[fr] || fr : fr;
  return remplacer(texte, vars);
}

const separer = (href: string) => {
  const m = /^([^?#]*)(.*)$/.exec(href) as RegExpExecArray;
  return { chemin: m[1] || '/', reste: m[2] };
};
const normal = (chemin: string) => (chemin.length > 1 ? chemin.replace(/\/+$/, '') : chemin);

/** Lien interne dans la langue de la page : /en/… si la page existe en anglais, sinon l'adresse française. */
export function lienLangue(lang: Lang, href: string) {
  if (lang !== 'en' || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/en/') || href === '/en' || href.startsWith('/api/')) return href;
  const { chemin, reste } = separer(href);
  const c = normal(chemin);
  if (!PAGES_ANGLAISES.includes(c)) return href;
  return `${c === '/' ? '/en' : `/en${c}`}${reste}`;
}

/** Langue d'une adresse du site. */
export const langueDe = (chemin: string): Lang => (chemin === '/en' || chemin.startsWith('/en/') ? 'en' : 'fr');

/** Bouton FR | EN : la même page dans l'autre langue, ou l'accueil de l'autre langue si elle n'existe pas. */
export function cheminAutreLangue(chemin: string) {
  const { chemin: c0 } = separer(chemin);
  const c = normal(c0);
  if (langueDe(c) === 'en') {
    const fr = c === '/en' ? '/' : c.slice(3);
    return PAGES_ANGLAISES.includes(fr) ? fr : '/';
  }
  return PAGES_ANGLAISES.includes(c) ? (c === '/' ? '/en' : `/en${c}`) : '/en';
}

/** Adresses alternatives (hreflang) d'une page publiée dans les deux langues. */
export function alternates(cheminFr: string) {
  const c = normal(cheminFr);
  const en = c === '/' ? '/en' : `/en${c}`;
  return { languages: { 'fr-CA': c, 'en-CA': en, 'x-default': c } };
}
