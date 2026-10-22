// Double vérification de /admin : lecture et écriture en base (vsw_settings, service_role seulement).
//   admin_totp_secret    secret TOTP CHIFFRÉ (AES-256-GCM, clé tirée d'ADMIN_SECRET) — absent tant que
//                        la double vérification n'est pas activée
//   admin_totp_last_step dernier pas de 30 s accepté (anti-rejeu, fonction vsw_totp_accept)
//   admin_backup_codes   empreintes HMAC des codes de secours restants (fonction vsw_use_backup_code)
// Le projet Supabase est partagé avec CSF : une fuite de la base seule ne donne ni le secret ni les codes.
// Téléphone ET codes de secours perdus : dans Supabase, supprimer la ligne admin_totp_secret de
// vsw_settings, puis se reconnecter AUSSITÔT pour réactiver (avant, quiconque a le code d'accès le peut).
import type { SupabaseClient } from '@supabase/supabase-js';
import { chiffrer, dechiffrer } from './mfa';

/** Secret TOTP déchiffré, ou null s'il n'y en a pas. Valeur illisible (ADMIN_SECRET changé) : erreur. */
export async function secretMfa(db: SupabaseClient, secretServeur: string): Promise<string | null> {
  const { data, error } = await db.from('vsw_settings').select('value').eq('key', 'admin_totp_secret').maybeSingle();
  if (error) throw new Error(error.message);
  if (typeof data?.value !== 'string' || !data.value) return null;
  const clair = dechiffrer(data.value, secretServeur);
  if (!clair) throw new Error('secret de double vérification illisible (ADMIN_SECRET a changé ?)');
  return clair;
}

/** La double vérification est-elle activée ? (sans déchiffrer) */
export async function mfaActivee(db: SupabaseClient): Promise<boolean> {
  const { data, error } = await db.from('vsw_settings').select('value').eq('key', 'admin_totp_secret').maybeSingle();
  if (error) throw new Error(error.message);
  return typeof data?.value === 'string' && Boolean(data.value);
}

/** Active (atomique). remplacer = false : échoue si un secret existe déjà. */
export async function activerMfa(
  db: SupabaseClient,
  secret: string,
  secretServeur: string,
  pas: number,
  empreintes: string[],
  remplacer: boolean,
): Promise<boolean> {
  return rpcBooleen(db, 'vsw_mfa_enroll', {
    p_secret: chiffrer(secret, secretServeur),
    p_step: pas,
    p_hashes: empreintes,
    p_replace: remplacer,
  });
}

const rpcBooleen = async (db: SupabaseClient, fn: string, args: Record<string, unknown>) => {
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data === true;
};

/** Accepte un pas de 30 s s'il est plus récent que le dernier utilisé (atomique). */
export const accepterPas = (db: SupabaseClient, pas: number) => rpcBooleen(db, 'vsw_totp_accept', { p_step: pas });

/** Consomme un code de secours (atomique) : vrai s'il était valide et inutilisé. */
export const utiliserCodeSecours = (db: SupabaseClient, empreinte: string) => rpcBooleen(db, 'vsw_use_backup_code', { p_hash: empreinte });

/** Compte un essai dans la fenêtre ; renvoie le total de la fenêtre. */
export async function compterEssai(db: SupabaseClient, cle: string, fenetreSecondes: number): Promise<number> {
  const { data, error } = await db.rpc('vsw_rate_limit_hit', { p_key: cle, p_window_seconds: fenetreSecondes });
  if (error) throw new Error(error.message);
  return Number(data) || 0;
}

/** Lit un compteur sans l'incrémenter (0 si aucune ligne). */
export async function lireCompteur(db: SupabaseClient, cle: string, fenetreSecondes: number): Promise<number> {
  const debut = new Date(Math.floor(Date.now() / 1000 / fenetreSecondes) * fenetreSecondes * 1000).toISOString();
  const { data, error } = await db.from('vsw_rate_limits').select('count').eq('key', cle).eq('window_start', debut).maybeSingle();
  if (error) throw new Error(error.message);
  return Number(data?.count) || 0;
}
