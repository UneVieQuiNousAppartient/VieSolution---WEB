/* « Combien ça coûte ? » — démarche de prix, sans aucun montant (décision de Camille, 2026-10-17). */
const ETAPES = [
  {
    num: '01',
    title: 'Un appel gratuit de 30 minutes',
    desc: 'On écoute ce qui vous gruge. Aucune obligation.',
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

const FACTEURS = [
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
            <div className="eyebrow">{'// Comment on établit un prix'}</div>
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
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--fg-0)', margin: 0, fontWeight: 500, letterSpacing: '-0.01em' }}>
                {e.title}
              </h3>
              <p>{e.desc}</p>
            </li>
          ))}
        </ol>
        <div
          className="ai-pillar reveal"
          style={{ marginTop: 24, border: '1px solid var(--line-soft)', borderRadius: 'var(--radius-lg)' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--fg-0)', margin: 0, fontWeight: 500, letterSpacing: '-0.01em' }}>
            Ce qui fait varier le prix
          </h3>
          <ul>
            {FACTEURS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p style={{ marginTop: 8 }}>
            On commence souvent petit : un premier pas, un prix clair, puis on décide de la suite
            ensemble.
          </p>
        </div>
      </div>
    </section>
  );
}
