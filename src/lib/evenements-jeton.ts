// Lien « libérer ma place » des courriels d'atelier (étape F) — côté serveur, testé par
// tests/evenements.test.mjs. Sans table de jetons : HMAC de l'inscription et du courriel.
import { createHmac, timingSafeEqual } from 'node:crypto';

export const jetonPlace = (inscriptionId: string, courriel: string, cle: string) =>
  cle && inscriptionId && courriel ? createHmac('sha256', cle).update(`place:${inscriptionId}:${courriel.trim().toLowerCase()}`).digest('base64url') : '';

export function jetonPlaceValide(inscriptionId: string, courriel: string, jeton: unknown, cle: string) {
  const attendu = jetonPlace(inscriptionId, courriel, cle);
  if (!attendu || typeof jeton !== 'string') return false;
  const a = Buffer.from(attendu);
  const b = Buffer.from(jeton);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const lienLiberer = (site: string, inscriptionId: string, courriel: string, cle: string) => {
  const t = jetonPlace(inscriptionId, courriel, cle);
  return t && /^https:\/\//.test(site) ? `${site}/evenements/liberer?i=${encodeURIComponent(inscriptionId)}&t=${t}` : '';
};
