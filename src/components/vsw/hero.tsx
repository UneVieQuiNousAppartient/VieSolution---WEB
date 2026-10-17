import Link from 'next/link';
import { Icon } from './icon';

const MARQUEE_ITEMS = [
  'Moins de paperasse',
  'Factures automatiques',
  'Relances sans oubli',
  'Assistant IA',
  'Zoho CRM',
  'Zoho Books',
  'Formation simple',
  'Service en français',
  'Premier pas accompagné',
];

function MarqueeContent() {
  return (
    <>
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 60 }}>
          {item}
          <span className="dot" />
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid"></div>
      <div className="hero-glow"></div>
      <div className="container hero-inner">
        <div className="eyebrow">{'// Pour les professionnels, les travailleurs autonomes et les PME du Québec'}</div>
        <h1>
          Une vie qui<br />
          <span className="highlight">nous appartient.</span>
        </h1>
        <p className="lede">
          Mieux servir vos clients, et retrouver du temps pour votre vrai métier. On améliore
          votre service au quotidien — rappels, suivis, réponses, paperasse — avec des outils
          simples comme l&apos;IA et Zoho, et on vous montre comment vous en servir. Pas besoin
          d&apos;être techno.
        </p>
        <div className="hero-ctas">
          <Link href="/rdv" className="btn btn-primary btn-lg">
            Prendre un RDV <Icon name="arrow" size={14} />
          </Link>
          <Link href="#demarrer" className="btn btn-ghost btn-lg">
            <Icon name="check" size={14} /> Par où commencer ?
          </Link>
        </div>
        <div className="hero-meta">
          <div><strong>IA + Zoho</strong>une seule équipe</div>
          <div><strong>24h</strong>délai de réponse</div>
          <div><strong>100%</strong>basé au Québec</div>
          <div><strong>FR</strong>service en français</div>
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          <span>
            <MarqueeContent />
          </span>
        </div>
      </div>
    </section>
  );
}
