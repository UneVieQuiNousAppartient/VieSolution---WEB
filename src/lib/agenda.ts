// Google Agenda (étape C, choix de Camille du 2026-10-23 : « branché au site et au CRM », 7 jours sur 7,
// Google Meet automatique) — règles pures, testées par tests/agenda.test.mjs. Sans import : aussi
// utilisé par le navigateur (page /rdv, onglet de l'admin).

const FUSEAU = 'America/Toronto';

export type ReglagesAgenda = {
  /** Jours ouverts : 0 = dimanche … 6 = samedi. */
  jours: number[];
  /** « 09:00 » … « 17:00 », heure de Montréal. */
  debut: string;
  fin: string;
  /** Durée d'un appel, en minutes. */
  duree: number;
  /** Délai minimum avant un rendez-vous, en heures. */
  delaiHeures: number;
  /** Jusqu'à combien de jours à l'avance. */
  horizonJours: number;
};

/** Réglages par défaut (Camille, 2026-10-23 : « samedi et dimanche aussi ») — modifiables dans l'admin. */
export const REGLAGES_AGENDA_DEFAUT: ReglagesAgenda = { jours: [0, 1, 2, 3, 4, 5, 6], debut: '09:00', fin: '17:00', duree: 30, delaiHeures: 24, horizonJours: 30 };
export const CLE_REGLAGES_AGENDA = 'agenda_reglages';
export const CLE_JETON_GOOGLE = 'google_refresh_token';
export const NOMS_JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const HEURE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const minutes = (h: string) => {
  const r = HEURE.exec(h);
  return r ? Number(r[1]) * 60 + Number(r[2]) : NaN;
};

/** Valide les réglages saisis dans l'admin. */
export function validerReglagesAgenda(b: unknown): { ok: true; valeur: ReglagesAgenda } | { ok: false; erreur: string } {
  const o = (b && typeof b === 'object' ? b : {}) as Record<string, unknown>;
  const jours = Array.isArray(o.jours) ? [...new Set(o.jours.map(Number).filter((j) => Number.isInteger(j) && j >= 0 && j <= 6))].sort() : [];
  if (!jours.length) return { ok: false, erreur: 'Choisissez au moins un jour.' };
  const debut = typeof o.debut === 'string' ? o.debut : '';
  const fin = typeof o.fin === 'string' ? o.fin : '';
  if (!(minutes(debut) < minutes(fin))) return { ok: false, erreur: 'L’heure de fin doit suivre l’heure de début (ex. 09:00 à 17:00).' };
  const duree = Number(o.duree);
  if (![15, 20, 30, 45, 60].includes(duree)) return { ok: false, erreur: 'Durée : 15, 20, 30, 45 ou 60 minutes.' };
  if (minutes(fin) - minutes(debut) < duree) return { ok: false, erreur: 'La plage horaire est plus courte qu’un appel.' };
  const delaiHeures = Number(o.delaiHeures);
  if (!Number.isInteger(delaiHeures) || delaiHeures < 0 || delaiHeures > 168) return { ok: false, erreur: 'Délai minimum : de 0 à 168 heures.' };
  const horizonJours = Number(o.horizonJours);
  if (!Number.isInteger(horizonJours) || horizonJours < 1 || horizonJours > 90) return { ok: false, erreur: 'Réservation possible de 1 à 90 jours à l’avance.' };
  return { ok: true, valeur: { jours, debut, fin, duree, delaiHeures, horizonJours } };
}

/** Réglages lus en base (JSON) : invalides → défauts. */
export function lireReglagesAgenda(v: unknown): ReglagesAgenda {
  try {
    const r = validerReglagesAgenda(typeof v === 'string' ? JSON.parse(v) : v);
    return r.ok ? r.valeur : REGLAGES_AGENDA_DEFAUT;
  } catch {
    return REGLAGES_AGENDA_DEFAUT;
  }
}

// --- Heure de Montréal ------------------------------------------------------------------

const parties = (d: Date) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return { a: +p.year, m: +p.month, j: +p.day, h: +p.hour, min: +p.minute };
};

/** Jour (« 2026-11-12 ») et minute de la journée → instant UTC ; null si l'heure n'existe pas (changement d'heure). */
export function instantMontreal(jour: string, minuteDuJour: number): Date | null {
  const [a, m, j] = jour.split('-').map(Number);
  const voulu = Date.UTC(a, m - 1, j, Math.floor(minuteDuJour / 60), minuteDuJour % 60);
  let t = voulu;
  for (let i = 0; i < 3; i++) {
    const p = parties(new Date(t));
    t += voulu - Date.UTC(p.a, p.m - 1, p.j, p.h, p.min);
  }
  const p = parties(new Date(t));
  return Date.UTC(p.a, p.m - 1, p.j, p.h, p.min) === voulu ? new Date(t) : null;
}

