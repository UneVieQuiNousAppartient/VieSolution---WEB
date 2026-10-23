'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PILIERS } from './services';

/* Cartes des articles du Blog, filtrées par pilier (maquette validée par Camille le 2026-10-23).
   Sans JavaScript, toutes les cartes s'affichent ; les filtres ne servent qu'à l'écran. */
export type CarteArticle = { slug: string; titre: string; pilier: string; resume: string; minutes: number };

export function BlogListe({ articles }: { articles: CarteArticle[] }) {
  const [filtre, setFiltre] = useState<string>('Tous');
  const piliers = PILIERS.filter((p) => articles.some((a) => a.pilier === p));
  const visibles = articles.filter((a) => filtre === 'Tous' || a.pilier === filtre);
  return (
    <>
      <div className="blog-filtres" role="group" aria-label="Filtrer les articles par pilier">
        {['Tous', ...piliers].map((p) => (
          <button key={p} type="button" className="blog-filtre" aria-pressed={filtre === p} onClick={() => setFiltre(p)}>
            {p}
          </button>
        ))}
      </div>
      <ul className="blog-cartes">
        {visibles.map((a) => (
          <li key={a.slug}>
            <Link href={`/blog/${a.slug}`} className="blog-carte">
              <span className="blog-carte-meta">{a.pilier} · {a.minutes} min</span>
              <strong>{a.titre}</strong>
              <span className="blog-carte-resume">{a.resume}</span>
              <span className="pm-lien">Lire l&apos;article <span aria-hidden="true">→</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
