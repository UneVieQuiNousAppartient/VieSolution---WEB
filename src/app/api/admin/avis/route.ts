// Onglet « Avis » de l'admin (étape E, même disposition que l'onglet Avis de KHI).
//   GET → les 300 avis les plus récents et les réglages de la page /avis
//   POST { op: 'statut', id, statut } → publier, refuser, remettre en attente
//   POST { op: 'supprimer', id } → suppression définitive (demande de retrait, Loi 25)
//   POST { op: 'reglages', google, facebook, whatsapp } → liens de la page /avis
// Accès : session complète de l'admin (code + double vérification) ; service_role côté serveur.
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { CLES_REGLAGES_AVIS, STATUTS_AVIS, validerReglagesAvis, type StatutAvis } from '@/lib/avis';
import { lireReglagesAvis } from '@/lib/avis-serveur';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const db = getAdminClient();
  try {
    const { data, error } = await db
      .from('vsw_avis')
      .select('id, nom, metier, note, message, statut, source, created_at, statut_at, consentement_at')
      .order('created_at', { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return NextResponse.json({ avis: data || [], reglages: await lireReglagesAvis(db) });
  } catch (e) {
    console.error('[admin] avis :', e instanceof Error ? e.message : e);
    return refus('Avis illisibles pour le moment.', 500);
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const db = getAdminClient();
  try {
    if (body?.op === 'statut') {
      const id = typeof body.id === 'string' ? body.id : '';
      const statut = body.statut as StatutAvis;
      if (!UUID.test(id) || !STATUTS_AVIS.includes(statut)) return refus('bad request');
      const { error } = await db.from('vsw_avis').update({ statut, statut_at: new Date().toISOString() }).eq('id', id);
      if (error) throw new Error(error.message);
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: `avis_${statut}`, target_type: 'avis', target_id: id }).then(() => undefined, () => undefined);
      return NextResponse.json({ ok: true });
    }
    if (body?.op === 'supprimer') {
      const id = typeof body.id === 'string' ? body.id : '';
      if (!UUID.test(id)) return refus('bad request');
      const { error } = await db.from('vsw_avis').delete().eq('id', id);
      if (error) throw new Error(error.message);
      // Le journal garde seulement l'identifiant, jamais le nom ni le message supprimés.
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'avis_supprimer', target_type: 'avis', target_id: id }).then(() => undefined, () => undefined);
      return NextResponse.json({ ok: true });
    }
    if (body?.op === 'reglages') {
      const v = validerReglagesAvis(body);
      if (!v.ok) return refus(v.erreur);
      const maintenant = new Date().toISOString();
      for (const [champ, cle] of Object.entries(CLES_REGLAGES_AVIS) as [keyof typeof CLES_REGLAGES_AVIS, string][]) {
        const valeur = v.valeur[champ];
        const r = valeur
          ? await db.from('vsw_settings').upsert({ key: cle, value: valeur, updated_at: maintenant, updated_by: 'Camille (admin)' })
          : await db.from('vsw_settings').delete().eq('key', cle);
        if (r.error) throw new Error(r.error.message);
      }
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'avis_reglages', target_type: 'reglages', target_id: 'avis' }).then(() => undefined, () => undefined);
      return NextResponse.json({ ok: true, reglages: await lireReglagesAvis(db) });
    }
    return refus('bad request');
  } catch (e) {
    console.error('[admin] avis :', e instanceof Error ? e.message : e);
    return refus('L’opération n’a pas pu être faite. Réessayez dans quelques minutes.', 500);
  }
}
