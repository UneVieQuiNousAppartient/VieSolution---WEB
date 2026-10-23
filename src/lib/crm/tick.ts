// Le « tick » horaire du suivi des demandes (repris de KHI Educ, lib/tick.js).
// Appelé par GET /api/cron/tick (Vercel Cron, vercel.json). Un verrou en base
// (vsw_claim_job_lock) empêche deux passages de se chevaucher ; chaque règle reste idempotente
// (clé unique de vsw_automation_runs).
import { getAdminClient } from '@/lib/supabase/admin';
import { executerRegles, type Bilan } from './moteur';
import { envoyerRappels } from '@/lib/evenements-serveur';

const VERROU = 'vsw_tick';
const VERROU_MINUTES = 15;

export type ResultatTick =
  | { at: string; source: string; skipped: string }
  | { at: string; source: string; duree_ms: number; regles: Record<string, Bilan> | { error: string }; ateliers?: { candidats: number; envoyes: number; erreurs: number } | { error: string } };

export async function lancerTick(source = 'cron'): Promise<ResultatTick> {
  const db = getAdminClient();
  const at = new Date().toISOString();
  const { data: libre, error } = await db.rpc('vsw_claim_job_lock', { p_name: VERROU, p_minutes: VERROU_MINUTES, p_by: source });
  // Verrou indisponible (fonction absente) : on continue — les réservations empêchent déjà les doublons.
  if (error) console.error('[tick] verrou :', error.message);
  else if (libre !== true) return { at, source, skipped: 'un passage est déjà en cours' };
  try {
    let regles: Record<string, Bilan> | { error: string };
    try {
      regles = await executerRegles(db);
    } catch (e) {
      regles = { error: e instanceof Error ? e.message : String(e) };
    }
    // Rappels des ateliers de demain (étape F) : à part, une panne ici n'arrête pas les relances.
    let ateliers: { candidats: number; envoyes: number; erreurs: number } | { error: string };
    try {
      ateliers = await envoyerRappels(db);
    } catch (e) {
      ateliers = { error: e instanceof Error ? e.message : String(e) };
    }
    // Ménage : compteurs d'essais de connexion à /admin de plus d'un jour (vsw_rate_limits).
    await db.from('vsw_rate_limits').delete().lt('window_start', new Date(Date.now() - 24 * 3600 * 1000).toISOString()).then(() => undefined, () => undefined);
    return { at, source, duree_ms: Date.now() - new Date(at).getTime(), regles, ateliers };
  } finally {
    if (!error) await db.rpc('vsw_release_job_lock', { p_name: VERROU }).then(() => undefined, () => undefined);
  }
}
