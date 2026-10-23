// Boîte de réception de l'admin (étape B, maquette validée par Camille le 2026-10-23).
//   GET                         → conversations (celles qui ont au moins un courriel reçu)
//   GET ?cle=<fiche:…|adresse:…> → une conversation : fiche, courriels, modèles de réponse remplis
//   POST { op: 'repondre', cle, sujet, corps, modele? } → réponse dans le même fil, contact noté
//   POST { op: 'traiter', cle }  → courriels reçus marqués « traités »
//   POST { op: 'ignorer', cle }  → courriels reçus marqués « ignorés » (pourriel, publicité)
//   POST { op: 'creer_depuis', cle } → nouvelle demande (provenance « Courriel reçu ») pour un inconnu
// Accès : session complète de l'admin (code + double vérification) ; service_role côté serveur.
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { journaliser, noterContact } from '@/lib/crm/fiche';
import { envoyerCourrielFiche, type Lead } from '@/lib/crm/moteur';
import { lireConversation, modelesPour, suggestionIaActive } from '@/lib/crm/boite';
import { entetesFil, regrouperConversations, type MessageBoite } from '@/lib/crm/entrant';
import { accordManquant, sourceManuelle, validerReponse } from '@/lib/crm/saisie';
import { MODELES_REPONSE } from '@/lib/crm/suggestion';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });

type Db = ReturnType<typeof getAdminClient>;
const audit = (db: Db, action: string, cible: string, meta: Record<string, unknown> = {}) =>
  db.from('vsw_admin_audit_log').insert({ actor: 'admin', action, target_type: 'courriel', target_id: cible, meta }).then(() => undefined, () => undefined);

function garde(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  return null;
}

