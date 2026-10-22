const STEPS = [
  {
    num: '01',
    title: 'Appel découverte',
    desc: "30 minutes, gratuit et sans engagement. On comprend votre réalité, vos irritants et vos objectifs avant de parler solution.",
  },
  {
    num: '02',
    title: 'Portrait de vos façons de faire',
    desc: "On regarde comment vous travaillez et on repère où l'IA et Zoho vous feront gagner du temps.",
  },
  {
    num: '03',
    title: 'Implantation',
    desc: "Tâches automatiques, assistants IA, configuration Zoho : on avance par étapes, en validant chaque étape avec vous.",
  },
  {
    num: '04',
    title: 'Formation & suivi',
    desc: "On forme votre équipe jusqu'à l'autonomie, puis on reste disponibles pour optimiser et faire évoluer vos outils.",
  },
];

/* Frise : pastilles numérotées reliées par une ligne fine au-dessus des cartes
   (inspiration « How it works 09 », 21st.dev). Le modificateur `process-grid--timeline`
   ne touche pas les autres grilles `process-grid` du site (/devis, /postuler-stagiaire). */
export function ProcessSection() {
  return (
    <section id="processus" className="section section--band">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Notre processus</div>
            <h2>Simple, du début<br />à la fin.</h2>
          </div>
          <p className="desc">
            Une méthode simple et transparente : vous savez toujours où on s&apos;en va, ce
            que ça coûte et ce que ça rapporte.
          </p>
        </div>
        <ol className="process-grid process-grid--timeline reveal">
          {STEPS.map((s) => (
            <li className="process-step" key={s.num}>
              <span className="step-dot" aria-hidden="true">{s.num}</span>
              <div className="step-body">
                <div className="step-num">Étape {s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
