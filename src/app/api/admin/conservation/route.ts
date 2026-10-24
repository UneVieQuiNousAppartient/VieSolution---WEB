// Conservation (Loi 25, accord de Camille du 2026-10-24) : rien ne s'efface tout seul.
//   GET  → fiches sans contact depuis 24 mois (nom, entreprise, étape, dernière activité)
//   POST { ids: [...] } → effacement de chaque personne choisie par Camille (crm/effacement.ts)
// Accès : session complète de l'admin (code + double vérification) ; service_role côté serveur.
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { MOIS_CONSERVATION, aSupprimer, derniereActivite } from '@/lib/crm/conservation';
import { effacerPersonne } from '@/lib/crm/effacement';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  try {
    const db = getAdminClient();
    const data: { id: string; name: string; company: string | null; status: string; created_at: string; status_changed_at: string | null; last_contact_at: string | null; relance_sent_at: string | null }[] = [];
    for (let debut = 0; ; debut += 1000) {
      const { data: page, error } = await db.from('vsw_leads').select('id, name, company, status, created_at, status_changed_at, last_contact_at, relance_sent_at').order('id').range(debut, debut + 999);
      if (error) throw new Error(error.message);
      data.push(...(page || []));
      if (!page || page.length < 1000) break;
    }
    const maintenant = new Date();
    const fiches = data
      .filter((l) => aSupprimer(l, maintenant))
      .map((l) => ({ id: l.id, nom: l.name, entreprise: l.company, etape: l.status, derniere: derniereActivite(l)?.toISOString() || null }))
      .sort((a, b) => String(a.derniere).localeCompare(String(b.derniere)));
    return NextResponse.json({ mois: MOIS_CONSERVATION, fiches });
  } catch (e) {
    console.error('[admin] conservation :', e instanceof Error ? e.message : e);
    return refus('Liste illisible pour le moment.', 500);
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const body = (await req.json().catch(() => null)) as { ids?: unknown } | null;
  const ids = Array.isArray(body?.ids) ? [...new Set(body.ids.filter((x): x is string => typeof x === 'string' && UUID.test(x)))].slice(0, 200) : [];
  if (!ids.length) return refus('bad request');
  const db = getAdminClient();
  let effacees = 0;
  let erreurs = 0;
  const maintenant = new Date();
  for (const id of ids) {
    try {
      // Revérifié ici : seule une fiche vraiment sans contact depuis 24 mois part par cette route.
      const { data: l } = await db.from('vsw_leads').select('id, created_at, status_changed_at, last_contact_at, relance_sent_at').eq('id', id).maybeSingle();
      if (!l || !aSupprimer(l, maintenant)) continue;
      const bilan = await effacerPersonne(db, id);
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'lead_effacer_conservation', target_type: 'lead', target_id: id, meta: bilan }).then(() => undefined, () => undefined);
      effacees++;
    } catch (e) {
      erreurs++;
      console.error('[admin] conservation :', e instanceof Error ? e.message : e);
    }
  }
  return NextResponse.json({ ok: true, effacees, erreurs });
}
