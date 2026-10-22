// Opérations sur une fiche (lead) partagées par le moteur, l'admin et le désabonnement.
// Côté serveur seulement (client Supabase service_role).
import type { SupabaseClient } from '@supabase/supabase-js';
import { statutApresContact } from './regles';

export const SYSTEME = 'système';

export type Activite = { lead_id: string; type: string; content: string; meta?: Record<string, unknown>; author?: string };

export async function journaliser(db: SupabaseClient, a: Activite) {
  const { error } = await db.from('vsw_lead_activities').insert({ meta: {}, author: SYSTEME, ...a });
  if (error) console.error('[crm] activité :', error.message);
}

/** next_action_at = échéance de la plus proche tâche ouverte (null s'il n'y en a plus). */
export async function recalculerProchaineAction(db: SupabaseClient, leadId: string) {
  const { data } = await db
    .from('vsw_lead_tasks')
    .select('due_at')
    .eq('lead_id', leadId)
    .is('done_at', null)
    .not('due_at', 'is', null)
    .order('due_at', { ascending: true })
    .limit(1);
  await db.from('vsw_leads').update({ next_action_at: data?.[0]?.due_at ?? null }).eq('id', leadId);
}

/** Crée une tâche pour l'équipe et avance next_action_at si elle est plus proche. */
export async function creerTache(
  db: SupabaseClient,
  lead: { id: string; assigned_to?: string | null; next_action_at?: string | null },
  titre: string,
  echeance: string,
  regle: string,
) {
  const { data, error } = await db
    .from('vsw_lead_tasks')
    .insert({ lead_id: lead.id, title: titre, due_at: echeance, assigned_to: lead.assigned_to ?? null, created_by: SYSTEME })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  if (!lead.next_action_at || echeance < lead.next_action_at) {
    await db.from('vsw_leads').update({ next_action_at: echeance }).eq('id', lead.id);
  }
  await journaliser(db, { lead_id: lead.id, type: 'tache', content: `Tâche créée : ${titre}`, meta: { automatic: true, regle, task_id: data.id } });
  return data.id as string;
}

/**
 * Contact humain saisi par l'équipe (appel, courriel, SMS, rendez-vous) : activité qui arrête les
 * relances automatiques, last_contact_at, et l'étape qui avance (Nouveau → Contacté, … → RDV).
 */
export async function noterContact(
  db: SupabaseClient,
  leadId: string,
  genre: 'appel' | 'courriel' | 'sms' | 'rdv',
  contenu: string,
  auteur = 'admin',
) {
  const { data: lead, error } = await db.from('vsw_leads').select('id, status').eq('id', leadId).single();
  if (error) throw new Error(error.message);
  const maintenant = new Date().toISOString();
  const statut = statutApresContact(lead.status, genre);
  const { error: e2 } = await db
    .from('vsw_leads')
    .update({ last_contact_at: maintenant, ...(statut ? { status: statut, status_changed_at: maintenant } : {}) })
    .eq('id', leadId);
  if (e2) throw new Error(e2.message);
  await journaliser(db, { lead_id: leadId, type: genre, content: contenu, author: auteur });
  return statut;
}

export const SOURCES_DESABONNEMENT = {
  lien: 'lien du courriel',
  'one-click': 'bouton de désabonnement de la messagerie',
  admin: "demande reçue par l'équipe",
} as const;
export type SourceDesabonnement = keyof typeof SOURCES_DESABONNEMENT;

/**
 * Désabonne une adresse : la fiche puis toutes les autres demandes du même courriel (casse
 * ignorée — la loi vise l'adresse). Idempotent : une fiche déjà désabonnée garde sa date.
 */
export async function desabonnerAdresse(
  db: SupabaseClient,
  lead: { id: string; email: string },
  source: SourceDesabonnement,
  auteur = SYSTEME,
) {
  const at = new Date().toISOString();
  const patch = { email_opt_out_at: at, email_opt_out_source: source };
  const email = lead.email.trim().toLowerCase();
  // Égalité exacte en minuscules (vsw_leads a un index sur lower(email)) : sélection large
  // par ILIKE échappé, puis filtre exact ici — aucun joker ne désabonne une autre adresse.
  const motif = email.replace(/[\\%_]/g, (c) => `\\${c}`);
  const { data: memes, error } = await db.from('vsw_leads').select('id, email').ilike('email', motif).is('email_opt_out_at', null);
  if (error) throw new Error(error.message);
  const ids = [lead.id, ...(memes || []).filter((r) => String(r.email).trim().toLowerCase() === email).map((r) => r.id as string)];
  const uniques = [...new Set(ids)];
  const { data: faits, error: e2 } = await db.from('vsw_leads').update(patch).in('id', uniques).is('email_opt_out_at', null).select('id');
  if (e2) throw new Error(e2.message);
  for (const row of faits || []) {
    await journaliser(db, {
      lead_id: row.id,
      type: 'systeme',
      content: `Désabonné des relances automatiques (${SOURCES_DESABONNEMENT[source]}${row.id !== lead.id ? ', depuis une autre demande de la même adresse' : ''})`,
      meta: { unsubscribe: true, source },
      author: auteur,
    });
  }
  return { at, lead_ids: (faits || []).map((r) => r.id as string) };
}
