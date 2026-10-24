// Conservation et effacement (Loi 25, accord de Camille du 2026-10-24) — règles pures, testées par
// tests/conservation.test.mjs. Rien ne s'efface tout seul : l'admin liste les fiches sans contact depuis
// 24 mois, Camille vérifie et supprime. Le bouton « Supprimer définitivement » de la fiche efface tout ce
// qui concerne la personne (crm/effacement.ts) ; seule une empreinte de son courriel reste, pour ne
// plus jamais lui écrire. Seul import : node:crypto.
import { createHmac } from 'node:crypto';

export const MOIS_CONSERVATION = 24;

type Dates = { created_at: string; status_changed_at?: string | null; last_contact_at?: string | null; relance_sent_at?: string | null };

/** Dernière activité d'une fiche : création, changement d'étape, dernier contact, dernière relance. */
export function derniereActivite(l: Dates) {
  const t = [l.created_at, l.status_changed_at, l.last_contact_at, l.relance_sent_at]
    .map((d) => (d ? new Date(d).getTime() : NaN))
    .filter((n) => Number.isFinite(n));
  return t.length ? new Date(Math.max(...t)) : null;
}

/** Sans activité depuis au moins `mois` mois civils (UTC) ? */
export function aConserverJusquau(l: Dates, mois = MOIS_CONSERVATION) {
  const d = derniereActivite(l);
  if (!d) return null;
  const f = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + mois, 1));
  const dernierJour = new Date(Date.UTC(f.getUTCFullYear(), f.getUTCMonth() + 1, 0)).getUTCDate();
  f.setUTCDate(Math.min(d.getUTCDate(), dernierJour));
  f.setUTCHours(d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
  return f;
}

export const aSupprimer = (l: Dates, maintenant: Date, mois = MOIS_CONSERVATION) => {
  const f = aConserverJusquau(l, mois);
  return Boolean(f && f.getTime() <= maintenant.getTime());
};

/** Empreinte du courriel d'une personne effacée (HMAC, jamais le courriel lui-même). '' sans secret. */
export const empreinteCourriel = (courriel: string, cle: string) =>
  cle && courriel.trim() ? createHmac('sha256', cle).update(`efface:${courriel.trim().toLowerCase()}`).digest('hex') : '';

/** Motif ILIKE échappé (aucun joker ne vise une autre adresse) ; le filtre exact se fait ensuite. */
export const motifExact = (courriel: string) => courriel.trim().toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`);
