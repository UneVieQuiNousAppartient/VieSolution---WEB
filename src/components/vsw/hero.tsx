import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { SitesBand } from './sites-band';
import { METIERS } from './metiers-section';

/* Tuiles d'outils qui flottent autour du titre (décoratives, inspiration Agnos). */
const TUILES: { icon: IconName; cls: string }[] = [
  { icon: 'calendar', cls: 't1' },
  { icon: 'mail', cls: 't2' },
  { icon: 'chat', cls: 't3' },
  { icon: 'bolt', cls: 't4' },
  { icon: 'globe', cls: 't5' },
  { icon: 'grid', cls: 't6' },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-arcs" aria-hidden="true"></div>
      <div className="hero-glow"></div>
      <div className="hero-tiles" aria-hidden="true">
        {TUILES.map((t) => (
          <span key={t.cls} className={`hero-tile ${t.cls}`}>
            <Icon name={t.icon} size={22} />
          </span>
        ))}
      </div>
      <div className="container hero-inner">
        <div className="eyebrow">Pour les professionnels, les travailleurs autonomes et les PME du Québec</div>
        <h1>
          Une vie qui<br />
          nous <span className="highlight">appartient.</span>
        </h1>
        <p className="lede">
          Mieux servir vos clients et retrouver du temps pour votre vrai métier. IA, Zoho, sites
          web, CRM sur mesure : on choisit les bons outils, on les installe et on vous forme.
          Pas besoin d&apos;être techno.
        </p>
        <div className="hero-ctas">
          <Link href="/rdv" className="btn btn-primary btn-lg">
            Prendre un RDV <Icon name="arrow" size={14} />
          </Link>
          <Link href="#demarrer" className="btn btn-dark btn-lg">
            Par où commencer ?
          </Link>
          <span className="hero-note">appel gratuit de 30&nbsp;min ↗</span>
        </div>
        {/* Sélecteur « Je suis… » (PRD-JE-SUIS.md). Ancres natives <a> et non <Link> : Link passe par
            history.pushState, qui ne met pas à jour :target (mise en évidence de la carte ciblée). */}
        <div className="hero-metiers" role="group" aria-labelledby="hero-metiers-label">
          <p className="hero-divider" id="hero-metiers-label"><span>Je suis…</span></p>
          <div className="hero-metiers-list">
            {METIERS.map((m) => (
              <a key={m.slug} href={`#metier-${m.slug}`} className="btn btn-ghost hero-metier">
                <Icon name={m.icon} size={14} aria-hidden="true" /> {m.titre}
              </a>
            ))}
            <a href="#metiers" className="btn btn-ghost hero-metier">
              Autre métier
            </a>
          </div>
        </div>
      </div>
      <SitesBand />
    </section>
  );
}
