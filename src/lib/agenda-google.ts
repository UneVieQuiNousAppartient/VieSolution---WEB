// Google Agenda (étape C) — côté serveur seulement. Connexion OAuth de Camille (une fois, depuis
// l'admin), jeton de renouvellement CHIFFRÉ avec ADMIN_SECRET dans vsw_settings (comme le secret de
// double vérification), lecture des périodes occupées (freeBusy), création du rendez-vous avec lien
// Google Meet (Google envoie l'invitation au client). Variables : GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// (saisies par Camille dans Vercel). Aucune dépendance : appels HTTP directs aux API Google.
import type { SupabaseClient } from '@supabase/supabase-js';
import { chiffrer, dechiffrer } from '@/lib/admin/mfa';
import { etatSigne, verifierEtat } from '@/lib/agenda-etat';
import { SITE_URL } from '@/lib/site';
import { CLE_JETON_GOOGLE, CLE_REGLAGES_AGENDA, lireReglagesAgenda, type Occupe, type ReglagesAgenda } from '@/lib/agenda';

export const REDIRECTION = `${SITE_URL}/api/admin/google/retour`;
const PORTEES = ['openid', 'email', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.freebusy'];
export const COOKIE_ETAT = 'vsw_google_etat';
const CLE_COMPTE = 'google_compte';

const secretServeur = () => process.env.ADMIN_SECRET || '';
export const googleConfigure = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && secretServeur().length >= 32);

// --- Jeton anti-falsification de la connexion (state OAuth) : ./agenda-etat (testé) --------

export const nouvelEtat = (maintenant = Date.now()) => etatSigne(secretServeur(), maintenant);
export const etatValide = (recu: unknown, cookie: unknown, maintenant = Date.now()) => verifierEtat(secretServeur(), recu, cookie, maintenant);

export function urlAutorisation(etat: string) {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: REDIRECTION,
    response_type: 'code',
    scope: PORTEES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state: etat,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

// --- Jetons ------------------------------------------------------------------------------

async function jetonPost(params: Record<string, string>) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID || '', client_secret: process.env.GOOGLE_CLIENT_SECRET || '', ...params }),
  });
  const j = (await r.json().catch(() => ({}))) as { access_token?: string; refresh_token?: string; expires_in?: number; id_token?: string; error?: string };
  if (!r.ok || !j.access_token) throw new Error(`google jeton ${r.status} ${j.error || ''}`.trim());
  return j;
}

/** Courriel du compte connecté, lu dans l'id_token reçu directement de Google (canal TLS, pas de vérification de signature nécessaire). */
const courrielDuJeton = (idToken?: string) => {
  try {
    const charge = JSON.parse(Buffer.from(String(idToken).split('.')[1], 'base64url').toString('utf8')) as { email?: string };
    return typeof charge.email === 'string' ? charge.email.slice(0, 200) : '';
  } catch {
    return '';
  }
};

/** Retour de Google : échange le code, garde le jeton de renouvellement chiffré. */
export async function enregistrerConnexion(db: SupabaseClient, code: string) {
  const j = await jetonPost({ code, grant_type: 'authorization_code', redirect_uri: REDIRECTION });
  if (!j.refresh_token) throw new Error('google : pas de jeton de renouvellement (accès déjà accordé ?)');
  const maintenant = new Date().toISOString();
  const lignes = [
    { key: CLE_JETON_GOOGLE, value: chiffrer(j.refresh_token, secretServeur()), updated_at: maintenant, updated_by: 'Camille (admin)' },
    { key: CLE_COMPTE, value: courrielDuJeton(j.id_token), updated_at: maintenant, updated_by: 'Camille (admin)' },
  ];
  const { error } = await db.from('vsw_settings').upsert(lignes);
  if (error) throw new Error(error.message);
  cache = null;
  occupesCache = null;
}

// Jeton d'accès gardé en mémoire avec la valeur chiffrée dont il vient : une reconnexion ou une
// déconnexion faite sur une autre instance l'invalide au prochain appel (revue securite).
let cache: { jeton: string; expire: number; source: string } | null = null;

