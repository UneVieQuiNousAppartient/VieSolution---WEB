'use client';

import { useState, useSyncExternalStore } from 'react';
import { Icon } from './icon';

/*
 * Panneau « Avant / après » : un seul cadre partagé en deux, chaque ligne « avant » face à sa
 * ligne « après » (même rangée de grille, donc même hauteur). Inspiré du bloc « Comparison 03 »
 * de Hirael (21st.dev, MIT) — structure reprise, styles portés sur les jetons de vsw.css.
 * Sur téléphone, une bascule Avant / Après remplace l'empilement ; sans JavaScript, les deux
 * colonnes restent empilées (la classe `is-switchable` n'est posée qu'au montage).
 */

const ROWS: [string, string][] = [
  [
    'Vous tapez chaque facture à la main.',
    'La facture part toute seule à la fin du travail. Vous la vérifiez d’un clic.',
  ],
  [
    'Vous cherchez le numéro d’un client dans trois endroits.',
    'Tous vos clients sont au même endroit, dans un carnet de clients en ligne (Zoho CRM).',
  ],
  [
    'Vous oubliez de relancer une soumission.',
    'Un rappel vous avertit, ou un courriel de relance est préparé pour vous.',
  ],
  [
    'Vous répondez dix fois à la même question.',
    'Un assistant IA prépare la réponse. Vous la relisez et l’envoyez.',
  ],
  [
    'Vous refaites le même rapport chaque mois.',
    'Vos chiffres se mettent à jour seuls, sur un seul écran.',
  ],
];

/* Bandeau de conclusion : des résultats qualitatifs, jamais un chiffre inventé. */
const OUTCOMES: [string, string][] = [
  ['Moins de ressaisie', 'chaque information entre une seule fois'],
  ['Rien d’oublié', 'rappels et relances préparés pour vous'],
  ['Clients mieux servis', 'des réponses plus rapides, par les mêmes personnes'],
];

type View = 'avant' | 'apres';
const subscribeNoop = () => () => {};

export function AvantApresSection() {
  const [view, setView] = useState<View>('apres');
  // La bascule n'existe qu'avec JavaScript : faux au rendu serveur, vrai une fois hydraté.
  // Sans lui, les deux colonnes restent empilées (voir vsw.css, « Sans bascule »).
  const switchable = useSyncExternalStore(subscribeNoop, () => true, () => false);

  return (
    <section id="avant-apres" className="section section--nuit">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'Avant / après'}</div>
            <h2>Ce qui change<br />dans votre semaine.</h2>
          </div>
          <p className="desc">
            Des exemples concrets de tâches qu&apos;on simplifie. Chaque situation est
            différente : on regarde la vôtre ensemble.
          </p>
        </div>

        {switchable && (
          <div className="compare-switch" role="group" aria-label="Afficher la colonne">
            <button
              type="button"
              className="compare-switch-btn"
              aria-pressed={view === 'avant'}
              onClick={() => setView('avant')}
            >
              Avant
            </button>
            <button
              type="button"
              className="compare-switch-btn"
              aria-pressed={view === 'apres'}
              onClick={() => setView('apres')}
            >
              Après
            </button>
          </div>
        )}

        <div
          className={`compare-panel reveal${switchable ? ' is-switchable' : ''}`}
          data-view={view}
          role="group"
          aria-label="Avant et après : la même semaine, deux façons de la vivre"
        >
          <div className="compare-panel-head compare-panel-avant">
            <span className="compare-panel-dot" aria-hidden="true">!</span>
            <h3>Avant</h3>
          </div>
          <div className="compare-panel-head compare-panel-apres">
            <span className="compare-panel-dot" aria-hidden="true">
              <Icon name="check" size={11} />
            </span>
            <h3>Après</h3>
          </div>
          {/* Cellules en enfants directs de la grille : la ligne « avant » et sa ligne « après »
              partagent la même rangée, donc la même hauteur. */}
          {ROWS.flatMap(([avant, apres]) => [
            <div className="compare-panel-cell compare-panel-avant" key={`a-${avant}`}>
              <span className="mark" aria-hidden="true">—</span>
              <span>{avant}</span>
            </div>,
            <div className="compare-panel-cell compare-panel-apres" key={`b-${apres}`}>
              <span className="mark" aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
              <span>{apres}</span>
            </div>,
          ])}
        </div>

        <div className="compare-outcomes reveal">
          <dl className="compare-outcomes-list">
            {OUTCOMES.map(([value, label]) => (
              <div className="compare-outcome" key={value}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
          <a href="#metiers" className="btn btn-ghost">
            Voir pour votre métier <Icon name="arrow" size={14} />
          </a>
        </div>
        <p className="compare-note reveal">
          Exemples illustratifs. Le temps gagné dépend de votre situation : on l&apos;estime
          avec vous lors de l&apos;appel découverte.
        </p>
      </div>
    </section>
  );
}
