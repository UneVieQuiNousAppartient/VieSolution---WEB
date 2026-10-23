import { AboutCompilation } from './about-compilation';

export function About() {
  return (
    <section id="apropos" className="section">
      <div className="container">
        <div className="about-wrap reveal">
          <AboutCompilation />
          <div className="about-content">
            <div className="eyebrow">Qui sommes-nous</div>
            <h2>Un studio québécois, à votre service.</h2>
            <p>
              <strong style={{ color: 'var(--fg-0)' }}>Vie Solution Web</strong> est un
              studio indépendant qui accompagne particuliers, travailleurs autonomes et
              PME dans leur transition numérique. Notre approche : comprendre d&apos;abord,
              bâtir ensuite.
            </p>
            <p>
              Notre conviction est simple : les outils d&apos;aujourd&apos;hui — l&apos;intelligence
              artificielle et les logiciels Zoho — permettent à n&apos;importe quelle
              entreprise de reprendre le contrôle de sa gestion, sans armée de
              consultants ni budgets démesurés.
            </p>
            <p>
              Vous avez un irritant à automatiser, une gestion éparpillée à centraliser,
              une équipe à former ? Parlons-en pendant un appel découverte gratuit.
            </p>
            <div className="about-stats">
              <div className="about-stat"><strong>IA + Zoho</strong><span>Deux expertises, un studio</span></div>
              <div className="about-stat"><strong>100%</strong><span>Basé au Québec</span></div>
              <div className="about-stat"><strong>24h</strong><span>Temps de réponse</span></div>
              <div className="about-stat"><strong>0 jargon</strong><span>Accompagnement humain</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
