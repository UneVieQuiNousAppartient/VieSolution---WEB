// Modèles de courriels modifiables dans l'admin (étape B : « Vous pourrez modifier chaque modèle dans
// l'admin », maquette des modèles validée par Camille le 2026-10-23).
//   GET                          → les modèles (courriels automatiques, puis modèles de réponse)
//   POST { cle, sujet, corps }   → modifie un modèle existant (l'ancienne version reste dans le journal)
// Accès : session complète de l'admin ; service_role côté serveur.
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { validerReponse } from '@/lib/crm/saisie';
import { MODELES_REPONSE } from '@/lib/crm/suggestion';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Courriels qui partent seuls (textes approuvés par Camille les 2026-10-21 et 22). */
const AUTOMATIQUES = [
  { cle: 'accuse_reception', libelle: 'Accusé de réception d’une demande' },
  { cle: 'accuse_rdv', libelle: 'Accusé de réception d’une demande d’appel' },
  // Délais réglables dans l'onglet (règles new_lead_j2 / new_lead_j5) : pas écrits ici.
  { cle: 'followup_new_1', libelle: 'Relance 1 (demande sans contact)' },
  { cle: 'followup_new_2', libelle: 'Relance 2 (dernier courriel)' },
];
const TOUS = [...AUTOMATIQUES.map((m) => ({ ...m, automatique: true })), ...MODELES_REPONSE.map((m) => ({ ...m, automatique: false }))];

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const { data, error } = await getAdminClient()
    .from('vsw_email_templates')
    .select('key, subject, body, updated_at, updated_by')
    .eq('lang', 'fr')
    .in('key', TOUS.map((m) => m.cle));
  if (error) {
    console.error('[admin] modèles :', error.message);
    return refus('Modèles illisibles pour le moment.', 500);
  }
  const parCle = new Map((data || []).map((t) => [t.key as string, t]));
  return NextResponse.json({
    modeles: TOUS.filter((m) => parCle.has(m.cle)).map((m) => {
      const t = parCle.get(m.cle)!;
      return { ...m, sujet: t.subject, corps: t.body, modifie: t.updated_at, par: t.updated_by };
    }),
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const cle = typeof body?.cle === 'string' ? body.cle : '';
  if (!TOUS.some((m) => m.cle === cle)) return refus('modèle inconnu');
  const v = validerReponse(body);
  if (!v.ok) return refus(v.erreur);
  const db = getAdminClient();
  const { data: avant, error: e1 } = await db.from('vsw_email_templates').select('subject, body').eq('key', cle).eq('lang', 'fr').maybeSingle();
  if (e1 || !avant) return refus('Modèle introuvable.', e1 ? 500 : 404);
  const { error } = await db
    .from('vsw_email_templates')
    .update({ subject: v.valeur.sujet, body: v.valeur.corps, updated_at: new Date().toISOString(), updated_by: 'Camille (admin)' })
    .eq('key', cle)
    .eq('lang', 'fr');
  if (error) {
    console.error('[admin] modèles :', error.message);
    return refus('Le modèle n’a pas pu être enregistré.', 500);
  }
  await db
    .from('vsw_admin_audit_log')
    .insert({ actor: 'admin', action: 'modele_modifier', target_type: 'modele', target_id: cle, meta: { avant } })
    .then(() => undefined, () => undefined);
  return NextResponse.json({ ok: true });
}
