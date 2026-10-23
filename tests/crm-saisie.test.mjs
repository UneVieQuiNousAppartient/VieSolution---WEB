// Tests des saisies de l'admin (src/lib/crm/saisie.ts) et de la règle des relances (regles.ts). npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PROVENANCES_MANUELLES,
  accordManquant,
  estAjoutManuel,
  lireDate,
  sourceManuelle,
  validerCoordonnees,
  validerNote,
  validerNouvelleDemande,
  validerReponse,
  validerTache,
} from '../src/lib/crm/saisie.ts';
import { recoitRelances } from '../src/lib/crm/regles.ts';
import { cleSource } from '../src/lib/crm/tableau.ts';

test('coordonnées : nettoyées, courriel ou téléphone exigé', () => {
  const r = validerCoordonnees({ nom: '  Marie\t Exemple ', courriel: ' Marie@Exemple.CA ', telephone: '514 555-0101', entreprise: '' });
  assert.deepEqual(r, { ok: true, valeur: { nom: 'Marie Exemple', courriel: 'marie@exemple.ca', telephone: '514 555-0101', entreprise: '' } });
  assert.equal(validerCoordonnees({ nom: 'Marie', telephone: '+1 (438) 506-5243' }).ok, true, 'téléphone seul');
  assert.equal(validerCoordonnees({ nom: 'Marie', courriel: 'm@ex.ca' }).ok, true, 'courriel seul');
  for (const [e, msg] of [
    [{ nom: 'M', courriel: 'm@ex.ca' }, 'nom trop court'],
    [{ nom: 'x'.repeat(81), courriel: 'm@ex.ca' }, 'nom trop long'],
    [{ nom: 'Marie' }, 'ni courriel ni téléphone'],
    [{ nom: 'Marie', courriel: 'pas-un-courriel' }, 'courriel invalide'],
    [{ nom: 'Marie', courriel: '<b>@ex.ca' }, 'courriel avec chevrons'],
    [{ nom: 'Marie', courriel: '*@ex.ca' }, 'joker de recherche'],
    [{ nom: 'Marie', telephone: 'appelez-moi' }, 'téléphone invalide'],
    [null, 'vide'],
  ]) {
    assert.equal(validerCoordonnees(e).ok, false, msg);
  }
});

test('lireDate : seulement les dates qui existent', () => {
  assert.deepEqual(lireDate('2026-10-28'), { annee: 2026, mois: 10, jour: 28 });
  for (const v of ['2026-02-30', '2026-13-01', '28/10/2026', '', null, 20261028, '1999-01-01']) assert.equal(lireDate(v), null, String(v));
});

test('nouvelle demande : provenance, rappel, accord', () => {
  const base = { nom: 'Louis Exemple', courriel: 'louis@ex.ca', provenance: 'Appel reçu', besoin: '  Un site\r\n\r\n\r\n\r\npour ma boutique  ' };
  const r = validerNouvelleDemande({ ...base, rappel: '2026-10-28', dejaParle: true, accord: true });
  assert.equal(r.ok, true);
  assert.equal(r.valeur.besoin, 'Un site\n\npour ma boutique');
  assert.deepEqual(r.valeur.rappel, { annee: 2026, mois: 10, jour: 28 });
  assert.equal(r.valeur.dejaParle, true);
  assert.equal(r.valeur.accord, true);
  const sans = validerNouvelleDemande(base);
  assert.equal(sans.valeur.accord, false, 'pas d’accord par défaut');
  assert.equal(sans.valeur.dejaParle, false);
  assert.equal(sans.valeur.rappel, null);
  assert.equal(validerNouvelleDemande({ ...base, accord: 'true' }).valeur.accord, false, 'seul true compte');
  assert.equal(validerNouvelleDemande({ ...base, provenance: 'Pub' }).ok, false);
  assert.equal(validerNouvelleDemande({ ...base, rappel: '2026-02-31' }).ok, false);
  assert.equal(validerNouvelleDemande({ ...base, besoin: 'x'.repeat(2001) }).ok, false);
  assert.equal(validerNouvelleDemande({ nom: 'Louis', telephone: '514 555-0102', provenance: 'Appel reçu', accord: true }).ok, false, 'accord sans courriel');
  assert.equal(PROVENANCES_MANUELLES.every((p) => validerNouvelleDemande({ ...base, provenance: p }).ok), true);
});

test('note, tâche, réponse', () => {
  assert.deepEqual(validerNote('  Préfère le matin  '), { ok: true, valeur: 'Préfère le matin' });
  assert.equal(validerNote('   ').ok, false);
  assert.equal(validerNote('x'.repeat(2001)).ok, false);
  assert.deepEqual(validerTache({ titre: ' Envoyer la soumission ', echeance: '2026-11-02' }), {
    ok: true,
    valeur: { titre: 'Envoyer la soumission', date: { annee: 2026, mois: 11, jour: 2 } },
  });
  assert.equal(validerTache({ titre: '', echeance: '2026-11-02' }).ok, false);
  assert.equal(validerTache({ titre: 'Rappeler', echeance: 'demain' }).ok, false);
  assert.deepEqual(validerReponse({ sujet: 'Votre\ndemande', corps: 'Bonjour,\r\nMerci.' }), { ok: true, valeur: { sujet: 'Votre demande', corps: 'Bonjour,\nMerci.' } });
  assert.equal(validerReponse({ sujet: '', corps: 'x' }).ok, false);
  assert.equal(validerReponse({ sujet: 'x', corps: '  ' }).ok, false);
  assert.equal(validerReponse({ sujet: 'x'.repeat(201), corps: 'x' }).ok, false);
});

