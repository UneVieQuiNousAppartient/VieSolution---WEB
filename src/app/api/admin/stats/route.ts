// Onglet « Statistiques » de l'admin (étape D, accord de Camille du 2026-10-23).
//   GET → visites des 30 derniers jours (par jour, pages, articles du Blog, sources, appareils),
//         avis (chiffres de l'onglet Avis) et courriels envoyés / reçus.
// Accès : session complète de l'admin (code + double vérification) ; service_role côté serveur.
import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { chiffresAvis } from '@/lib/avis';
import { articles } from '@/lib/blog';
import { chiffresCourriels, resumeVisites, type Courriel, type Visite } from '@/lib/stats';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PAGE = 1000;
const MAX_LIGNES = 60_000;

/** Lit toutes les lignes depuis une date, par pages de 1000 (limite de Supabase), jusqu'à MAX_LIGNES. */
async function toutLire<T>(db: SupabaseClient, table: string, colonnes: string, champDate: string, depuis: string) {
  const lignes: T[] = [];
  for (let debut = 0; debut < MAX_LIGNES; debut += PAGE) {
    const { data, error } = await db.from(table).select(colonnes).gte(champDate, depuis).order(champDate, { ascending: false }).order('id').range(debut, debut + PAGE - 1);
    if (error) throw new Error(error.message);
    lignes.push(...((data || []) as T[]));
    if (!data || data.length < PAGE) break;
  }
  return lignes;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasServiceKey()) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }, { status: 500 });
  const db = getAdminClient();
  const maintenant = new Date();
  const depuis = new Date(maintenant.getTime() - 31 * 86_400_000).toISOString();
  try {
    const [visites, courriels, avis] = await Promise.all([
      toutLire<Visite>(db, 'vsw_page_views', 'chemin, source, appareil, created_at', 'created_at', depuis),
      toutLire<Courriel>(db, 'vsw_email_messages', 'direction, received_at', 'received_at', depuis),
      db.from('vsw_avis').select('statut, note, created_at').limit(5000),
    ]);
    if (avis.error) throw new Error(avis.error.message);
    const lesAvis = avis.data || [];
    const resume = resumeVisites(visites, maintenant);
    const titres = new Map(articles().map((a) => [a.slug, a.titre]));
    return NextResponse.json({
      visites: { ...resume, articles: resume.articles.map((a) => ({ ...a, titre: titres.get(a.cle) || a.cle })) },
      avis: { ...chiffresAvis(lesAvis), recus30: lesAvis.filter((a) => new Date(a.created_at).getTime() >= maintenant.getTime() - 30 * 86_400_000).length },
      courriels: chiffresCourriels(courriels, maintenant),
      tronque: visites.length >= MAX_LIGNES,
    });
  } catch (e) {
    console.error('[admin] stats :', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Statistiques illisibles pour le moment.' }, { status: 500 });
  }
}
