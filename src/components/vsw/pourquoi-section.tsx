import Link from 'next/link';
import { Icon } from './icon';
import { ENGAGEMENTS } from './engagements-section';
import { ROWS } from './comparison-section';
import { APPEL } from './appel';

/*
 * « Pourquoi nous » (réorganisation du 2026-10-22, maquette 3 validée par Camille) : fusion de
 * « Pourquoi nous choisir », « La différence » et « Nos engagements ». Textes repris tels quels :
 * les 4 engagements (engagements-section.tsx), 5 des 7 lignes « ailleurs / avec nous »
 * (comparison-section.tsx), la carte d'appel. Les 5 bénéfices, qui répétaient l'avant/après, sont
 * retirés de l'accueil (benefits-section.tsx reste dans le dépôt).
 */
const LIGNES_GARDEES = ['Solutions génériques', 'Jargon technique', 'Projet livré, consultant parti', 'Coûts cachés', 'Vous dépendez du consultant'];
const LIGNES = ROWS.filter(([ailleurs]) => LIGNES_GARDEES.includes(ailleurs));

export function PourquoiSection() {
  return (
    <section id="pourquoi" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Pourquoi nous</div>
            <h2>Ce qu&apos;on vous promet,<br /><span className="pourquoi-accent">et qu&apos;on tient.</span></h2>
          </div>
          <p className="desc">
            Les logiciels existent déjà. Notre travail : choisir avec vous les bons, les installer,
            les relier et vous former.
          </p>
        </div>
        <div className="pourquoi-engagements reveal">
          {ENGAGEMENTS.map((e) => (
            <div className="pourquoi-carte" key={e.title}>
              <span className="pourquoi-icone" aria-hidden="true"><Icon name={e.icon} size={18} /></span>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
        <div className="pourquoi-duo reveal">
          <table className="pourquoi-tableau">
            <caption className="sr-only">Ce qui change avec Vie Solution Web</caption>
            <thead>
              <tr><th scope="col">Ailleurs</th><th scope="col">Avec nous</th></tr>
            </thead>
            <tbody>
              {LIGNES.map(([ailleurs, nous]) => (
                <tr key={ailleurs}>
                  <td><span className="sr-only">Ailleurs : </span>{ailleurs}</td>
                  <td><span className="pourquoi-coche" aria-hidden="true">✓</span>{nous}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pourquoi-appel section--nuit">
            <h3>Un appel de 30&nbsp;minutes</h3>
            <p>
              Gratuit, sans engagement. On regarde votre situation ensemble, puis vous recevez une
              proposition écrite.
            </p>
            <Link href={APPEL.href} className="btn btn-primary">
              {APPEL.libelle} <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
