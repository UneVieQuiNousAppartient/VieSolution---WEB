// Événements (étape F, maquette SiteEvenements acceptée par Camille le 2026-10-23) — règles pures,
// testées par tests/evenements.test.mjs. Ateliers en ligne et en personne, réservés d'abord aux
// clients : page cachée /evenements (ni menu, ni Google), lien envoyé par Camille. Aucun prix, aucun
// paiement (à décider plus tard). Le lieu privé (adresse ou lien de visioconférence) n'est envoyé
// que par courriel aux inscrits. Sans import : aussi utilisé par les composants du navigateur.
// Le jeton du lien « libérer ma place » (node:crypto) est dans ./evenements-jeton.

export const FUSEAU_EVT = 'America/Toronto';
export const GENRES = ['en_ligne', 'en_personne'] as const;
export type Genre = (typeof GENRES)[number];
export const STATUTS_EVT = ['brouillon', 'publie', 'annule'] as const;
export type StatutEvt = (typeof STATUTS_EVT)[number];
export const LIBELLE_GENRE: Record<Genre, string> = { en_ligne: 'En ligne', en_personne: 'En personne' };

/** Texte de la case d'accord (maquette SiteEvenements, accepté par Camille le 2026-10-23), gardé avec chaque inscription. */
export const CONSENTEMENT_INSCRIPTION =
  "J'accepte que Vie Solution Web garde mes coordonnées pour m'envoyer la confirmation et un rappel de cet atelier. Je peux demander leur retrait en tout temps à info@viesolutionweb.ca.";
export const TEXTE_AVERTIR = 'Je veux aussi être averti(e) des prochains ateliers.';

const longueur = (s: string) => Array.from(s).length;
const nettoyer = (v: unknown, max: number, lignes = false) => {
  if (typeof v !== 'string') return '';
  const s = lignes
    ? v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
    : v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ');
  return Array.from(s.trim()).slice(0, max).join('').trim();
};
const COURRIEL = /^[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[a-z]{2,}$/i;

// --- Dates (heure de Montréal) ---------------------------------------------------------

const parties = (d: Date) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: FUSEAU_EVT, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return { a: +p.year, m: +p.month, j: +p.day, h: +p.hour, min: +p.minute };
};

