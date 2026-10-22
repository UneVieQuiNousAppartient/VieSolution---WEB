import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { METIERS } from './metiers-section';

/*
 * « Nos engagements » (idée reprise de la section valeurs de zoho.com). Aucune promesse nouvelle :
 * chaque engagement reprend un texte déjà publié sur le site (FAQ, « La différence »).
 */
export const ENGAGEMENTS: { icon: IconName; title: string; desc: string }[] = [
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

/* Mosaïque dans un plateau (lot design Agnos, 2026-10-21) :
   engagement | appel de 30 min | engagement
   engagement | métiers         | engagement
   « Une proposition écrite » reprend l'étape 02 de comment-prix-section.tsx. */
export function EngagementsSection() {
  const [a, b, c, d] = ENGAGEMENTS;
  const carte = (e: (typeof ENGAGEMENTS)[number], cls: string) => (
    <div className={`engagement ${cls}`} key={e.title}>
      <div className="engagement-icon" aria-hidden="true"><Icon name={e.icon} size={18} /></div>
      <h3>{e.title}</h3>
      <p>{e.desc}</p>
    </div>
  );
  return (
    <section id="engagements" className="section">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <div>
            <div className="eyebrow">Nos engagements</div>
            <h2>Ce qu&apos;on vous promet,<br />et qu&apos;on tient.</h2>
          </div>
        </div>
        <div className="tray engagements-bento reveal">
          {carte(a, 'eg-a')}
          <div className="engagement engagement--appel eg-b">
            <h3>Un appel de 30&nbsp;minutes</h3>
            <p>
              Gratuit, sans engagement. On regarde votre situation ensemble, puis vous recevez une
              proposition écrite.
            </p>
            <Link href="/rdv" className="btn btn-dark">
              Prendre un RDV <Icon name="arrow" size={14} />
            </Link>
          </div>
          {carte(b, 'eg-c')}
          {carte(c, 'eg-d')}
          <div className="engagement engagement--metiers eg-m">
            <h3>Les métiers qu&apos;on accompagne</h3>
            <ul>
              {METIERS.map((m) => (
                <li key={m.slug}>
                  <a href={`#metier-${m.slug}`}>{m.titre}</a>
                </li>
              ))}
            </ul>
          </div>
          {carte(d, 'eg-e')}
        </div>
      </div>
    </section>
  );
}
