// Page « Aujourd'hui » de /admin (reprise de KHI, lib/actionCenter.js, en plus simple) — fonctions
// pures, testées par tests/crm-aujourdhui.test.mjs. Quoi faire aujourd'hui, dans l'ordre : tâches en
// retard, tâches du jour, demandes sans contact depuis 24 h, dossiers « À relancer », brouillons à
// approuver, alertes.
// Sans import (Node exécute ce fichier tel quel dans les tests) : même fuseau que regles.ts.
const FUSEAU = 'America/Toronto';

const H = 3600 * 1000;

export type LeadResume = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  created_at: string;
  last_contact_at: string | null;
  email_opt_out_at: string | null;
};
export type Tache = { id: string; lead_id: string; title: string; due_at: string | null };
export type Brouillon = { id: string; target_id: string; status: string; subject: string; created_at: string };
export type Alerte = { id: string; title: string; body: string; created_at: string; lead_id?: string | null };

/** Instant (ISO) de la fin de la journée en cours, heure de Montréal. */
export const finDeJournee = (maintenant: Date = new Date()) => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: FUSEAU, hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' })
    .formatToParts(maintenant)
    .reduce<Record<string, number>>((acc, x) => (x.type === 'literal' ? acc : { ...acc, [x.type]: Number(x.value) }), {});
  const ecoule = ((p.hour * 60 + p.minute) * 60 + p.second) * 1000 + maintenant.getMilliseconds();
  return new Date(maintenant.getTime() - ecoule + 24 * H - 1).toISOString();
};

export type Aujourdhui = {
  enRetard: (Tache & { lead: LeadResume | null })[];
  duJour: (Tache & { lead: LeadResume | null })[];
  sansContact: LeadResume[];
  aRelancer: LeadResume[];
  brouillons: (Brouillon & { lead: LeadResume | null })[];
  alertes: Alerte[];
  total: number;
};

const parDate = <T>(cle: (x: T) => string | null) => (a: T, b: T) => String(cle(a) ?? '').localeCompare(String(cle(b) ?? ''));

export function construireAujourdhui(
  d: { leads: LeadResume[]; taches: Tache[]; brouillons: Brouillon[]; alertes: Alerte[] },
  maintenant: Date = new Date(),
): Aujourdhui {
  const parId = new Map(d.leads.map((l) => [l.id, l]));
  const n = maintenant.toISOString();
  const fin = finDeJournee(maintenant);
  const avecLead = (t: Tache) => ({ ...t, lead: parId.get(t.lead_id) ?? null });
  const taches = [...d.taches].filter((t) => t.due_at).sort(parDate((t) => t.due_at));
  const enRetard = taches.filter((t) => (t.due_at as string) < n).map(avecLead);
  const duJour = taches.filter((t) => (t.due_at as string) >= n && (t.due_at as string) <= fin).map(avecLead);
  const limite24h = new Date(maintenant.getTime() - 24 * H).toISOString();
  const sansContact = d.leads
    .filter((l) => l.status === 'Nouveau' && !l.last_contact_at && l.created_at <= limite24h)
    .sort(parDate((l) => l.created_at));
  const aRelancer = d.leads.filter((l) => l.status === 'À relancer').sort(parDate((l) => l.created_at));
  const brouillons = d.brouillons
    .filter((b) => b.status === 'pending')
    .sort(parDate((b) => b.created_at))
    .map((b) => ({ ...b, lead: parId.get(b.target_id) ?? null }));
  const alertes = [...d.alertes].sort(parDate((a) => a.created_at)).reverse();
  return {
    enRetard,
    duJour,
    sansContact,
    aRelancer,
    brouillons,
    alertes,
    total: enRetard.length + duJour.length + sansContact.length + aRelancer.length + brouillons.length + alertes.length,
  };
}

// --- réglage des relances (onglet « Relances ») ---------------------------------------

export const DELAI_MIN_JOURS = 1;
export const DELAI_MAX_JOURS = 90;

/**
 * Valide un réglage reçu de l'admin : { enabled?: boolean, delai_jours?: entier 1..90 }.
 * Renvoie le patch à écrire ({ enabled?, delay_hours? }) ou un message d'erreur.
 */
export function validerReglage(entree: unknown, delaiReglable: boolean): { patch: { enabled?: boolean; delay_hours?: number } } | { erreur: string } {
  if (!entree || typeof entree !== 'object') return { erreur: 'réglage manquant' };
  const e = entree as Record<string, unknown>;
  const patch: { enabled?: boolean; delay_hours?: number } = {};
  if ('enabled' in e) {
    if (typeof e.enabled !== 'boolean') return { erreur: 'marche/arrêt invalide' };
    patch.enabled = e.enabled;
  }
  if ('delai_jours' in e) {
    if (!delaiReglable) return { erreur: 'le délai de cette règle ne se règle pas' };
    const j = e.delai_jours;
    if (typeof j !== 'number' || !Number.isInteger(j) || j < DELAI_MIN_JOURS || j > DELAI_MAX_JOURS) {
      return { erreur: `délai invalide (de ${DELAI_MIN_JOURS} à ${DELAI_MAX_JOURS} jours)` };
    }
    patch.delay_hours = j * 24;
  }
  if (!Object.keys(patch).length) return { erreur: 'rien à changer' };
  return { patch };
}
