// Carte « Google Agenda » de l'admin (étape C).
//   GET → configuré (variables), connecté, compte, réglages, 6 prochains créneaux libres
//   POST { op: 'reglages', jours, debut, fin, duree, delaiHeures, horizonJours } · { op: 'deconnecter' }
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { CLE_REGLAGES_AGENDA, creneauxLibres, validerReglagesAgenda } from '@/lib/agenda';
import { deconnecter, etatConnexion, googleConfigure, periodesOccupees } from '@/lib/agenda-google';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const db = getAdminClient();
  try {
    const e = await etatConnexion(db);
    let apercu: string[] = [];
    let erreurGoogle = '';
    if (e.connecte && googleConfigure()) {
      try {
        const maintenant = new Date();
        const occupes = await periodesOccupees(db, maintenant, new Date(maintenant.getTime() + (e.reglages.horizonJours + 1) * 86_400_000));
        apercu = creneauxLibres(e.reglages, occupes, maintenant).slice(0, 6).map((c) => c.debut);
      } catch (err) {
        console.error('[admin] agenda :', err instanceof Error ? err.message : err);
        erreurGoogle = 'Google Agenda ne répond pas, ou l’accès a été retiré. Reconnectez-le.';
      }
    }
    return NextResponse.json({ configure: googleConfigure(), ...e, apercu, erreurGoogle });
  } catch (err) {
    console.error('[admin] agenda :', err instanceof Error ? err.message : err);
    return refus('Réglages illisibles pour le moment.', 500);
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const db = getAdminClient();
  try {
    if (body?.op === 'reglages') {
      const v = validerReglagesAgenda(body);
      if (!v.ok) return refus(v.erreur);
      const { error } = await db.from('vsw_settings').upsert({ key: CLE_REGLAGES_AGENDA, value: JSON.stringify(v.valeur), updated_at: new Date().toISOString(), updated_by: 'Camille (admin)' });
      if (error) throw new Error(error.message);
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'agenda_reglages', target_type: 'reglages', target_id: 'agenda' }).then(() => undefined, () => undefined);
      return NextResponse.json({ ok: true });
    }
    if (body?.op === 'deconnecter') {
      const revoque = await deconnecter(db);
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'google_deconnecter', target_type: 'reglages', target_id: 'agenda' }).then(() => undefined, () => undefined);
      return NextResponse.json({ ok: true, revoque });
    }
    return refus('bad request');
  } catch (err) {
    console.error('[admin] agenda :', err instanceof Error ? err.message : err);
    return refus('L’opération n’a pas pu être faite. Réessayez dans quelques minutes.', 500);
  }
}
