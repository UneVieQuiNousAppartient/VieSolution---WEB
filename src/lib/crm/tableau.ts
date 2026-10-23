// Tableau de bord de /admin (maquette validée par Camille le 2026-10-23) — fonctions pures, testées par
// tests/crm-tableau.test.mjs. Tuiles (nouvelles demandes, tâches en retard, rendez-vous, clients),
// courbe par semaine, provenance des demandes, « À appeler maintenant », rendez-vous du jour.
// Sans import (Node exécute ce fichier tel quel dans les tests) : même fuseau que regles.ts, et la liste
// des sujets de stage recopiée de regles.ts (SUJETS_HORS_PROSPECTION, test de parité).
const FUSEAU = 'America/Toronto';
const H = 3600 * 1000;
const J = 24 * H;

export const PERIODES = [7, 30, 90] as const;
export type Periode = (typeof PERIODES)[number];

/** Sujets qui ne sont pas des demandes de clients (copie de SUJETS_HORS_PROSPECTION, regles.ts). */
export const SUJETS_STAGE = ['candidature-stage'] as const;

export type LeadTableau = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  service_interest: string;
  need: string;
  created_at: string;
  status_changed_at: string | null;
  last_contact_at: string | null;
  tags?: string[] | null;
};
export type TacheTableau = { id: string; lead_id: string; title: string; due_at: string | null };
export type BrouillonTableau = { status: string };

export const estStage = (l: Pick<LeadTableau, 'service_interest'>) =>
  (SUJETS_STAGE as readonly string[]).includes(String(l.service_interest || '').trim());
/** Étiquette posée sur une fiche de prospection : elle reste quand la fiche passe à « Contacté », « Client »… */
export const ETIQUETTE_PROSPECTION = 'prospection';
/**
 * Fiche de prospection (personne que Camille est allée chercher) : à part dans les statistiques des demandes
 * reçues et du taux de conversion (accord de Camille du 2026-10-23) ; comptée dans les clients gagnés.
 */
export const estProspection = (l: Pick<LeadTableau, 'status' | 'tags'>) =>
  l.status === 'Prospect' || (l.tags ?? []).includes(ETIQUETTE_PROSPECTION);
export const estRdv = (l: Pick<LeadTableau, 'service_interest'>) => String(l.service_interest || '').trim() === 'rdv-decouverte';

// --- dates, heure de Montréal -------------------------------------------------------------

type Parties = { annee: number; mois: number; jour: number; heure: number; minute: number; seconde: number };

const partiesLocales = (d: Date): Parties => {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSEAU, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
  })
    .formatToParts(d)
    .reduce<Record<string, number>>((acc, x) => (x.type === 'literal' ? acc : { ...acc, [x.type]: Number(x.value) }), {});
  return { annee: p.year, mois: p.month, jour: p.day, heure: p.hour, minute: p.minute, seconde: p.second };
};

/** Écart entre l'heure de Montréal et l'heure UTC à cet instant (ms ; négatif : Montréal est en retard). */
const decalage = (t: number) => {
  const p = partiesLocales(new Date(t));
  return Date.UTC(p.annee, p.mois - 1, p.jour, p.heure, p.minute, p.seconde) - (t - (t % 1000));
};

/** Instant correspondant à une heure de Montréal (jour hors bornes accepté : 32 octobre = 1er novembre). */
export const instantLocal = (annee: number, mois: number, jour: number, heure = 0, minute = 0): Date => {
  const naif = Date.UTC(annee, mois - 1, jour, heure, minute);
  const d1 = decalage(naif);
  let t = naif - d1;
  const d2 = decalage(t);
  if (d2 !== d1) t = naif - d2;
  return new Date(t);
};

/** Minuit (Montréal) du jour de `d`, décalé de `n` jours. */
export const debutDuJour = (d: Date, n = 0) => {
  const p = partiesLocales(d);
  return instantLocal(p.annee, p.mois, p.jour + n);
};

