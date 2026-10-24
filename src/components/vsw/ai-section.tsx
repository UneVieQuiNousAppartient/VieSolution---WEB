import Link from 'next/link';
import { Icon } from './icon';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

const AI_PILLARS: { num: string; title: string; desc: string; items: string[]; note?: string }[] = [
  {
    num: '01',
    title: phrase("Formation à l'IA pour petites entreprises"),
    desc: phrase("Des ateliers concrets pour utiliser l'IA (comme Claude, ChatGPT ou Copilot) au quotidien : courriels, documents, suivi des clients. Avec vos vrais dossiers, sans jargon, et en sachant ce qu'on ne confie pas à une IA."),
    items: [phrase("Pour vous seul ou votre équipe"), phrase("Exemples tirés de votre métier"), phrase("Bonnes pratiques & limites")],
    // Badge fourni par Camille (PDF, 2026-10-21). Titre recopié tel quel ; date volontairement omise (demande de Camille).
    note: phrase("Formation donnée par Camille Yvan Mbiakop, qui a suivi le cours « AI Fluency for small businesses » de Claude Academy (Anthropic)."),
  },
  {
    num: '02',
    title: phrase("Comment l'IA améliore votre travail"),
    desc: phrase("On regarde comment vous travaillez, on repère où l'IA vous fait gagner du temps, et on vous accompagne pas à pas pour l'adopter."),
    items: [phrase("Portrait de vos façons de faire"), phrase("Identification des gains"), phrase("Plan étape par étape")],
  },
  {
    num: '03',
    title: phrase("Des outils IA installés et bâtis pour vous"),
    desc: phrase("On installe et règle pour votre équipe des outils d'IA comme Claude ou ChatGPT. Et on bâtit sur mesure des assistants et des tâches automatiques qui fonctionnent avec vos outils actuels."),
    items: [phrase("Installation de Claude ou ChatGPT pour votre équipe"), phrase("Assistants personnalisés"), phrase("Tâches qui s'enchaînent seules"), phrase("Connexion à vos outils")],
  },
];

export function AISection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="ia" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{t(lang, "Intelligence artificielle")}</div>
              <h2>
                {t(lang, "L'IA dans votre quotidien.")}<br />
                <span className="glow">{t(lang, "On vous montre comment.")}</span>
              </h2>
            </div>
            <p>
              {t(lang, "On vous aide à utiliser l'IA dans votre quotidien, que vous soyez seul ou en équipe. D'abord comprendre, ensuite essayer, puis bâtir ensemble des façons de faire qui vous sauvent du temps.")}
            </p>
          </div>

          <div className="ai-pillars" id="formation">
            {AI_PILLARS.map((p) => (
              <div className="ai-pillar" key={p.num}>
                <div className="ai-pillar-num">{t(lang, "{num} · Volet", { num: p.num })}</div>
                <h4>{t(lang, p.title)}</h4>
                <p>{t(lang, p.desc)}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{t(lang, it)}</li>
                  ))}
                </ul>
                {p.note && <p className="ai-pillar-note">{t(lang, p.note)}</p>}
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              {t(lang, "Nous sommes là pour")} <em>{t(lang, "simplifier votre travail")}</em> {t(lang, "avec l'IA — à votre mesure, avec vos outils et votre équipe.")}
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
