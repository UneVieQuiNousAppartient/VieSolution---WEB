// Boîte de réception de l'admin (étape B) — lectures partagées par /api/admin/courriels et la
// suggestion de l'IA. Côté serveur seulement (client Supabase service_role).
import type { SupabaseClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/site';
import { prenomDe, remplir } from './regles';
import { MODELES_REPONSE, lireCle } from './suggestion';

const CHAMPS = 'id, lead_id, direction, from_email, to_email, subject, snippet, body_text, received_at, message_id, attachments, traite_at, ignore_at';

export type FicheBoite = {
  id: string; name: string; email: string; company: string | null; need: string | null; status: string;
  source: string; consent_at: string | null; email_opt_out_at: string | null;
};

export type MessageComplet = {
  id: string; lead_id: string | null; direction: string; from_email: string; to_email: string | null; subject: string;
  snippet: string; body_text: string | null; received_at: string; message_id: string | null;
  attachments: { nom: string; taille: number | null }[]; traite_at: string | null; ignore_at: string | null;
};

const echapperIlike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Une conversation : la fiche (s'il y en a une) et ses courriels, du plus ancien au plus récent. */
export async function lireConversation(db: SupabaseClient, cle: unknown) {
  const c = lireCle(cle);
  if (!c) return null;
  let fiche: FicheBoite | null = null;
  let requete;
  if ('fiche' in c) {
    const { data, error } = await db
      .from('vsw_leads')
      .select('id, name, email, company, need, status, source, consent_at, email_opt_out_at')
      .eq('id', c.fiche)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    fiche = data as FicheBoite;
    requete = db.from('vsw_email_messages').select(CHAMPS).eq('lead_id', c.fiche);
  } else {
    const a = echapperIlike(c.adresse);
    requete = db.from('vsw_email_messages').select(CHAMPS).is('lead_id', null).or(`from_email.ilike.${a},to_email.ilike.${a}`);
  }
  const { data, error } = await requete.order('received_at', { ascending: true }).limit(100);
  if (error) throw new Error(error.message);
  const messages = ((data || []) as MessageComplet[]).filter(
    (m) => 'fiche' in c || [m.from_email, m.to_email].some((x) => String(x || '').toLowerCase() === c.adresse),
  );
  return { cle: 'fiche' in c ? `fiche:${c.fiche}` : `adresse:${c.adresse}`, adresse: 'adresse' in c ? c.adresse : fiche?.email || '', fiche, messages };
}

/** Modèles de réponse, {{prenom}} et {{lien_rdv}} déjà remplis pour cette personne. */
export async function modelesPour(db: SupabaseClient, nom: string | null) {
  const { data, error } = await db
    .from('vsw_email_templates')
    .select('key, subject, body')
    .eq('lang', 'fr')
    .in('key', MODELES_REPONSE.map((m) => m.cle));
  if (error) throw new Error(error.message);
  const vars = { prenom: prenomDe(nom), lien_rdv: `${SITE_URL}/rdv` };
  const parCle = new Map((data || []).map((t) => [t.key as string, t as { key: string; subject: string; body: string }]));
  return MODELES_REPONSE.filter((m) => parCle.has(m.cle)).map((m) => {
    const t = parCle.get(m.cle)!;
    return { cle: m.cle, libelle: m.libelle, sujet: remplir(t.subject, vars), corps: remplir(t.body, vars) };
  });
}

/**
 * Suggestion de réponse par l'IA : éteinte tant que Camille ne l'a pas allumée (réglage ia_courriels =
 * true dans vsw_settings), une fois la politique de confidentialité à jour — le courriel reçu part chez
 * Anthropic, hors Québec (Loi 25, revue securite du 2026-10-23).
 */
export async function suggestionIaActive(db: SupabaseClient) {
  if (!process.env.ANTHROPIC_API_KEY) return false;
  const { data, error } = await db.from('vsw_settings').select('value').eq('key', 'ia_courriels').maybeSingle();
  return !error && data?.value === true;
}
