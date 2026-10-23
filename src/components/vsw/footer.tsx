import Link from 'next/link';
import { LogoMark } from './logo-mark';
import { PILIERS_NAV } from './nav';
import { APPEL } from './appel';
import { Icon } from './icon';
import { RESEAUX } from '@/lib/site';

/* Pied de page premium (option A validée par Camille le 2026-10-22) : fond nuit (.section--nuit),
   colonnes par pilier depuis la refonte du 2026-10-23 (Stagiaires → page Emplois, Prix → Entreprise),
   slogan en dégradé, bouton d'appel, grand nom en filigrane. Icônes sociales tirées de RESEAUX
   (src/lib/site.ts) : affichées seulement quand Camille a donné le lien. */
const ICONES: Record<(typeof RESEAUX)[number]['nom'], string> = {
  WhatsApp:
    'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z',
  Facebook:
    'M9.1 23.69v-7.98H6.63v-3.67H9.1v-1.58c0-4.09 1.85-5.98 5.86-5.98.4 0 .96.04 1.47.1.39.04.77.1 1.14.2v3.32a8.6 8.6 0 0 0-1.39-.05c-.7 0-1.26.1-1.67.31-.29.15-.52.36-.68.62-.26.42-.38 1-.38 1.75v1.3h3.92l-.39 2.1-.28 1.57h-3.25v8.24C19.4 23.24 24 18.18 24 12.04 24 5.42 18.63.04 12 .04S0 5.42 0 12.04c0 5.63 3.87 10.35 9.1 11.65z',
};

export function VswFooter() {
  const reseaux = RESEAUX.filter((r) => r.url);
  return (
    <footer className="footer footer--premium section--nuit">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-marque">
            <div className="logo">
              <LogoMark />
              <div>Vie Solution Web</div>
            </div>
            <p className="footer-slogan">Une vie qui vous appartient, des clients mieux servis, plus vite.</p>
            <p className="footer-desc">
              Automatisation, IA, sites web et implantation Zoho pour les entreprises québécoises.
            </p>
            <Link href={APPEL.href} className="btn btn-primary footer-appel">
              {APPEL.libelle} <Icon name="arrow" size={14} />
            </Link>
          </div>
          {PILIERS_NAV.map((p) => (
            <div key={p.pilier}>
              <h5>{p.pilier}</h5>
              {p.services.map((sv) => (
                <Link key={sv.href} href={sv.href}>{sv.label}</Link>
              ))}
            </div>
          ))}
          <div>
            <h5>Entreprise</h5>
            <Link href="/metiers">Métiers</Link>
            <Link href="/realisations">Réalisations</Link>
            <Link href="/devis">Prix</Link>
            <Link href="/a-propos">À propos</Link>
            <Link href="/emplois">Emplois</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h5>Nous joindre</h5>
            <a href="mailto:info@viesolutionweb.ca">info@viesolutionweb.ca</a>
            <a href="tel:+14385065243">(438) 506-5243</a>
            {reseaux.length > 0 && (
              <ul className="footer-reseaux">
                {reseaux.map((r) => (
                  <li key={r.nom}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.nom} (nouvel onglet)`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={ICONES[r.nom]} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Vie Solution Web · Tous droits réservés</div>
          <div>
            <Link href="/politique-confidentialite">Politique de confidentialité</Link>
            {' · '}
            <Link href="/conditions-utilisation">Conditions d&apos;utilisation</Link>
          </div>
        </div>
        <p className="footer-geant" aria-hidden="true">Vie Solution Web</p>
      </div>
    </footer>
  );
}