/** « 2026-11-12 » (jour à Montréal). */
export const jourMontreal = (d: Date | string) => {
  const { a, m, j } = parties(new Date(d));
  return `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
};

/** « 2026-11-12T12:00 », heure de Montréal → instant UTC (ISO), ou '' si invalide. Changements d'heure compris. */
export function localVersIso(local: unknown) {
  const r = typeof local === 'string' ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local) : null;
  if (!r) return '';
  const [a, m, j, h, min] = r.slice(1).map(Number);
  if (m < 1 || m > 12 || j < 1 || j > 31 || h > 23 || min > 59) return '';
  const voulu = Date.UTC(a, m - 1, j, h, min);
  let t = voulu;
  for (let i = 0; i < 3; i++) {
    const p = parties(new Date(t));
    t += voulu - Date.UTC(p.a, p.m - 1, p.j, p.h, p.min);
  }
  const p = parties(new Date(t));
  return Date.UTC(p.a, p.m - 1, p.j, p.h, p.min) === voulu ? new Date(t).toISOString() : '';
}

/** Instant → « 2026-11-12T12:00 » (champ datetime-local de l'admin, heure de Montréal). */
export const isoVersLocal = (iso: string) => {
  const { a, m, j, h, min } = parties(new Date(iso));
  const d = (n: number) => String(n).padStart(2, '0');
  return `${a}-${d(m)}-${d(j)}T${d(h)}:${d(min)}`;
};

const heure = (d: Date) => {
  const { h, min } = parties(d);
  return min ? `${h} h ${String(min).padStart(2, '0')}` : `${h} h`;
};

/** « Mercredi 12 novembre 2026, 12 h à 13 h ». */
export function quandLisible(debut: string, fin: string) {
  const d = new Date(debut);
  const jour = new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU_EVT, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  const memeJour = jourMontreal(debut) === jourMontreal(fin);
  const j = jour.charAt(0).toLocaleUpperCase('fr-CA') + jour.slice(1);
  return memeJour ? `${j}, ${heure(d)} à ${heure(new Date(fin))}` : `${j}, ${heure(d)}`;
}

/** Pastille de date des cartes : { mois: 'nov.', jour: '12', semaine: 'mer.' }. */
export function pastilleDate(debut: string) {
  const d = new Date(debut);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU_EVT, ...o }).format(d);
  return { mois: f({ month: 'short' }), jour: f({ day: 'numeric' }), semaine: f({ weekday: 'short' }) };
}

/** Rappel la veille, à partir de 9 h (heure de Montréal), jusqu'au début de l'atelier. */
export function doitRappeler(debut: string, maintenant: Date) {
  const t = new Date(debut).getTime();
  if (!(t > maintenant.getTime())) return false;
  const { a, m, j, h } = parties(maintenant);
  const demain = new Date(Date.UTC(a, m - 1, j + 1)).toISOString().slice(0, 10);
  // Le jour même, plus de rappel (inscrit après la veille, ou passage horaire en panne).
  return jourMontreal(debut) === demain && h >= 9;
}

// --- Événement (admin) -----------------------------------------------------------------

/** Adresse de l'atelier : « Claude ou ChatGPT ? » le 2026-11-12 → « claude-ou-chatgpt-2026-11-12 ». */
export function slugEvenement(titre: string, debutIso: string) {
  const base = titre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
  return `${base || 'atelier'}-${jourMontreal(debutIso)}`;
}

export const slugEvtValide = (s: unknown): s is string => typeof s === 'string' && s.length <= 90 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);

export type EvenementSaisi = {
  titre: string; genre: Genre; debut: string; fin: string;
  lieu_public: string; lieu_prive: string; places: number; presentation: string;
};

/** Valide un atelier saisi dans l'admin (dates en heure de Montréal, champs datetime-local). */
export function validerEvenement(b: unknown): { ok: true; valeur: EvenementSaisi } | { ok: false; erreur: string } {
  const o = (b && typeof b === 'object' ? b : {}) as Record<string, unknown>;
  const titre = nettoyer(o.titre, 120);
  if (longueur(titre) < 3) return { ok: false, erreur: 'Donnez un titre à l’atelier.' };
  const genre = o.genre as Genre;
  if (!GENRES.includes(genre)) return { ok: false, erreur: 'Choisissez « En ligne » ou « En personne ».' };
  const debut = localVersIso(o.debut);
  const fin = localVersIso(o.fin);
  if (!debut || !fin) return { ok: false, erreur: 'Indiquez la date, l’heure de début et l’heure de fin.' };
  if (new Date(fin) <= new Date(debut)) return { ok: false, erreur: 'L’heure de fin doit suivre l’heure de début.' };
  if (new Date(fin).getTime() - new Date(debut).getTime() > 12 * 3_600_000) return { ok: false, erreur: 'Un atelier dure 12 heures au plus.' };
  const places = Number(o.places);
  if (!Number.isInteger(places) || places < 1 || places > 500) return { ok: false, erreur: 'Nombre de places : de 1 à 500.' };
  const lieu_public = nettoyer(o.lieu_public, 120);
  const lieu_prive = nettoyer(o.lieu_prive, 500);
  if (genre === 'en_ligne' && lieu_prive && !/^https:\/\/[^\s<>"']+$/.test(lieu_prive)) return { ok: false, erreur: 'Le lien de visioconférence doit commencer par https://' };
  const presentation = nettoyer(o.presentation, 5000, true);
  return { ok: true, valeur: { titre, genre, debut, fin, lieu_public, lieu_prive, places, presentation } };
}

/** Ce qui manque avant de publier (le lieu privé part dans les courriels). */
export function manquePourPublier(e: { lieu_prive: string }) {
  return e.lieu_prive.trim() ? null : 'Ajoutez l’adresse ou le lien de visioconférence avant de publier : il part dans le courriel de confirmation.';
}

/** Lieu affiché sur le site : jamais le lieu privé. */
export const lieuAffiche = (e: { genre: Genre; lieu_public: string }) =>
  e.genre === 'en_ligne' ? 'En ligne · le lien arrive dans votre courriel de confirmation' : e.lieu_public || 'Lieu précisé dans votre courriel de confirmation';

/** Places restantes et libellé de la pastille. */
export function places(total: number, inscrits: number) {
  const restantes = Math.max(0, total - inscrits);
  const libelle = restantes === 0 ? 'Complet' : restantes <= 3 ? `Plus que ${restantes} place${restantes > 1 ? 's' : ''}` : `${restantes} places restantes`;
  return { restantes, libelle, ton: restantes === 0 ? 'complet' : restantes <= 3 ? 'peu' : 'ok' } as const;
}

/** Visible sur la page publique : publié, pas commencé. */
export const estAVenir = (e: { statut: string; debut: string }, maintenant: Date) => e.statut === 'publie' && new Date(e.debut).getTime() > maintenant.getTime();

// --- Inscription (formulaire public) -----------------------------------------------------

export type InscriptionValide = { nom: string; courriel: string; entreprise: string | null; question: string | null; avertir: boolean };

export function validerInscription(b: unknown): { ok: true; valeur: InscriptionValide } | { ok: false; erreur: string } {
  const o = (b && typeof b === 'object' ? b : {}) as Record<string, unknown>;
  if (o.consentement !== true) return { ok: false, erreur: 'Votre accord est requis pour vous envoyer la confirmation.' };
  const nom = nettoyer(o.nom, 80);
  if (longueur(nom) < 2) return { ok: false, erreur: 'Indiquez votre nom.' };
  const courriel = nettoyer(o.courriel, 200).toLowerCase();
  if (!COURRIEL.test(courriel)) return { ok: false, erreur: 'Votre adresse courriel semble incomplète.' };
  const entreprise = nettoyer(o.entreprise, 120) || null;
  const question = nettoyer(o.question, 1000, true) || null;
  return { ok: true, valeur: { nom, courriel, entreprise, question, avertir: o.avertir === true } };
}

// --- Courriels (textes de la maquette, acceptés par Camille le 2026-10-23) ----------------

const prenom = (nom: string) => {
  const mot = nom.trim().split(/\s+/)[0] || '';
  return /^\p{L}[\p{L}'’-]{0,39}$/u.test(mot) ? mot : '';
};

type Evt = { titre: string; genre: Genre; debut: string; fin: string; lieu_public: string; lieu_prive: string };

const lieuCourriel = (e: Evt) => (e.genre === 'en_ligne' ? `En ligne : ${e.lieu_prive}` : `Adresse : ${e.lieu_prive}`);

/** Courriel de confirmation (texte brut ; habillé et échappé à l'envoi). */
export function courrielConfirmation(e: Evt, nom: string, lienLibererPlace: string) {
  const p = prenom(nom);
  return {
    sujet: `Votre place est réservée — ${e.titre}`,
    texte:
      `Bonjour${p ? ` ${p}` : ''},\n\n` +
      `Merci de votre inscription ! J'ai bien hâte de vous rencontrer.\n\n` +
      `${e.titre}\n${quandLisible(e.debut, e.fin)}\n${lieuCourriel(e)}\n\n` +
      `Si vous avez une question d'ici là, répondez simplement à ce courriel.\n\n` +
      `Un empêchement ? Libérez votre place pour quelqu'un d'autre : ${lienLibererPlace}\n\n` +
      `Au plaisir,\nCamille Yvan, Vie Solution Web`,
  };
}

