import { Icon, type IconName } from './icon';

const BENEFITS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'bolt',
    title: 'Des heures récupérées chaque semaine',
    desc: "Vos tâches répétitives roulent toutes seules pendant que vous vous concentrez sur votre vrai métier.",
  },
  {
    icon: 'clock',
    title: 'Votre entreprise avance, même la nuit',
    desc: "Rappels, suivis, réponses préparées d'avance : les tâches automatiques ne dorment jamais — et vous validez ce qui part.",
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
        <div className="section-head section-head--split reveal">
          <div>
            <div className="eyebrow">Pourquoi nous choisir</div>
            <h2>Ce que vous y gagnez,<br />concrètement.</h2>
          </div>
          <p className="desc">
            Des clients mieux servis, du temps qui vous revient : voilà ce que vous y gagnez. La
            technologie, elle, reste en coulisses.
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
