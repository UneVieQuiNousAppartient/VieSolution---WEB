import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { NavMenu } from './nav-menu';
import { NavDeroulant } from './nav-deroulant';
import { LogoMark } from './logo-mark';
import { APPEL } from './appel';
import { METIERS } from '@/lib/metiers';
import type { Pilier } from './services';
import { NavLangue } from './nav-langue';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

export type NavLinkItem = { href: string; label: string };
export type ServiceNavItem = NavLinkItem & { desc: string; icon: IconName };
export type PilierNav = { pilier: Pilier; services: readonly ServiceNavItem[] };

/**
 * Services rangés en 3 piliers (menu « Services », menu mobile, pied de page) — refonte du
 * 2026-10-23, maquette validée par Camille : la formation est séparée en IA et en Zoho.
 */
export const PILIERS_NAV: readonly PilierNav[] = [
  {
    pilier: 'IA et automatisation',
    services: [
      { href: '/ia', label: phrase("Automatisation et IA"), desc: phrase("Claude ou ChatGPT installés, tâches qui roulent seules"), icon: 'bolt' },
      { href: '/accueil-ia', label: phrase("Accueil IA : clavardage, rendez-vous, voix"), desc: phrase("Une réponse tout de suite à vos clients"), icon: 'phone' },
      { href: '/ia#formation', label: phrase("Formation IA"), desc: phrase("Votre équipe à l’aise avec l’IA, en français"), icon: 'users' },
    ],
  },
  {
    pilier: 'Zoho',
    services: [
      { href: '/zoho', label: phrase("Implantation Zoho"), desc: phrase("CRM, Books, Desk, Campaigns : clients, factures et suivi au même endroit"), icon: 'grid' },
      { href: '/zoho#formation', label: phrase("Formation Zoho"), desc: phrase("Votre équipe autonome dans Zoho, en français"), icon: 'users' },
    ],
  },
  {
    pilier: 'Web et visibilité',
    services: [
      { href: '/sites-web', label: phrase("Sites et applications web"), desc: phrase("Un site qui travaille pour votre entreprise"), icon: 'globe' },
      { href: '/crm-sur-mesure', label: phrase("CRM et outils sur mesure"), desc: phrase("Un outil fait pour votre façon de travailler"), icon: 'layout' },
      { href: '/referencement', label: phrase("Être trouvé sur Google et par les IA"), desc: phrase("Référencement SEO et AEO"), icon: 'arrow' },
    ],
  },
];
export const SERVICES_NAV: readonly ServiceNavItem[] = PILIERS_NAV.flatMap((p) => p.services);

/** Métiers (menu « Métiers ») : chacun mène à sa page /metiers/<slug>. */
export const METIERS_NAV: readonly ServiceNavItem[] = METIERS.map((m) => ({
  href: `/metiers/${m.slug}`,
  label: m.titre,
  desc: m.resume,
  icon: m.icon,
}));

/**
 * Liens simples après les deux menus ; « Contact » est dans le pied de page. Les libellés sont en
 * français (phrase(…)) et traduits à l'affichage par t(lang, …) ; le bouton FR | EN est NavLangue.
 */
export const NAV_LINKS: readonly NavLinkItem[] = [
  { href: '/devis', label: phrase("Prix") },
  { href: '/blog', label: phrase("Blog") },
  { href: '/a-propos', label: phrase("À propos") },
];

/** Menu dans la langue de la page : libellés traduits, liens vers /en/… quand la page existe en anglais. */
export const piliersNav = (lang: Lang): PilierNav[] =>
  PILIERS_NAV.map((p) => ({
    pilier: p.pilier,
    services: p.services.map((s) => ({ ...s, href: lienLangue(lang, s.href), label: t(lang, s.label), desc: t(lang, s.desc) })),
  }));
export const metiersNav = (lang: Lang): ServiceNavItem[] => METIERS_NAV.map((m) => ({ ...m, label: t(lang, m.label), desc: t(lang, m.desc) }));
export const liensNav = (lang: Lang): NavLinkItem[] => NAV_LINKS.map((l) => ({ href: lienLangue(lang, l.href), label: t(lang, l.label) }));

function Element({ s }: { s: ServiceNavItem }) {
  return (
    <Link href={s.href} className="nav-element">
      <span className="nav-element-icone"><Icon name={s.icon} size={18} aria-hidden="true" /></span>
      <span>
        <strong>{s.label}</strong>
        <small>{s.desc}</small>
      </span>
    </Link>
  );
}

export function VswNav({ lang = 'fr' }: { lang?: Lang }) {
  const piliers = piliersNav(lang);
  const liens = liensNav(lang);
  const L = (href: string) => lienLangue(lang, href);
  return (
    <nav className="nav" aria-label={t(lang, "Navigation principale")}>
      <div className="container nav-inner">
        <Link href={L('/')} className="logo" style={{ textDecoration: 'none' }}>
          <LogoMark />
          <div>Vie Solution Web</div>
        </Link>
        <div className="nav-links">
          <NavDeroulant id="services" libelle={t(lang, "Services")}>
            <div className="nav-panneau nav-panneau--services">
              {piliers.map((p) => (
                <div className="nav-colonne" key={p.pilier}>
                  <p className="nav-colonne-titre">{t(lang, p.pilier)}</p>
                  <ul>
                    {p.services.map((s) => <li key={s.href}><Element s={s} /></li>)}
                  </ul>
                </div>
              ))}
              <Link href="/realisations" className="nav-vedette">
                <span className="nav-colonne-titre">{t(lang, "En vedette")}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- miniature de 260 px, déjà en webp */}
                <img src="/realisations/outils/khi-accueil.webp" alt="" width={260} height={163} loading="lazy" />
                <strong>Khí Succès Académique</strong>
                <small>{t(lang, "Un site et une administration sur mesure : demandes, séances et statistiques au même endroit.")}</small>
                <span className="nav-vedette-lien">{t(lang, "Voir nos réalisations")} <span aria-hidden="true">→</span></span>
              </Link>
            </div>
            <div className="nav-panneau-pied">
              <Link href={`${L('/')}#demarrer`}>{t(lang, "Un premier pas, à votre rythme")} · <strong>{t(lang, "Voir par où commencer →")}</strong></Link>
              <Link href="/services"><strong>{t(lang, "Tous les services →")}</strong></Link>
            </div>
          </NavDeroulant>
          <NavDeroulant id="metiers" libelle={t(lang, "Métiers")}>
            <ul className="nav-panneau nav-panneau--metiers">
              {metiersNav(lang).map((m) => <li key={m.href}><Element s={m} /></li>)}
            </ul>
            <div className="nav-panneau-pied">
              <span>{t(lang, "Une PME ou un travailleur autonome ? Si vous servez des clients, on regarde ensemble ce qui vous gruge.")}</span>
              <Link href="/metiers"><strong>{t(lang, "Tous les métiers →")}</strong></Link>
            </div>
          </NavDeroulant>
          {liens.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <NavLangue lang={lang} />
        <Link href={L(APPEL.href)} className="btn btn-primary nav-cta">
          {t(lang, APPEL.court)} <Icon name="arrow" size={14} />
        </Link>
        <NavMenu lang={lang} links={liens} piliers={piliers} metiers={metiersNav(lang)} />
      </div>
    </nav>
  );
}
