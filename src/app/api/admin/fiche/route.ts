// Fiche détaillée d'une demande (étape A, maquette validée par Camille le 2026-10-23).
//   GET  ?id=<uuid>                         → la fiche, son historique, ses tâches, ses brouillons, ses courriels
//   POST { op: 'creer', … }                 → nouvelle demande ajoutée à la main (aucune relance sans accord noté)
//   POST { op: 'note', id, texte }          → note dans l'historique
//   POST { op: 'coordonnees', id, … }       → nom, courriel, téléphone, entreprise
//   POST { op: 'tache', id, titre, echeance } → tâche à 9 h (heure de Montréal) le jour choisi
//   POST { op: 'envoyer', id, sujet, corps, brouillon? } → courriel envoyé par Resend, contact noté
//   POST { op: 'accord', id }               → accord pour les courriels de suivi noté (fiche ajoutée à la main)
// Accès : session complète de l'admin (code + double vérification) ; service_role côté serveur.
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { journaliser, noterContact, recalculerProchaineAction } from '@/lib/crm/fiche';
import { envoyerCourrielFiche, type Lead } from '@/lib/crm/moteur';
import { instantLocal } from '@/lib/crm/tableau';
import {
  TEXTE_ACCORD_MANUEL,
  accordManquant,
  sourceManuelle,
  validerCoordonnees,
  validerNote,
  validerNouvelleDemande,
  validerReponse,
  validerTache,
} from '@/lib/crm/saisie';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });

const audit = (db: ReturnType<typeof getAdminClient>, action: string, id: string, meta: Record<string, unknown> = {}) =>
  db.from('vsw_admin_audit_log').insert({ actor: 'admin', action, target_type: 'lead', target_id: id, meta }).then(() => undefined, () => undefined);

function garde(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  return null;
}

export async function GET(req: NextRequest) {
  const g = garde(req);
  if (g) return g;
  const id = req.nextUrl.searchParams.get('id') || '';
  if (!UUID.test(id)) return refus('fiche inconnue');
  const db = getAdminClient();
  const [lead, activites, taches, brouillons, courriels] = await Promise.all([
    db.from('vsw_leads').select('*').eq('id', id).maybeSingle(),
    db.from('vsw_lead_activities').select('id, type, content, author, created_at').eq('lead_id', id).order('created_at', { ascending: false }).limit(100),
    db.from('vsw_lead_tasks').select('id, title, due_at, done_at, created_at').eq('lead_id', id).order('done_at', { ascending: true, nullsFirst: true }).order('due_at', { ascending: true }).limit(50),
    db.from('vsw_outreach_drafts').select('id, kind, subject, body, status, created_at').eq('target_id', id).order('created_at', { ascending: false }).limit(20),
    db.from('vsw_email_messages').select('id, direction, subject, snippet, received_at, created_at').eq('lead_id', id).order('created_at', { ascending: false }).limit(50),
  ]);
  const erreur = lead.error || activites.error || taches.error || brouillons.error || courriels.error;
  if (erreur) {
    console.error('[admin] fiche :', erreur.message);
    return refus('Fiche illisible pour le moment.', 500);
  }
  if (!lead.data) return refus('fiche introuvable', 404);
  return NextResponse.json({
    lead: lead.data,
    activites: activites.data ?? [],
    taches: taches.data ?? [],
    brouillons: brouillons.data ?? [],
    courriels: courriels.data ?? [],
  });
}

