// Réglage des relances automatiques depuis /admin (onglet « Relances ») : marche/arrêt et délai en
// jours. Les règles et leurs défauts sont dans src/lib/crm/moteur.ts ; ici, seulement la surcharge
// (vsw_automation_rules). Accès complet exigé (code d'accès + double vérification).
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { validerReglage } from '@/lib/crm/aujourdhui';
import { REGLES, estCleRegle, listerRegles, reglerRegle } from '@/lib/crm/moteur';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasServiceKey()) return NextResponse.json({ error: 'Base non configurée' }, { status: 500 });
  const body = (await req.json().catch(() => null)) as { key?: unknown; enabled?: unknown; delai_jours?: unknown } | null;
  if (!estCleRegle(body?.key)) return NextResponse.json({ error: 'règle inconnue' }, { status: 400 });
  const { key, ...reglage } = body as { key: string };
  const v = validerReglage(reglage, REGLES[key].delay_hours > 0);
  if ('erreur' in v) return NextResponse.json({ error: v.erreur }, { status: 400 });
  const db = getAdminClient();
  try {
    // La relance 2 (« dernier courriel ») doit rester après la relance 1.
    if (v.patch.delay_hours !== undefined && (key === 'new_lead_j2' || key === 'new_lead_j5')) {
      const actuelles = await listerRegles(db);
      const autre = actuelles.find((r) => r.key === (key === 'new_lead_j2' ? 'new_lead_j5' : 'new_lead_j2'));
      const j2 = key === 'new_lead_j2' ? v.patch.delay_hours : autre?.delay_hours;
      const j5 = key === 'new_lead_j5' ? v.patch.delay_hours : autre?.delay_hours;
      if (j2 !== undefined && j5 !== undefined && j5 <= j2) {
        return NextResponse.json({ error: 'La relance 2 doit partir après la relance 1.' }, { status: 400 });
      }
    }
    await reglerRegle(db, key, v.patch);
    await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'regle', target_type: 'automation_rule', target_id: key, meta: v.patch });
    return NextResponse.json({ ok: true, regles: await listerRegles(db) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
