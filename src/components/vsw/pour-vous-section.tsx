'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from './icon';
import { APPEL } from './appel';
import { BENEFICES, IA_RDV, IA_TACHES, METIERS, SITUATIONS, metierParSlug } from '@/lib/metiers';

/*
 * « C'est pour vous si… » réunie avec « Avant / après » et « Pour votre métier » (maquette validée
 * par Camille le 2026-10-23) : le visiteur choisit son métier, une seule fiche montre ce qui le gruge,
 * ce qu'on améliore, le temps retrouvé, ce qu'on installe et 3 situations à cocher choisies pour lui.
 * « Autre métier ou PME » montre les 7 situations. Rien n'est perdu : textes dans src/lib/metiers.ts.
 *
 * Le « Je suis… » du hero pointe vers #metier-<slug> : la fiche s'ouvre sur ce métier. Sans
 * JavaScript, chaque métier est un lien vers sa page (/metiers/<slug>). Rien n'est envoyé ni
 * enregistré : les cases ne servent qu'à l'écran.
 */
const AUTRE = 'autre';

const phrase = (n: number, total: number) => {
  if (n === 0) return 'Une seule de ces phrases vous ressemble ? Un appel de 30 minutes suffit pour voir par où commencer.';
  if (n === 1) return 'Une seule ? On commence par celle-là. Un appel de 30 minutes suffit pour voir comment.';
  if (n === total) return 'Toutes ? On commence par la plus pressante, une étape à la fois.';
  return 'vous ressemblent. Bonne nouvelle : on peut commencer par une seule.';
};

