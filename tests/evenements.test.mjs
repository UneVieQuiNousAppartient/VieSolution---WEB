// Règles des événements (étape F) : dates à Montréal, saisie de l'admin, inscription, rappel, courriels.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONSENTEMENT_INSCRIPTION, courrielAnnulation, courrielConfirmation, courrielRappel, csvInscrits, doitRappeler, estAVenir, fichierIcs,
  isoVersLocal, lieuAffiche, localVersIso, manquePourPublier, places, quandLisible,
  slugEvenement, slugEvtValide, validerEvenement, validerInscription,
} from '../src/lib/evenements.ts';
import { jetonPlace, jetonPlaceValide, lienLiberer } from '../src/lib/evenements-jeton.ts';

test('heure de Montréal → UTC, changements d’heure compris', () => {
  assert.equal(localVersIso('2026-11-12T12:00'), '2026-11-12T17:00:00.000Z'); // heure normale (UTC−5)
  assert.equal(localVersIso('2026-10-23T09:30'), '2026-10-23T13:30:00.000Z'); // heure avancée (UTC−4)
  assert.equal(localVersIso('2027-03-14T02:30'), ''); // heure qui n'existe pas (passage à l'heure avancée)
  for (const v of ['', '2026-13-01T10:00', '2026-11-12 12:00', 42, null]) assert.equal(localVersIso(v), '', String(v));
  assert.equal(isoVersLocal('2026-11-12T17:00:00.000Z'), '2026-11-12T12:00');
});

test('date lisible', () => {
  assert.equal(quandLisible('2026-11-12T17:00:00Z', '2026-11-12T18:00:00Z'), 'Jeudi 12 novembre 2026, 12 h à 13 h');
  assert.equal(quandLisible('2026-11-27T14:00:00Z', '2026-11-27T16:30:00Z'), 'Vendredi 27 novembre 2026, 9 h à 11 h 30');
});

test('rappel : la veille à partir de 9 h, jamais le jour même ni après', () => {
  const debut = '2026-11-12T17:00:00Z'; // 12 nov., 12 h
  assert.equal(doitRappeler(debut, new Date('2026-11-11T13:59:00Z')), false); // 11 nov., 8 h 59
  assert.equal(doitRappeler(debut, new Date('2026-11-11T14:00:00Z')), true); // 11 nov., 9 h
  assert.equal(doitRappeler(debut, new Date('2026-11-12T04:30:00Z')), true); // 11 nov., 23 h 30
  assert.equal(doitRappeler(debut, new Date('2026-11-12T05:00:00Z')), false); // 12 nov., 0 h
  assert.equal(doitRappeler(debut, new Date('2026-11-10T15:00:00Z')), false); // deux jours avant
  assert.equal(doitRappeler(debut, new Date('2026-11-12T18:00:00Z')), false); // après
});

test('rappel le jour du retour à l’heure normale (1er nov. 2026)', () => {
  const debut = '2026-11-02T15:00:00Z'; // 2 nov., 10 h (UTC−5)
  assert.equal(doitRappeler(debut, new Date('2026-11-01T13:59:00Z')), false); // 1er nov., 8 h 59 (UTC−5)
  assert.equal(doitRappeler(debut, new Date('2026-11-01T14:00:00Z')), true); // 1er nov., 9 h
  assert.equal(doitRappeler(debut, new Date('2026-11-01T04:30:00Z')), false); // 31 oct., 0 h 30 (UTC−4)
});

test('saisie d’un atelier dans l’admin', () => {
  const bon = { titre: '  Claude ou ChatGPT ? ', genre: 'en_ligne', debut: '2026-11-12T12:00', fin: '2026-11-12T13:00', places: '20', lieu_prive: 'https://meet.example/abc', presentation: 'Ligne 1\r\n\r\n\r\nLigne 2' };
  const r = validerEvenement(bon);
  assert.equal(r.ok, true);
  assert.equal(r.valeur.titre, 'Claude ou ChatGPT ?');
  assert.equal(r.valeur.places, 20);
  assert.equal(r.valeur.debut, '2026-11-12T17:00:00.000Z');
  assert.equal(r.valeur.presentation, 'Ligne 1\n\nLigne 2');
  assert.equal(validerEvenement({ ...bon, fin: '2026-11-12T11:00' }).ok, false);
  assert.equal(validerEvenement({ ...bon, fin: '2026-11-13T13:00' }).ok, false);
  assert.equal(validerEvenement({ ...bon, places: 0 }).ok, false);
  assert.equal(validerEvenement({ ...bon, places: 2.5 }).ok, false);
  assert.equal(validerEvenement({ ...bon, genre: 'hybride' }).ok, false);
  assert.equal(validerEvenement({ ...bon, lieu_prive: 'javascript:alert(1)' }).ok, false);
  assert.equal(validerEvenement({ ...bon, genre: 'en_personne', lieu_prive: '123, rue Exemple, Montréal' }).ok, true);
  assert.equal(manquePourPublier({ lieu_prive: ' ' }) !== null, true);
  assert.equal(manquePourPublier({ lieu_prive: 'https://meet.example/abc' }), null);
});

test('adresse de l’atelier', () => {
  assert.equal(slugEvenement('Claude ou ChatGPT : par où commencer ?', '2026-11-12T17:00:00Z'), 'claude-ou-chatgpt-par-ou-commencer-2026-11-12');
  assert.equal(slugEvenement('!!!', '2026-11-12T17:00:00Z'), 'atelier-2026-11-12');
  assert.ok(slugEvtValide(slugEvenement('Atelier pratique : votre CRM en une matinée', '2026-11-27T14:00:00Z')));
  for (const s of ['../x', 'A', 'a b', '-x', '', 'x'.repeat(91)]) assert.equal(slugEvtValide(s), false, s);
});

