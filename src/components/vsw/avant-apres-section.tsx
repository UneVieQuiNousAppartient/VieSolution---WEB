const ROWS: [string, string][] = [
  [
    'Vous tapez chaque facture à la main.',
    'La facture part toute seule à la fin du travail. Vous la vérifiez d’un clic.',
  ],
  [
    'Vous cherchez le numéro d’un client dans trois endroits.',
    'Tous vos clients sont au même endroit, dans un carnet de clients en ligne (Zoho CRM).',
  ],
  [
    'Vous oubliez de relancer une soumission.',
    'Un rappel vous avertit, ou un courriel de relance est préparé pour vous.',
  ],
  [
    'Vous répondez dix fois à la même question.',
    'Un assistant IA prépare la réponse. Vous la relisez et l’envoyez.',
  ],
  [
    'Vous refaites le même rapport chaque mois.',
    'Vos chiffres se mettent à jour seuls, sur un seul écran.',
  ],
];

export function AvantApresSection() {
  return (
    <section id="avant-apres" className="section section--band">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'// Avant / après'}</div>
            <h2>Ce qui change<br />dans votre semaine.</h2>
          </div>
          <p className="desc">
            Des exemples concrets de tâches qu&apos;on simplifie. Chaque situation est
            différente : on regarde la vôtre ensemble.
          </p>
        </div>
        <div className="compare-wrap reveal">
          <div className="compare-col others">
            <div className="compare-head">Avant</div>
            {ROWS.map(([avant]) => (
              <div className="compare-cell" key={avant}>
                <span className="mark">✕</span> {avant}
              </div>
            ))}
          </div>
          <div className="compare-col us">
            <div className="compare-head">Après</div>
            {ROWS.map(([, apres]) => (
              <div className="compare-cell" key={apres}>
                <span className="mark">✓</span> {apres}
              </div>
            ))}
          </div>
        </div>
        <p className="compare-note reveal">
          Exemples illustratifs. Le temps gagné dépend de votre situation : on l&apos;estime
          avec vous lors de l&apos;appel découverte.
        </p>
      </div>
    </section>
  );
}
