// Tests des métiers et des situations (src/lib/metiers.ts) : refonte du 2026-10-23. npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BENEFICES, IA_RDV, IA_TACHES, METIERS, SITUATIONS, metierParSlug } from '../src/lib/metiers.ts';

// Pages de service existantes (src/components/vsw/nav.tsx, PILIERS_NAV) : un métier ne peut pas en citer une autre.
const PAGES_SERVICE = ['/ia', '/accueil-ia', '/zoho', '/sites-web', '/crm-sur-mesure', '/referencement'];

test('8 métiers, slugs uniques et lisibles dans une adresse', () => {
  assert.equal(METIERS.length, 8);
  const slugs = METIERS.map((m) => m.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z]+(-[a-z]+)*$/, s);
  assert.equal(metierParSlug('clinique-dentaire')?.titre, 'Clinique dentaire');
  assert.equal(metierParSlug('inconnu'), null);
});

test('rien n’est perdu : 7 situations (6 de « C’est pour vous si… » + le rapport mensuel) et 3 bénéfices', () => {
  assert.equal(SITUATIONS.length, 7);
  assert.ok(SITUATIONS.some((s) => s.avant === 'Vous refaites le même rapport chaque mois.'));
  assert.equal(BENEFICES.length, 3);
  for (const m of METIERS) {
    for (const champ of ['titre', 'gruge', 'ameliore', 'temps', 'resume']) assert.ok(m[champ]?.trim(), `${m.slug}.${champ}`);
    assert.ok(m.tags.length >= 2, m.slug);
  }
});

test('chaque métier : 3 situations distinctes et valides, des pages de service qui existent', () => {
  for (const m of METIERS) {
    assert.equal(m.situations.length, 3, m.slug);
    assert.equal(new Set(m.situations).size, 3, m.slug);
    for (const i of m.situations) assert.ok(Number.isInteger(i) && i >= 0 && i < SITUATIONS.length, `${m.slug} : ${i}`);
    assert.ok(m.services.length >= 1, m.slug);
    for (const href of m.services) assert.ok(PAGES_SERVICE.includes(href), `${m.slug} : ${href}`);
  }
  // Toutes les situations servent au moins à un métier (« Autre métier ou PME » les montre toutes).
  const utilisees = new Set(METIERS.flatMap((m) => m.situations));
  assert.equal(utilisees.size, SITUATIONS.length);
});

test('étiquettes d’IA : rendez-vous pour les métiers à rendez-vous, petites tâches pour tous', () => {
  const avecRdv = METIERS.filter((m) => m.rdvIa).map((m) => m.slug).sort();
  assert.deepEqual(avecRdv, ['agent-immobilier', 'clinique-de-soins', 'clinique-dentaire', 'commerce-restaurant', 'conseiller-financier', 'courtier-hypothecaire']);
  assert.ok(PAGES_SERVICE.includes(IA_RDV.href) && PAGES_SERVICE.includes(IA_TACHES.href));
});

test('mention conformité gardée pour les métiers financiers', () => {
  assert.ok(metierParSlug('conseiller-financier')?.note?.includes('AMF'));
});