export async function GET(req: NextRequest) {
  const g = garde(req);
  if (g) return g;
  const db = getAdminClient();
  try {
    const cle = req.nextUrl.searchParams.get('cle');
    if (cle) {
      const conv = await lireConversation(db, cle);
      if (!conv) return refus('conversation introuvable', 404);
      const modeles = await modelesPour(db, conv.fiche?.name ?? null);
      return NextResponse.json({ ...conv, modeles, ia: await suggestionIaActive(db) });
    }
    // Les 90 derniers jours suffisent à la boîte ; l'historique complet reste sur chaque fiche.
    const depuis = new Date(Date.now() - 90 * 86_400_000).toISOString();
    const { data, error } = await db
      .from('vsw_email_messages')
      .select('id, lead_id, direction, from_email, to_email, subject, snippet, received_at, traite_at, ignore_at')
      .gte('received_at', depuis)
      .order('received_at', { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    const messages = (data || []) as MessageBoite[];
    const ids = [...new Set(messages.map((m) => m.lead_id).filter((x): x is string => Boolean(x)))];
    const noms = new Map<string, string>();
    if (ids.length) {
      const { data: leads, error: e2 } = await db.from('vsw_leads').select('id, name').in('id', ids);
      if (e2) throw new Error(e2.message);
      for (const l of leads || []) noms.set(l.id, l.name);
    }
    return NextResponse.json({ conversations: regrouperConversations(messages, noms) });
  } catch (e) {
    console.error('[admin] boîte :', e instanceof Error ? e.message : e);
    return refus('Boîte de réception illisible pour le moment.', 500);
  }
}

/** Courriels reçus de la conversation encore ouverts → traités (ou ignorés). */
async function fermer(db: Db, ids: string[], champ: 'traite_at' | 'ignore_at') {
  if (!ids.length) return;
  const { error } = await db.from('vsw_email_messages').update({ [champ]: new Date().toISOString() }).in('id', ids).eq('direction', 'in').is(champ, null);
  if (error) throw new Error(error.message);
}

export async function POST(req: NextRequest) {
  const g = garde(req);
  if (g) return g;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.op !== 'string') return refus('bad request');
  const db = getAdminClient();
  try {
    const conv = await lireConversation(db, body.cle);
    if (!conv) return refus('conversation introuvable', 404);
    const recus = conv.messages.filter((m) => m.direction === 'in');
    const ouverts = recus.filter((m) => !m.traite_at && !m.ignore_at).map((m) => m.id);

    if (body.op === 'traiter' || body.op === 'ignorer') {
      await fermer(db, ouverts, body.op === 'traiter' ? 'traite_at' : 'ignore_at');
      await audit(db, `boite_${body.op}`, conv.cle, { messages: ouverts.length });
      return NextResponse.json({ ok: true });
    }

    if (body.op === 'creer_depuis') {
      if (conv.fiche) return NextResponse.json({ ok: true, id: conv.fiche.id });
      const premier = recus[0];
      if (!premier) return refus('Aucun courriel reçu dans cette conversation.');
      // Une fiche ouverte existe déjà pour cette adresse (créée entre-temps) : on y relie les courriels.
      const { data: ouverte } = await db
        .from('vsw_leads')
        .select('id, email')
        .ilike('email', conv.adresse.replace(/[\\%_]/g, (c) => `\\${c}`))
        .not('status', 'in', '("Client","Perdu")')
        .limit(5);
      const existante = (ouverte || []).find((l) => String(l.email || '').toLowerCase() === conv.adresse);
      let id = existante?.id as string | undefined;
      if (!id) {
        const nom = typeof body.nom === 'string' && body.nom.trim() ? body.nom.trim().slice(0, 80) : conv.adresse.split('@')[0].slice(0, 80);
        const maintenant = new Date().toISOString();
        const { data: lead, error } = await db
          .from('vsw_leads')
          .insert({
            name: nom,
            email: conv.adresse,
            phone: '',
            need: `${premier.subject ? `${premier.subject}\n\n` : ''}${premier.body_text || premier.snippet}`.slice(0, 2000),
            source: sourceManuelle('Courriel reçu'),
            status: 'Nouveau',
            status_changed_at: maintenant,
          })
          .select('id')
          .single();
        if (error) throw new Error(error.message);
        id = lead.id as string;
        await journaliser(db, { lead_id: id, type: 'note', content: 'Demande créée depuis la boîte de réception (courriel reçu)', author: 'admin' });
      }
      const { error: e2 } = await db.from('vsw_email_messages').update({ lead_id: id }).in('id', conv.messages.map((m) => m.id)).is('lead_id', null);
      if (e2) throw new Error(e2.message);
      for (const m of recus) {
        await journaliser(db, { lead_id: id, type: 'email_in', content: `Courriel reçu : ${m.subject || '(sans objet)'}`, author: 'prospect', meta: { message: m.id } });
      }
      await audit(db, 'boite_creer_depuis', conv.cle, { lead: id, existante: Boolean(existante) });
      return NextResponse.json({ ok: true, id });
    }

    if (body.op === 'repondre') {
      if (!conv.fiche) return refus('Créez d’abord la demande avec ce courriel : la réponse sera rangée dans sa fiche.');
      const lead = conv.fiche;
      if (!lead.email) return refus('Cette fiche n’a pas de courriel.');
      // Répondre à quelqu'un qui nous a écrit est permis (LCAP) ; sinon, même règle que la fiche.
      const nousAEcrit = recus.some((m) => m.from_email.toLowerCase() === lead.email.toLowerCase());
      if (!nousAEcrit && accordManquant(lead)) {
        return refus('Cette personne n’a rien demandé et son accord n’est pas noté : la loi anti-pourriel interdit de lui écrire un courriel commercial. Notez d’abord son accord sur sa fiche.', 422);
      }
      const v = validerReponse(body);
      if (!v.ok) return refus(v.erreur);
      const modele = typeof body.modele === 'string' && MODELES_REPONSE.some((m) => m.cle === body.modele) ? body.modele : null;
      const dernierRecu = [...recus].reverse().find((m) => m.message_id);
      const empreinte = createHash('sha256').update(`${v.valeur.sujet}\n${v.valeur.corps}`).digest('hex').slice(0, 24);
      const { data: complet, error: eLead } = await db.from('vsw_leads').select('*').eq('id', lead.id).single();
      if (eLead) throw new Error(eLead.message);
      const r = await envoyerCourrielFiche(db, complet as Lead, v.valeur.sujet, v.valeur.corps, `vsw-boite-${lead.id}-${empreinte}`, {
        modele,
        entetes: entetesFil(dernierRecu?.message_id ?? null),
      });
      if ('refus' in r) return refus(r.refus, 422);
      if (r.deja) return NextResponse.json({ ok: true });
      await fermer(db, ouverts, 'traite_at');
      // Réponse de Camille : contact humain — arrête les relances automatiques, fait avancer l'étape.
      await noterContact(db, lead.id, 'courriel', `Réponse envoyée depuis la boîte de réception : ${v.valeur.sujet}`);
      await audit(db, 'boite_repondre', conv.cle, { modele });
      return NextResponse.json({ ok: true });
    }

    return refus('bad request');
  } catch (e) {
    console.error('[admin] boîte :', e instanceof Error ? e.message : e);
    return refus('L’opération n’a pas pu être faite. Réessayez dans quelques minutes.', 500);
  }
}