/** Rappel de la veille. */
export function courrielRappel(e: Evt, nom: string, lienLibererPlace: string) {
  const p = prenom(nom);
  const h = heure(new Date(e.debut));
  return {
    sujet: `C'est demain ! ${e.titre}`,
    texte:
      `Bonjour${p ? ` ${p}` : ''},\n\n` +
      `Un petit mot pour vous rappeler notre atelier de demain, ${h}. Prévoyez ${e.genre === 'en_ligne' ? 'un café' : 'votre portable'} et vos questions.\n\n` +
      `${e.titre}\n${quandLisible(e.debut, e.fin)}\n${lieuCourriel(e)}\n\n` +
      `Un empêchement ? Pas de souci : libérez votre place pour quelqu'un d'autre en un clic : ${lienLibererPlace}\n\n` +
      `À demain,\nCamille`,
  };
}

/** Annulation de l'atelier par Camille (texte montré dans l'admin avant l'envoi). */
export function courrielAnnulation(e: Evt, nom: string) {
  const p = prenom(nom);
  return {
    sujet: `Atelier annulé — ${e.titre}`,
    texte:
      `Bonjour${p ? ` ${p}` : ''},\n\n` +
      `Je dois malheureusement annuler l'atelier « ${e.titre} » prévu le ${quandLisible(e.debut, e.fin).replace(/^./, (c) => c.toLocaleLowerCase('fr-CA'))}. Toutes mes excuses pour ce changement.\n\n` +
      `Je vous écris dès qu'une nouvelle date est fixée. D'ici là, n'hésitez pas à répondre à ce courriel si vous avez une question.\n\n` +
      `Merci de votre compréhension,\nCamille Yvan, Vie Solution Web`,
  };
}

/** Pied des courriels d'atelier : identité, adresse postale, site (loi anti-pourriel). */
export const raisonCourrielAtelier = 'vous vous êtes inscrit(e) à un atelier de Vie Solution Web';

/** Invitation d'agenda (.ics) — renseignements publics seulement (jamais le lieu privé). */
export function fichierIcs(e: { slug: string; titre: string; debut: string; fin: string; genre: Genre; lieu_public: string }, site: string) {
  const t = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vie Solution Web//Ateliers//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.slug}@viesolutionweb.ca`,
    `DTSTAMP:${t(new Date().toISOString())}`,
    `DTSTART:${t(e.debut)}`,
    `DTEND:${t(e.fin)}`,
    `SUMMARY:${esc(e.titre)}`,
    `LOCATION:${esc(e.genre === 'en_ligne' ? 'En ligne (lien dans votre courriel de confirmation)' : e.lieu_public || 'Voir votre courriel de confirmation')}`,
    `URL:${site}/evenements/${e.slug}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
}

/** Liste des inscrits en CSV (Excel en français : point-virgule, BOM). */
export function csvInscrits(lignes: { nom: string; courriel: string; entreprise: string | null; question: string | null; statut: string; avertir: boolean; created_at: string }[]) {
  const cel = (v: unknown) => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // pas de formule exécutée à l'ouverture dans Excel
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const tete = ['Nom', 'Courriel', 'Entreprise ou métier', 'Question', 'État', 'Veut les prochains ateliers', 'Inscrit le'];
  const corps = lignes.map((l) => [l.nom, l.courriel, l.entreprise, l.question, l.statut === 'confirmee' ? 'Confirmée' : 'Annulée', l.avertir ? 'Oui' : 'Non', jourMontreal(l.created_at)].map(cel).join(';'));
  return '\uFEFF' + [tete.join(';'), ...corps].join('\r\n');
}
