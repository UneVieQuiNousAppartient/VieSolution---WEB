import { Icon, type IconName } from './icon';

/*
 * « Nos engagements » (idée reprise de la section valeurs de zoho.com). Aucune promesse nouvelle :
 * chaque engagement reprend un texte déjà publié sur le site (FAQ, « La différence »).
 */
const ENGAGEMENTS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'grid',
    title: 'Vos besoins d’abord',
    desc: 'On part de ce que vous avez. Zoho, Claude, votre logiciel actuel ou un outil bâti pour vous : on choisit avec vous ce qui sert votre métier.',
  },
  {
    icon: 'check',
    title: 'Vous gardez le dernier mot',
    desc: 'Ce qui engage votre jugement professionnel, un conseil ou une réponse personnalisée, n’est jamais envoyé sans votre validation.',
  },
  {
    icon: 'users',
    title: 'Vos données vous appartiennent',
    desc: 'On configure les accès selon la Loi 25 et on vous explique clairement où vos données sont hébergées et qui y a accès.',
  },
  {
    icon: 'clock',
    title: 'On reste après',
    desc: 'Votre équipe est formée jusqu’à l’autonomie, en français et sans jargon. Ensuite, on reste disponibles pour faire évoluer vos outils.',
  },
];

export function EngagementsSection() {
  return (
    <section id="engagements" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'// Nos engagements'}</div>
            <h2>Ce qu&apos;on vous promet,<br />et qu&apos;on tient.</h2>
          </div>
        </div>
        <div className="engagements-grid reveal">
          {ENGAGEMENTS.map((e) => (
            <div className="engagement" key={e.title}>
              <div className="engagement-icon" aria-hidden="true"><Icon name={e.icon} size={18} /></div>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
