import Link from 'next/link';
import { LogoMark } from './logo-mark';

export function VswFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="logo" style={{ marginBottom: 16 }}>
              <LogoMark />
              <div>Vie Solution Web<br /><small>Québec · Canada</small></div>
            </div>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, maxWidth: 300, margin: 0 }}>
              Une vie qui nous appartient. Automatisation, IA, sites web et implantation Zoho
              pour les entreprises québécoises.
            </p>
          </div>
          <div>
            <h5>Services</h5>
            <Link href="/ia">Automatisation &amp; IA</Link>
            <Link href="/zoho">Implantation Zoho</Link>
            <Link href="/sites-web">Sites et applications web</Link>
            <Link href="/crm-sur-mesure">CRM et outils sur mesure</Link>
            <Link href="/referencement">SEO et AEO</Link>
            <Link href="/ia#formation">Formation IA &amp; Zoho</Link>
            <Link href="/devis">Combien ça coûte ?</Link>
          </div>
          <div>
            <h5>Entreprise</h5>
            <Link href="/a-propos">À propos</Link>
            <Link href="/realisations">Cas d&apos;usage</Link>
            <Link href="/#partenaires">Partenaires</Link>
            <Link href="/postuler-stagiaire">Stagiaires</Link>
            <Link href="/rdv">Prendre un RDV</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h5>Contact</h5>
            <a href="mailto:bonjour@viesolutionweb.ca">bonjour@viesolutionweb.ca</a>
            <a href="tel:+14185550143">(418) 555-0143</a>
            <a>Québec · Canada</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 VIE SOLUTION WEB · TOUS DROITS RÉSERVÉS</div>
          <div>
            <Link href="/politique-confidentialite">Politique de confidentialité</Link>
            {' · '}
            <Link href="/conditions-utilisation">Conditions d&apos;utilisation</Link>
          </div>
          <div>{'// FAIT AU QUÉBEC AVEC RIGUEUR'}</div>
        </div>
        <p className="footer-marques">
          Zoho, Claude, ChatGPT et Copilot sont des marques de leurs propriétaires respectifs.
          Vie Solution Web n&apos;est affiliée à aucune de ces entreprises.
        </p>
      </div>
    </footer>
  );
}
