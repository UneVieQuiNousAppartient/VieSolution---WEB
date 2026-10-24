import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { SitesBand } from './sites-band';
import { METIERS } from '@/lib/metiers';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

/*
 * Mini tableau de bord qui flotte autour du titre (lot « relief », choix de Camille le 2026-10-22) :
 * quatre cartes d'interface qui montrent ce que les outils font, sans chiffre ni nom inventé, sans
 * logo de marque. Décoratif (aria-hidden), masqué sous 1200 px.
 */
type Carte = { cls: string; icon: IconName; titre: string; detail: string; pastille: string; ton: 'accent' | 'ok' | 'warn' | 'violet' };
const CARTES: Carte[] = [
  { cls: 'c1', icon: 'mail', titre: phrase("Nouvelle demande"), detail: phrase("Clinique dentaire · site web"), pastille: phrase("Nouveau"), ton: 'accent' },
  { cls: 'c2', icon: 'clock', titre: phrase("Rappeler demain"), detail: phrase("Tâche créée pour 9 h"), pastille: phrase("Aujourd’hui"), ton: 'warn' },
  { cls: 'c3', icon: 'calendar', titre: phrase("RDV confirmé"), detail: phrase("Appel découverte · 30 min"), pastille: phrase("Confirmé"), ton: 'ok' },
  { cls: 'c4', icon: 'send', titre: phrase("Relance envoyée"), detail: phrase("Suivi automatique"), pastille: phrase("Fait"), ton: 'violet' },
];

export function Hero({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section className="hero">
      <div className="hero-arcs" aria-hidden="true"></div>
      <div className="hero-glow"></div>
      <div className="hero-cartes" aria-hidden="true">
        {CARTES.map((c) => (
          <div key={c.cls} className={`hero-carte ${c.cls} ton-${c.ton}`}>
            <span className="hero-carte-icone"><Icon name={c.icon} size={18} /></span>
            <span className="hero-carte-texte">
              <strong>{t(lang, c.titre)}</strong>
              <small>{t(lang, c.detail)}</small>
            </span>
            <span className="hero-carte-pastille">{t(lang, c.pastille)}</span>
          </div>
        ))}
      </div>
      <div className="container hero-inner">
        <div className="eyebrow">{t(lang, "Pour les professionnels, les travailleurs autonomes et les PME du Québec")}</div>
        <h1>
          {t(lang, "Une vie qui")} <span className="highlight">{t(lang, "vous appartient,")}</span>{' '}
          <span className="hero-h1-suite">{t(lang, "des clients mieux servis, plus vite.")}</span>
        </h1>
        <p className="lede">
          {t(lang, "Concentrez-vous sur votre vrai métier. IA, Zoho, sites web et CRM sur mesure : on choisit les bons outils, on les installe et on vous forme. On s'occupe de la technique.")}
        </p>
        <div className="hero-ctas">
          <Link href={lienLangue(lang, APPEL.href)} className="btn btn-primary btn-lg">
            {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
          </Link>
          <Link href="#demarrer" className="btn btn-dark btn-lg">
            {t(lang, "Par où commencer ?")}
          </Link>
          <span className="hero-note">
            {t(lang, "30 min, sans engagement")}
            {/* Flèche tracée à la main, qui remonte vers le bouton d'appel */}
            <svg className="hero-note-fleche" width="46" height="38" viewBox="0 0 46 38" fill="none" aria-hidden="true">
              <path d="M3 33c9 1 21-3 28-12 3-4 5-9 6-14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M30 9l7-4 2 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {/* Sélecteur « Je suis… » (PRD-JE-SUIS.md). Ancres natives <a> et non <Link> : Link passe par
            history.pushState, qui ne met pas à jour :target (mise en évidence de la carte ciblée). */}
        <div className="hero-metiers" role="group" aria-labelledby="hero-metiers-label">
          <p className="hero-divider" id="hero-metiers-label"><span>{t(lang, "Je suis…")}</span></p>
          <div className="hero-metiers-list">
            {METIERS.map((m) => (
              <a key={m.slug} href={`#metier-${m.slug}`} className="hero-metier-carte">
                <span className="hero-metier-icone"><Icon name={m.icon} size={18} aria-hidden="true" /></span>
                <span>{t(lang, m.titre)}</span>
              </a>
            ))}
          </div>
          <p className="hero-metier-autre">
            <a href="#metiers">{t(lang, "Autre métier ? Voir comment on aide chacun")} <span aria-hidden="true">→</span></a>
          </p>
        </div>
      </div>
      <SitesBand lang={lang} />
    </section>
  );
}
