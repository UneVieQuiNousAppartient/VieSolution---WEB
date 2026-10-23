// Saisies de l'admin (étape A, maquette validée par Camille le 2026-10-23) : nouvelle demande ajoutée à
// la main, coordonnées, note, tâche, réponse envoyée depuis la fiche. Fonctions pures, testées par
// tests/crm-saisie.test.mjs. Sans import (Node exécute ce fichier tel quel dans les tests).

export const PROVENANCES_MANUELLES = ['Appel reçu', 'Courriel reçu', 'Recommandation', 'Événement', 'Réseaux sociaux', 'Autre'] as const;
export type ProvenanceManuelle = (typeof PROVENANCES_MANUELLES)[number];

/** Préfixe de la source d'une fiche ajoutée à la main (« admin — Appel reçu »). */
export const PREFIXE_MANUEL = 'admin';
export const sourceManuelle = (p: ProvenanceManuelle) => `${PREFIXE_MANUEL} — ${p}`;
export const estAjoutManuel = (source: string | null | undefined) => String(source || '').startsWith(`${PREFIXE_MANUEL} —`);

/** Provenances où la personne a elle-même fait une demande (consentement tacite LCAP de 6 mois). */
export const PROVENANCES_DEMANDE: readonly ProvenanceManuelle[] = ['Appel reçu', 'Courriel reçu'];

/**
 * Fiche ajoutée à la main pour quelqu'un qui n'a rien demandé (recommandation, événement, réseaux
 * sociaux, autre) et sans accord noté : aucun courriel ne peut lui partir de l'admin (loi anti-pourriel,
 * revue securite du 2026-10-23). Il faut d'abord noter son accord.
 */
export const accordManquant = (lead: { source?: string | null; consent_at?: string | null }) =>
  estAjoutManuel(lead.source) && !lead.consent_at && !PROVENANCES_DEMANDE.some((p) => lead.source === sourceManuelle(p));

/** Texte gardé avec l'accord de recevoir les courriels de suivi (preuve LCAP). */
export const TEXTE_ACCORD_MANUEL = "Accord pour recevoir les courriels de suivi de Vie Solution Web, donné à l'équipe et noté dans l'admin";

export const LIMITES_SAISIE = { nom: 80, courriel: 254, telephone: 30, entreprise: 120, besoin: 2000, note: 2000, tache: 140, sujet: 200, corps: 10000 } as const;

type Resultat<T> = { ok: true; valeur: T } | { ok: false; erreur: string };
const echec = (erreur: string): { ok: false; erreur: string } => ({ ok: false, erreur });

/** Texte d'une ligne : sans caractères de contrôle ni espaces multiples. */
const ligne = (v: unknown) => (typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim() : '');
/** Texte de plusieurs lignes : contrôles retirés sauf les retours à la ligne. */
const bloc = (v: unknown) =>
  typeof v === 'string' ? v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, '').replace(/\n{3,}/g, '\n\n').trim() : '';

// « * » refusé : Supabase le lit comme un joker dans les recherches ilike (revue securite du 2026-10-23).
const COURRIEL = /^[^\s@<>()[\]\\,;:"*]+@[^\s@<>()[\]\\,;:"*]+\.[a-z]{2,}$/i;
const TELEPHONE = /^[0-9+().\- ]{7,30}$/;

export type Coordonnees = { nom: string; courriel: string; telephone: string; entreprise: string };

/** Nom, courriel et téléphone (au moins un des deux), entreprise facultative. */
export function validerCoordonnees(e: unknown): Resultat<Coordonnees> {
  const x = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
  const nom = ligne(x.nom);
  const courriel = ligne(x.courriel).toLowerCase();
  const telephone = ligne(x.telephone);
  const entreprise = ligne(x.entreprise);
  if (nom.length < 2) return echec('Indiquez le nom de la personne.');
  if (nom.length > LIMITES_SAISIE.nom) return echec(`Le nom est trop long (${LIMITES_SAISIE.nom} caractères au plus).`);
  if (courriel && (courriel.length > LIMITES_SAISIE.courriel || !COURRIEL.test(courriel))) return echec('Ce courriel ne semble pas valide.');
  if (telephone && !TELEPHONE.test(telephone)) return echec('Ce numéro de téléphone ne semble pas valide.');
  if (!courriel && !telephone) return echec('Indiquez au moins un courriel ou un téléphone.');
  if (entreprise.length > LIMITES_SAISIE.entreprise) return echec('Le nom de l’entreprise est trop long.');
  return { ok: true, valeur: { nom, courriel, telephone, entreprise } };
}

