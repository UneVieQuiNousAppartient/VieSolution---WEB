// Règles de Google Agenda (étape C) : réglages, créneaux libres, réservation, événement Google.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  REGLAGES_AGENDA_DEFAUT, creneauPermis, creneauxLibres, dateHeureLisible, evenementGoogle, instantMontreal, lireReglagesAgenda,
  parJour, validerReglagesAgenda, validerReservation,
} from '../src/lib/agenda.ts';
import { creneauPourCrm } from '../src/lib/agenda.ts';
import { lireCreneau } from '../src/lib/crm/tableau.ts';
import { etatSigne, verifierEtat } from '../src/lib/agenda-etat.ts';

const R = { ...REGLAGES_AGENDA_DEFAUT, horizonJours: 3 };

test('réglages : défauts 7 jours sur 7, 9 h à 17 h, 30 min', () => {
  assert.deepEqual(REGLAGES_AGENDA_DEFAUT.jours, [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(validerReglagesAgenda({ ...R, jours: [] }).ok, false);
  assert.equal(validerReglagesAgenda({ ...R, debut: '17:00', fin: '09:00' }).ok, false);
  assert.equal(validerReglagesAgenda({ ...R, duree: 25 }).ok, false);
  assert.equal(validerReglagesAgenda({ ...R, debut: '9h' }).ok, false);
  assert.deepEqual(validerReglagesAgenda({ ...R, jours: [5, 1, 1, 9] }).valeur.jours, [1, 5]);
  assert.deepEqual(lireReglagesAgenda('pas du json'), REGLAGES_AGENDA_DEFAUT);
  assert.deepEqual(lireReglagesAgenda(JSON.stringify({ ...R, fin: '12:00' })).fin, '12:00');
});

test('heure de Montréal → UTC, et heure inexistante au changement d’heure', () => {
  assert.equal(instantMontreal('2026-11-12', 9 * 60).toISOString(), '2026-11-12T14:00:00.000Z');
  assert.equal(instantMontreal('2026-10-23', 9 * 60).toISOString(), '2026-10-23T13:00:00.000Z');
  assert.equal(instantMontreal('2027-03-14', 2 * 60 + 30), null);
});

test('créneaux : délai de 24 h, plage 9 h-17 h, fin au plus tard à 17 h', () => {
  const maintenant = new Date('2026-11-10T15:00:00Z'); // 10 nov., 10 h
  const c = creneauxLibres(R, [], maintenant);
  assert.equal(c[0].debut, '2026-11-11T15:00:00.000Z'); // 11 nov., 10 h (24 h plus tard)
  assert.ok(c.every((x) => new Date(x.debut) >= new Date('2026-11-11T15:00:00Z')));
  const jours = parJour(c);
  assert.equal(jours.get('2026-11-12').length, 16); // 9 h à 16 h 30
  assert.equal(jours.get('2026-11-12').at(-1).fin, '2026-11-12T22:00:00.000Z'); // 17 h
  assert.equal(jours.get('2026-11-13').at(-1).debut, '2026-11-13T15:00:00.000Z'); // 13 nov. : l'horizon (3 jours) s'arrête à 10 h
});

test('créneaux : jours fermés et périodes occupées retirés (chevauchement partiel compris)', () => {
  const maintenant = new Date('2026-11-10T15:00:00Z');
  const semaine = { ...R, jours: [1, 2, 3, 4, 5] }; // 14-15 nov. = samedi-dimanche
  const c = creneauxLibres({ ...semaine, horizonJours: 6 }, [{ debut: '2026-11-12T15:10:00Z', fin: '2026-11-12T16:00:00Z' }], maintenant);
  const j = parJour(c);
  assert.equal(j.has('2026-11-14'), false);
  assert.equal(j.has('2026-11-15'), false);
  const le12 = j.get('2026-11-12').map((x) => x.debut);
  assert.ok(!le12.includes('2026-11-12T15:00:00.000Z')); // 10 h, chevauche 10 h 10
  assert.ok(!le12.includes('2026-11-12T15:30:00.000Z')); // 10 h 30
  assert.ok(le12.includes('2026-11-12T16:00:00.000Z')); // 11 h, libre (fin exacte de l'occupation)
});

test('créneaux : la nuit du retour à l’heure normale ne fausse pas les heures', () => {
  const c = creneauxLibres({ ...R, horizonJours: 4 }, [], new Date('2026-10-30T12:00:00Z'));
  const le1 = parJour(c).get('2026-11-01');
  assert.equal(le1[0].debut, '2026-11-01T14:00:00.000Z'); // 9 h, UTC−5
  assert.equal(le1.length, 16);
});

test('le serveur n’accepte qu’un créneau libre', () => {
  const libres = [{ debut: '2026-11-12T15:00:00.000Z', fin: '2026-11-12T15:30:00.000Z' }];
  assert.equal(creneauPermis('2026-11-12T15:00:00.000Z', libres), true);
  assert.equal(creneauPermis('2026-11-12T15:10:00.000Z', libres), false);
  assert.equal(creneauPermis(42, libres), false);
});

test('réservation : nom, courriel valide, téléphone nettoyé', () => {
  const r = validerReservation({ debut: '2026-11-12T15:00:00Z', nom: ' Marie ', courriel: 'Marie@Ex.CA', telephone: '438 506-5243<b>', sujet: '' });
  assert.deepEqual(r.valeur, { debut: '2026-11-12T15:00:00.000Z', nom: 'Marie', courriel: 'marie@ex.ca', telephone: '438 506-5243', sujet: null });
  assert.equal(validerReservation({ debut: 'demain', nom: 'Marie', courriel: 'm@e.ca' }).ok, false);
  assert.equal(validerReservation({ debut: '2026-11-12T15:00:00Z', nom: 'Marie', courriel: 'm@e' }).ok, false);
});

test('événement Google : texte fixe (rien du visiteur), invité, lien Meet, fuseau de Montréal', () => {
  const r = validerReservation({ debut: '2026-11-12T15:00:00Z', nom: 'Facture impayée https://faux.example', courriel: 'm@e.ca', telephone: '438', sujet: '<a href="https://faux.example">payez</a>' }).valeur;
  const e = evenementGoogle(r, '2026-11-12T15:30:00.000Z', 'abc');
  assert.ok(!JSON.stringify(e).includes('faux.example'));
  assert.ok(!JSON.stringify(e).includes('Facture'));
  assert.equal(e.summary, 'Appel découverte — Vie Solution Web');
  assert.deepEqual(e.attendees, [{ email: 'm@e.ca' }]);
  assert.equal(e.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
  assert.equal(e.start.timeZone, 'America/Toronto');
  assert.equal(dateHeureLisible('2026-11-12T15:00:00Z'), 'jeudi 12 novembre 2026 à 10 h');
});

test('connexion Google : le jeton « state » doit venir de l’admin, être identique au cookie et récent', () => {
  const s = 'x'.repeat(32);
  const e = etatSigne(s, 1_000_000);
  assert.equal(verifierEtat(s, e, e, 1_000_000), true);
  assert.equal(verifierEtat(s, e, 'autre', 1_000_000), false); // pas le cookie de ce navigateur
  assert.equal(verifierEtat(s, e, e, 1_000_000 + 11 * 60_000), false); // expiré
  assert.equal(verifierEtat('y'.repeat(32), e, e, 1_000_000), false); // autre secret
  const falsifie = e.replace(/\.(\d+)\./, (_, n) => `.${Number(n) + 9_999_999}.`);
  assert.equal(verifierEtat(s, falsifie, falsifie, 1_000_000), false); // expiration modifiée
  assert.equal(verifierEtat('', e, e, 1_000_000), false);
});

test('le rendez-vous Google est lu par l’admin (même format que l’ancien calendrier)', () => {
  assert.equal(creneauPourCrm('2026-11-12T15:00:00Z'), 'Jeu 12 novembre 2026 · 10:00');
  assert.equal(creneauPourCrm('2026-08-04T13:30:00Z'), 'Mar 4 août 2026 · 09:30');
  for (const iso of ['2026-11-12T15:00:00.000Z', '2026-11-01T14:00:00.000Z', '2026-08-04T13:30:00.000Z']) {
    assert.equal(lireCreneau(`Appel découverte réservé — ${creneauPourCrm(iso)}`).toISOString(), iso);
  }
});
