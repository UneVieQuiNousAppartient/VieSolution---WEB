// Courriels reçus à @viesolutionweb.ca (étape B, boîte de réception) — règles pures, testées par
// tests/crm-entrant.test.mjs : vérification de la signature de Resend (Svix), adresse de l'expéditeur,
// texte lisible tiré du HTML, clé de conversation. Seul import : node:crypto.
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Écart toléré entre l'horloge de Resend et la nôtre (anti-rejeu), en secondes. */
export const TOLERANCE_S = 5 * 60;

/**
 * Signature Svix (en-têtes svix-id, svix-timestamp, svix-signature) : HMAC-SHA256, en base64, de
 * « id.timestamp.corps brut », avec le secret « whsec_… » décodé du base64. L'en-tête peut porter
 * plusieurs signatures « v1,… » séparées par des espaces. Comparaison à temps constant.
 */
export function signatureValide(
  secret: string,
  entetes: { id: string | null; timestamp: string | null; signature: string | null },
  corps: string,
  maintenantS: number = Math.floor(Date.now() / 1000),
): boolean {
  const { id, timestamp, signature } = entetes;
  if (!secret || !id || !timestamp || !signature) return false;
  const t = Number(timestamp);
  if (!Number.isInteger(t) || Math.abs(maintenantS - t) > TOLERANCE_S) return false;
  let cle: Buffer;
  try {
    cle = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  } catch {
    return false;
  }
  if (!cle.length) return false;
  const attendue = createHmac('sha256', cle).update(`${id}.${timestamp}.${corps}`).digest();
  return signature.split(' ').some((morceau) => {
    const [version, valeur] = morceau.split(',');
    if (version !== 'v1' || !valeur) return false;
    const recue = Buffer.from(valeur, 'base64');
    return recue.length === attendue.length && timingSafeEqual(recue, attendue);
  });
}

/** « Marie Exemple <Marie@Exemple.ca> » → { nom: 'Marie Exemple', adresse: 'marie@exemple.ca' }. */
export function lireExpediteur(brut: unknown): { nom: string; adresse: string } | null {
  const s = typeof brut === 'string' ? brut.trim() : '';
  const m = s.match(/^(?:"?([^"<]*?)"?\s*)?<([^<>\s]+@[^<>\s]+)>$/) || s.match(/^()([^<>\s]+@[^<>\s]+)$/);
  if (!m) return null;
  const adresse = m[2].toLowerCase();
  // Même classe de caractères que lireCle (suggestion.ts) : toute conversation rangée peut s'ouvrir.
  if (!/^[^@\s*%,()"]{1,64}@[^@\s*%,()"]{1,180}\.[a-z]{2,24}$/i.test(adresse)) return null;
  const nom = (m[1] || '').replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, 80);
  return { nom, adresse };
}

const ENTITES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

/** Répète un remplacement jusqu'à ce que le texte ne change plus (balises imbriquées, ex. « <scr<script>ipt> »). */
function jusquaStable(texte: string, motif: RegExp, par: string) {
  let avant: string;
  do {
    avant = texte;
    texte = texte.replace(motif, par);
  } while (texte !== avant);
  return texte;
}

/** Caractère d'une entité numérique, ou rien si le code est invalide (jamais d'exception sur un courriel piégé). */
const caractere = (code: number) => (Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '');

/**
 * Texte lisible d'un courriel HTML (quand le texte brut manque) : balises retirées, paragraphes gardés.
 * Le résultat est du TEXTE : il est toujours échappé à l'affichage (React, texteEnHtml).
 */
