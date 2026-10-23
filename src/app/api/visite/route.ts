// Visites du site (étape D, accord de Camille du 2026-10-23) : une page vue → une ligne de vsw_page_views.
//   POST { chemin, referent } → 204, toujours (le visiteur n'attend rien de cette réponse)
// Rien qui identifie le visiteur : ni cookie, ni IP, ni navigateur complet ; seulement la page, le
// domaine d'où il vient et le type d'appareil. Les robots ne sont pas comptés. Limites : 300 pages
// par adresse et par heure (empreinte de l'adresse, dans le compteur), 20 000 par jour pour le site.
import { createHash } from 'node:crypto';
import { NextRequest } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { cleIp } from '@/lib/chat/regles';
import { appareilDe, cheminVisite, estRobot, sourceVisite } from '@/lib/stats';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PAR_IP_HEURE = 300;
const SITE_JOUR = 20_000;
const rien = () => new Response(null, { status: 204 });

export async function POST(req: NextRequest) {
  // Sans sel, l'empreinte de l'adresse se retrouverait par essais : rien n'est enregistré (revue securite).
  if (!hasServiceKey() || !process.env.CRON_SECRET) return rien();
  // Seul le site lui-même compte des visites : JSON, et pas depuis un autre site (revue securite).
  if (!(req.headers.get('content-type') || '').startsWith('application/json')) return rien();
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return rien();
  // Camille connectée à l'admin : ses propres visites du site ne comptent pas.
  if (isAuthed(req)) return rien();
  const ua = (req.headers.get('user-agent') || '').slice(0, 400);
  if (estRobot(ua)) return rien();
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const chemin = cheminVisite(body?.chemin);
  if (!chemin) return rien();

  const adresse = cleIp(req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0]);
  const ip = createHash('sha256').update(`${process.env.CRON_SECRET}:visite:${adresse}`).digest('hex').slice(0, 32);
  const db = getAdminClient();
  try {
    const heure = await compterEssai(db, `visite_h:${ip}`, 3_600);
    if (heure > PAR_IP_HEURE) return rien();
    if ((await compterEssai(db, 'visite_site_j', 86_400)) > SITE_JOUR) return rien();
    const { error } = await db.from('vsw_page_views').insert({
      chemin,
      source: sourceVisite(body?.referent, new URL(SITE_URL).hostname),
      appareil: appareilDe(ua),
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error('[visite] :', e instanceof Error ? e.message : e);
  }
  return rien();
}
