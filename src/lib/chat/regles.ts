// Règles du clavardage IA (bulle du site) — fonctions pures, sans base ni réseau ni import :
// testées par `npm test` (tests/chat-regles.test.mjs). Demande de Camille (2026-10-22) :
// « lance le chatbot IA et bloque les questions malicieuses, on répond du site seulement ».
//
// Trois barrières, de la moins chère à la plus chère :
//   1. ici, avant tout appel à l'IA : taille et forme de la conversation, tentatives évidentes de
//      détourner l'assistant (« ignore tes instructions… ») → réponse fixe, sans appel payant ;
//   2. la consigne de l'IA (src/lib/chat/connaissances.ts) : le site comme seule source, refus du reste ;
//   3. ici, après la réponse : aucun montant ne sort, même si l'IA en écrivait un.
// La demande de rendez-vous n'est jamais envoyée par l'IA : elle la PROPOSE, le visiteur la relit et
// clique « Envoyer ». La validation ci-dessous s'applique aux deux bouts (navigateur et serveur).

// Anglais : phrase(…) marque un message affiché dans la bulle, traduit à l'affichage par t(lang, …) (sans import : fichier lu par les tests).
const phrase = (fr: string) => fr;

/** Limites d'une conversation (le navigateur garde l'historique ; le serveur le revérifie). */
export const LIMITES = {
  /** Messages du visiteur par conversation. Au-delà : on propose l'appel. */
  messagesParConversation: 12,
  /** Caractères par message du visiteur. */
  caracteresParMessage: 600,
  /** Caractères par réponse de l'assistant renvoyée dans l'historique. */
  caracteresParReponse: 1200,
} as const;

/** Limites par adresse IP et globales (compteur vsw_rate_limit_hit, src/app/api/chat/route.ts). */
export const QUOTAS = {
  parIpHeure: 30,
  parIpJour: 80,
  /** Plafond du site entier par jour : borne la facture même en cas d'abus réparti. */
  siteJour: 400,
} as const;

export type Role = 'user' | 'assistant';
export type MessageChat = { role: Role; text: string };

export type Refus = { ok: false; erreur: string };

const CONTROLES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁠-⁤﻿]/g;

/** Retire les caractères de contrôle et invisibles (souvent utilisés pour cacher une consigne). */
export const nettoyer = (s: string): string => s.replace(CONTROLES, '').replace(/\r\n?/g, '\n').trim();

/**
 * Vérifie l'historique envoyé par le navigateur : alternance visiteur / assistant, commence et
 * finit par le visiteur, tailles bornées. Renvoie l'historique nettoyé.
 */
export function validerHistorique(brut: unknown): { ok: true; messages: MessageChat[] } | Refus {
  if (!Array.isArray(brut) || brut.length === 0) return { ok: false, erreur: 'conversation vide' };
  if (brut.length > LIMITES.messagesParConversation * 2 - 1) return { ok: false, erreur: 'conversation trop longue' };
  const messages: MessageChat[] = [];
  for (let i = 0; i < brut.length; i++) {
    const m = brut[i] as { role?: unknown; text?: unknown } | null;
    const attendu: Role = i % 2 === 0 ? 'user' : 'assistant';
    if (!m || m.role !== attendu || typeof m.text !== 'string') return { ok: false, erreur: 'forme invalide' };
    const text = nettoyer(m.text);
    const max = attendu === 'user' ? LIMITES.caracteresParMessage : LIMITES.caracteresParReponse;
    if (!text) return { ok: false, erreur: 'message vide' };
    if (text.length > max) return { ok: false, erreur: 'message trop long' };
    messages.push({ role: attendu, text });
  }
  if (messages[messages.length - 1].role !== 'user') return { ok: false, erreur: 'forme invalide' };
  return { ok: true, messages };
}

/** Nombre de messages du visiteur dans un historique. */
export const messagesVisiteur = (messages: readonly MessageChat[]): number => messages.filter((m) => m.role === 'user').length;

// Tentatives évidentes de détourner l'assistant. Volontairement étroit : un faux positif coûte
// une vraie question de client. Le reste est l'affaire de la consigne de l'IA.
const DETOURNEMENTS: RegExp[] = [
  /\b(ignore|oublie|oubliez|ignorez|disregard|forget)\b.{0,20}\b(tes|vos|your|all|previous|above)\b.{0,20}\b(instructions?|consignes?|prompt|directives?|rules)\b/i,
  /\b(instructions?|consignes?)\s+pr[ée]c[ée]dentes\b/i,
  /\b(ton|votre|tes|vos|your)\s+(prompt|message|instructions?|consignes?)\s+(syst[eè]me|system)\b/i,
  /\b(system\s+prompt|prompt\s+syst[eè]me)\b/i,
  /\b(r[ée]v[eè]le|affiche|montre|r[ée]p[eè]te|copie|reveal|print|show|repeat)\b.{0,30}\b(tes|vos|your|ton|votre)\s+(instructions?|consignes?|prompt)\b/i,
  /\b(tu es|you are)\s+(maintenant|d[ée]sormais|now)\s+(un|une|le|la|a|an|mon|my|dan)\b/i,
  /\b(jailbreak|DAN mode|developer mode|mode d[ée]veloppeur)\b/i,
  /<\/?\s*(system|instructions?|assistant)\s*>/i,
];

