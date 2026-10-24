import Link from 'next/link';
import { Icon } from './icon';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

/* Niveaux d'accompagnement — aucun montant affiché (décision de Camille, 2026-10-17) :
   le prix de chaque forfait est établi par écrit après l'appel découverte. */
const PLANS = [
  {
    name: phrase("Essentiel"),
    desc: phrase("Pour garder vos automatisations en santé."),
    items: [
      phrase("Surveillance de vos automatisations"),
      phrase("Ajustements et correctifs mensuels"),
      phrase("Support courriel prioritaire"),
      phrase("Rapport mensuel simple"),
    ],
    featured: false,
  },
  {
    name: phrase("Croissance"),
    desc: phrase("Pour faire progresser l'IA et Zoho chaque mois."),
    items: [
      phrase("Tout le forfait Essentiel"),
      phrase("Nouvelles automatisations chaque mois"),
      phrase("Optimisation continue de Zoho"),
      phrase("Rencontre mensuelle de suivi"),
    ],
    featured: true,
  },
  {
    name: phrase("Partenaire"),
    desc: phrase("Votre département techno externalisé."),
    items: [
      phrase("Tout le forfait Croissance"),
      phrase("Agent IA dédié à votre entreprise"),
      phrase("Formations trimestrielles de votre équipe"),
      phrase("Accompagnement stratégique"),
    ],
    featured: false,
  },
];

export function PricingSection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="forfaits" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "Forfaits mensuels")}</div>
            <h2>{t(lang, "Un accompagnement")}<br />{t(lang, "clair et prévisible.")}</h2>
          </div>
          <p className="desc">
            {t(lang, "Pour un accompagnement continu, trois niveaux — le bon dépend de votre situation, on le choisit ensemble.")}
          </p>
        </div>
        <div className="pricing-grid reveal">
          {PLANS.map((p) => (
            <div key={p.name} className={'pricing-card' + (p.featured ? ' featured' : '')}>
              {p.featured && <div className="pricing-badge">{t(lang, "Populaire")}</div>}
              <h3>{t(lang, p.name)}</h3>
              <div className="pricing-price">
                <span className="amount">{t(lang, "Sur mesure")}</span>
                <span className="period" style={{ display: 'block', marginTop: 4 }}>{t(lang, "selon votre situation")}</span>
              </div>
              <p className="pricing-desc">{t(lang, p.desc)}</p>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>
                    <Icon name="check" size={14} /> {t(lang, it)}
                  </li>
                ))}
              </ul>
              <Link
                href={lienLangue(lang, APPEL.href)}
                className={'btn btn-lg ' + (p.featured ? 'btn-primary' : 'btn-ghost')}
                style={{ justifyContent: 'center' }}
              >
                {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
              </Link>
            </div>
          ))}
        </div>
        <p className="pricing-note">
          {t(lang, "Le prix de chaque forfait est établi après l'appel découverte, avant tout engagement.")}
        </p>
      </div>
    </section>
  );
}
