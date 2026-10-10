const STEPS = [
  {
    num: '01',
    title: 'Appel découverte',
    desc: "30 minutes, gratuit et sans engagement. On comprend votre réalité, vos irritants et vos objectifs avant de parler solution.",
  },
  {
    num: '02',
    title: 'Audit de vos processus',
    desc: "On cartographie votre façon de travailler et on identifie précisément où l'IA et Zoho vous feront gagner du temps et de l'argent.",
  },
  {
    num: '03',
    title: 'Implantation',
    desc: "Automatisations, agents IA, configuration Zoho : on déploie par étapes, en validant chaque livrable avec vous.",
  },
  {
    num: '04',
    title: 'Formation & suivi',
    desc: "On forme votre équipe jusqu'à l'autonomie, puis on reste disponibles pour optimiser et faire évoluer vos outils.",
  },
];

export function ProcessSection() {
  return (
    <section id="processus" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Notre processus</div>
            <h2>De l&apos;idée à l&apos;impact,<br />en quatre étapes.</h2>
          </div>
          <p className="desc">
            Une méthode simple et transparente : vous savez toujours où on s&apos;en va, ce
            que ça coûte et ce que ça rapporte.
          </p>
        </div>
        <div className="process-grid reveal">
          {STEPS.map((s) => (
            <div className="process-step" key={s.num}>
              <div className="step-num">Étape {s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
