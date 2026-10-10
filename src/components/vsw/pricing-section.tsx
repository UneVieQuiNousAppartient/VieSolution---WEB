import Link from 'next/link';
import { Icon } from './icon';

/* Forfaits mensuels — montants indicatifs [à confirmer] */
const PLANS = [
  {
    name: 'Essentiel',
    price: '495',
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
    price: '995',
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
    price: '1 995',
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
            Pour les projets ponctuels, utilisez le calculateur ci-dessus. Pour un
            accompagnement continu, choisissez un forfait — sans contrat de longue durée,
            ajustable chaque mois.
          </p>
        </div>
        <div className="pricing-grid reveal">
          {PLANS.map((p) => (
            <div key={p.name} className={'pricing-card' + (p.featured ? ' featured' : '')}>
              {p.featured && <div className="pricing-badge">Populaire</div>}
              <h3>{p.name}</h3>
              <div className="pricing-price">
                <span className="amount">{p.price} $</span>
                <span className="period">/ mois · CAD</span>
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
                href="/rdv"
                className={'btn btn-lg ' + (p.featured ? 'btn-primary' : 'btn-ghost')}
                style={{ justifyContent: 'center' }}
              >
                Commencer <Icon name="arrow" size={14} />
              </Link>
            </div>
          ))}
        </div>
        <p className="pricing-note">
          Montants indicatifs, taxes en sus. Le forfait exact est confirmé après
          l&apos;audit de vos processus.
        </p>
      </div>
    </section>
  );
}