test('le lieu privé n’est jamais affiché sur le site', () => {
  assert.equal(lieuAffiche({ genre: 'en_ligne', lieu_public: '', lieu_prive: 'https://meet.example/secret' }).includes('secret'), false);
  assert.equal(lieuAffiche({ genre: 'en_personne', lieu_public: 'Montréal' }), 'Montréal');
  const ics = fichierIcs({ slug: 'a-2026-11-12', titre: 'Atelier, pratique', debut: '2026-11-12T17:00:00Z', fin: '2026-11-12T18:00:00Z', genre: 'en_ligne', lieu_public: '', lieu_prive: 'https://meet.example/secret' }, 'https://viesolutionweb.ca');
  assert.ok(!ics.includes('secret'));
  assert.ok(ics.includes('DTSTART:20261112T170000Z'));
  assert.ok(ics.includes('SUMMARY:Atelier\\, pratique'));
});

test('places restantes', () => {
  assert.deepEqual(places(20, 6), { restantes: 14, libelle: '14 places restantes', ton: 'ok' });
  assert.deepEqual(places(20, 19), { restantes: 1, libelle: 'Plus que 1 place', ton: 'peu' });
  assert.deepEqual(places(20, 25), { restantes: 0, libelle: 'Complet', ton: 'complet' });
  const maintenant = new Date('2026-11-01T12:00:00Z');
  assert.equal(estAVenir({ statut: 'publie', debut: '2026-11-12T17:00:00Z' }, maintenant), true);
  assert.equal(estAVenir({ statut: 'brouillon', debut: '2026-11-12T17:00:00Z' }, maintenant), false);
  assert.equal(estAVenir({ statut: 'publie', debut: '2026-10-12T17:00:00Z' }, maintenant), false);
});

test('inscription : accord obligatoire, courriel valide, case « prochains ateliers » non cochée par défaut', () => {
  const bon = { nom: ' Marie  Tremblay ', courriel: ' Marie@Exemple.CA ', consentement: true };
  const r = validerInscription(bon);
  assert.deepEqual(r.valeur, { nom: 'Marie Tremblay', courriel: 'marie@exemple.ca', entreprise: null, question: null, avertir: false });
  assert.equal(validerInscription({ ...bon, consentement: 'true' }).ok, false);
  assert.equal(validerInscription({ ...bon, courriel: 'marie@' }).ok, false);
  assert.equal(validerInscription({ ...bon, courriel: 'a@b.c<script>' }).ok, false);
  assert.equal(validerInscription({ ...bon, nom: 'M' }).ok, false);
  assert.equal(validerInscription({ ...bon, avertir: 'oui' }).valeur.avertir, false);
  assert.equal(validerInscription({ ...bon, avertir: true }).valeur.avertir, true);
  assert.match(CONSENTEMENT_INSCRIPTION, /info@viesolutionweb\.ca/);
});

test('lien « libérer ma place » : signé, propre à l’inscription et au courriel', () => {
  const cle = 'x'.repeat(32);
  const j = jetonPlace('id-1', 'Marie@Exemple.ca', cle);
  assert.ok(jetonPlaceValide('id-1', 'marie@exemple.ca', j, cle));
  assert.equal(jetonPlaceValide('id-2', 'marie@exemple.ca', j, cle), false);
  assert.equal(jetonPlaceValide('id-1', 'autre@exemple.ca', j, cle), false);
  assert.equal(jetonPlaceValide('id-1', 'marie@exemple.ca', j, 'y'.repeat(32)), false);
  assert.equal(jetonPlace('id-1', 'm@e.ca', ''), '');
  assert.equal(lienLiberer('http://x.ca', 'id-1', 'm@e.ca', cle), '');
  assert.match(lienLiberer('https://viesolutionweb.ca', 'id-1', 'm@e.ca', cle), /^https:\/\/viesolutionweb\.ca\/evenements\/liberer\?i=id-1&t=/);
});

test('courriels : prénom sûr, lieu privé seulement dans le courriel', () => {
  const e = { titre: 'Atelier', genre: 'en_ligne', debut: '2026-11-12T17:00:00Z', fin: '2026-11-12T18:00:00Z', lieu_public: '', lieu_prive: 'https://meet.example/abc' };
  const c = courrielConfirmation(e, 'Marie Tremblay', 'https://viesolutionweb.ca/evenements/liberer?i=1&t=x');
  assert.ok(c.texte.startsWith('Bonjour Marie,'));
  assert.ok(c.texte.includes('https://meet.example/abc'));
  assert.ok(c.texte.includes('Jeudi 12 novembre 2026, 12 h à 13 h'));
  assert.ok(courrielConfirmation(e, 'https://faux.example', '').texte.startsWith('Bonjour,'));
  assert.ok(courrielRappel(e, 'Marie', 'l').sujet.startsWith("C'est demain !"));
  assert.ok(courrielAnnulation(e, 'Marie').texte.includes('jeudi 12 novembre'));
});

test('liste CSV : point-virgule, formules neutralisées', () => {
  const csv = csvInscrits([{ nom: '=HYPERLINK("x")', courriel: 'a@b.ca', entreprise: 'A; B', question: null, statut: 'confirmee', avertir: true, created_at: '2026-11-01T12:00:00Z' }]);
  assert.ok(csv.startsWith('﻿Nom;Courriel'));
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`));
  assert.ok(csv.includes('"A; B"'));
  assert.ok(csv.includes('Confirmée;Oui;2026-11-01'));
});
