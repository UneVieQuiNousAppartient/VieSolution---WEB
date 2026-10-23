// Lecture des articles du Blog (src/content/blog/*.md) — fonctions pures, testées par
// tests/blog.test.mjs. Sous-ensemble de Markdown seulement (celui des articles approuvés par
// Camille le 2026-10-23) : titres « ## », paragraphes, listes « - » et « 1. », **gras**, [liens](…).
// Rien n'est transformé en HTML brut : la page rend ces blocs en éléments React (aucune injection).

export type Morceau = { t: 'texte'; v: string } | { t: 'gras'; v: string } | { t: 'lien'; v: string; href: string };
export type Bloc =
  | { type: 'h2'; id: string; morceaux: Morceau[] }
  | { type: 'p'; morceaux: Morceau[] }
  | { type: 'ul' | 'ol'; elements: Morceau[][] };

export type EnTete = {
  titre: string;
  pilier: string;
  resume: string;
  description: string;
  liens: string[];
  sources: string[];
  date: string;
  auteur: string;
  ordre: number;
};

/** Sépare l'en-tête « --- … --- » du texte ; listes au format [a, b]. */
export function lireEnTete(source: string): { enTete: EnTete; corps: string } {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(source);
  if (!m) throw new Error('article sans en-tête');
  const champs: Record<string, string> = {};
  for (const ligne of m[1].split('\n')) {
    const i = ligne.indexOf(':');
    if (i > 0) champs[ligne.slice(0, i).trim()] = ligne.slice(i + 1).trim();
  }
  const liste = (v = '') =>
    v.replace(/^\[|\]$/g, '').split(',').map((x) => x.trim()).filter(Boolean);
  for (const cle of ['titre', 'pilier', 'resume', 'description', 'date', 'auteur'] as const) {
    if (!champs[cle]) throw new Error(`champ manquant : ${cle}`);
  }
  return {
    enTete: {
      titre: champs.titre,
      pilier: champs.pilier,
      resume: champs.resume,
      description: champs.description,
      liens: liste(champs.liens),
      sources: liste(champs.sources),
      date: champs.date,
      auteur: champs.auteur,
      ordre: Number(champs.ordre) || 99,
    },
    corps: source.slice(m[0].length),
  };
}

/** Lien permis : adresse interne (« /… », sans « // ») ou https. Le reste reste du texte. */
export const lienPermis = (href: string) => /^\/(?![/\\])/.test(href) || /^https:\/\/[^\s]+$/.test(href);

/** « Texte **gras** et [lien](/ia) » → morceaux. */
export function lireLigne(texte: string): Morceau[] {
  const morceaux: Morceau[] = [];
  const motif = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let fin = 0;
  for (let m = motif.exec(texte); m; m = motif.exec(texte)) {
    if (m.index > fin) morceaux.push({ t: 'texte', v: texte.slice(fin, m.index) });
    if (m[1] !== undefined) morceaux.push({ t: 'gras', v: m[1] });
    else if (lienPermis(m[3])) morceaux.push({ t: 'lien', v: m[2], href: m[3] });
    else morceaux.push({ t: 'texte', v: m[2] });
    fin = m.index + m[0].length;
  }
  if (fin < texte.length) morceaux.push({ t: 'texte', v: texte.slice(fin) });
  return morceaux;
}

export const texteDe = (morceaux: Morceau[]) => morceaux.map((x) => x.v).join('');

/** « 1. Partir d'une tâche » → « partir-d-une-tache » (ancre du plan de l'article). */
export function ancre(texte: string) {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function lireCorps(corps: string): Bloc[] {
  const blocs: Bloc[] = [];
  let para: string[] = [];
  let liste: { type: 'ul' | 'ol'; elements: Morceau[][] } | null = null;
  const vider = () => {
    if (para.length) blocs.push({ type: 'p', morceaux: lireLigne(para.join(' ')) });
    para = [];
    if (liste) blocs.push(liste);
    liste = null;
  };
  for (const brute of corps.split('\n')) {
    const ligne = brute.trim();
    if (!ligne) { vider(); continue; }
    const titre = /^##\s+(.+)$/.exec(ligne);
    const puce = /^-\s+(.+)$/.exec(ligne);
    const numero = /^\d+\.\s+(.+)$/.exec(ligne);
    if (titre) {
      vider();
      const morceaux = lireLigne(titre[1]);
      blocs.push({ type: 'h2', id: ancre(texteDe(morceaux)), morceaux });
    } else if (puce || numero) {
      const type = puce ? 'ul' : 'ol';
      if (para.length) { blocs.push({ type: 'p', morceaux: lireLigne(para.join(' ')) }); para = []; }
      if (!liste || liste.type !== type) { if (liste) blocs.push(liste); liste = { type, elements: [] }; }
      liste.elements.push(lireLigne((puce || numero)![1]));
    } else {
      if (liste) { blocs.push(liste); liste = null; }
      para.push(ligne);
    }
  }
  vider();
  return blocs;
}

/** Minutes de lecture (≈ 200 mots par minute), au moins 1. */
export function minutesDeLecture(corps: string) {
  return Math.max(1, Math.round(corps.split(/\s+/).filter(Boolean).length / 200));
}

/** Plan de l'article : les titres, sans « À retenir » ni « Sources ». */
export function planDe(blocs: Bloc[]) {
  return blocs
    .filter((b): b is Extract<Bloc, { type: 'h2' }> => b.type === 'h2')
    .filter((b) => !['a-retenir', 'sources'].includes(b.id))
    .map((b) => ({ id: b.id, texte: texteDe(b.morceaux) }));
}
