import { VideoPresentation } from './video-presentation';
import { t, type Lang } from '@/lib/i18n';

export function About({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="apropos" className="section">
      <div className="container">
        <div className="about-wrap reveal">
          <VideoPresentation lang={lang} />
          <div className="about-content">
            <div className="eyebrow">{t(lang, "Qui sommes-nous")}</div>
            <h2>{t(lang, "Un studio québécois, à votre service.")}</h2>
            <p>
              <strong style={{ color: 'var(--fg-0)' }}>Vie Solution Web</strong> {t(lang, "est un studio indépendant qui accompagne particuliers, travailleurs autonomes et PME dans leur transition numérique. Notre approche : comprendre d'abord, bâtir ensuite.")}
            </p>
            <p>
              {t(lang, "Notre conviction est simple : les outils d'aujourd'hui — l'intelligence artificielle et les logiciels Zoho — permettent à n'importe quelle entreprise de reprendre le contrôle de sa gestion, sans armée de consultants ni budgets démesurés.")}
            </p>
            <p>
              {t(lang, "Vous avez un irritant à automatiser, une gestion éparpillée à centraliser, une équipe à former ? Parlons-en pendant un appel découverte gratuit.")}
            </p>
            <div className="about-stats">
              <div className="about-stat"><strong>{t(lang, "IA + Zoho")}</strong><span>{t(lang, "Deux expertises, un studio")}</span></div>
              <div className="about-stat"><strong>100%</strong><span>{t(lang, "Basé au Québec")}</span></div>
              <div className="about-stat"><strong>{t(lang, "24h")}</strong><span>{t(lang, "Temps de réponse")}</span></div>
              <div className="about-stat"><strong>{t(lang, "0 jargon")}</strong><span>{t(lang, "Accompagnement humain")}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
