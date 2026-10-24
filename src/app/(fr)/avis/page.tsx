import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { AvisFormulaire } from '@/components/vsw/avis-formulaire';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { liensPublics, lireReglagesAvis } from '@/lib/avis-serveur';

/* Page « Avis » (étape E, maquette SiteAvis validée par Camille le 2026-10-23, sur le modèle de KHI) :
   note en étoiles, choix de la plateforme (offert à tous, quelle que soit la note : règle de Google),
   message d'écoute si la note est basse, témoignage pour le site après vérification par Camille.
   Les boutons Google, Facebook et WhatsApp n'apparaissent que si leur lien est réglé dans l'admin. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Votre avis',
  description: 'Partagez votre expérience avec Vie Solution Web : une note, la plateforme de votre choix, ou un témoignage pour notre site.',
  alternates: { canonical: '/avis' },
};

export default async function AvisPage() {
  let liens = { google: '', facebook: '', whatsapp: '' };
  if (hasServiceKey()) {
    try {
      liens = liensPublics(await lireReglagesAvis(getAdminClient()));
    } catch {
      /* sans réglages, la page propose seulement le témoignage pour le site */
    }
  }
  return (
    <>
      <RevealInit />
      <section className="section avis-page" style={{ borderTop: 'none', paddingTop: 72 }}>
        <div className="container avis-colonne">
          <div className="eyebrow">Votre avis</div>
          <h1 className="avis-titre">Comment s&apos;est passée votre expérience ?</h1>
          <p className="avis-intro">
            Prenez 30 secondes pour nous donner une note et choisir où partager votre avis. Merci sincèrement :
            chaque mot nous aide à mieux servir les prochains.
          </p>
          <AvisFormulaire liens={liens} />
        </div>
      </section>
    </>
  );
}
