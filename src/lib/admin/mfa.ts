// Double vérification de /admin (TOTP, RFC 6238) et session signée — fonctions pures, sans base ni
// réseau : testées par tests/admin-mfa.test.mjs. Aucune dépendance : node:crypto seulement.
//
// Compatible Google Authenticator, Microsoft Authenticator, 1Password : SHA-1, 6 chiffres, 30 s.
// Le secret (base32) est créé dans /admin, confirmé par un premier code, puis rangé CHIFFRÉ dans
// vsw_settings — voir src/lib/admin/mfa-store.ts.
//
// Secret serveur ADMIN_SECRET (32 caractères ou plus, jamais tapé par personne) : il signe la
// session et chiffre le secret TOTP. Sans lui, aucune connexion (revue de sécurité du 2026-10-21 :
// une session signée avec le seul code d'accès se forgeait sans le code à 6 chiffres).
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export const PAS_SECONDES = 30;
export const CHIFFRES = 6;

export const base32Encoder = (buf: Buffer): string => {
  let bits = 0;
  let valeur = 0;
  let sortie = '';
  for (const octet of buf) {
    valeur = (valeur << 8) | octet;
    bits += 8;
    while (bits >= 5) {
      sortie += ALPHABET[(valeur >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) sortie += ALPHABET[(valeur << (5 - bits)) & 31];
  return sortie;
};

/** Décode du base32 (espaces, tirets et « = » ignorés, casse ignorée) ; null si invalide. */
export const base32Decoder = (texte: string): Buffer | null => {
  const propre = texte.toUpperCase().replace(/[\s=-]/g, '');
  if (!propre || /[^A-Z2-7]/.test(propre)) return null;
  let bits = 0;
  let valeur = 0;
  const octets: number[] = [];
  for (const c of propre) {
    valeur = (valeur << 5) | ALPHABET.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      octets.push((valeur >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(octets);
};

/** HOTP (RFC 4226) : code à `chiffres` chiffres pour le compteur donné. */
export const hotp = (cle: Buffer, compteur: number, chiffres = CHIFFRES): string => {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(compteur));
  const h = createHmac('sha1', cle).update(msg).digest();
  const decalage = h[h.length - 1] & 0xf;
  const nombre = ((h[decalage] & 0x7f) << 24) | (h[decalage + 1] << 16) | (h[decalage + 2] << 8) | h[decalage + 3];
  return String(nombre % 10 ** chiffres).padStart(chiffres, '0');
};

export const pasA = (maintenant: Date) => Math.floor(maintenant.getTime() / 1000 / PAS_SECONDES);

const egal = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/**
 * Vérifie un code TOTP : tolère un pas d'écart (horloge du téléphone), refuse un pas déjà utilisé
 * (`dernierPas` : rejouer un code vu par-dessus l'épaule ne marche pas). Renvoie le pas accepté, ou null.
 */
export const verifierTotp = (
  secret: string,
  code: unknown,
  maintenant: Date = new Date(),
  dernierPas: number | null = null,
): number | null => {
  const cle = base32Decoder(secret);
  if (!cle || cle.length < 10 || typeof code !== 'string') return null;
  const saisi = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(saisi)) return null;
  const pas = pasA(maintenant);
  for (const p of [pas, pas - 1, pas + 1]) {
    if (dernierPas !== null && p <= dernierPas) continue;
    if (egal(hotp(cle, p), saisi)) return p;
  }
  return null;
};

/** Nouveau secret TOTP : 20 octets aléatoires (160 bits, recommandé par la RFC 4226), en base32. */
export const genererSecret = () => base32Encoder(randomBytes(20));

/** Lien d'inscription : un téléphone qui l'ouvre propose de l'ajouter à l'application d'authentification. */
export const lienOtpauth = (secret: string, compte = 'admin', emetteur = 'Vie Solution Web') =>
  `otpauth://totp/${encodeURIComponent(`${emetteur}:${compte}`)}?secret=${secret}&issuer=${encodeURIComponent(emetteur)}&algorithm=SHA1&digits=${CHIFFRES}&period=${PAS_SECONDES}`;

/** Secret en groupes de 4 pour la saisie à la main (« Saisir une clé de configuration »). */
export const secretLisible = (secret: string) => secret.replace(/(.{4})/g, '$1 ').trim();

// --- codes de secours -----------------------------------------------------------------

const ALPHABET_SECOURS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans 0/O ni 1/I : se recopie sans erreur

/** `n` codes de secours « XXXX-XXXX » (usage unique ; seule leur empreinte est gardée). */
export const genererCodesSecours = (n = 8): string[] =>
  Array.from({ length: n }, () => {
    const b = randomBytes(8);
    const c = Array.from(b, (x) => ALPHABET_SECOURS[x % 32]).join('');
    return `${c.slice(0, 4)}-${c.slice(4)}`;
  });

export const normaliserCodeSecours = (code: string) => code.toUpperCase().replace(/[\s-]/g, '');
export const estFormatCodeSecours = (code: unknown) =>
  typeof code === 'string' && /^[A-Z0-9]{8}$/.test(normaliserCodeSecours(code));
/** Empreinte HMAC (clé = secret serveur) : la base seule ne permet pas de retrouver un code. */
export const empreinteCodeSecours = (code: string, secretServeur: string) =>
  createHmac('sha256', `vsw-secours|${secretServeur}`).update(normaliserCodeSecours(code)).digest('hex');

// --- secret serveur et chiffrement du secret TOTP ---------------------------------------

export const LONGUEUR_MIN_SECRET = 32;

/** ADMIN_SECRET s'il est assez long, sinon "" (et alors tout est refusé). */
export const secretServeur = (env: Record<string, string | undefined> = process.env) =>
  (env.ADMIN_SECRET || '').length >= LONGUEUR_MIN_SECRET ? (env.ADMIN_SECRET as string) : '';

const cleChiffrement = (secret: string) => createHash('sha256').update(`vsw-totp|${secret}`).digest();

/** Chiffre (AES-256-GCM) : « v1.iv.tag.texte » en base64url. */
export const chiffrer = (texte: string, secret: string) => {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', cleChiffrement(secret), iv);
  const donnees = Buffer.concat([c.update(texte, 'utf8'), c.final()]);
  return ['v1', iv.toString('base64url'), c.getAuthTag().toString('base64url'), donnees.toString('base64url')].join('.');
};

/** Déchiffre ; null si le format, le secret ou l'intégrité ne vont pas. */
export const dechiffrer = (valeur: string, secret: string): string | null => {
  const [v, iv, tag, donnees] = String(valeur).split('.');
  if (v !== 'v1' || !iv || !tag || donnees === undefined || !secret) return null;
  try {
    const d = createDecipheriv('aes-256-gcm', cleChiffrement(secret), Buffer.from(iv, 'base64url'));
    d.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([d.update(Buffer.from(donnees, 'base64url')), d.final()]).toString('utf8');
  } catch {
    return null;
  }
};

// --- session -----------------------------------------------------------------------

export const DUREE_SESSION_S = 8 * 3600;

/**
 * Clé de signature des sessions : secret serveur (ADMIN_SECRET) mêlé à l'empreinte du code d'accès —
 * changer l'un ou l'autre déconnecte tout le monde. "" si l'un manque (aucune session valide).
 */
export const cleSession = (secret: string, codeAcces: string) =>
  secret && codeAcces
    ? createHmac('sha256', secret).update(`vsw-admin-session|${createHash('sha256').update(codeAcces).digest('hex')}`).digest('hex')
    : '';

/**
 * Jeton de session « exp.m.signature » : exp = fin de validité (secondes Unix), m = 1 si la double
 * vérification a été faite, 0 sinon (le jeton ne sert alors qu'à l'activer).
 */
export const signerSession = (cle: string, mfa: boolean, maintenant: Date = new Date()) => {
  const exp = Math.floor(maintenant.getTime() / 1000) + DUREE_SESSION_S;
  const m = mfa ? 1 : 0;
  return `${exp}.${m}.${signature(cle, exp, m)}`;
};

const signature = (cle: string, exp: number, m: number) => createHmac('sha256', cle).update(`${exp}|${m}`).digest('base64url');

/** Session valide → { mfa } ; sinon null (signature fausse, expirée, format inconnu, clé absente). */
export const lireSession = (jeton: string | undefined, cle: string, maintenant: Date = new Date()): { mfa: boolean } | null => {
  if (!jeton || !cle) return null;
  const morceaux = jeton.split('.');
  if (morceaux.length !== 3) return null;
  const [expTexte, mTexte, sig] = morceaux;
  const exp = Number(expTexte);
  if (!/^\d+$/.test(expTexte) || (mTexte !== '0' && mTexte !== '1')) return null;
  if (!egal(sig, signature(cle, exp, Number(mTexte)))) return null;
  if (exp * 1000 <= maintenant.getTime()) return null;
  return { mfa: mTexte === '1' };
};

/** Comparaison du code d'accès en temps constant (empreintes de même longueur). */
export const codeAccesValide = (saisi: unknown, attendu: string) => {
  if (typeof saisi !== 'string' || !saisi || !attendu) return false;
  const h = (s: string) => createHash('sha256').update(`vsw|${s}`).digest('hex');
  return egal(h(saisi), h(attendu));
};
