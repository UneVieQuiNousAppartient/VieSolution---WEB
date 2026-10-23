// Avis (étape E) — lectures et écritures côté serveur seulement (client Supabase service_role).
// Règles pures : src/lib/avis.ts.
import type { SupabaseClient } from '@supabase/supabase-js';
import { CLES_REGLAGES_AVIS, lienExterne, lienWhatsapp, nomAffiche } from './avis';

export type ReglagesAvis = { google: string; facebook: string; whatsapp: string };

export async function lireReglagesAvis(db: SupabaseClient): Promise<ReglagesAvis> {
  const { data, error } = await db.from('vsw_settings').select('key, value').in('key', Object.values(CLES_REGLAGES_AVIS));
  if (error) throw new Error(error.message);
  const v = new Map((data || []).map((r) => [r.key as string, typeof r.value === 'string' ? r.value : '']));
  return {
    google: lienExterne(v.get(CLES_REGLAGES_AVIS.google)),
    facebook: lienExterne(v.get(CLES_REGLAGES_AVIS.facebook)),
    whatsapp: v.get(CLES_REGLAGES_AVIS.whatsapp) || '',
  };
}

/** Liens prêts pour la page /avis : un bouton n'apparaît que si son lien existe. */
export function liensPublics(r: ReglagesAvis) {
  return {
    google: r.google,
    facebook: r.facebook,
    whatsapp: r.whatsapp ? lienWhatsapp(r.whatsapp, 'Bonjour, je souhaite vous faire part de mon expérience avec Vie Solution Web : ') : '',
  };
}

/** Avis publiés, tels qu'affichés sur le site : prénom et initiale seulement. */
export async function lireAvisPublies(db: SupabaseClient, limite = 6) {
  const { data, error } = await db
    .from('vsw_avis')
    .select('id, nom, metier, note, message')
    .eq('statut', 'publie')
    .order('statut_at', { ascending: false })
    .limit(limite);
  if (error) throw new Error(error.message);
  return (data || []).map((a) => ({ id: a.id as string, nom: nomAffiche(a.nom as string), metier: (a.metier as string | null) ?? null, note: a.note as number, message: a.message as string }));
}
