import Link from 'next/link';
import { Icon } from './icon';

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
          <Link href="/#demarrer">Démarrer</Link>
          <Link href="/#metiers">Métiers</Link>
          <Link href="/ia">IA</Link>
          <Link href="/zoho">Zoho</Link>
          <Link href="/devis">Devis</Link>
          <Link href="/realisations">Réalisations</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Link href="/rdv" className="btn btn-primary">
          Prendre un RDV <Icon name="arrow" size={14} />
        </Link>
      </div>
    </nav>
  );
}
