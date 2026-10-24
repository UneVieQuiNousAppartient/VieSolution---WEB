// Effacement d'une personne (Loi 25, droit à l'effacement ; accord de Camille du 2026-10-24) — côté
// serveur, service_role. Efface toutes les fiches de cette adresse et ce qui s'y rattache : notes et
// tâches (cascade), brouillons, notifications, passages des relances, courriels reçus et envoyés,
// inscriptions aux ateliers, rendez-vous, candidatures de stage, et les formulaires d'origine du site
// (contact, clavardage, devis, audit — seulement quand EFFACER_FORMULAIRES_SITE est vrai, voir plus bas).
// Seule reste une EMPREINTE du courriel (vsw_privacy_requests, « effacement ») : les relances et accusés
// ne partent plus jamais vers cette adresse. Les avis publiés n'ont pas de courriel : onglet Avis.
// Hors de la base, à faire à la main : l'événement Google Agenda, les journaux de Resend, la copie
// interne dans la boîte Gmail.
import type { SupabaseClient } from '@supabase/supabase-js';
import { secretDesabonnement } from './jeton';
import { createHmac } from 'node:crypto';
import { empreinteCourriel, motifExact } from './conservation';

/**
 * Formulaires d'origine du site (contact_requests, chatbot_leads, estimateur_requests, audit_requests) :
 * tables sans préfixe, mais propres au site de Vie Solution Web. Vérifié le 2026-10-24 : leur seul
 * déclencheur et la seule fonction SQL qui les lit sont ceux du CRM (trg_vsw_intake, fn_vsw_lead_intake ; vérifié dans la base de production) ; le site y écrit (actions.ts, /api/rdv/reserver) ;
 * Camille confirme que CSF a ses propres tables (« on avait différencié »). Exception écrite dans CLAUDE.md.
 */
export const EFFACER_FORMULAIRES_SITE = true;

/** Lignes d'une table dont la colonne courriel est exactement cette adresse (ILIKE échappé, puis filtre exact). */
async function idsParCourriel(db: SupabaseClient, table: string, colonne: string, courriel: string) {
  // `%…%` puis filtre exact sans les espaces autour : une adresse saisie avec des espaces est trouvée aussi.
  const { data, error } = await db.from(table).select(`id, ${colonne}`).ilike(colonne, `%${motifExact(courriel)}%`).limit(1000);
  if (error) throw new Error(`${table} : ${error.message}`);
  return ((data || []) as unknown as Record<string, unknown>[])
    .filter((r) => String(r[colonne] || '').trim().toLowerCase() === courriel)
    .map((r) => r.id as string);
}

async function supprimerIds(db: SupabaseClient, table: string, ids: string[]) {
  for (let i = 0; i < ids.length; i += 200) {
    const { error } = await db.from(table).delete().in('id', ids.slice(i, i + 200));
    if (error) throw new Error(`${table} : ${error.message}`);
  }
  return ids.length;
}

export type BilanEffacement = Record<string, number>;

