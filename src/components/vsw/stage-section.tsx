import Link from 'next/link';
import { Icon } from './icon';

/* Programme de stage — textes de /postuler-stagiaire. Sur l'accueil le 2026-10-22, puis sur la page
   /emplois depuis la refonte du 2026-10-23 (demande de Camille), avec la précision « sous la
   supervision de Camille, qui valide tout ce qui est livré » (son choix). */
export const OFFRES_STAGE = [
  {
    title: 'Mentorat individuel',
    desc: "Un accompagnement rapproché tout au long du stage, avec suivi régulier et retours concrets sur le travail et les livrables.",
  },
  {
    title: 'Projets clients réels',
    desc: "Pas de mandats fictifs : vous contribuez à des automatisations, des implantations Zoho et des agents IA livrés à de vrais clients québécois, sous la supervision de Camille, qui valide tout ce qui est livré.",
  },
  {
    title: "IA & Zoho appliqués",
    desc: "Formation aux outils d'IA générative et à l'écosystème Zoho — les compétences que les PME recherchent dès maintenant.",
  },
];

export function StageSection() {
  return (
    <section id="stagiaires" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Programme de stage</div>
            <h2>Apprenez le métier<br />sur de vrais mandats.</h2>
          </div>
          <p className="desc">
            Vie Solution Web accueille des jeunes en informatique, en intelligence artificielle et
            en administration pour travailler aux côtés de l&apos;équipe sur des projets clients
            réels — automatisation, agents IA et implantation Zoho.
          </p>
        </div>
        <div className="process-grid cols-3 reveal">
          {OFFRES_STAGE.map((o, i) => (
            <div className="process-step" key={o.title}>
              <div className="step-num">0{i + 1}</div>
              <h4>{o.title}</h4>
              <p>{o.desc}</p>
            </div>
          ))}
        </div>
        <div className="stage-appel reveal">
          <Link href="/emplois" className="btn btn-primary btn-lg">
            Postuler comme stagiaire <Icon name="arrow" size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
