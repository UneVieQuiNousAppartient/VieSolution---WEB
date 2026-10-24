import type { Metadata } from 'next';
import Link from 'next/link';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Icon } from '@/components/vsw/icon';
import { CTASection } from '@/components/vsw/cta-section';
import { METIERS } from '@/lib/metiers';

/* Page principale du menu « Métiers » (refonte du 2026-10-23, maquette validée par Camille) :
   les 8 métiers, chacun mène à sa page /metiers/<slug>. Textes : src/lib/metiers.ts. */
export const metadata: Metadata = {
  title: 'Métiers',
  description:
    "Conseillers financiers, courtiers, cliniques, comptables, entrepreneurs, agents immobiliers, commerces : ce qui vous gruge, ce qu'on améliore pour vos clients et le temps que vous retrouvez.",
};

export default function MetiersPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Métiers"
        title={
          <>
            Un meilleur service pour vos clients.<br />Plus de temps pour vous.
          </>
        }
        lede="On part de votre métier. On regarde ce qui vous gruge, on améliore le service que vous offrez à vos clients, et vous retrouvez du temps. L'IA, Zoho et l'automatisation sont nos outils pour y arriver."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ul className="metiers-index reveal">
            {METIERS.map((m) => (
              <li key={m.slug}>
                <Link href={`/metiers/${m.slug}`} className="metiers-index-carte">
                  <span className="benefit-icon"><Icon name={m.icon} size={20} aria-hidden="true" /></span>
                  <strong>{m.titre}</strong>
                  {m.precision && <small>{m.precision}</small>}
                  <span className="metiers-index-gruge">{m.gruge}</span>
                  <span className="pm-lien">Voir comment on aide <span aria-hidden="true">→</span></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="metiers-index-autre">
            Un autre métier ? Si vous servez des clients, on regarde ensemble ce qui vous gruge et ce
            qu&apos;on peut améliorer.
          </p>
        </div>
      </section>
      <CTASection />
    </>
  );
}
