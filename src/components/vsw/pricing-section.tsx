import Link from 'next/link';
import { Icon } from './icon';
import { APPEL } from './appel';

/* Niveaux d'accompagnement — aucun montant affiché (décision de Camille, 2026-10-17) :
   le prix de chaque forfait est établi par écrit après l'appel découverte. */
const PLANS = [
  {
    name: 'Essentiel',
    desc: 'Pour garder vos automatisations en santé.',
    items: [
      'Surveillance de vos automatisations',
      'Ajustements et correctifs mensuels',
      'Support courriel prioritaire',
      'Rapport mensuel simple',
    ],
    featured: false,
  },
  {
    name: 'Croissance',
    desc: "Pour faire progresser l'IA et Zoho chaque mois.",
    items: [
      'Tout le forfait Essentiel',
      'Nouvelles automatisations chaque mois',
      'Optimisation continue de Zoho',
      'Rencontre mensuelle de suivi',
    ],
    featured: true,
  },
  {
    name: 'Partenaire',
    desc: 'Votre département techno externalisé.',
    items: [
      'Tout le forfait Croissance',
      'Agent IA dédié à votre entreprise',
      'Formations trimestrielles (équipe & relève)',
      'Accompagnement stratégique',
    ],
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="forfaits" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Forfaits mensuels</div>
            <h2>Un accompagnement<br />clair et prévisible.</h2>
          </div>
          <p className="desc">
            Pour un accompagnement continu, trois niveaux — le bon dépend de votre
            situation, on le choisit ensemble.
          </p>
        </div>
        <div className="pricing-grid reveal">
          {PLANS.map((p) => (
            <div key={p.name} className={'pricing-card' + (p.featured ? ' featured' : '')}>
              {p.featured && <div className="pricing-badge">Populaire</div>}
              <h3>{p.name}</h3>
              <div className="pricing-price">
                <span className="amount">Sur mesure</span>
                <span className="period" style={{ display: 'block', marginTop: 4 }}>selon votre situation</span>
              </div>
              <p className="pricing-desc">{p.desc}</p>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>
                    <Icon name="check" size={14} /> {it}
                  </li>
                ))}
              </ul>
              <Link
                href={APPEL.href}
                className={'btn btn-lg ' + (p.featured ? 'btn-primary' : 'btn-ghost')}
                style={{ justifyContent: 'center' }}
              >
                {APPEL.libelle} <Icon name="arrow" size={14} />
              </Link>
            </div>
          ))}
        </div>
        <p className="pricing-note">
          Le prix de chaque forfait est établi après l&apos;appel découverte, avant tout
          engagement.
        </p>
      </div>
    </section>
  );
}