/** Lundi 0 h (Montréal) de la semaine de `d`. */
export const debutDeSemaine = (d: Date) => {
  const p = partiesLocales(d);
  const jourSemaine = new Date(Date.UTC(p.annee, p.mois - 1, p.jour)).getUTCDay(); // 0 = dimanche
  return instantLocal(p.annee, p.mois, p.jour - ((jourSemaine + 6) % 7));
};

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** « 4 août », « 1er sept. » : étiquette d'une semaine sur la courbe. */
export const etiquetteJour = (d: Date) => {
  const p = partiesLocales(d);
  return `${p.jour === 1 ? '1er' : p.jour} ${MOIS_COURTS[p.mois - 1]}`;
};

/**
 * Créneau choisi dans le calendrier de /rdv (src/components/vsw/booking.tsx), lu dans le texte de la
 * demande : « … — Mar 28 octobre 2026 · 10:00 » (heure de Montréal). null si le texte n'en contient pas.
 */
export const lireCreneau = (texte: string | null | undefined): Date | null => {
  const m = String(texte || '').match(/\b(?:Dim|Lun|Mar|Mer|Jeu|Ven|Sam) (\d{1,2}) ([a-zéû]+) (\d{4}) · (\d{2}):(\d{2})\b/);
  if (!m) return null;
  const mois = MOIS.indexOf(m[2]) + 1;
  const [jour, annee, heure, minute] = [Number(m[1]), Number(m[3]), Number(m[4]), Number(m[5])];
  if (!mois || jour < 1 || jour > 31 || heure > 23 || minute > 59) return null;
  return instantLocal(annee, mois, jour, heure, minute);
};

/** « Moment souhaité » d'une demande de rendez-vous faite par la bulle IA (messagePourCrm, chat/regles.ts). */
export const lireMomentSouhaite = (texte: string | null | undefined): string | null => {
  const m = String(texte || '').match(/Moment souhaité : ([^\n]+)/);
  const moment = m?.[1].trim() ?? '';
  return moment && moment !== 'non précisé' ? moment.slice(0, 120) : null;
};

// --- provenance ----------------------------------------------------------------------------

export const SOURCES = [
  { cle: 'contact', libelle: 'Formulaire de contact' },
  { cle: 'rdv', libelle: 'Demande de rendez-vous' },
  { cle: 'chatbot', libelle: 'Bulle de clavardage' },
  { cle: 'devis', libelle: '« Combien ça coûte ? »' },
  { cle: 'audit', libelle: 'Diagnostic' },
  { cle: 'manuel', libelle: 'Ajoutée à la main' },
  { cle: 'autre', libelle: 'Autres' },
] as const;
export type CleSource = (typeof SOURCES)[number]['cle'];

/** « site web — rdv » → 'rdv' ; « admin — … » (ajout à la main, saisie.ts) → 'manuel' ; le reste → 'autre'. */
export const cleSource = (source: string | null | undefined): CleSource => {
  if (String(source || '').startsWith('admin —')) return 'manuel';
  const fin = String(source || '').split('—').pop()?.trim() ?? '';
  return (SOURCES.some((s) => s.cle === fin) ? fin : 'autre') as CleSource;
};

// --- tableau ------------------------------------------------------------------------------

export type Priorite = 'Urgente' | 'Haute' | 'Normale';
export type RaisonAppel = 'jamais_contacte' | 'a_relancer' | 'tache_en_retard';

