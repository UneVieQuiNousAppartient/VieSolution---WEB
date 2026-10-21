// Tests de la double vérification de /admin (src/lib/admin/mfa.ts). Lancement : npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  base32Encoder,
  base32Decoder,
  hotp,
  verifierTotp,
  genererSecret,
  lienOtpauth,
  secretLisible,
  genererCodesSecours,
  estFormatCodeSecours,
  empreinteCodeSecours,
  signerSession,
  lireSession,
  cleSession,
  secretServeur,
  chiffrer,
  dechiffrer,
  codeAccesValide,
  DUREE_SESSION_S,
} from '../src/lib/admin/mfa.ts';

const SRV = 'un-secret-serveur-de-test-assez-long-0123';

// Vecteurs officiels RFC 6238 (SHA-1, clé ASCII « 12345678901234567890 »).
const CLE_RFC = Buffer.from('12345678901234567890');
const SECRET_RFC = base32Encoder(CLE_RFC);

test('base32 : aller-retour, casse, espaces et tirets ignorés, caractère invalide refusé', () => {
  assert.equal(SECRET_RFC, 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  assert.deepEqual(base32Decoder(SECRET_RFC), CLE_RFC);
  assert.deepEqual(base32Decoder('gezd gnbv-gy3t qojq gezd gnbv gy3t qojq'), CLE_RFC);
  assert.equal(base32Decoder('ABC1'), null);
  assert.equal(base32Decoder(''), null);
});

test('HOTP / TOTP : vecteurs de la RFC 6238 (8 chiffres)', () => {
  assert.equal(hotp(CLE_RFC, Math.floor(59 / 30), 8), '94287082');
  assert.equal(hotp(CLE_RFC, Math.floor(1111111109 / 30), 8), '07081804');
  assert.equal(hotp(CLE_RFC, Math.floor(1234567890 / 30), 8), '89005924');
  assert.equal(hotp(CLE_RFC, Math.floor(2000000000 / 30), 8), '69279037');
});

test('verifierTotp : code du moment accepté, ±30 s tolérés, au-delà refusé', () => {
  const t = new Date(1111111109 * 1000);
  const pas = Math.floor(1111111109 / 30);
  const code = hotp(CLE_RFC, pas);
  assert.equal(code, '081804');
  assert.equal(verifierTotp(SECRET_RFC, code, t), pas);
  assert.equal(verifierTotp(SECRET_RFC, code, new Date(t.getTime() + 30_000)), pas, 'pas précédent toléré');
  assert.equal(verifierTotp(SECRET_RFC, code, new Date(t.getTime() - 30_000)), pas, 'pas suivant toléré');
  assert.equal(verifierTotp(SECRET_RFC, code, new Date(t.getTime() + 90_000)), null, 'trop vieux');
  assert.equal(verifierTotp(SECRET_RFC, ' 081 804 ', t), pas, 'espaces ignorés');
});

test('verifierTotp : un code déjà utilisé ne passe pas deux fois ; formats invalides refusés', () => {
  const t = new Date(1111111109 * 1000);
  const pas = Math.floor(1111111109 / 30);
  const code = hotp(CLE_RFC, pas);
  assert.equal(verifierTotp(SECRET_RFC, code, t, pas), null, 'rejeu refusé');
  assert.equal(verifierTotp(SECRET_RFC, code, t, pas - 1), pas);
  assert.equal(verifierTotp(SECRET_RFC, '000000', t), null);
  assert.equal(verifierTotp(SECRET_RFC, '12345', t), null);
  assert.equal(verifierTotp(SECRET_RFC, 123456, t), null);
  assert.equal(verifierTotp('ABC', code, t), null, 'secret trop court');
});

test('genererSecret : 32 caractères base32 (160 bits), lien otpauth et forme lisible', () => {
  const s = genererSecret();
  assert.match(s, /^[A-Z2-7]{32}$/);
  assert.notEqual(s, genererSecret());
  const lien = lienOtpauth(s);
  assert.match(lien, /^otpauth:\/\/totp\/Vie%20Solution%20Web%3Aadmin\?secret=[A-Z2-7]{32}&issuer=Vie%20Solution%20Web/);
  assert.match(lien, /digits=6&period=30/);
  assert.match(secretLisible(s), /^([A-Z2-7]{4} ){7}[A-Z2-7]{4}$/);
});

test('codes de secours : 8 codes XXXX-XXXX distincts, empreinte insensible à la casse et au tiret', () => {
  const codes = genererCodesSecours();
  assert.equal(codes.length, 8);
  assert.equal(new Set(codes).size, 8);
  for (const c of codes) {
    assert.match(c, /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
    assert.equal(estFormatCodeSecours(c), true);
  }
  assert.equal(empreinteCodeSecours('abcd-efgh', SRV), empreinteCodeSecours('ABCDEFGH', SRV));
  assert.notEqual(empreinteCodeSecours('ABCDEFGH', SRV), empreinteCodeSecours('ABCDEFGJ', SRV));
  assert.notEqual(empreinteCodeSecours('ABCDEFGH', SRV), empreinteCodeSecours('ABCDEFGH', 'un-autre-secret-serveur-assez-long-xyz'), 'empreinte liée au secret serveur');
  assert.equal(estFormatCodeSecours('123456'), false);
});

test('session : signée, expirée après 8 h, refusée si le code d\'accès ou le secret serveur change, ou si m est falsifié', () => {
  const t = new Date('2026-10-21T12:00:00Z');
  const cle = cleSession(SRV, 'phrase secrete longue');
  const jeton = signerSession(cle, true, t);
  assert.deepEqual(lireSession(jeton, cle, t), { mfa: true });
  assert.deepEqual(lireSession(signerSession(cle, false, t), cle, t), { mfa: false });
  assert.equal(lireSession(jeton, cleSession(SRV, 'autre code'), t), null, 'code d\'accès changé : déconnecté');
  assert.equal(lireSession(jeton, cleSession('un-autre-secret-serveur-assez-long-xyz', 'phrase secrete longue'), t), null, 'secret serveur changé');
  assert.equal(lireSession(jeton, cle, new Date(t.getTime() + DUREE_SESSION_S * 1000)), null, 'expirée');
  const [exp, , sig] = signerSession(cle, false, t).split('.');
  assert.equal(lireSession(`${exp}.1.${sig}`, cle, t), null, 'm falsifié');
  assert.equal(lireSession(`${Number(exp) + 3600}.0.${sig}`, cle, t), null, 'exp prolongée');
  assert.equal(lireSession(undefined, cle, t), null);
  assert.equal(lireSession(jeton, '', t), null);
  assert.equal(lireSession('abc', cle, t), null);
});

test('session : un jeton forgé avec le seul code d\'accès (connu de qui se connecte) est refusé', () => {
  const t = new Date('2026-10-21T12:00:00Z');
  const code = 'phrase secrete longue';
  const forge = signerSession(code, true, t);
  const forge2 = signerSession(`vsw-admin-session|${code}`, true, t);
  assert.equal(lireSession(forge, cleSession(SRV, code), t), null);
  assert.equal(lireSession(forge2, cleSession(SRV, code), t), null);
});

test('secret serveur : 32 caractères au moins, sinon aucune clé de session', () => {
  assert.equal(secretServeur({ ADMIN_SECRET: 'x'.repeat(32) }), 'x'.repeat(32));
  assert.equal(secretServeur({ ADMIN_SECRET: 'x'.repeat(31) }), '');
  assert.equal(secretServeur({}), '');
  assert.equal(cleSession('', 'code'), '');
  assert.equal(cleSession(SRV, ''), '');
});

test('chiffrement du secret TOTP : aller-retour, aléa, mauvais secret ou valeur modifiée refusés', () => {
  const s = genererSecret();
  const c1 = chiffrer(s, SRV);
  assert.match(c1, /^v1\./);
  assert.ok(!c1.includes(s), 'le secret n\'apparaît pas en clair');
  assert.notEqual(c1, chiffrer(s, SRV), 'iv aléatoire');
  assert.equal(dechiffrer(c1, SRV), s);
  assert.equal(dechiffrer(c1, 'un-autre-secret-serveur-assez-long-xyz'), null);
  const morceaux = c1.split('.');
  morceaux[3] = morceaux[3].slice(0, -2) + (morceaux[3].endsWith('AA') ? 'BB' : 'AA');
  assert.equal(dechiffrer(morceaux.join('.'), SRV), null, 'intégrité');
  assert.equal(dechiffrer('texte-en-clair', SRV), null);
});

test('codeAccesValide : exact seulement', () => {
  assert.equal(codeAccesValide('phrase secrete', 'phrase secrete'), true);
  assert.equal(codeAccesValide('phrase secret', 'phrase secrete'), false);
  assert.equal(codeAccesValide('', ''), false);
  assert.equal(codeAccesValide(undefined, 'x'), false);
});