async function jetonAcces(db: SupabaseClient) {
  const { data } = await db.from('vsw_settings').select('value').eq('key', CLE_JETON_GOOGLE).maybeSingle();
  const source = typeof data?.value === 'string' ? data.value : '';
  if (cache && cache.source === source && cache.expire > Date.now() + 60_000) return cache.jeton;
  const refresh = source ? dechiffrer(source, secretServeur()) : null;
  if (!refresh) throw new Error('google non connecté');
  const j = await jetonPost({ refresh_token: refresh, grant_type: 'refresh_token' });
  cache = { jeton: j.access_token as string, expire: Date.now() + (j.expires_in || 3600) * 1000, source };
  return cache.jeton;
}

export async function etatConnexion(db: SupabaseClient) {
  const { data } = await db.from('vsw_settings').select('key, value').in('key', [CLE_JETON_GOOGLE, CLE_COMPTE, CLE_REGLAGES_AGENDA]);
  const v = new Map((data || []).map((r) => [r.key as string, r.value]));
  return { connecte: Boolean(v.get(CLE_JETON_GOOGLE)), compte: typeof v.get(CLE_COMPTE) === 'string' ? (v.get(CLE_COMPTE) as string) : '', reglages: lireReglagesAgenda(v.get(CLE_REGLAGES_AGENDA)) };
}

export async function lireReglages(db: SupabaseClient): Promise<ReglagesAgenda> {
  const { data } = await db.from('vsw_settings').select('value').eq('key', CLE_REGLAGES_AGENDA).maybeSingle();
  return lireReglagesAgenda(data?.value);
}

/** Déconnexion : Google révoque l'accès (jeton dans le corps, pas dans l'adresse), la ligne chiffrée est supprimée. Renvoie false si Google n'a pas confirmé la révocation. */
export async function deconnecter(db: SupabaseClient) {
  const { data } = await db.from('vsw_settings').select('value').eq('key', CLE_JETON_GOOGLE).maybeSingle();
  const refresh = typeof data?.value === 'string' ? dechiffrer(data.value, secretServeur()) : null;
  let revoque = !refresh;
  if (refresh) {
    const r = await fetch('https://oauth2.googleapis.com/revoke', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ token: refresh }) }).catch(() => null);
    revoque = Boolean(r?.ok);
  }
  const { error } = await db.from('vsw_settings').delete().in('key', [CLE_JETON_GOOGLE, CLE_COMPTE]);
  if (error) throw new Error(error.message);
  cache = null;
  occupesCache = null;
  return revoque;
}

// --- Agenda ------------------------------------------------------------------------------

// Périodes occupées gardées 60 s en mémoire pour la page publique (une rafale de visites ne vide pas le
// quota Google, revue securite) ; la réservation, elle, relit toujours l'agenda (« frais »).
let occupesCache: { at: number; de: number; a: number; occupes: Occupe[] } | null = null;

/** Périodes occupées de l'agenda principal entre deux instants. */
export async function periodesOccupees(db: SupabaseClient, de: Date, a: Date, frais = false): Promise<Occupe[]> {
  const c = occupesCache;
  if (!frais && c && Date.now() - c.at < 60_000 && c.de <= de.getTime() + 60_000 && c.a >= a.getTime() - 60_000) return c.occupes;
  const jeton = await jetonAcces(db);
  const r = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin: de.toISOString(), timeMax: a.toISOString(), timeZone: 'America/Toronto', items: [{ id: 'primary' }] }),
  });
  const j = (await r.json().catch(() => ({}))) as { calendars?: { primary?: { busy?: { start: string; end: string }[]; errors?: unknown[] } } };
  if (!r.ok || j.calendars?.primary?.errors?.length) throw new Error(`google freeBusy ${r.status}`);
  const occupes = (j.calendars?.primary?.busy || []).map((b) => ({ debut: b.start, fin: b.end }));
  occupesCache = { at: Date.now(), de: de.getTime(), a: a.getTime(), occupes };
  return occupes;
}

/** Crée le rendez-vous (lien Meet, invitation envoyée par Google au client). */
export async function creerRendezVous(db: SupabaseClient, evenement: object) {
  const jeton = await jetonAcces(db);
  const r = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(evenement),
  });
  const j = (await r.json().catch(() => ({}))) as { id?: string; hangoutLink?: string; htmlLink?: string };
  if (!r.ok || !j.id) throw new Error(`google événement ${r.status}`);
  occupesCache = null;
  return { id: j.id, meet: typeof j.hangoutLink === 'string' && /^https:\/\/meet\.google\.com\//.test(j.hangoutLink) ? j.hangoutLink : '' };
}
