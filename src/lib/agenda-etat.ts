// Jeton « state » de la connexion à Google Agenda (étape C) — testé par tests/agenda.test.mjs.
// « aléa.expiration.signature », signé HMAC avec ADMIN_SECRET, valable 10 minutes, posé en cookie
// et renvoyé par Google : seule une connexion lancée depuis l'admin, dans ce navigateur, aboutit.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const signer = (secret: string, corps: string) => createHmac('sha256', secret).update(`google-etat:${corps}`).digest('base64url');

export function etatSigne(secret: string, maintenant = Date.now()) {
  const corps = `${randomBytes(18).toString('base64url')}.${maintenant + 10 * 60_000}`;
  return `${corps}.${signer(secret, corps)}`;
}

export function verifierEtat(secret: string, recu: unknown, cookie: unknown, maintenant = Date.now()) {
  if (!secret || typeof recu !== 'string' || typeof cookie !== 'string' || !recu || recu !== cookie) return false;
  const i = recu.lastIndexOf('.');
  if (i < 0) return false;
  const corps = recu.slice(0, i);
  const a = Buffer.from(recu.slice(i + 1));
  const b = Buffer.from(signer(secret, corps));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(corps.split('.')[1]) > maintenant;
}