export async function POST(req: NextRequest) {
  const g = garde(req);
  if (g) return g;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.op !== 'string') return refus('bad request');
  const db = getAdminClient();
  const maintenant = new Date().toISOString();

  try {
    if (body.op === 'creer') {
      const v = validerNouvelleDemande(body);
      if (!v.ok) return refus(v.erreur);
      const d = v.valeur;
      if (d.courriel) {
        // Même règle que les formulaires du site : une seule fiche ouverte par courriel.
        const { data: ouverte } = await db
          .from('vsw_leads')
          .select('id')
          .ilike('email', d.courriel.replace(/[\\%_]/g, (c) => `\\${c}`))
          .not('status', 'in', '("Client","Perdu")')
          .limit(1);
        if (ouverte?.length) return NextResponse.json({ error: 'Une demande ouverte existe déjà pour ce courriel.', id: ouverte[0].id }, { status: 409 });
      }
      const { data: lead, error } = await db
        .from('vsw_leads')
        .insert({
          name: d.nom,
          email: d.courriel,
          phone: d.telephone,
          company: d.entreprise || null,
          need: d.besoin,
          source: sourceManuelle(d.provenance),
          status: d.dejaParle ? 'Contacté' : 'Nouveau',
          status_changed_at: maintenant,
          last_contact_at: d.dejaParle ? maintenant : null,
          consent_at: d.accord ? maintenant : null,
          consent_text: d.accord ? TEXTE_ACCORD_MANUEL : null,
        })
        .select('id')
        .single();
      if (error) throw error;
      await journaliser(db, { lead_id: lead.id, type: 'note', content: `Demande ajoutée à la main (${d.provenance})${d.accord ? ' — accord noté pour les courriels de suivi' : ''}`, author: 'admin' });
      if (d.dejaParle) await journaliser(db, { lead_id: lead.id, type: 'appel', content: 'Premier échange avant l’ajout de la fiche', author: 'admin' });
      if (d.rappel) {
        const due = instantLocal(d.rappel.annee, d.rappel.mois, d.rappel.jour, 9, 0).toISOString();
        await db.from('vsw_lead_tasks').insert({ lead_id: lead.id, title: `Recontacter ${d.nom}`, due_at: due, created_by: 'admin' });
        await recalculerProchaineAction(db, lead.id);
      }
      await audit(db, 'lead_creer', lead.id, { provenance: d.provenance, accord: d.accord });
      return NextResponse.json({ ok: true, id: lead.id });
    }

    const id = typeof body.id === 'string' ? body.id : '';
    if (!UUID.test(id)) return refus('fiche inconnue');
    const { data: lead, error: eLead } = await db.from('vsw_leads').select('*').eq('id', id).maybeSingle();
    if (eLead) throw eLead;
    if (!lead) return refus('fiche introuvable', 404);

    if (body.op === 'note') {
      const v = validerNote(body.texte);
      if (!v.ok) return refus(v.erreur);
      await journaliser(db, { lead_id: id, type: 'note', content: v.valeur, author: 'admin' });
      await audit(db, 'lead_note', id);
    } else if (body.op === 'coordonnees') {
      const v = validerCoordonnees(body);
      if (!v.ok) return refus(v.erreur);
      const c = v.valeur;
      const { error } = await db.from('vsw_leads').update({ name: c.nom, email: c.courriel, phone: c.telephone, company: c.entreprise || null }).eq('id', id);
      if (error) throw error;
      const changes = [
        lead.name !== c.nom && 'nom',
        String(lead.email || '').toLowerCase() !== c.courriel && 'courriel',
        (lead.phone || '') !== c.telephone && 'téléphone',
        (lead.company || '') !== c.entreprise && 'entreprise',
      ].filter(Boolean);
      if (changes.length) await journaliser(db, { lead_id: id, type: 'note', content: `Coordonnées modifiées : ${changes.join(', ')}`, author: 'admin' });
      await audit(db, 'lead_coordonnees', id, { champs: changes });
    } else if (body.op === 'tache') {
      const v = validerTache(body);
      if (!v.ok) return refus(v.erreur);
      const due = instantLocal(v.valeur.date.annee, v.valeur.date.mois, v.valeur.date.jour, 9, 0).toISOString();
      const { error } = await db.from('vsw_lead_tasks').insert({ lead_id: id, title: v.valeur.titre, due_at: due, created_by: 'admin' });
      if (error) throw error;
      await recalculerProchaineAction(db, id);
      await journaliser(db, { lead_id: id, type: 'tache', content: `Tâche ajoutée : ${v.valeur.titre}`, author: 'admin' });
      await audit(db, 'lead_tache', id);
    } else if (body.op === 'envoyer') {
      const v = validerReponse(body);
      if (!v.ok) return refus(v.erreur);
      if (!lead.email) return refus('Cette fiche n’a pas de courriel.');
      if (accordManquant(lead)) {
        return refus('Cette personne n’a rien demandé et son accord n’est pas noté : la loi anti-pourriel interdit de lui écrire un courriel commercial. Notez d’abord son accord.', 422);
      }
      const brouillon = typeof body.brouillon === 'string' && UUID.test(body.brouillon) ? body.brouillon : null;
      // Même texte renvoyé deux fois (double clic) dans les 24 h : un seul envoi (idempotence Resend).
      const empreinte = createHash('sha256').update(`${v.valeur.sujet}\n${v.valeur.corps}`).digest('hex').slice(0, 24);
      const r = await envoyerCourrielFiche(db, lead as Lead, v.valeur.sujet, v.valeur.corps, `vsw-fiche-${id}-${empreinte}`);
      if ('refus' in r) return refus(r.refus, 422);
      if (r.deja) return NextResponse.json({ ok: true });
      if (brouillon) {
        await db.from('vsw_outreach_drafts').update({ status: 'sent', approved_by: 'admin', approved_at: maintenant, sent_email_id: r.id, subject: v.valeur.sujet, body: v.valeur.corps })
          .eq('id', brouillon).eq('target_id', id).in('status', ['pending', 'approved']);
      }
      // Courriel envoyé par Camille : contact humain — arrête les relances automatiques.
      await noterContact(db, id, 'courriel', `Courriel envoyé depuis la fiche : ${v.valeur.sujet}`);
      await audit(db, 'lead_envoyer', id, { brouillon });
    } else if (body.op === 'accord') {
      if (!lead.email) return refus('Cette fiche n’a pas de courriel.');
      if (lead.consent_at) return NextResponse.json({ ok: true });
      const { error } = await db.from('vsw_leads').update({ consent_at: maintenant, consent_text: TEXTE_ACCORD_MANUEL }).eq('id', id).is('consent_at', null);
      if (error) throw error;
      await journaliser(db, { lead_id: id, type: 'note', content: 'Accord noté pour les courriels de suivi', author: 'admin' });
      await audit(db, 'lead_accord', id);
    } else {
      return refus('bad request');
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin] fiche :', e instanceof Error ? e.message : e);
    return refus('L’opération n’a pas pu être faite. Réessayez dans quelques minutes.', 500);
  }
}