/** Vrai si le message ressemble à une tentative de détourner l'assistant de son rôle. */
export const estDetournement = (texte: string): boolean => DETOURNEMENTS.some((r) => r.test(nettoyer(texte)));

/** Vrai si un des messages du visiteur, n'importe où dans l'historique, est un détournement. */
export const historiqueDetourne = (messages: readonly MessageChat[]): boolean =>
  messages.some((m) => m.role === 'user' && estDetournement(m.text));

/**
 * Clé de quota d'une adresse IP. Une adresse IPv6 est ramenée à son réseau /64 (les 4 premiers
 * groupes) : un abonné en reçoit des milliards, il ne doit pas multiplier ses quotas pour autant.
 */
export function cleIp(ip: string): string {
  const a = ip.trim().toLowerCase();
  if (!a.includes(':')) return a || 'inconnue';
  const [tete, queue = ''] = a.split('::');
  const t = tete ? tete.split(':') : [];
  const q = queue ? queue.split(':') : [];
  const groupes = a.includes('::') ? [...t, ...Array(Math.max(0, 8 - t.length - q.length)).fill('0'), ...q] : t;
  return groupes.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, '') || '0').join(':') + '::/64';
}

// Montants : « 500 $ », « $500 », « 1 200,50 $ », « 300 dollars », « 50 $/h », « 20 k$ ».
const MONTANT = /([$€]\s?\d)|(\d[\d\s.,]*\s?(k\s?)?[$€])|(\d[\d\s.,]*\s?(dollars?|piastres?|cad|usd|euros?)\b)/i;

/** Vrai si le texte contient un montant d'argent. */
export const contientMontant = (texte: string): boolean => MONTANT.test(texte);

/** Réponses fixes (aucun appel à l'IA) — ton du site : positif, vouvoiement. */
export const REPONSES = {
  detournement:
    "Je suis là seulement pour parler des services de Vie Solution Web et vous aider à prendre rendez-vous. Avez-vous une question sur nos services ?",
  montant:
    "Le prix est toujours sur mesure : on vous le donne par écrit après l'appel découverte gratuit de 30 minutes, avant de commencer. Voulez-vous que je transmette une demande de rendez-vous ?",
  limite:
    "Merci pour cette belle conversation ! Pour aller plus loin, le plus simple est d'en parler de vive voix : l'appel découverte est gratuit.",
  indisponible:
    "Je ne peux pas répondre pour le moment. Le plus simple est de réserver votre appel gratuit, ou de nous écrire par la page Contact.",
  refus:
    "Je ne peux pas vous aider sur ce sujet. Je réponds aux questions sur les services de Vie Solution Web et je peux transmettre une demande de rendez-vous.",
  proposition: 'Voici le résumé de votre demande. Vérifiez-le, puis cliquez sur « Envoyer ma demande ».',
} as const;

/** Applique la barrière 3 : une réponse qui contient un montant est remplacée par la réponse fixe. */
export const filtrerReponse = (texte: string): string => {
  const t = nettoyer(texte);
  if (!t) return REPONSES.indisponible;
  return contientMontant(t) ? REPONSES.montant : t.slice(0, LIMITES.caracteresParReponse);
};

/** Demande de rendez-vous proposée par l'IA, relue par le visiteur. */
export type DemandeRdv = { nom: string; courriel: string; moment: string; besoin: string };

const COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,180}\.[A-Za-z]{2,24}$/;

/** Valide et normalise une demande de rendez-vous (données venues de l'IA ou du visiteur). */
export function validerDemandeRdv(brut: unknown): { ok: true; demande: DemandeRdv } | Refus {
  const b = (brut && typeof brut === 'object' ? brut : {}) as Record<string, unknown>;
  const champ = (k: string) => (typeof b[k] === 'string' ? nettoyer(b[k] as string).replace(/\s+/g, ' ') : '');
  const demande: DemandeRdv = {
    nom: champ('nom'),
    courriel: champ('courriel').toLowerCase(),
    moment: champ('moment'),
    besoin: champ('besoin'),
  };
  if (demande.nom.length < 2 || demande.nom.length > 80) return { ok: false, erreur: phrase("Votre nom est requis.") };
  if (demande.courriel.length > 254 || !COURRIEL.test(demande.courriel)) return { ok: false, erreur: phrase("Votre courriel semble invalide.") };
  if (demande.moment.length > 120) return { ok: false, erreur: phrase("Le moment souhaité est trop long.") };
  if (demande.besoin.length > 500) return { ok: false, erreur: phrase("La description est trop longue.") };
  return { ok: true, demande };
}

/** Message enregistré dans contact_requests (repris dans la fiche du CRM). */
export const messagePourCrm = (d: DemandeRdv): string =>
  [
    "Demande de rendez-vous transmise par l'assistant IA du site (relue et envoyée par le visiteur).",
    `Moment souhaité : ${d.moment || 'non précisé'}`,
    `Besoin : ${d.besoin || 'non précisé'}`,
  ].join('\n');
