import Link from 'next/link';
import { Icon } from './icon';

const MARQUEE_ITEMS = [
  'Automatisation IA',
  'Agents IA',
  'Formation IA',
  'Implantation Zoho',
  'Zoho CRM',
  'Zoho Books',
  'Zoho Desk',
  'Intégrations',
  'Audit de processus',
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
        <div className="eyebrow">{'// Studio IA & Zoho · Québec, Canada'}</div>
        <h1>
          Une vie qui<br />
          <span className="highlight">nous appartient.</span>
        </h1>
        <p className="lede">
          Automatisation, intelligence artificielle et implantation Zoho pour reprendre
          le contrôle de la gestion de votre entreprise — pensé pour les PME et
          travailleurs autonomes québécois.
        </p>
        <div className="hero-ctas">
          <Link href="/rdv" className="btn btn-primary btn-lg">
            Prendre un RDV <Icon name="arrow" size={14} />
          </Link>
          <Link href="/devis" className="btn btn-ghost btn-lg">
            <Icon name="bolt" size={14} /> Estimer mon projet
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
