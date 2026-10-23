// Articles du Blog (maquette validée par Camille le 2026-10-23) : un fichier Markdown par article dans
// src/content/blog/, relu et approuvé par Camille avant d'y entrer. Lu au moment du build (pages
// statiques). Règles de lecture pures et testées : src/lib/blog-markdown.ts.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { lireCorps, lireEnTete, minutesDeLecture, planDe, slugValide, type Bloc, type EnTete } from './blog-markdown';

export type Article = EnTete & { slug: string; blocs: Bloc[]; minutes: number; plan: { id: string; texte: string }[] };

const DOSSIER = join(process.cwd(), 'src', 'content', 'blog');

let cache: Article[] | null = null;

export function articles(): Article[] {
  if (cache) return cache;
  cache = readdirSync(DOSSIER)
    .filter((f) => f.endsWith('.md') && slugValide(f.slice(0, -3)))
    .map((f) => {
      const { enTete, corps } = lireEnTete(readFileSync(join(DOSSIER, f), 'utf8'));
      const blocs = lireCorps(corps);
      return { ...enTete, slug: f.slice(0, -3), blocs, minutes: minutesDeLecture(corps), plan: planDe(blocs) };
    })
    .sort((a, b) => a.ordre - b.ordre);
  return cache;
}

export const articleParSlug = (slug: string) => articles().find((a) => a.slug === slug);

/** « 2026-10-23 » → « 23 octobre 2026 ». */
export function dateLisible(iso: string) {
  const [a, m, j] = iso.split('-').map(Number);
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${j === 1 ? '1er' : j} ${mois[m - 1]} ${a}`;
}
