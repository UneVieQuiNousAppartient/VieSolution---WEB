import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { NavMenu } from './nav-menu';
import { NavDeroulant } from './nav-deroulant';
import { LogoMark } from './logo-mark';
import { APPEL } from './appel';
import { METIERS } from '@/lib/metiers';
import type { Pilier } from './services';

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
      { href: '/ia', label: 'Automatisation et IA', desc: 'Claude ou ChatGPT installés, tâches qui roulent seules', icon: 'bolt' },
      { href: '/accueil-ia', label: 'Accueil IA : clavardage, rendez-vous, voix', desc: 'Une réponse tout de suite à vos clients', icon: 'phone' },
      { href: '/ia#formation', label: 'Formation IA', desc: 'Votre équipe à l’aise avec l’IA, en français', icon: 'users' },
    ],
  },
  {
    pilier: 'Zoho',
    services: [
      { href: '/zoho', label: 'Implantation Zoho', desc: 'CRM, Books, Desk, Campaigns : clients, factures et suivi au même endroit', icon: 'grid' },
      { href: '/zoho#formation', label: 'Formation Zoho', desc: 'Votre équipe autonome dans Zoho, en français', icon: 'users' },
    ],
  },
  {
    pilier: 'Web et visibilité',
    services: [
      { href: '/sites-web', label: 'Sites et applications web', desc: 'Un site qui travaille pour votre entreprise', icon: 'globe' },
      { href: '/crm-sur-mesure', label: 'CRM et outils sur mesure', desc: 'Un outil fait pour votre façon de travailler', icon: 'layout' },
      { href: '/referencement', label: 'Être trouvé sur Google et par les IA', desc: 'Référencement SEO et AEO', icon: 'arrow' },
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
 * Liens simples après les deux menus. « Blog » et le sélecteur FR / EN s'ajouteront quand les
 * 3 premiers articles et la version anglaise seront prêts (décision de Camille, 2026-10-23) ;
 * « Contact » est dans le pied de page.
 */
export const NAV_LINKS: readonly NavLinkItem[] = [
  { href: '/devis', label: 'Prix' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
];

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

export function VswNav() {
  return (
    <nav className="nav" aria-label="Navigation principale">
      <div className="container nav-inner">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <LogoMark />
          <div>Vie Solution Web</div>
        </Link>
        <div className="nav-links">
          <NavDeroulant id="services" libelle="Services">
            <div className="nav-panneau nav-panneau--services">
              {PILIERS_NAV.map((p) => (
                <div className="nav-colonne" key={p.pilier}>
                  <p className="nav-colonne-titre">{p.pilier}</p>
                  <ul>
                    {p.services.map((s) => <li key={s.href}><Element s={s} /></li>)}
                  </ul>
                </div>
              ))}
              <Link href="/realisations" className="nav-vedette">
                <span className="nav-colonne-titre">En vedette</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- miniature de 260 px, déjà en webp */}
                <img src="/realisations/outils/khi-accueil.webp" alt="" width={260} height={163} loading="lazy" />
                <strong>Khí Succès Académique</strong>
                <small>Un site et une administration sur mesure : demandes, séances et statistiques au même endroit.</small>
                <span className="nav-vedette-lien">Voir nos réalisations <span aria-hidden="true">→</span></span>
              </Link>
            </div>
            <div className="nav-panneau-pied">
              <Link href="/#demarrer">Un premier pas, à votre rythme · <strong>Voir par où commencer →</strong></Link>
              <Link href="/services"><strong>Tous les services →</strong></Link>
            </div>
          </NavDeroulant>
          <NavDeroulant id="metiers" libelle="Métiers">
            <ul className="nav-panneau nav-panneau--metiers">
              {METIERS_NAV.map((m) => <li key={m.href}><Element s={m} /></li>)}
            </ul>
            <div className="nav-panneau-pied">
              <span>Une PME ou un travailleur autonome ? Si vous servez des clients, on regarde ensemble ce qui vous gruge.</span>
              <Link href="/metiers"><strong>Tous les métiers →</strong></Link>
            </div>
          </NavDeroulant>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href={APPEL.href} className="btn btn-primary nav-cta">
          {APPEL.court} <Icon name="arrow" size={14} />
        </Link>
        <NavMenu links={NAV_LINKS} piliers={PILIERS_NAV} metiers={METIERS_NAV} />
      </div>
    </nav>
  );
}
