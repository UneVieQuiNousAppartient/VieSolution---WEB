export const ROWS: [string, string][] = [
  ['Solutions génériques', 'Plans personnalisés à votre réalité'],
  ['Jargon technique', 'Des explications claires, en français'],
  ['Outils imposés', 'Des outils que vous maîtrisez (IA + Zoho)'],
  ['Des résultats flous', 'Du temps et de l’argent réellement gagnés'],
  ['Projet livré, consultant parti', 'Formation et accompagnement continus'],
  ['Coûts cachés', 'Un prix clair avant de commencer, sans frais cachés'],
  ['Vous dépendez du consultant', 'Une vie qui vous appartient'],
];

export function ComparisonSection() {
  return (
    <section id="difference" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">La différence</div>
            <h2>Pendant que d&apos;autres livrent,<br />nous, on vous outille.</h2>
          </div>
          <p className="desc">
            Notre objectif n&apos;est pas de vous rendre dépendants de nous — c&apos;est de vous
            rendre autonomes avec des outils solides.
          </p>
        </div>
        <div className="compare-wrap reveal">
          <div className="compare-col others">
            <div className="compare-head">Les autres</div>
            {ROWS.map(([o]) => (
              <div className="compare-cell" key={o}>
                <span className="mark">✕</span> {o}
              </div>
            ))}
          </div>
          <div className="compare-col us">
            <div className="compare-head">Vie Solution Web</div>
            {ROWS.map(([, u]) => (
              <div className="compare-cell" key={u}>
                <span className="mark">✓</span> {u}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