/** « 2026-10-28 » → { annee, mois, jour } si la date existe vraiment. */
export function lireDate(v: unknown): { annee: number; mois: number; jour: number } | null {
  const m = typeof v === 'string' ? v.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  if (!m) return null;
  const [annee, mois, jour] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(annee, mois - 1, jour));
  if (d.getUTCFullYear() !== annee || d.getUTCMonth() !== mois - 1 || d.getUTCDate() !== jour) return null;
  if (annee < 2020 || annee > 2100) return null;
  return { annee, mois, jour };
}

export type NouvelleDemande = Coordonnees & {
  provenance: ProvenanceManuelle;
  besoin: string;
  rappel: { annee: number; mois: number; jour: number } | null;
  dejaParle: boolean;
  accord: boolean;
};

/** Formulaire « Nouvelle demande » de l'admin. */
export function validerNouvelleDemande(e: unknown): Resultat<NouvelleDemande> {
  const c = validerCoordonnees(e);
  if (!c.ok) return c;
  const x = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
  const provenance = PROVENANCES_MANUELLES.find((p) => p === x.provenance);
  if (!provenance) return echec('Choisissez la provenance.');
  const besoin = bloc(x.besoin);
  if (besoin.length > LIMITES_SAISIE.besoin) return echec(`Le besoin est trop long (${LIMITES_SAISIE.besoin} caractères au plus).`);
  let rappel = null;
  if (x.rappel !== undefined && x.rappel !== null && x.rappel !== '') {
    rappel = lireDate(x.rappel);
    if (!rappel) return echec('La date du rappel n’est pas valide.');
  }
  const accord = x.accord === true;
  if (accord && !c.valeur.courriel) return echec('L’accord pour les courriels de suivi demande un courriel.');
  return { ok: true, valeur: { ...c.valeur, provenance, besoin, rappel, dejaParle: x.dejaParle === true, accord } };
}

/** Note de l'historique. */
export function validerNote(v: unknown): Resultat<string> {
  const t = bloc(v);
  if (!t) return echec('La note est vide.');
  if (t.length > LIMITES_SAISIE.note) return echec(`La note est trop longue (${LIMITES_SAISIE.note} caractères au plus).`);
  return { ok: true, valeur: t };
}

/** Tâche ajoutée sur une fiche : titre et date d'échéance (le rappel est fixé à 9 h, heure de Montréal). */
export function validerTache(e: unknown): Resultat<{ titre: string; date: { annee: number; mois: number; jour: number } }> {
  const x = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
  const titre = ligne(x.titre);
  if (!titre) return echec('Décrivez la tâche.');
  if (titre.length > LIMITES_SAISIE.tache) return echec(`La tâche est trop longue (${LIMITES_SAISIE.tache} caractères au plus).`);
  const date = lireDate(x.echeance);
  if (!date) return echec('Choisissez une date d’échéance.');
  return { ok: true, valeur: { titre, date } };
}

/** Réponse envoyée depuis la fiche : objet d'une ligne, message. */
export function validerReponse(e: unknown): Resultat<{ sujet: string; corps: string }> {
  const x = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
  const sujet = ligne(x.sujet);
  const corps = bloc(x.corps);
  if (!sujet) return echec('Indiquez l’objet du courriel.');
  if (sujet.length > LIMITES_SAISIE.sujet) return echec('L’objet est trop long.');
  if (!corps) return echec('Le message est vide.');
  if (corps.length > LIMITES_SAISIE.corps) return echec('Le message est trop long.');
  return { ok: true, valeur: { sujet, corps } };
}