export type Tableau = {
  periode: Periode;
  /** Instant du calcul (ISO) : sert aux « il y a 5 h » de l'écran. */
  maintenant: string;
  nouvelles: { n: number; precedent: number; serie: number[]; jamaisContactees: number };
  retard: { n: number; sansContact24h: number };
  rdv: { n: number; aujourdhui: number; parJour: number[] };
  clients: { n: number; sur: number; taux: number | null; gagnes: number };
  semaines: { debut: string; etiquette: string; demandes: number; rdv: number }[];
  sources: { cle: CleSource; libelle: string; n: number }[];
  aAppeler: { lead: LeadTableau; priorite: Priorite; raison: RaisonAppel }[];
  rendezVous: { lead: LeadTableau; creneau: string; demain: boolean }[];
  rdvAConfirmer: { lead: LeadTableau; moment: string | null }[];
  brouillons: number;
  prospection: { enCours: number; gagnes: number };
  compteurs: { demandes: number; clients: number; rdv: number; stages: number; taches: number };
};

const RANG: Record<Priorite, number> = { Urgente: 0, Haute: 1, Normale: 2 };
const FERMES = ['Client', 'Perdu'];

export function construireTableau(
  d: { leads: LeadTableau[]; taches: TacheTableau[]; brouillons: BrouillonTableau[] },
  periode: Periode,
  maintenant: Date = new Date(),
): Tableau {
  const n = maintenant.getTime();
  const iso = (t: number) => new Date(t).toISOString();
  const debut = n - periode * J;
  const prospects = d.leads.filter((l) => !estStage(l));
  const entre = (x: string | null, de: number, a: number) => x !== null && x >= iso(de) && x < iso(a);
  // Demandes reçues : sans la prospection (ce ne sont pas des demandes), pour un taux de conversion juste.
  const demandes = prospects.filter((l) => !estProspection(l));
  const recues = demandes.filter((l) => entre(l.created_at, debut, n + 1));

  // Nouvelles demandes : la période, la précédente, et 8 tranches égales pour la petite courbe.
  const tranches = 8;
  const pas = (periode * J) / tranches;
  const serie = Array.from({ length: tranches }, (_, i) =>
    recues.filter((l) => entre(l.created_at, debut + i * pas, i === tranches - 1 ? n + 1 : debut + (i + 1) * pas)).length,
  );
  const jamaisContactee = (l: LeadTableau) => l.status === 'Nouveau' && !l.last_contact_at;
  const nouvelles = {
    n: recues.length,
    precedent: demandes.filter((l) => entre(l.created_at, debut - periode * J, debut)).length,
    serie,
    jamaisContactees: recues.filter(jamaisContactee).length,
  };

  // Tâches en retard et demandes sans contact depuis 24 h.
  const enRetard = d.taches.filter((t) => t.due_at && t.due_at < iso(n));
  const limite24h = iso(n - 24 * H);
  const sansContact24h = prospects.filter((l) => jamaisContactee(l) && l.created_at <= limite24h);

  // Rendez-vous : demandes d'appel découverte encore ouvertes, avec le créneau choisi sur /rdv.
  const demandesRdv = prospects.filter((l) => estRdv(l) && !FERMES.includes(l.status));
  const avecCreneau = demandesRdv
    .map((lead) => ({ lead, creneau: lireCreneau(lead.need) }))
    .filter((x): x is { lead: LeadTableau; creneau: Date } => x.creneau !== null);
  const aujourdhui0 = debutDuJour(maintenant).getTime();
  const jours = Array.from({ length: 8 }, (_, i) => debutDuJour(maintenant, i).getTime());
  const aVenir = avecCreneau.filter((x) => x.creneau.getTime() >= n && x.creneau.getTime() < jours[7]);
  const rdv = {
    n: aVenir.length,
    aujourdhui: aVenir.filter((x) => x.creneau.getTime() < jours[1]).length,
    // Aujourd'hui : à partir de maintenant seulement, comme `aujourdhui`.
    parJour: jours.slice(0, 7).map((j, i) => avecCreneau.filter((x) => x.creneau.getTime() >= (i ? j : n) && x.creneau.getTime() < jours[i + 1]).length),
  };
  const rendezVous = avecCreneau
    .filter((x) => x.creneau.getTime() >= aujourdhui0 && x.creneau.getTime() < jours[2])
    .sort((a, b) => a.creneau.getTime() - b.creneau.getTime())
    .map((x) => ({ lead: x.lead, creneau: x.creneau.toISOString(), demain: x.creneau.getTime() >= jours[1] }));
  const rdvAConfirmer = demandesRdv
    .filter((l) => !lireCreneau(l.need) && l.created_at >= iso(n - 14 * J))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((lead) => ({ lead, moment: lireMomentSouhaite(lead.need) }));

  // Clients : part des demandes de la période devenues clientes, et clients gagnés dans la période.
  const devenues = recues.filter((l) => l.status === 'Client').length;
  const clients = {
    n: devenues,
    sur: recues.length,
    taux: recues.length ? Math.round((devenues / recues.length) * 100) : null,
    gagnes: prospects.filter((l) => l.status === 'Client' && entre(l.status_changed_at, debut, n + 1)).length,
  };

  // Courbe : 12 semaines (lundi au dimanche, heure de Montréal), la semaine en cours comprise.
  // (+ 12 h : un lundi reste un lundi aux changements d'heure.)
  const lundi = debutDeSemaine(maintenant).getTime();
  const lundis = Array.from({ length: 12 }, (_, i) => debutDeSemaine(new Date(lundi + (i - 11) * 7 * J + 12 * H)).getTime());
  const semaines = lundis.map((de, i) => {
    const a = i === 11 ? n + 1 : lundis[i + 1];
    const semaine = demandes.filter((l) => entre(l.created_at, de, a));
    return { debut: iso(de), etiquette: etiquetteJour(new Date(de)), demandes: semaine.length, rdv: semaine.filter(estRdv).length };
  });

  // Provenance des demandes de la période.
  const sources = SOURCES.map((s) => ({ ...s, n: recues.filter((l) => cleSource(l.source) === s.cle).length })).filter((s) => s.n > 0);

  // À appeler maintenant : jamais contactées (urgentes après 24 h), à relancer, tâche en retard.
  const tacheEnRetard = new Set(enRetard.map((t) => t.lead_id));
  const aAppeler = d.leads
    .filter((l) => !FERMES.includes(l.status) && l.status !== 'RDV')
    .flatMap((lead): Tableau['aAppeler'] => {
      if (jamaisContactee(lead)) return [{ lead, priorite: lead.created_at <= limite24h ? 'Urgente' : 'Haute', raison: 'jamais_contacte' }];
      if (lead.status === 'À relancer') return [{ lead, priorite: 'Haute', raison: 'a_relancer' }];
      if (tacheEnRetard.has(lead.id)) return [{ lead, priorite: 'Normale', raison: 'tache_en_retard' }];
      return [];
    })
    .sort((a, b) => RANG[a.priorite] - RANG[b.priorite] || a.lead.created_at.localeCompare(b.lead.created_at))
    .slice(0, 6);

  return {
    periode,
    maintenant: maintenant.toISOString(),
    nouvelles,
    retard: { n: enRetard.length, sansContact24h: sansContact24h.length },
    rdv,
    clients,
    semaines,
    sources,
    aAppeler,
    rendezVous,
    rdvAConfirmer,
    brouillons: d.brouillons.filter((b) => b.status === 'pending').length,
    // Prospection, à part : en cours (ni cliente ni perdue) et devenues clientes dans la période.
    prospection: {
      enCours: prospects.filter((l) => estProspection(l) && !FERMES.includes(l.status)).length,
      gagnes: prospects.filter((l) => estProspection(l) && l.status === 'Client' && entre(l.status_changed_at, debut, n + 1)).length,
    },
    compteurs: {
      demandes: prospects.length,
      clients: prospects.filter((l) => l.status === 'Client').length,
      rdv: prospects.filter(estRdv).length, // comme la page « Rendez-vous » du menu
      stages: d.leads.length - prospects.length,
      taches: d.taches.length,
    },
  };
}
