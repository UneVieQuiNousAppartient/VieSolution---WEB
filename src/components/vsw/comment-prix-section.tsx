/* « Combien ça coûte ? » — démarche de prix, sans aucun montant (décision de Camille, 2026-10-17). */
export const ETAPES = [
  {
    num: '01',
    title: 'Un appel gratuit de 30 minutes',
    desc: 'On écoute ce qui vous gruge. Vous restez libre de la suite.',
  },
  {
    num: '02',
    title: 'Une proposition écrite',
    desc: 'Un premier pas précis, ce qu’il comprend, et son prix. Vous prenez le temps de décider.',
  },
  {
    num: '03',
    title: 'Le prix est fixé avant de commencer',
    desc: 'Pas de surprise en cours de route : si quelque chose doit changer, on en parle avant, jamais après.',
  },
];

/* Phrase de conclusion, affichée à côté du formulaire de situation (round 7). */
export const CONCLUSION_PRIX =
  'On commence souvent petit : un premier pas, un prix clair, puis on décide de la suite ensemble.';

export const FACTEURS = [
  'L’ampleur du premier pas (une tâche ou plusieurs)',
  'Les logiciels à relier entre eux',
  'Le transfert de vos données existantes',
  'La formation : pour vous seul ou pour une équipe',
];

export function CommentPrixSection() {
  return (
    <section id="comment" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'Comment on établit un prix'}</div>
            <h2>
              Trois étapes,
              <br />
              aucune surprise.
            </h2>
          </div>
        </div>
        <ol className="process-grid cols-3 reveal" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {ETAPES.map((e) => (
            <li className="process-step" key={e.num}>
              <div className="step-num">Étape {e.num}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h3)', lineHeight: 1.25, color: 'var(--fg-0)', margin: 0, fontWeight: 500, letterSpacing: '-0.01em' }}>
                {e.title}
              </h3>
              <p>{e.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
