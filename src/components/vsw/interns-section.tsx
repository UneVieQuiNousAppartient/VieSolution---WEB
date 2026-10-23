import Link from 'next/link';

export function InternsSection() {
  return (
    <section id="stagiaires" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-banner" style={{ borderTop: 'none' }}>
            <div className="ai-banner-text">
              Vous êtes aux études en informatique, en IA ou en administration ? Découvrez
              notre <em>offre de stage</em>.
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