/** « #metier-clinique-dentaire » → « clinique-dentaire », si ce métier existe. */
const slugDuLien = (hash: string) => {
  const s = decodeURIComponent(hash.replace(/^#/, ''));
  return s.startsWith('metier-') && metierParSlug(s.slice(7)) ? s.slice(7) : null;
};

export function PourVousSection() {
  const [choix, setChoix] = useState<string>(AUTRE);
  const [coches, setCoches] = useState<boolean[]>(() => SITUATIONS.map(() => false));

  useEffect(() => {
    const lire = () => {
      const slug = slugDuLien(window.location.hash);
      if (!slug) return;
      setChoix(slug);
      // Le lien du « Je suis… » amène au bouton du métier ; on montre plutôt le haut de la section.
      requestAnimationFrame(() => document.getElementById('metiers')?.scrollIntoView({ block: 'start' }));
    };
    lire();
    window.addEventListener('hashchange', lire);
    return () => window.removeEventListener('hashchange', lire);
  }, []);

  const metier = choix === AUTRE ? null : metierParSlug(choix);
  const visibles = metier ? metier.situations : SITUATIONS.map((_, i) => i);
  const n = visibles.filter((i) => coches[i]).length;
  const basculer = (i: number) => setCoches((c) => c.map((v, j) => (j === i ? !v : v)));
  const choisir = (e: React.MouseEvent, valeur: string) => {
    // Ctrl/Cmd/Maj + clic ou clic du milieu : on laisse le lien ouvrir la page du métier.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setChoix(valeur);
  };

  return (
    <section id="metiers" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'C’est pour vous si…'}</div>
            <h2>
              Vous vous reconnaissez ?<br />
              <span className="pourquoi-accent">Voici ce qui change.</span>
            </h2>
          </div>
          <p className="desc">
            Vous êtes bon dans votre métier, mais l&apos;administration vous gruge. Choisissez votre
            métier, cochez ce qui vous ressemble : on commence là.
          </p>
        </div>

        <div className="pm-layout reveal">
          <nav className="pm-choix" aria-label="Votre métier">
            <p className="pm-choix-titre">Votre métier</p>
            <ul>
              {METIERS.map((m) => (
                <li key={m.slug}>
                  <Link
                    id={`metier-${m.slug}`}
                    href={`/metiers/${m.slug}`}
                    className="pm-metier"
                    aria-current={choix === m.slug ? 'true' : undefined}
                    onClick={(e) => choisir(e, m.slug)}
                  >
                    <Icon name={m.icon} size={18} aria-hidden="true" />
                    <span>{m.titre}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/metiers"
                  className="pm-metier pm-metier--autre"
                  aria-current={choix === AUTRE ? 'true' : undefined}
                  onClick={(e) => choisir(e, AUTRE)}
                >
                  <span>Autre métier ou PME</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="pm-fiche">
            {metier ? (
              <>
                <div className="pm-fiche-tete">
                  <div>
                    <h3>{metier.titre}</h3>
                    {metier.precision && <p className="metier-precision">{metier.precision}</p>}
                  </div>
                  <Link href={`/metiers/${metier.slug}`} className="pm-lien">
                    Voir comment on aide : {metier.titre} <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="pm-trio">
                  <div className="pm-bloc">
                    <div className="metier-label">Ce qui vous gruge</div>
                    <p>{metier.gruge}</p>
                  </div>
                  <div className="pm-bloc metier-ameliore">
                    <div className="metier-label">Ce qu&apos;on améliore</div>
                    <p><span aria-hidden="true">→ </span>{metier.ameliore}</p>
                  </div>
                  <div className="pm-bloc">
                    <div className="metier-label">Le temps retrouvé</div>
                    <p>{metier.temps}</p>
                  </div>
                </div>
                <div>
                  <div className="metier-label">Ce qu&apos;on installe</div>
                  <div className="service-tags pm-tags">
                    {metier.tags.map((t) => <span className="service-tag" key={t}>{t}</span>)}
                    {metier.rdvIa && <Link href={IA_RDV.href} className="service-tag pm-tag-ia">{IA_RDV.libelle}</Link>}
                    <Link href={IA_TACHES.href} className="service-tag pm-tag-ia">{IA_TACHES.libelle}</Link>
                  </div>
                  {metier.note && <p className="metier-note">{metier.note}</p>}
                </div>
                <p className="pm-sous-titre">Vous vous reconnaissez aussi ? Cochez</p>
              </>
            ) : (
              <div className="pm-fiche-tete">
                <div>
                  <h3>Autre métier ou PME</h3>
                  <p className="metier-precision">
                    Si vous servez des clients, on regarde ensemble ce qui vous gruge et ce qu&apos;on peut
                    améliorer. Cochez ce qui vous ressemble.
                  </p>
                </div>
                <Link href="/metiers" className="pm-lien">
                  Tous les métiers <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}

            <ul className="pv-grille pm-situations">
              {visibles.map((i) => {
                const s = SITUATIONS[i];
                return (
                  <li key={s.avant}>
                    <button type="button" className="pv-carte" aria-pressed={coches[i]} onClick={() => basculer(i)}>
                      <span className="pv-haut">
                        <span className="pv-icone" aria-hidden="true"><Icon name={s.icone} size={20} /></span>
                        <span className="pv-case" aria-hidden="true"><Icon name="check" size={14} /></span>
                      </span>
                      <span className="pv-avant">{s.avant}</span>
                      <span className="pv-apres"><span aria-hidden="true">→</span> {s.apres}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="pv-bilan section--nuit">
              <div>
                <p className="pv-bilan-phrase" aria-live="polite" aria-atomic="true">
                  {n > 0 && <strong>{n} sur {visibles.length}</strong>}
                  {n > 0 ? (n > 1 && n < visibles.length ? ' ' : ' · ') : ''}
                  {phrase(n, visibles.length)}
                </p>
                <span className="pv-jauge" aria-hidden="true">
                  {visibles.map((i, k) => <i key={i} data-on={k < n || undefined} />)}
                </span>
              </div>
              <Link href={APPEL.href} className="btn btn-primary btn-lg">
                {APPEL.libelle} <Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>
        </div>

        <ul className="pm-benefices reveal">
          {BENEFICES.map(([titre, detail]) => (
            <li key={titre}>
              <strong>{titre}</strong>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
