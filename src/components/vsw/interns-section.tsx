import Link from 'next/link';
import { lienLangue, t, type Lang } from '@/lib/i18n';

export function InternsSection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="stagiaires" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-banner" style={{ borderTop: 'none' }}>
            <div className="ai-banner-text">
              {t(lang, "Vous êtes aux études en informatique, en IA ou en administration ? Découvrez notre")} <em>{t(lang, "offre de stage")}</em>.
            </div>
            <Link href={lienLangue(lang, '/emplois')} className="btn btn-primary btn-lg">
              {t(lang, "Voir l'offre de stage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
