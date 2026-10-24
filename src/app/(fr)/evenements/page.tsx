import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { lireEvenementsPublics, type EvenementPublic } from '@/lib/evenements-serveur';
import { EvenementsFiltre } from '@/components/vsw/evenements-filtre';
import { CarteEvenement } from '@/components/vsw/evenement-carte';

/* Page « Événements » (étape F, maquette SiteEvenements acceptée par Camille le 2026-10-23).
   Réservée d'abord aux clients (choix de Camille) : ni menu, ni pied de page, ni sitemap, ni Google
   (noindex). Camille envoie le lien. Aucun prix affiché (à décider plus tard). */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Événements',
  description: 'Ateliers de Vie Solution Web, en ligne et en personne : l’IA et un bon CRM, appliqués à votre journée.',
  robots: { index: false, follow: false },
};

export default async function EvenementsPage() {
  let evts: EvenementPublic[] = [];
  let erreur = false;
  if (hasServiceKey()) {
    try {
      evts = await lireEvenementsPublics(getAdminClient());
    } catch {
      erreur = true;
    }
  }
  return (
    <section className="section avis-page" style={{ borderTop: 'none', paddingTop: 72 }}>
      <div className="container evt-colonne">
        <div className="eyebrow">Événements</div>
        <h1 className="avis-titre">Apprendre ensemble, une heure à la fois.</h1>
        <p className="avis-intro">
          Des ateliers concrets, en ligne ou en personne, pour voir comment l&apos;IA et un bon CRM peuvent alléger vos
          journées. Posez vos questions, repartez avec des idées que vous pouvez appliquer dès lundi.
        </p>
        {erreur ? (
          <p className="evt-vide" role="alert">Les ateliers n&apos;ont pas pu être chargés. Réessayez dans quelques minutes.</p>
        ) : evts.length === 0 ? (
          <div className="evt-vide">
            <strong>Aucun atelier à venir pour le moment.</strong>
            <p>Une idée de sujet, ou envie d&apos;être averti du prochain ? <Link href="/contact">Écrivez-nous</Link>.</p>
          </div>
        ) : (
          <EvenementsFiltre genres={[...new Set(evts.map((e) => e.genre))]}>
            {evts.map((e) => <CarteEvenement key={e.slug} e={e} />)}
          </EvenementsFiltre>
        )}
      </div>
    </section>
  );
}
