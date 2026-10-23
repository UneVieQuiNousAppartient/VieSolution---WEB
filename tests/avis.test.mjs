// Règles des avis (étape E) : validation du formulaire public, nom publié, chiffres, liens.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENTEMENT_AVIS, chiffresAvis, lienExterne, lienWhatsapp, nomAffiche, validerAvis, validerReglagesAvis } from '../src/lib/avis.ts';

const bon = { nom: '  Marie   Tremblay ', metier: 'Clinique dentaire', note: 5, message: 'Un service humain et rapide, merci !', consentement: true };

test('un avis complet passe, nettoyé', () => {
  const r = validerAvis(bon);
  assert.equal(r.ok, true);
  assert.deepEqual(r.valeur, { nom: 'Marie Tremblay', metier: 'Clinique dentaire', note: 5, message: 'Un service humain et rapide, merci !' });
});

test('le consentement est obligatoire (true, pas une chaîne)', () => {
  assert.equal(validerAvis({ ...bon, consentement: false }).ok, false);
  assert.equal(validerAvis({ ...bon, consentement: 'true' }).ok, false);
  assert.equal(validerAvis({ ...bon, consentement: undefined }).ok, false);
});

test('note de 1 à 5, entière', () => {
  for (const note of [0, 6, 2.5, 'cinq', null]) assert.equal(validerAvis({ ...bon, note }).ok, false, String(note));
  assert.equal(validerAvis({ ...bon, note: '4' }).valeur.note, 4);
});

test('nom et message trop courts refusés, longueurs bornées', () => {
  assert.equal(validerAvis({ ...bon, nom: 'M' }).ok, false);
  assert.equal(validerAvis({ ...bon, message: 'Super' }).ok, false);
  const long = validerAvis({ ...bon, nom: 'a'.repeat(200), message: 'b'.repeat(3000) }).valeur;
  assert.equal(long.nom.length, 80);
  assert.equal(long.message.length, 1500);
});

test('métier facultatif, mais seulement parmi la liste', () => {
  assert.equal(validerAvis({ ...bon, metier: '' }).valeur.metier, null);
  assert.equal(validerAvis({ ...bon, metier: 'Pirate' }).ok, false);
});

test('longueurs comptées en caractères : un émoji compte pour 1, jamais coupé en deux', () => {
  assert.equal(validerAvis({ ...bon, nom: '😀' }).ok, false);
  assert.equal(validerAvis({ ...bon, message: '😀😀😀😀😀' }).ok, false);
  const r = validerAvis({ ...bon, message: '😀'.repeat(2000) }).valeur.message;
  assert.equal(Array.from(r).length, 1500);
  assert.ok(!/[\uD800-\uDBFF]$/.test(r));
});

test('caractères de contrôle retirés', () => {
  assert.equal(validerAvis({ ...bon, message: 'Merci\u0000 beaucoup\npour tout' }).valeur.message, 'Merci beaucoup pour tout');
});

test('nom publié : prénom + initiale', () => {
  assert.equal(nomAffiche('Marie Tremblay'), 'Marie T.');
  assert.equal(nomAffiche('Jean-Pierre de la Fontaine'), 'Jean-Pierre de la F.');
  assert.equal(nomAffiche('marie élise'), 'marie É.');
  assert.equal(nomAffiche('Marie'), 'Marie');
  assert.equal(nomAffiche('  '), '');
});

test('chiffres de l’onglet Avis', () => {
  assert.deepEqual(chiffresAvis([]), { enAttente: 0, publies: 0, refuses: 0, moyenne: null });
  assert.deepEqual(chiffresAvis([{ statut: 'en_attente', note: 5 }, { statut: 'publie', note: 4 }, { statut: 'refuse', note: 2 }]), { enAttente: 1, publies: 1, refuses: 1, moyenne: 3.7 });
});

test('lien WhatsApp : numéro nord-américain, texte encodé', () => {
  assert.equal(lienWhatsapp('(438) 506-5243', 'Bonjour !'), 'https://wa.me/14385065243?text=Bonjour%20!');
  assert.equal(lienWhatsapp('+1 438 506 5243', 'x'), 'https://wa.me/14385065243?text=x');
  assert.equal(lienWhatsapp('123', 'x'), '');
});

test('liens externes : https seulement', () => {
  assert.equal(lienExterne('https://g.page/r/abc/review'), 'https://g.page/r/abc/review');
  for (const v of ['http://exemple.com', 'javascript:alert(1)', 'https://a b', '', 42, 'https://x"onmouseover=1']) assert.equal(lienExterne(v), '', String(v));
});

test('réglages de la page Avis', () => {
  assert.deepEqual(validerReglagesAvis({ google: 'https://g.page/r/x', facebook: '', whatsapp: '438 506-5243' }), { ok: true, valeur: { google: 'https://g.page/r/x', facebook: '', whatsapp: '438 506-5243' } });
  assert.equal(validerReglagesAvis({ google: 'g.page/x' }).ok, false);
  assert.equal(validerReglagesAvis({ whatsapp: '12' }).ok, false);
});

test('le texte de consentement est celui accepté par Camille', () => {
  assert.match(CONSENTEMENT_AVIS, /après vérification par Camille/);
  assert.match(CONSENTEMENT_AVIS, /info@viesolutionweb\.ca/);
});
