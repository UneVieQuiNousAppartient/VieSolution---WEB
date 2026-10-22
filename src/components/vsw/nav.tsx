import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { NavMenu } from './nav-menu';
import { NavServices } from './nav-services';
import { LogoMark } from './logo-mark';
import { APPEL } from './appel';

export type NavLinkItem = { href: string; label: string };
export type ServiceNavItem = NavLinkItem & { desc: string; icon: IconName };

/**
 * Services (menu déroulant de la nav, menu mobile, pied de page) — mêmes noms partout
 * (réorganisation du 2026-10-22, maquette 1 validée par Camille).
 */
export const SERVICES_NAV: readonly ServiceNavItem[] = [
  { href: '/ia', label: 'Automatisation et IA', desc: 'Claude ou ChatGPT installés, tâches qui roulent seules', icon: 'bolt' },
  { href: '/zoho', label: 'Implantation Zoho', desc: 'Clients, factures et suivi au même endroit', icon: 'grid' },
  { href: '/sites-web', label: 'Sites et applications web', desc: 'Un site qui travaille pour votre entreprise', icon: 'globe' },
  { href: '/crm-sur-mesure', label: 'CRM et outils sur mesure', desc: 'Un outil fait pour votre façon de travailler', icon: 'layout' },
  { href: '/referencement', label: 'Être trouvé sur Google et par les IA', desc: 'Référencement SEO et AEO', icon: 'arrow' },
  { href: '/ia#formation', label: 'Formation IA et Zoho', desc: 'Votre équipe autonome, en français', icon: 'users' },
];

/** Liens de la nav après « Services » : barre (> 640 px) et menu mobile (nav-menu.tsx). */
export const NAV_LINKS: readonly NavLinkItem[] = [
  { href: '/#metiers', label: 'Métiers' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/devis', label: 'Prix' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export function VswNav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <LogoMark />
          <div>Vie Solution Web</div>
        </Link>
        <div className="nav-links">
          <NavServices services={SERVICES_NAV} />
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href={APPEL.href} className="btn btn-primary nav-cta">
          {APPEL.court} <Icon name="arrow" size={14} />
        </Link>
        <NavMenu links={NAV_LINKS} services={SERVICES_NAV} />
      </div>
    </nav>
  );
}
