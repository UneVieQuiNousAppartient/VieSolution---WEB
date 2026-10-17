import Link from 'next/link';
import { Icon } from './icon';
import { NavMenu } from './nav-menu';

export type NavLinkItem = { href: string; label: string };

/** Liens de la nav : barre (> 640 px) et menu mobile (nav-menu.tsx) partagent cette liste. */
export const NAV_LINKS: readonly NavLinkItem[] = [
  { href: '/#demarrer', label: 'Démarrer' },
  { href: '/#metiers', label: 'Métiers' },
  { href: '/ia', label: 'IA' },
  { href: '/zoho', label: 'Zoho' },
  { href: '/devis', label: 'Devis' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export function VswNav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-mark"></div>
          <div>
            Vie Solution Web
            <br />
            <small>Québec · IA &amp; Zoho</small>
          </div>
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/rdv" className="btn btn-primary nav-cta">
          Prendre un RDV <Icon name="arrow" size={14} />
        </Link>
        <NavMenu links={NAV_LINKS} />
      </div>
    </nav>
  );
}