export const jourDe = (d: Date) => {
  const { a, m, j } = parties(d);
  return `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
};
const jourSemaine = (jour: string) => new Date(`${jour}T12:00:00Z`).getUTCDay();
const ajouterJours = (jour: string, n: number) => {
  const [a, m, j] = jour.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10);
};

export type Occupe = { debut: string; fin: string };
export type Creneau = { debut: string; fin: string };

/**
 * Créneaux libres : jours ouverts, plage horaire, délai minimum et horizon, sans chevauchement avec
 * une période occupée de l'agenda (Google « freebusy »). Résultat trié, en instants UTC (ISO).
 */
export function creneauxLibres(r: ReglagesAgenda, occupes: Occupe[], maintenant: Date): Creneau[] {
  const premier = maintenant.getTime() + r.delaiHeures * 3_600_000;
  const dernier = maintenant.getTime() + r.horizonJours * 86_400_000;
  const occ = occupes.map((o) => [new Date(o.debut).getTime(), new Date(o.fin).getTime()] as const).filter(([a, b]) => b > a);
  const out: Creneau[] = [];
  const aujourdhui = jourDe(maintenant);
  for (let n = 0; n <= r.horizonJours; n++) {
    const jour = ajouterJours(aujourdhui, n);
    if (!r.jours.includes(jourSemaine(jour))) continue;
    for (let m = minutes(r.debut); m + r.duree <= minutes(r.fin); m += r.duree) {
      const d = instantMontreal(jour, m);
      const f = instantMontreal(jour, m + r.duree);
      if (!d || !f) continue;
      const a = d.getTime();
      const b = f.getTime();
      if (a < premier || a > dernier) continue;
      if (occ.some(([x, y]) => a < y && b > x)) continue;
      out.push({ debut: d.toISOString(), fin: f.toISOString() });
    }
  }
  return out;
}

/** Un créneau demandé par le visiteur fait-il partie des créneaux libres ? (vérifié côté serveur avant de réserver). */
export const creneauPermis = (debut: unknown, libres: Creneau[]) => typeof debut === 'string' && libres.some((c) => c.debut === debut);

/** Créneaux regroupés par jour de Montréal (affichage du calendrier de /rdv). */
export function parJour(creneaux: Creneau[]) {
  const m = new Map<string, Creneau[]>();
  for (const c of creneaux) {
    const j = jourDe(new Date(c.debut));
    m.set(j, [...(m.get(j) || []), c]);
  }
  return m;
}

/** « 14 h 30 » (heure de Montréal). */
export const heureLisible = (iso: string) => {
  const { h, min } = parties(new Date(iso));
  return min ? `${h} h ${String(min).padStart(2, '0')}` : `${h} h`;
};

/** « jeudi 12 novembre 2026 à 14 h 30 ». */
export const dateHeureLisible = (iso: string) =>
  `${new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))} à ${heureLisible(iso)}`;

// --- Réservation (formulaire de /rdv) ---------------------------------------------------

const COURRIEL = /^[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[a-z]{2,}$/i;
const nettoyer = (v: unknown, max: number) =>
  typeof v === 'string' ? Array.from(v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, max).join('').trim() : '';

export type Reservation = { debut: string; nom: string; courriel: string; telephone: string | null; sujet: string | null };

export function validerReservation(b: unknown): { ok: true; valeur: Reservation } | { ok: false; erreur: string } {
  const o = (b && typeof b === 'object' ? b : {}) as Record<string, unknown>;
  const debut = typeof o.debut === 'string' && !Number.isNaN(Date.parse(o.debut)) ? new Date(o.debut).toISOString() : '';
  if (!debut) return { ok: false, erreur: 'Choisissez un créneau.' };
  const nom = nettoyer(o.nom, 80);
  if (Array.from(nom).length < 2) return { ok: false, erreur: 'Indiquez votre nom.' };
  const courriel = nettoyer(o.courriel, 200).toLowerCase();
  if (!COURRIEL.test(courriel)) return { ok: false, erreur: 'Votre adresse courriel semble incomplète.' };
  const telephone = nettoyer(o.telephone, 30).replace(/[^\d+()\s.-]/g, '') || null;
  const sujet = nettoyer(o.sujet, 500) || null;
  return { ok: true, valeur: { debut, nom, courriel, telephone, sujet } };
}

/**
 * Événement Google Agenda (API v3). Texte FIXE : rien de ce que le visiteur écrit n'entre dans
 * l'invitation que Google envoie (revue securite du 2026-10-23 : sinon, n'importe qui pourrait faire
 * envoyer son propre texte, depuis le compte de Camille, à l'adresse de son choix). Le nom, le
 * téléphone et le sujet vont seulement dans la demande du CRM.
 */
export function evenementGoogle(r: Pick<Reservation, 'debut' | 'courriel'>, fin: string, idDemande: string) {
  return {
    summary: 'Appel découverte — Vie Solution Web',
    description: 'Appel découverte gratuit réservé sur viesolutionweb.ca. Le lien Google Meet est ci-dessous.',
    start: { dateTime: r.debut, timeZone: FUSEAU },
    end: { dateTime: fin, timeZone: FUSEAU },
    attendees: [{ email: r.courriel }],
    conferenceData: { createRequest: { requestId: `vsw-${idDemande}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    reminders: { useDefault: true },
  };
}

const JOURS_COURTS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS_LONGS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** « Jeu 12 novembre 2026 · 10:00 » (heure de Montréal) : le format que lit lireCreneau (crm/tableau.ts) pour l'admin. */
export function creneauPourCrm(iso: string) {
  const d = new Date(iso);
  const { a, m, j, h, min } = parties(d);
  const js = new Date(Date.UTC(a, m - 1, j)).getUTCDay();
  return `${JOURS_COURTS[js]} ${j} ${MOIS_LONGS[m - 1]} ${a} · ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}
