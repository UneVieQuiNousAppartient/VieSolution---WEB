import Link from 'next/link';
import { Icon } from './icon';

const AI_PILLARS = [
  {
    num: '01',
    title: "Formation à l'IA",
    desc: "Nous formons vos équipes à utiliser concrètement les outils d'IA générative dans leur quotidien — ChatGPT, Claude, Copilot et bien d'autres.",
    items: ['Ateliers personnalisés', "Cas d'usage métier", 'Bonnes pratiques & limites'],
  },
  {
    num: '02',
    title: "Comment l'IA améliore votre travail",
    desc: "On audite vos processus actuels, on identifie où l'IA fait gagner du temps, et on vous accompagne dans son intégration progressive.",
    items: ['Audit de processus', 'Identification des gains', "Plan d'intégration"],
  },
  {
    num: '03',
    title: 'Construction de processus IA',
    desc: "Nous bâtissons sur mesure les processus, agents et automatisations IA qui s'intègrent parfaitement à vos outils existants.",
    items: ['Agents personnalisés', 'Workflows automatisés', 'Connexion à vos outils'],
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
              Au-delà de l&apos;automatisation classique, nous formons et accompagnons les
              particuliers et les PME québécoises dans l&apos;intégration de l&apos;intelligence
              artificielle. Comprendre, expérimenter, puis bâtir ensemble les processus qui
              transformeront votre façon de travailler. Nous formons également des jeunes
              en informatique et en IA au sein de notre studio.
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
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              Nous sommes là pour <em>construire des processus</em> qui s&apos;appuient sur
              l&apos;IA — adaptés à votre réalité, vos outils et votre équipe.
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
