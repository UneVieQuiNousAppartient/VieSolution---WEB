import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { lireEvenementPublic } from '@/lib/evenements-serveur';
import { LIBELLE_GENRE, lieuAffiche, places, quandLisible, slugEvtValide } from '@/lib/evenements';
import { InscriptionFormulaire } from '@/components/vsw/inscription-formulaire';

/* Page d'un atelier (étape F) : renseignements publics (jamais le lieu privé), inscription,
   invitation d'agenda. Cachée des moteurs de recherche, comme /evenements. */
export const dynamic = 'force-dynamic';

const lire = async (slug: string) => {
  if (!hasServiceKey() || !slugEvtValide(slug)) return null;
  try {
    return (await lireEvenementPublic(getAdminClient(), slug))?.public ?? null;
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = await lire((await params).slug);
  return { title: e ? e.titre : 'Atelier', robots: { index: false, follow: false } };
}

export default async function AtelierPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = await lire((await params).slug);
  if (!e) notFound();
  const p = places(e.places, e.inscrits);
  return (
    <section className="section avis-page" style={{ borderTop: 'none', paddingTop: 64 }}>
      <div className="container evt-fiche">
        <div className="evt-fiche-texte">
          <Link href="/evenements" className="evt-retour">← Tous les ateliers</Link>
          <div className="evt-etiquettes">
            <span className={`evt-genre evt-genre--${e.genre}`}>{LIBELLE_GENRE[e.genre]}</span>
            <span className={`evt-places evt-places--${p.ton}`}>{p.libelle}</span>
          </div>
          <h1 className="evt-fiche-titre">{e.titre}</h1>
          <dl className="evt-infos">
            <dt>Quand</dt><dd>{quandLisible(e.debut, e.fin)}</dd>
            <dt>Où</dt><dd>{lieuAffiche(e)}</dd>
            <dt>Animé par</dt><dd>Camille Yvan, Vie Solution Web</dd>
          </dl>
          {e.presentation.split(/\n{2,}/).map((para, i) => <p key={i} className="evt-presentation">{para}</p>)}
          <a className="btn btn-ghost evt-agenda" href={`/api/evenements/ics?e=${encodeURIComponent(e.slug)}`}>Ajouter à mon agenda (.ics)</a>
        </div>
        {p.restantes > 0 ? (
          <InscriptionFormulaire slug={e.slug} />
        ) : (
          <div className="avis-formulaire">
            <h2 className="avis-form-titre">Cet atelier est complet</h2>
            <p>Écrivez-nous : on vous avertit si une place se libère.</p>
            <Link className="btn btn-primary" href="/contact">Nous écrire</Link>
          </div>
        )}
      </div>
    </section>
  );
}