/** Efface la personne de la fiche `leadId`. Renvoie le nombre de lignes effacées par table (sans aucune donnée). */
export async function effacerPersonne(db: SupabaseClient, leadId: string): Promise<BilanEffacement> {
  const { data: lead, error } = await db.from('vsw_leads').select('id, email').eq('id', leadId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!lead) throw Object.assign(new Error('fiche introuvable'), { introuvable: true });
  const courriel = String(lead.email || '').trim().toLowerCase();
  const cle = secretDesabonnement();
  if (courriel && !cle) throw new Error('UNSUBSCRIBE_SECRET ou CRON_SECRET manquant (empreinte du courriel)');

  // 1. L'empreinte d'abord : si la suite échoue, plus rien ne part quand même vers cette adresse.
  //    Une seule ligne par adresse ; « en_cours » jusqu'à la fin, avec l'identifiant de la clé utilisée
  //    (si UNSUBSCRIBE_SECRET changeait, on saurait quelles empreintes ne se reconnaissent plus).
  const empreinte = courriel ? empreinteCourriel(courriel, cle) : '';
  let demande: string | null = null;
  const cleId = cle ? createHmac('sha256', cle).update('kid').digest('hex').slice(0, 8) : '';
  if (empreinte) {
    const { data: deja, error: eD } = await db.from('vsw_privacy_requests').select('id').eq('kind', 'effacement').eq('email_hash', empreinte).limit(1);
    if (eD) throw new Error(`vsw_privacy_requests : ${eD.message}`);
    if (deja?.length) demande = deja[0].id as string;
    else {
      const { data: d, error: e } = await db.from('vsw_privacy_requests').insert({ kind: 'effacement', email_hash: empreinte, admin: 'Camille (admin)', summary: { statut: 'en_cours', cle: cleId } }).select('id').single();
      if (e) throw new Error(`vsw_privacy_requests : ${e.message}`);
      demande = d.id as string;
    }
  }

  const fiches = courriel ? [...new Set([leadId, ...(await idsParCourriel(db, 'vsw_leads', 'email', courriel))])] : [leadId];
  const bilan: BilanEffacement = { fiches: fiches.length };

  // 2. Ce qui pointe vers les fiches.
  for (const [table, colonne] of [['vsw_outreach_drafts', 'target_id'], ['vsw_notifications', 'lead_id'], ['vsw_automation_runs', 'lead_id'], ['vsw_email_messages', 'lead_id'], ['vsw_bookings', 'lead_id']] as const) {
    const { data, error: e } = await db.from(table).delete().in(colonne, fiches).select('id');
    if (e) throw new Error(`${table} : ${e.message}`);
    bilan[table] = (data || []).length;
  }

  // 3. Ce qui porte son courriel sans pointer vers une fiche.
  if (courriel) {
    const parCourriel: [string, string][] = [
      ['vsw_email_messages', 'from_email'], ['vsw_email_messages', 'to_email'], ['vsw_inscriptions', 'courriel'], ['vsw_bookings', 'email'],
      ['vsw_applications', 'email'],
      ...(EFFACER_FORMULAIRES_SITE ? ([['contact_requests', 'email'], ['chatbot_leads', 'email'], ['estimateur_requests', 'email'], ['audit_requests', 'email']] as [string, string][]) : []),
    ];
    for (const [table, colonne] of parCourriel) {
      bilan[table] = (bilan[table] || 0) + (await supprimerIds(db, table, await idsParCourriel(db, table, colonne, courriel)));
    }
  }

  // 3 bis. Notifications sans fiche (« Courriel reçu de <adresse> ») et journal de l'admin, où une
  //        conversation sans fiche est notée « adresse:<courriel> » : l'adresse ne reste nulle part.
  if (courriel) {
    const { data: notifs, error: eN } = await db.from('vsw_notifications').select('id, title').is('lead_id', null).ilike('title', `%${motifExact(courriel)}%`).limit(1000);
    if (eN) throw new Error(`vsw_notifications : ${eN.message}`);
    bilan.vsw_notifications = (bilan.vsw_notifications || 0) + (await supprimerIds(db, 'vsw_notifications', (notifs || []).filter((n) => String(n.title).toLowerCase().includes(courriel)).map((n) => n.id as string)));
    const { error: eA } = await db.from('vsw_admin_audit_log').update({ target_id: 'efface' }).eq('target_id', `adresse:${courriel}`);
    if (eA) throw new Error(`vsw_admin_audit_log : ${eA.message}`);
  }

  // 4. Les fiches (notes et tâches suivent, ON DELETE CASCADE).
  const { error: e4 } = await db.from('vsw_leads').delete().in('id', fiches);
  if (e4) throw new Error(`vsw_leads : ${e4.message}`);
  if (demande) await db.from('vsw_privacy_requests').update({ summary: { statut: 'fait', cle: cleId, bilan } }).eq('id', demande);
  return bilan;
}

/** Empreintes des personnes effacées (moteur des relances : ne plus jamais leur écrire). */
export async function empreintesEffacees(db: SupabaseClient): Promise<Set<string>> {
  const out = new Set<string>();
  for (let debut = 0; ; debut += 1000) {
    const { data, error } = await db.from('vsw_privacy_requests').select('email_hash').eq('kind', 'effacement').order('id').range(debut, debut + 999);
    if (error) throw new Error(error.message);
    for (const r of data || []) out.add(r.email_hash as string);
    if (!data || data.length < 1000) break;
  }
  return out;
}
