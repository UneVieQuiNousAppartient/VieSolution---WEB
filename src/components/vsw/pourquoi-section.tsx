import Link from 'next/link';
import { Icon } from './icon';
import { ENGAGEMENTS } from './engagements-section';
import { ROWS } from './comparison-section';
import { APPEL } from './appel';
import { lienLangue, t, type Lang } from '@/lib/i18n';

/*
 * « Pourquoi nous » (réorganisation du 2026-10-22, maquette 3 validée par Camille) : fusion de
 * « Pourquoi nous choisir », « La différence » et « Nos engagements ». Textes repris tels quels :
 * les 4 engagements (engagements-section.tsx), la colonne « avec nous » de 5 des 7 lignes
 * (comparison-section.tsx ; colonne « ailleurs » barrée retirée le 2026-10-22, ton positif demandé
 * par Camille), la carte d'appel. Les 5 bénéfices, qui répétaient l'avant/après, sont
 * retirés de l'accueil (benefits-section.tsx reste dans le dépôt).
 */
const LIGNES_GARDEES = ['Solutions génériques', 'Jargon technique', 'Projet livré, consultant parti', 'Coûts cachés', 'Vous dépendez du consultant'];
const LIGNES = ROWS.filter(([ailleurs]) => LIGNES_GARDEES.includes(ailleurs));

export function PourquoiSection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="pourquoi" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "Pourquoi nous")}</div>
            <h2>{t(lang, "Ce qu'on vous promet,")}<br /><span className="pourquoi-accent">{t(lang, "et qu'on tient.")}</span></h2>
          </div>
          <p className="desc">
            {t(lang, "Les logiciels existent déjà. Notre travail : choisir avec vous les bons, les installer, les relier et vous former.")}
          </p>
        </div>
        <div className="pourquoi-engagements reveal">
          {ENGAGEMENTS.map((e) => (
            <div className="pourquoi-carte" key={e.title}>
              <span className="pourquoi-icone" aria-hidden="true"><Icon name={e.icon} size={18} /></span>
              <h3>{t(lang, e.title)}</h3>
              <p>{t(lang, e.desc)}</p>
            </div>
          ))}
        </div>
        <div className="pourquoi-duo reveal">
          <div className="pourquoi-liste">
            <h3>{t(lang, "Avec nous")}</h3>
            <ul>
              {LIGNES.map(([ailleurs, nous]) => (
                <li key={ailleurs}>
                  <span className="pourquoi-coche" aria-hidden="true"><Icon name="check" size={14} /></span>
                  {t(lang, nous)}
                </li>
              ))}
            </ul>
          </div>
          <div className="pourquoi-appel section--nuit">
            <h3>{t(lang, "Un appel de 30 minutes")}</h3>
            <p>
              {t(lang, "Gratuit, sans engagement. On regarde votre situation ensemble, puis vous recevez une proposition écrite.")}
            </p>
            <Link href={lienLangue(lang, APPEL.href)} className="btn btn-primary">
              {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
