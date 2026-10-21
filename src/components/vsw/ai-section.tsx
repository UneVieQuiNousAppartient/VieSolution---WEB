import Link from 'next/link';
import { Icon } from './icon';

const AI_PILLARS: { num: string; title: string; desc: string; items: string[]; note?: string }[] = [
  {
    num: '01',
    title: "Formation à l'IA pour petites entreprises",
    desc: "Des ateliers concrets pour utiliser l'IA (comme Claude, ChatGPT ou Copilot) au quotidien : courriels, documents, suivi des clients. Avec vos vrais dossiers, sans jargon, et en sachant ce qu'on ne confie pas à une IA.",
    items: ['Pour vous seul ou votre équipe', 'Exemples tirés de votre métier', 'Bonnes pratiques & limites'],
    // Badge fourni par Camille (PDF, 2026-10-21). Titre recopié tel quel ; date volontairement omise (demande de Camille).
    note: "Formation donnée par Camille Yvan Mbiakop, qui a suivi le cours « AI Fluency for small businesses » de Claude Academy (Anthropic).",
  },
  {
    num: '02',
    title: "Comment l'IA améliore votre travail",
    desc: "On regarde comment vous travaillez, on repère où l'IA vous fait gagner du temps, et on vous accompagne pas à pas pour l'adopter.",
    items: ['Portrait de vos façons de faire', 'Identification des gains', 'Plan étape par étape'],
  },
  {
    num: '03',
    title: 'Des outils IA bâtis pour vous',
    desc: "On bâtit sur mesure des assistants et des tâches automatiques qui fonctionnent avec vos outils actuels.",
    items: ['Assistants personnalisés', "Tâches qui s'enchaînent seules", 'Connexion à vos outils'],
  },
];

export function AISection() {
  return (
    <section id="ia" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{'// Intelligence artificielle'}</div>
              <h2>
                L&apos;IA dans votre quotidien.<br />
                <span className="glow">On vous montre comment.</span>
              </h2>
            </div>
            <p>
              On vous aide à utiliser l&apos;IA dans votre quotidien, que vous soyez seul ou en
              équipe. D&apos;abord comprendre, ensuite essayer, puis bâtir ensemble des façons de
              faire qui vous sauvent du temps. On forme aussi des jeunes en informatique et en
              IA dans notre studio.
            </p>
          </div>

          <div className="ai-pillars" id="formation">
            {AI_PILLARS.map((p) => (
              <div className="ai-pillar" key={p.num}>
                <div className="ai-pillar-num">{p.num} · Volet</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {p.note && <p className="ai-pillar-note">{p.note}</p>}
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              Nous sommes là pour <em>simplifier votre travail</em> avec l&apos;IA — à votre
              mesure, avec vos outils et votre équipe.
            </div>
            <Link href="/rdv" className="btn btn-primary btn-lg">
              Discuter d&apos;un projet IA <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
