// Onglet « Événements » de l'admin (étape F).
//   GET → ateliers (300 plus récents), inscriptions, fiche client correspondante (même courriel)
//   GET ?csv=<id> → liste des inscrits en CSV
//   POST { op: 'creer' | 'modifier', id?, ...champs } · { op: 'statut', id, statut: 'publie' | 'brouillon' }
//   POST { op: 'annuler', id } → atelier annulé, courriel à chaque inscrit confirmé
//   POST { op: 'inscription', id, statut: 'confirmee' | 'annulee' }
// Accès : session complète de l'admin (code + double vérification) ; service_role côté serveur.
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { csvInscrits, manquePourPublier, slugEvenement, validerEvenement } from '@/lib/evenements';
import { courrielAtelier, type Evenement } from '@/lib/evenements-serveur';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COLONNES = 'id, slug, titre, genre, debut, fin, lieu_public, lieu_prive, places, presentation, statut, created_at';
const journal = (db: ReturnType<typeof getAdminClient>, action: string, id: string) =>
  db.from('vsw_admin_audit_log').insert({ actor: 'admin', action, target_type: 'evenement', target_id: id }).then(() => undefined, () => undefined);

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const db = getAdminClient();
  try {
    const csv = req.nextUrl.searchParams.get('csv');
    if (csv) {
      if (!UUID.test(csv)) return refus('bad request');
      const { data: e } = await db.from('vsw_evenements').select('slug').eq('id', csv).maybeSingle();
      const { data, error } = await db.from('vsw_inscriptions').select('nom, courriel, entreprise, question, statut, avertir, created_at').eq('evenement_id', csv).order('created_at');
      if (error) throw new Error(error.message);
      return new Response(csvInscrits(data || []), {
        headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="inscrits-${e?.slug || 'atelier'}.csv"`, 'Cache-Control': 'no-store' },
      });
    }
    const { data: evts, error } = await db.from('vsw_evenements').select(COLONNES).order('debut', { ascending: false }).limit(300);
    if (error) throw new Error(error.message);
    const ids = (evts || []).map((e) => e.id as string);
    const { data: ins, error: e2 } = ids.length
      ? await db.from('vsw_inscriptions').select('id, evenement_id, nom, courriel, entreprise, question, avertir, statut, confirmation_envoyee_at, rappel_envoye_at, created_at').in('evenement_id', ids).order('created_at').limit(10_000)
      : { data: [], error: null };
    if (e2) throw new Error(e2.message);
    const courriels = [...new Set((ins || []).map((i) => String(i.courriel).toLowerCase()))];
    const fiches = new Map<string, string>();
    for (let k = 0; k < courriels.length; k += 200) {
      const { data: leads } = await db.from('vsw_leads').select('id, email').in('email', courriels.slice(k, k + 200));
      for (const l of leads || []) fiches.set(String(l.email).toLowerCase(), l.id as string);
    }
    return NextResponse.json({
      evenements: evts || [],
      inscriptions: (ins || []).map((i) => ({ ...i, fiche: fiches.get(String(i.courriel).toLowerCase()) || null })),
    });
  } catch (e) {
    console.error('[admin] evenements :', e instanceof Error ? e.message : e);
    return refus('Événements illisibles pour le moment.', 500);
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const db = getAdminClient();
  const id = typeof body?.id === 'string' ? body.id : '';
  try {
    if (body?.op === 'creer' || body?.op === 'modifier') {
      const v = validerEvenement(body);
      if (!v.ok) return refus(v.erreur);
      const maintenant = new Date().toISOString();
      if (body.op === 'creer') {
        let slug = slugEvenement(v.valeur.titre, v.valeur.debut);
        const { data: pris } = await db.from('vsw_evenements').select('slug').like('slug', `${slug}%`);
        if (pris?.some((p) => p.slug === slug)) slug = `${slug}-${(pris?.length || 0) + 1}`;
        const { data, error } = await db.from('vsw_evenements').insert({ ...v.valeur, slug, statut: 'brouillon' }).select('id').single();
        if (error) throw new Error(error.message);
        await journal(db, 'evenement_creer', data.id as string);
        return NextResponse.json({ ok: true, id: data.id });
      }
      if (!UUID.test(id)) return refus('bad request');
      // L'adresse (slug) ne change pas : le lien déjà envoyé aux clients reste valable.
      const { data: avant } = await db.from('vsw_evenements').select('statut, debut').eq('id', id).maybeSingle();
      if (!avant) return refus('Atelier introuvable.', 404);
      if (avant.statut === 'annule') return refus('Cet atelier est annulé : créez-en un nouveau.');
      if (avant.statut === 'publie') {
        const manque = manquePourPublier(v.valeur);
        if (manque) return refus(manque);
      }
      const { error } = await db.from('vsw_evenements').update({ ...v.valeur, updated_at: maintenant }).eq('id', id);
      if (error) throw new Error(error.message);
      // Nouvelle date : le rappel de la veille repart pour la nouvelle date (les inscrits ne sont pas prévenus autrement).
      if (new Date(avant.debut as string).getTime() !== new Date(v.valeur.debut).getTime()) {
        await db.from('vsw_inscriptions').update({ rappel_envoye_at: null }).eq('evenement_id', id);
      }
      await journal(db, 'evenement_modifier', id);
      return NextResponse.json({ ok: true });
    }
    if (body?.op === 'statut') {
      const statut = body.statut;
      if (!UUID.test(id) || (statut !== 'publie' && statut !== 'brouillon')) return refus('bad request');
      const { data: e } = await db.from('vsw_evenements').select('statut, lieu_prive').eq('id', id).maybeSingle();
      if (!e) return refus('Atelier introuvable.', 404);
      if (e.statut === 'annule') return refus('Cet atelier est annulé.');
      if (statut === 'publie') {
        const manque = manquePourPublier({ lieu_prive: String(e.lieu_prive || '') });
        if (manque) return refus(manque);
      }
      if (statut === 'brouillon') {
        const { count } = await db.from('vsw_inscriptions').select('id', { count: 'exact', head: true }).eq('evenement_id', id).eq('statut', 'confirmee');
        if (count) return refus('Cet atelier a des inscrits : annulez-le plutôt (chacun reçoit un courriel).');
      }
      const { error } = await db.from('vsw_evenements').update({ statut, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw new Error(error.message);
      await journal(db, `evenement_${statut}`, id);
      return NextResponse.json({ ok: true });
    }
    if (body?.op === 'annuler') {
      if (!UUID.test(id)) return refus('bad request');
      const { data: e } = await db.from('vsw_evenements').select(COLONNES).eq('id', id).maybeSingle();
      if (!e) return refus('Atelier introuvable.', 404);
      if (e.statut === 'annule') return NextResponse.json({ ok: true, envoyes: 0, erreurs: 0 });
      const { error } = await db.from('vsw_evenements').update({ statut: 'annule', updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw new Error(error.message);
      await journal(db, 'evenement_annuler', id);
      let envoyes = 0;
      let erreurs = 0;
      // Un brouillon n'a pas d'inscrits ; un atelier déjà passé n'a rien à annoncer.
      if (e.statut === 'publie' && new Date(e.fin as string) > new Date()) {
        const { data: ins } = await db.from('vsw_inscriptions').select('id, nom, courriel').eq('evenement_id', id).eq('statut', 'confirmee').limit(500);
        for (const i of ins || []) {
          const r = await courrielAtelier(db, e as Evenement, i as { id: string; nom: string; courriel: string }, 'annulation');
          if ('echec' in r) erreurs++;
          else envoyes++;
        }
      }
      return NextResponse.json({ ok: true, envoyes, erreurs });
    }
    if (body?.op === 'inscription') {
      const statut = body.statut;
      if (!UUID.test(id) || (statut !== 'confirmee' && statut !== 'annulee')) return refus('bad request');
      if (statut === 'confirmee') {
        const { data: i } = await db.from('vsw_inscriptions').select('evenement_id').eq('id', id).maybeSingle();
        const { data: e } = i ? await db.from('vsw_evenements').select('places, statut').eq('id', i.evenement_id).maybeSingle() : { data: null };
        if (!e || e.statut === 'annule') return refus('Cet atelier est annulé.');
        const { count } = await db.from('vsw_inscriptions').select('id', { count: 'exact', head: true }).eq('evenement_id', i!.evenement_id).eq('statut', 'confirmee');
        if ((count || 0) >= (e.places as number)) return refus('L’atelier est complet : augmentez le nombre de places d’abord.');
      }
      const { error } = await db.from('vsw_inscriptions').update({ statut, annulee_at: statut === 'annulee' ? new Date().toISOString() : null }).eq('id', id);
      if (error) throw new Error(error.message);
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: `inscription_${statut}`, target_type: 'inscription', target_id: id }).then(() => undefined, () => undefined);
      return NextResponse.json({ ok: true });
    }
    return refus('bad request');
  } catch (e) {
    console.error('[admin] evenements :', e instanceof Error ? e.message : e);
    return refus('L’opération n’a pas pu être faite. Réessayez dans quelques minutes.', 500);
  }
}
