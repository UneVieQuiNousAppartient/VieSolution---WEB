import type { Metadata } from 'next';
import { LibererPlace } from '@/components/vsw/liberer-place';

/* « Libérer ma place » (lien des courriels d'atelier, étape F) : un clic confirme, pour qu'un antivirus
   qui ouvre les liens n'annule pas l'inscription à la place de la personne. */
export const metadata: Metadata = { title: 'Libérer ma place', robots: { index: false, follow: false } };

export default async function LibererPage({ searchParams }: { searchParams: Promise<{ i?: string; t?: string }> }) {
  const { i = '', t = '' } = await searchParams;
  return (
    <section className="section avis-page" style={{ borderTop: 'none', paddingTop: 72 }}>
      <div className="container avis-colonne">
        <div className="eyebrow">Événements</div>
        <h1 className="avis-titre">Libérer ma place</h1>
        <LibererPlace i={i} t={t} />
      </div>
    </section>
  );
}