export function texteDepuisHtml(html: string): string {
  let t = jusquaStable(html, /<(script|style|head)\b[\s\S]*?<\/\1\s*>/gi, '');
  t = t.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|tr|h[1-6]|blockquote)\s*>/gi, '\n\n');
  t = jusquaStable(t, /<[^<>]*>/g, '');
  return t
    .replace(/[<>]/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+|#39);/gi, (e, c: string) => {
      const k = c.toLowerCase();
      if (ENTITES[k] !== undefined) return ENTITES[k];
      if (k.startsWith('#x')) return caractere(parseInt(k.slice(2), 16));
      if (k.startsWith('#')) return caractere(Number(k.slice(1)));
      return e;
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Longueur gardée du texte d'un courriel reçu. */
export const LONGUEUR_MAX = 20000;

/** Texte d'un courriel reçu : le texte brut s'il existe, sinon tiré du HTML, borné. */
export const texteRecu = (texte: unknown, html: unknown) =>
  (typeof texte === 'string' && texte.trim() ? texte : typeof html === 'string' ? texteDepuisHtml(html) : '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, LONGUEUR_MAX);

/** Le courriel est-il adressé à notre domaine (et pas une copie égarée) ? */
export const pourNotreDomaine = (destinataires: unknown, domaine: string) =>
  Array.isArray(destinataires) &&
  destinataires.some((d) => typeof d === 'string' && (lireExpediteur(d)?.adresse ?? '').endsWith(`@${domaine.toLowerCase()}`));

/** Conversation : la fiche si l'expéditeur est connu, sinon son adresse. */
export const cleConversation = (m: { lead_id: string | null; from_email: string; to_email: string | null; direction: string }) =>
  m.lead_id ? `fiche:${m.lead_id}` : `adresse:${(m.direction === 'in' ? m.from_email : m.to_email || '').toLowerCase()}`;

export type CourrielRecu = {
  expediteur: { nom: string; adresse: string };
  destinataires: string[];
  sujet: string;
  texte: string;
  messageId: string | null;
  pieces: { nom: string; taille: number | null }[];
  /** En-têtes, noms en minuscules (vide si Resend ne les donne pas). */
  entetes: Map<string, string>;
};

/** En-têtes donnés par Resend, en objet { nom: valeur } ou en liste [{ name, value }] → noms en minuscules. */
export function lireEntetes(brut: unknown): Map<string, string> {
  const m = new Map<string, string>();
  const ajouter = (k: unknown, v: unknown) => {
    if (typeof k !== 'string') return;
    const val = Array.isArray(v) ? v.filter((x) => typeof x === 'string').join(' ; ') : typeof v === 'string' ? v : '';
    const cle = k.trim().toLowerCase();
    m.set(cle, m.has(cle) ? `${m.get(cle)} ; ${val}` : val);
  };
  if (Array.isArray(brut)) {
    for (const h of brut) if (h && typeof h === 'object') ajouter((h as Record<string, unknown>).name, (h as Record<string, unknown>).value);
  } else if (brut && typeof brut === 'object') {
    for (const [k, v] of Object.entries(brut)) ajouter(k, v);
  }
  return m;
}

/**
 * Réponse automatique (absence, accusé d'un logiciel, infolettre) : elle n'arrête rien, ne déclenche ni
 * alerte ni copie, et va directement dans « ignorés ». RFC 3834 (Auto-Submitted), en-têtes usuels,
 * puis l'objet en dernier recours.
 */
export function estReponseAutomatique(entetes: Map<string, string>, sujet: string): boolean {
  const auto = (entetes.get('auto-submitted') || '').trim().toLowerCase();
  if (auto && auto !== 'no') return true;
  if (entetes.has('x-autoreply') || entetes.has('x-autorespond')) return true;
  if (/\b(bulk|junk|list|auto_reply)\b/i.test(entetes.get('precedence') || '')) return true;
  if (entetes.has('list-id') || entetes.has('list-unsubscribe')) return true;
  return /^\s*(r[ée]ponse automatique|automatic reply|auto(matic)?[- ]?reply|out of (the )?office|absent(e)? du bureau|absence du bureau)/i.test(sujet);
}

/**
 * Verdict d'authentification de l'expéditeur (Authentication-Results posé par le serveur qui reçoit) :
 * 'echec' si DMARC échoue, ou si DKIM et SPF échouent tous les deux ; 'ok' si DMARC ou DKIM passe ;
 * 'inconnu' sinon. Un courriel en échec n'est pas rangé dans la fiche (adresse peut-être usurpée).
 */
export function verdictAuthentification(entetes: Map<string, string>): 'ok' | 'echec' | 'inconnu' {
  const a = (entetes.get('authentication-results') || '').toLowerCase();
  if (!a) return 'inconnu';
  if (/\bdmarc=fail\b/.test(a) || (/\bdkim=fail\b/.test(a) && /\bspf=(fail|softfail)\b/.test(a))) return 'echec';
  if (/\bdmarc=pass\b/.test(a) || /\bdkim=pass\b/.test(a)) return 'ok';
  return 'inconnu';
}

/** Adresse de notre domaine parmi les destinataires (comparaison exacte du domaine). */
export const adresseDeNotreDomaine = (destinataires: string[], domaine: string) =>
  destinataires.map((d) => lireExpediteur(d)?.adresse ?? '').find((a) => a.endsWith(`@${domaine.toLowerCase()}`)) ?? null;

const chaines = (v: unknown) => (Array.isArray(v) ? v : typeof v === 'string' ? [v] : []).filter((x): x is string => typeof x === 'string');

/**
 * Courriel reçu tel que Resend le donne (GET /emails/receiving/{id}, ou à défaut les métadonnées du
 * webhook) → forme simple. null si l'expéditeur est illisible : le courriel est alors ignoré.
 */
export function lireCourrielRecu(brut: unknown): CourrielRecu | null {
  if (!brut || typeof brut !== 'object') return null;
  const r = brut as Record<string, unknown>;
  const expediteur = lireExpediteur(r.from);
  if (!expediteur) return null;
  const sujet = (typeof r.subject === 'string' ? r.subject : '').replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, 300);
  const messageId = typeof r.message_id === 'string' && /^<?[^<>\s]{3,300}>?$/.test(r.message_id.trim()) ? r.message_id.trim() : null;
  const pieces = (Array.isArray(r.attachments) ? r.attachments : [])
    .filter((a): a is Record<string, unknown> => Boolean(a) && typeof a === 'object')
    .slice(0, 20)
    .map((a) => ({
      nom: String(a.filename ?? a.name ?? 'pièce jointe').replace(/[\u0000-\u001F\u007F]+/g, ' ').slice(0, 120),
      taille: typeof a.size === 'number' ? a.size : null,
    }));
  return {
    expediteur,
    destinataires: [...chaines(r.to), ...chaines(r.cc)].slice(0, 50),
    sujet,
    texte: texteRecu(r.text, r.html),
    messageId,
    pieces,
    entetes: lireEntetes(r.headers),
  };
}

/** « Re : » devant le sujet d'une réponse, une seule fois. */
export const sujetReponse = (sujet: string) => (/^\s*(re|rép|réf)\s*:/i.test(sujet) ? sujet.trim() : `Re : ${sujet.trim() || 'votre message'}`);

/** En-têtes qui rangent la réponse dans le même fil chez le prospect. */
export const entetesFil = (messageId: string | null): Record<string, string> => {
  if (!messageId) return {};
  const id = messageId.startsWith('<') ? messageId : `<${messageId}>`;
  return { 'In-Reply-To': id, References: id };
};

export type MessageBoite = {
  id: string;
  lead_id: string | null;
  direction: string;
  from_email: string;
  to_email: string | null;
  subject: string;
  snippet: string;
  received_at: string;
  traite_at: string | null;
  ignore_at: string | null;
};

export type Conversation = {
  cle: string;
  leadId: string | null;
  adresse: string;
  nom: string;
  sujet: string;
  extrait: string;
  /** Le dernier message vient-il de nous ? */
  deNous: boolean;
  date: string;
  /** Un courriel reçu n'est ni traité ni ignoré. */
  aRepondre: boolean;
  /** Tous les courriels reçus ont été ignorés (pourriel, publicité). */
  ignoree: boolean;
  recus: number;
};

/**
 * Conversations de la boîte : seulement celles qui ont au moins un courriel reçu (les accusés et
 * relances seuls n'y entrent pas), la plus récente d'abord. `noms` : nom de la fiche par id.
 */
export function regrouperConversations(messages: MessageBoite[], noms: Map<string, string>): Conversation[] {
  const groupes = new Map<string, MessageBoite[]>();
  for (const m of messages) {
    const cle = cleConversation(m);
    const g = groupes.get(cle);
    if (g) g.push(m);
    else groupes.set(cle, [m]);
  }
  const res: Conversation[] = [];
  for (const [cle, g] of groupes) {
    const recus = g.filter((m) => m.direction === 'in');
    if (!recus.length) continue;
    g.sort((a, b) => (a.received_at < b.received_at ? 1 : -1));
    const dernier = g[0];
    const dernierRecu = recus.reduce((a, b) => (a.received_at > b.received_at ? a : b));
    const leadId = g.find((m) => m.lead_id)?.lead_id ?? null;
    res.push({
      cle,
      leadId,
      adresse: dernierRecu.from_email.toLowerCase(),
      nom: (leadId && noms.get(leadId)) || '',
      sujet: dernier.subject,
      extrait: dernier.snippet,
      deNous: dernier.direction !== 'in',
      date: dernier.received_at,
      aRepondre: recus.some((m) => !m.traite_at && !m.ignore_at),
      ignoree: recus.every((m) => m.ignore_at),
      recus: recus.length,
    });
  }
  return res.sort((a, b) => (a.date < b.date ? 1 : -1));
}
