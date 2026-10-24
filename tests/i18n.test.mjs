// Règles de l'anglais du site (étape 1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alternates, cheminAutreLangue, langueDe, lienLangue, traduire } from '../src/lib/i18n-regles.ts';

test('traduction : anglais si présent, sinon la phrase française ; variables remplacées', () => {
  const d = { 'Bonjour {nom}': 'Hello {nom}', Prix: 'Pricing', Vide: '' };
  assert.equal(traduire(d, 'en', 'Bonjour {nom}', { nom: 'Marie' }), 'Hello Marie');
  assert.equal(traduire(d, 'fr', 'Bonjour {nom}', { nom: 'Marie' }), 'Bonjour Marie');
  assert.equal(traduire(d, 'en', 'Pas traduit'), 'Pas traduit');
  assert.equal(traduire(d, 'en', 'Vide'), 'Vide');
  assert.equal(traduire(d, 'en', 'Prix {x}', {}), 'Prix {x}');
});

test('liens internes : /en/… seulement pour les pages publiées en anglais', () => {
  assert.equal(lienLangue('en', '/'), '/en');
  assert.equal(lienLangue('en', '/ia'), '/en/ia');
  assert.equal(lienLangue('en', '/rdv?source=accueil#haut'), '/en/rdv?source=accueil#haut');
  assert.equal(lienLangue('en', '/ia/'), '/en/ia');
  assert.equal(lienLangue('en', '/blog'), '/blog');
  assert.equal(lienLangue('en', '#faq'), '#faq');
  assert.equal(lienLangue('en', 'https://exemple.com'), 'https://exemple.com');
  assert.equal(lienLangue('en', '/api/visite'), '/api/visite');
  assert.equal(lienLangue('en', '/en/zoho'), '/en/zoho');
  assert.equal(lienLangue('fr', '/ia'), '/ia');
});

test('bouton FR | EN : même page, ou accueil de l’autre langue', () => {
  assert.equal(cheminAutreLangue('/ia'), '/en/ia');
  assert.equal(cheminAutreLangue('/'), '/en');
  assert.equal(cheminAutreLangue('/blog/claude'), '/en');
  assert.equal(cheminAutreLangue('/en/ia'), '/ia');
  assert.equal(cheminAutreLangue('/en'), '/');
  assert.equal(cheminAutreLangue('/en/inconnue'), '/');
  assert.equal(langueDe('/en/zoho'), 'en');
  assert.equal(langueDe('/entreprise'), 'fr');
});

test('hreflang', () => {
  assert.deepEqual(alternates('/zoho').languages, { 'fr-CA': '/zoho', 'en-CA': '/en/zoho', 'x-default': '/zoho' });
  assert.deepEqual(alternates('/').languages['en-CA'], '/en');
});

test('relevé des phrases : t(lang, …) et phrase(…), pas les autres appels', async () => {
  const { MOTIF } = await import('../scripts/i18n.mjs');
  const src = `t(lang, "Bonjour") t('en', 'Prix') t(l, \`Deux\nlignes\`) phrase("Menu") et(lang, "Non") paraphrase("Non") t(lang, x)`;
  const vus = [...src.matchAll(MOTIF)].map((m) => m[1] ?? m[2] ?? m[3]);
  assert.deepEqual(vus, ['Bonjour', 'Prix', 'Deux\nlignes', 'Menu']);
});