test('source d’une fiche ajoutée à la main', () => {
  assert.equal(sourceManuelle('Recommandation'), 'admin — Recommandation');
  assert.equal(estAjoutManuel('admin — Appel reçu'), true);
  assert.equal(estAjoutManuel('site web — contact'), false);
  assert.equal(cleSource('admin — Appel reçu'), 'manuel');
});

test('courriel depuis la fiche : accord exigé pour qui n’a rien demandé', () => {
  for (const p of ['Recommandation', 'Événement', 'Réseaux sociaux', 'Autre']) {
    assert.equal(accordManquant({ source: sourceManuelle(p), consent_at: null }), true, p);
    assert.equal(accordManquant({ source: sourceManuelle(p), consent_at: '2026-10-23T12:00:00Z' }), false, `${p} avec accord`);
  }
  assert.equal(accordManquant({ source: sourceManuelle('Appel reçu'), consent_at: null }), false, 'elle a appelé');
  assert.equal(accordManquant({ source: sourceManuelle('Courriel reçu'), consent_at: null }), false, 'elle a écrit');
  assert.equal(accordManquant({ source: 'site web — contact', consent_at: null }), false, 'formulaire du site');
});

test('relances automatiques : site oui, stage non, ajout à la main seulement avec accord', () => {
  assert.equal(recoitRelances({ source: 'site web — rdv', service_interest: 'rdv-decouverte', consent_at: null }), true, 'site, même sans consent_at');
  assert.equal(recoitRelances({ source: 'site web — contact', service_interest: 'automatisation', consent_at: '2026-10-23T12:00:00Z' }), true);
  assert.equal(recoitRelances({ source: 'site web — contact', service_interest: 'candidature-stage', consent_at: '2026-10-23T12:00:00Z' }), false);
  assert.equal(recoitRelances({ source: 'admin — Appel reçu', service_interest: '', consent_at: null }), false);
  assert.equal(recoitRelances({ source: 'admin — Appel reçu', service_interest: '', consent_at: '2026-10-23T12:00:00Z' }), true);
});

test('nouvelle demande : case « prospect » → étape « Prospect », sauf si déjà parlé', async () => {
  const { etapeInitiale, validerNouvelleDemande } = await import('../src/lib/crm/saisie.ts');
  const v = validerNouvelleDemande({ nom: 'Paul Exemple', courriel: 'paul@ex.ca', telephone: '', entreprise: '', provenance: 'Événement', besoin: '', prospect: true });
  assert.equal(v.ok && v.valeur.prospect, true);
  assert.equal(etapeInitiale({ dejaParle: false, prospect: true }), 'Prospect');
  assert.equal(etapeInitiale({ dejaParle: true, prospect: true }), 'Contacté');
  assert.equal(etapeInitiale({ dejaParle: false, prospect: false }), 'Nouveau');
  const sans = validerNouvelleDemande({ nom: 'Paul Exemple', courriel: 'paul@ex.ca', provenance: 'Autre', prospect: 'oui' });
  assert.equal(sans.ok && sans.valeur.prospect, false, 'seul true coche la case');
});

test('prospect : aucun courriel depuis l’admin sans accord noté, quelle que soit la provenance (revue securite)', async () => {
  const { accordManquant, validerNouvelleDemande, ETIQUETTE_PROSPECTION_SAISIE } = await import('../src/lib/crm/saisie.ts');
  const { ETIQUETTE_PROSPECTION } = await import('../src/lib/crm/tableau.ts');
  assert.equal(ETIQUETTE_PROSPECTION_SAISIE, ETIQUETTE_PROSPECTION, 'parité de l’étiquette');
  assert.equal(accordManquant({ source: 'admin — Appel reçu', consent_at: null, tags: ['prospection'] }), true);
  assert.equal(accordManquant({ source: 'admin — Autre', consent_at: null, tags: ['prospection'] }), true, 'même après « Contacté »');
  assert.equal(accordManquant({ source: 'admin — Autre', consent_at: '2026-10-23T00:00:00Z', tags: ['prospection'] }), false, 'accord noté');
  assert.equal(accordManquant({ source: 'site web — contact', consent_at: null, tags: [] }), false, 'demande du site inchangée');
  assert.equal(accordManquant({ source: 'admin — Appel reçu', consent_at: null }), false, 'appel reçu sans prospection inchangé');
  for (const provenance of ['Appel reçu', 'Courriel reçu']) {
    const v = validerNouvelleDemande({ nom: 'Paul Exemple', courriel: 'paul@ex.ca', provenance, prospect: true });
    assert.equal(v.ok, false, `prospect + ${provenance} refusé`);
  }
});
