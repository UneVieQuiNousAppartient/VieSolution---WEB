import Link from 'next/link';

export function InternsSection() {
  return (
    <section id="stagiaires" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-banner" style={{ borderTop: 'none' }}>
            <div className="ai-banner-text">
              On <em>forme des jeunes</em> en informatique, en IA et sur Zoho — apprenez
              le métier sur de vrais mandats clients.
            </div>
            <Link href="/emplois" className="btn btn-primary btn-lg">
              Voir l&apos;offre de stage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
