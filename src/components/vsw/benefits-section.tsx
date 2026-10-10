import { Icon, type IconName } from './icon';

const BENEFITS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'bolt',
    title: 'Des heures récupérées chaque semaine',
    desc: "Vos tâches répétitives roulent toutes seules pendant que vous vous concentrez sur votre vrai métier.",
  },
  {
    icon: 'clock',
    title: 'Votre entreprise travaille 24/7',
    desc: "Relances, suivis, réponses aux leads : l'automatisation et les agents IA ne dorment jamais.",
  },
  {
    icon: 'grid',
    title: 'Tout centralisé dans Zoho',
    desc: 'Clients, soumissions, facturation, support : fini les données éparpillées dans dix outils.',
  },
  {
    icon: 'users',
    title: 'Votre équipe devient autonome',
    desc: "On forme vos gens — et la relève — pour que les outils vous appartiennent vraiment.",
  },
  {
    icon: 'check',
    title: 'Des résultats de grande entreprise, au prix PME',
    desc: 'Les mêmes leviers que les grandes organisations, adaptés à votre budget et à votre réalité.',
  },
];

export function BenefitsSection() {
  return (
    <section id="benefices" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Pourquoi nous choisir</div>
            <h2>Le choix le plus<br />payant pour votre PME.</h2>
          </div>
          <p className="desc">
            Ce que nos clients gagnent concrètement en travaillant avec nous — au-delà de
            la technologie.
          </p>
        </div>
        <div className="benefits-grid reveal">
          {BENEFITS.map((b) => (
            <div className="benefit" key={b.title}>
              <div className="benefit-icon">
                <Icon name={b.icon} size={20} />
              </div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
