// Jeton du lien de désabonnement (LCAP) — sans état, testé par tests/crm-regles.test.mjs.
//
// Jeton = HMAC-SHA256 de « lead_id:courriel en minuscules » (repris de KHI, lib/unsubscribe.js) :
// aucune table de jetons ; le lien reste valable tant que la fiche garde le même courriel (la loi
// exige au moins 60 jours après l'envoi) et ne désabonne que cette adresse.
// Secret : UNSUBSCRIBE_SECRET (16 caractères ou plus), sinon CRON_SECRET. Changer le secret
// invalide les liens déjà envoyés : en production, préférer un UNSUBSCRIBE_SECRET dédié.
import { createHmac, timingSafeEqual } from 'node:crypto';

const MIN_SECRET = 16;

export const secretDesabonnement = (env: Record<string, string | undefined> = process.env): string => {
  if ((env.UNSUBSCRIBE_SECRET || '').length >= MIN_SECRET) return env.UNSUBSCRIBE_SECRET as string;
  if ((env.CRON_SECRET || '').length >= MIN_SECRET) return env.CRON_SECRET as string;
  return '';
};

const charge = (leadId: string, email: string) => `${leadId}:${email.trim().toLowerCase()}`;

/** Jeton du lien ("" sans secret, sans lead ou sans courriel). */
export const jetonDesabonnement = (leadId: string | null | undefined, email: string | null | undefined, cle: string): string =>
  cle && leadId && email ? createHmac('sha256', cle).update(charge(leadId, email)).digest('base64url') : '';

/** Vérifie un jeton reçu, en temps constant. */
export const jetonValide = (
  leadId: string | null | undefined,
  email: string | null | undefined,
  jeton: unknown,
  cle: string,
): boolean => {
  const attendu = jetonDesabonnement(leadId, email, cle);
  if (!attendu || typeof jeton !== 'string' || !jeton) return false;
  const a = Buffer.from(attendu);
  const b = Buffer.from(jeton);
  return a.length === b.length && timingSafeEqual(a, b);
};

/** Lien absolu https du désabonnement, ou "" (un lien relatif dans un courriel ne mène nulle part). */
export const lienDesabonnement = (site: string, leadId: string, email: string, cle: string): string => {
  const t = jetonDesabonnement(leadId, email, cle);
  if (!t || !/^https:\/\//.test(site)) return '';
  return `${site}/api/desabonnement?l=${encodeURIComponent(leadId)}&t=${t}`;
};

/** En-têtes RFC 2369 + RFC 8058 (bouton « Se désabonner » de Gmail, Outlook, Apple Mail). */
export const entetesDesabonnement = (lien: string): Record<string, string> =>
  /^https:\/\//.test(lien) ? { 'List-Unsubscribe': `<${lien}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : {};

/** Comparaison en temps constant de deux secrets (route du cron). */
export const memeSecret = (recu: string, attendu: string): boolean => {
  if (!recu || !attendu) return false;
  const a = Buffer.from(recu);
  const b = Buffer.from(attendu);
  return a.length === b.length && timingSafeEqual(a, b);
};
