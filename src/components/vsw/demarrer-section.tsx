import Link from 'next/link';
import { Icon } from './icon';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

type Variant = 'accueil' | 'ia' | 'zoho';

type Carte = {
  title: string;
  desc: string;
  items: string[];
  href?: string;
};

const CARTES: Record<Variant, Carte[]> = {
  accueil: [
    {
      title: phrase("Configuration IA de base"),
      desc: phrase("On installe un assistant IA (comme ChatGPT ou Claude) et on le règle pour votre entreprise : courriels, soumissions, textes."),
      items: [phrase("Installation et réglages avec vous"), phrase("Exemples adaptés à votre métier"), phrase("Bonnes pratiques et limites")],
      href: '/ia#demarrer',
    },
    {
      title: phrase("Mise en place d’un logiciel de gestion (Zoho ou CRM sur mesure)"),
      desc: phrase("On installe Zoho, ou on bâtit votre CRM sur mesure, pour vos clients et vos factures. Un seul endroit, au lieu de cinq."),
      items: [phrase("Carnet de clients (CRM)"), phrase("Facturation (Books)"), phrase("Transfert de vos données existantes")],
      href: '/zoho#demarrer',
    },
    {
      title: phrase("Formation courte"),
      desc: phrase("Une formation pratique, avec vos vrais dossiers, pour être à l’aise seul ensuite."),
      items: [phrase("En français, sans jargon"), phrase("Pour vous ou votre équipe")],
      href: '/ia#formation',
    },
  ],
  ia: [
    {
      title: phrase("Votre assistant IA, bien réglé"),
      desc: phrase("On choisit l’outil avec vous et on le configure pour votre façon de travailler."),
      items: [phrase("Choix de l’outil"), phrase("Réglages pour votre entreprise"), phrase("Premiers usages guidés")],
    },
    {
      title: phrase("Vos trois premières tâches simplifiées"),
      desc: phrase("On repère trois tâches qui reviennent souvent : courriels, soumissions, résumés. On les simplifie avec l’IA."),
      items: [phrase("Courriels types"), phrase("Soumissions plus rapides"), phrase("Résumés de documents")],
    },
    {
      title: phrase("Une formation pour être autonome"),
      desc: phrase("On vous apprend à vous en servir seul, sans dépendre de nous."),
      items: [phrase("Atelier pratique"), phrase("Aide-mémoire"), phrase("Suivi après la formation")],
    },
  ],
  zoho: [
    {
      title: phrase("Votre carnet de clients (Zoho CRM)"),
      desc: phrase("Tous vos clients, vos soumissions et vos suivis au même endroit."),
      items: [phrase("Configuration de base"), phrase("Import de votre liste de clients"), phrase("Rappels de suivi")],
    },
    {
      title: phrase("Votre facturation (Zoho Books)"),
      desc: phrase("Des factures propres, envoyées plus vite, et un œil clair sur qui vous doit quoi."),
      // « Taxes du Québec configurées » : à valider par Camille (PRD 4.4) — sinon retirer.
      items: [phrase("Modèles de factures à votre image"), phrase("Taxes du Québec configurées"), phrase("Rappels de paiement")],
    },
    {
      title: phrase("Une formation courte pour bien partir"),
      desc: phrase("On vous montre l’essentiel, avec vos vrais clients. Vous repartez à l’aise."),
      items: [phrase("Formation pratique"), phrase("Pour vous ou votre équipe"), phrase("Soutien après le démarrage")],
    },
  ],
};

export function DemarrerSection({ variant, lang = 'fr' }: { variant: Variant; lang?: Lang }) {
  const cartes = CARTES[variant];
  return (
    <section id="demarrer" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{t(lang, "Démarrer simplement")}</div>
              <h2>
                {t(lang, "Un premier pas suffit.")}<br />
                <span className="glow">{t(lang, "On commence petit.")}</span>
              </h2>
            </div>
            <p>
              {t(lang, "On avance une étape à la fois. On choisit avec vous une seule chose qui vous fera gagner du temps, on la met en place, et on vous montre comment l'utiliser. Le reste viendra quand vous serez prêt.")}
            </p>
          </div>

          <div className="ai-pillars">
            {cartes.map((c, i) => (
              <div className="ai-pillar" key={c.title}>
                <div className="ai-pillar-num">{String(i + 1).padStart(2, '0')} · {t(lang, "Premier pas")}</div>
                <h4>{t(lang, c.title)}</h4>
                <p>{t(lang, c.desc)}</p>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{t(lang, it)}</li>
                  ))}
                </ul>
                {c.href && (
                  <Link href={lienLangue(lang, c.href)} className="ai-pillar-link">
                    {t(lang, "En savoir plus")} <Icon name="arrow" size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              {t(lang, "Un premier pas,")} <em>{t(lang, "à votre rythme")}</em>{t(lang, ". Sur mesure — on en discute à l'appel découverte gratuit.")}
            </div>
            <Link href={lienLangue(lang, APPEL.href)} className="btn btn-primary btn-lg">
              {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
