// Avis et témoignages (étape E, maquette SiteAvis validée par Camille le 2026-10-23) — règles pures,
// testées par tests/avis.test.mjs. Aucune dépendance : utilisées par /api/avis, /api/admin/avis,
// la page /avis et l'onglet « Avis » de l'admin.

/** Texte de consentement accepté par Camille le 2026-10-23 (preuve gardée avec chaque avis). */
export const CONSENTEMENT_AVIS =
  "J'accepte que Vie Solution Web publie sur son site mon commentaire et le nom que j'indique, après vérification par Camille. Je peux en demander le retrait en tout temps en écrivant à info@viesolutionweb.ca.";

export const STATUTS_AVIS = ['en_attente', 'publie', 'refuse'] as const;
export type StatutAvis = (typeof STATUTS_AVIS)[number];

/** Les 8 métiers du site + « Autre » (champ facultatif du formulaire). */
export const METIERS_AVIS = [
  'Conseiller financier',
  'Courtier hypothécaire',
  'Clinique dentaire',
  'Clinique de soins',
  'Cabinet comptable',
  'Entrepreneur en construction',
  'Agent immobilier',
  'Commerce ou restaurant',
  'Autre',
] as const;

export type AvisValide = { nom: string; metier: string | null; note: number; message: string };

/** Longueur en caractères (comme la base), pas en unités UTF-16 : un émoji compte pour 1. */
const longueur = (s: string) => Array.from(s).length;

const nettoyer = (v: unknown, max: number) =>
  typeof v === 'string' ? Array.from(v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, max).join('').trim() : '';

/** Valide un avis envoyé par le formulaire public. Le consentement est obligatoire. */
export function validerAvis(b: unknown): { ok: true; valeur: AvisValide } | { ok: false; erreur: string } {
  const o = (b && typeof b === 'object' ? b : {}) as Record<string, unknown>;
  if (o.consentement !== true) return { ok: false, erreur: 'Votre accord est requis pour publier votre témoignage.' };
  const nom = nettoyer(o.nom, 80);
  if (longueur(nom) < 2) return { ok: false, erreur: 'Indiquez votre nom.' };
  const message = nettoyer(o.message, 1500);
  if (longueur(message) < 10) return { ok: false, erreur: 'Votre témoignage est un peu court (10 caractères au moins).' };
  const note = Number(o.note);
  if (!Number.isInteger(note) || note < 1 || note > 5) return { ok: false, erreur: 'Choisissez une note de 1 à 5 étoiles.' };
  const metier = nettoyer(o.metier, 60);
  if (metier && !(METIERS_AVIS as readonly string[]).includes(metier)) return { ok: false, erreur: 'Métier inconnu.' };
  return { ok: true, valeur: { nom, metier: metier || null, note, message } };
}

/** « Marie Tremblay » → « Marie T. » ; « Marie » → « Marie » (nom publié sur le site). */
export function nomAffiche(nom: string) {
  const mots = nom.trim().split(/\s+/).filter(Boolean);
  if (mots.length === 0) return '';
  if (mots.length === 1) return mots[0];
  const initiale = mots[mots.length - 1].charAt(0).toLocaleUpperCase('fr-CA');
  return `${mots.slice(0, -1).join(' ')} ${initiale}.`;
}

/** Chiffres de l'onglet « Avis » : en attente, publiés, refusés, note moyenne (sur tous les avis reçus). */
export function chiffresAvis(avis: { statut: string; note: number }[]) {
  const compte = (s: StatutAvis) => avis.filter((a) => a.statut === s).length;
  const moyenne = avis.length ? Math.round((avis.reduce((t, a) => t + a.note, 0) / avis.length) * 10) / 10 : null;
  return { enAttente: compte('en_attente'), publies: compte('publie'), refuses: compte('refuse'), moyenne };
}

/** Lien WhatsApp « message direct » : chiffres seulement, indicatif 1 ajouté à un numéro nord-américain à 10 chiffres. */
export function lienWhatsapp(numero: string, texte: string) {
  let chiffres = numero.replace(/\D/g, '');
  if (chiffres.length === 10) chiffres = `1${chiffres}`;
  if (chiffres.length < 11 || chiffres.length > 15) return '';
  return `https://wa.me/${chiffres}?text=${encodeURIComponent(texte)}`;
}

/** Lien saisi dans l'admin (Google, Facebook) : https seulement, sinon vide (le bouton reste caché). */
export function lienExterne(v: unknown) {
  const s = typeof v === 'string' ? v.trim() : '';
  return /^https:\/\/[^\s<>"']+$/.test(s) && s.length <= 500 ? s : '';
}

/** Réglages de la page Avis (vsw_settings) ; un champ vide efface le réglage. */
export const CLES_REGLAGES_AVIS = { google: 'avis_lien_google', facebook: 'avis_lien_facebook', whatsapp: 'avis_whatsapp' } as const;

export function validerReglagesAvis(b: unknown): { ok: true; valeur: { google: string; facebook: string; whatsapp: string } } | { ok: false; erreur: string } {
  const o = (b && typeof b === 'object' ? b : {}) as Record<string, unknown>;
  const brut = (k: string) => (typeof o[k] === 'string' ? (o[k] as string).trim() : '');
  const google = lienExterne(brut('google'));
  if (brut('google') && !google) return { ok: false, erreur: 'Le lien Google doit commencer par https://' };
  const facebook = lienExterne(brut('facebook'));
  if (brut('facebook') && !facebook) return { ok: false, erreur: 'Le lien Facebook doit commencer par https://' };
  const whatsapp = brut('whatsapp').replace(/[^\d+()\s-]/g, '').slice(0, 20);
  if (whatsapp && !lienWhatsapp(whatsapp, 'x')) return { ok: false, erreur: 'Numéro WhatsApp invalide (10 chiffres, ex. 438 506-5243).' };
  return { ok: true, valeur: { google, facebook, whatsapp } };
}
