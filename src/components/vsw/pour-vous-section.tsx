'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon, type IconName } from './icon';
import { APPEL } from './appel';

/*
 * « C'est pour vous si… » — mélange des options A et B validé par Camille (2026-10-22) :
 * chaque carte dit ce qui gruge, puis ce qui change (textes repris de « Avant / après » et de
 * « Démarrer simplement » : rien de nouveau n'est promis), et se coche. La bande sombre compte les
 * cartes cochées et mène à l'appel. Rien n'est envoyé ni enregistré : seulement à l'écran.
 * Sans JavaScript, les cartes restent lisibles ; seule la case ne se coche pas.
 */
const SITUATIONS: { icone: IconName; avant: string; apres: string }[] = [
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

const phrase = (n: number, total: number) => {
  if (n === 0) return 'Une seule de ces phrases vous ressemble ? Un appel de 30 minutes suffit pour voir par où commencer.';
  if (n === 1) return 'Une seule ? On commence par celle-là. Un appel de 30 minutes suffit pour voir comment.';
  if (n === total) return 'Toutes ? On commence par la plus pressante, une étape à la fois.';
  return 'vous ressemblent. Bonne nouvelle : on peut commencer par une seule.';
};

export function PourVousSection() {
  const [coches, setCoches] = useState<boolean[]>(() => SITUATIONS.map(() => false));
  const n = coches.filter(Boolean).length;
  const basculer = (i: number) => setCoches((c) => c.map((v, j) => (j === i ? !v : v)));

  return (
    <section id="pour-vous" className="section">
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
            Vous êtes bon dans votre métier, mais l&apos;administration vous gruge. Cochez ce qui
            vous ressemble : on commence là.
          </p>
        </div>
        <ul className="pv-grille reveal">
          {SITUATIONS.map((s, i) => (
            <li key={s.avant}>
              <button
                type="button"
                className="pv-carte"
                aria-pressed={coches[i]}
                onClick={() => basculer(i)}
              >
                <span className="pv-haut">
                  <span className="pv-icone" aria-hidden="true">
                    <Icon name={s.icone} size={20} />
                  </span>
                  <span className="pv-case" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                </span>
                <span className="pv-avant">{s.avant}</span>
                <span className="pv-apres">
                  <span aria-hidden="true">→</span> {s.apres}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="pv-bilan section--nuit reveal">
          <div>
            <p className="pv-bilan-phrase" aria-live="polite" aria-atomic="true">
              {n > 0 && <strong>{n} sur {SITUATIONS.length}</strong>}
              {n > 0 ? (n > 1 && n < SITUATIONS.length ? ' ' : ' · ') : ''}
              {phrase(n, SITUATIONS.length)}
            </p>
            <span className="pv-jauge" aria-hidden="true">
              {SITUATIONS.map((s, i) => (
                <i key={s.avant} data-on={i < n || undefined} />
              ))}
            </span>
          </div>
          <Link href={APPEL.href} className="btn btn-primary btn-lg">
            {APPEL.libelle} <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
