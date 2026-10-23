// Tests du tableau de bord de /admin (src/lib/crm/tableau.ts). npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SUJETS_STAGE,
  cleSource,
  construireTableau,
  debutDeSemaine,
  debutDuJour,
  etiquetteJour,
  instantLocal,
  lireCreneau,
  lireMomentSouhaite,
} from '../src/lib/crm/tableau.ts';
import { SUJETS_HORS_PROSPECTION } from '../src/lib/crm/regles.ts';

test('parité : sujets de stage identiques à regles.ts', () => {
  assert.deepEqual([...SUJETS_STAGE], [...SUJETS_HORS_PROSPECTION]);
});

test('heure de Montréal : instant local, minuit, lundi (été et hiver)', () => {
  assert.equal(instantLocal(2026, 10, 28, 10, 0).toISOString(), '2026-10-28T14:00:00.000Z'); // UTC-4
  assert.equal(instantLocal(2026, 12, 2, 9, 30).toISOString(), '2026-12-02T14:30:00.000Z'); // UTC-5
  assert.equal(instantLocal(2026, 10, 32).toISOString(), '2026-11-01T04:00:00.000Z'); // 32 oct. = 1er nov.
  // 23 oct. 2026, 2 h UTC = 22 oct. 22 h à Montréal
  assert.equal(debutDuJour(new Date('2026-10-23T02:00:00Z')).toISOString(), '2026-10-22T04:00:00.000Z');
  assert.equal(debutDuJour(new Date('2026-10-23T02:00:00Z'), 1).toISOString(), '2026-10-23T04:00:00.000Z');
  // jeudi 22 oct. → lundi 19 oct. ; dimanche 25 oct. → lundi 19 oct.
  assert.equal(debutDeSemaine(new Date('2026-10-22T16:00:00Z')).toISOString(), '2026-10-19T04:00:00.000Z');
  assert.equal(debutDeSemaine(new Date('2026-10-25T20:00:00Z')).toISOString(), '2026-10-19T04:00:00.000Z');
  // semaine du changement d'heure (1er nov. 2026) : le lundi suivant est à UTC-5
  assert.equal(debutDeSemaine(new Date('2026-11-03T16:00:00Z')).toISOString(), '2026-11-02T05:00:00.000Z');
  assert.equal(etiquetteJour(new Date('2026-09-01T12:00:00Z')), '1er sept.');
  assert.equal(etiquetteJour(new Date('2026-08-04T12:00:00Z')), '4 août');
});

test('lireCreneau : le texte écrit par le calendrier de /rdv', () => {
  const t = "rdv-decouverte — Demande d'appel découverte — Mar 28 octobre 2026 · 10:00";
  assert.equal(lireCreneau(t).toISOString(), '2026-10-28T14:00:00.000Z');
  assert.equal(lireCreneau('Demande — Mer 2 décembre 2026 · 13:30').toISOString(), '2026-12-02T18:30:00.000Z');
  for (const t of [null, '', 'mardi matin', 'Mar 28 octobr 2026 · 10:00', 'Mar 28 octobre 2026 · 25:00', 'Mar 0 octobre 2026 · 10:00']) {
    assert.equal(lireCreneau(t), null, String(t));
  }
});

test('lireMomentSouhaite : demande faite par la bulle IA', () => {
  assert.equal(lireMomentSouhaite('…\nMoment souhaité : mardi matin\nBesoin : factures'), 'mardi matin');
  assert.equal(lireMomentSouhaite('Moment souhaité : non précisé'), null);
  assert.equal(lireMomentSouhaite('autre texte'), null);
});

test('cleSource : provenance lisible', () => {
  assert.equal(cleSource('site web — contact'), 'contact');
  assert.equal(cleSource('site web — rdv'), 'rdv');
  assert.equal(cleSource('site web — chatbot'), 'chatbot');
  assert.equal(cleSource('site web — devis'), 'devis');
  assert.equal(cleSource('site web'), 'autre');
  assert.equal(cleSource(''), 'autre');
});

const MAINTENANT = new Date('2026-10-23T16:00:00Z'); // jeudi 23 oct., midi à Montréal
const ilYa = (h) => new Date(MAINTENANT.getTime() - h * 3600_000).toISOString();
const lead = (id, extra = {}) => ({
  id,
  name: `Personne ${id}`,
  email: `${id}@ex.ca`,
  phone: '',
  status: 'Nouveau',
  source: 'site web — contact',
  service_interest: 'automatisation',
  need: '',
  created_at: ilYa(2),
  status_changed_at: null,
  last_contact_at: null,
  ...extra,
});

test('construireTableau : tuiles, rendez-vous, à appeler, provenance', () => {
  const r = construireTableau(
    {
      leads: [
        lead('a'), // jamais contactée, 2 h → Haute
        lead('b', { created_at: ilYa(30) }), // jamais contactée, 30 h → Urgente
        lead('c', { status: 'À relancer', last_contact_at: ilYa(100), created_at: ilYa(200) }), // Haute
        lead('d', { status: 'Contacté', last_contact_at: ilYa(5), created_at: ilYa(48) }), // tâche en retard → Normale
        lead('e', { status: 'Client', status_changed_at: ilYa(10), created_at: ilYa(24 * 10), last_contact_at: ilYa(20) }),
        lead('f', { status: 'RDV', source: 'site web — rdv', service_interest: 'rdv-decouverte',
          need: "rdv-decouverte — Demande d'appel découverte — Jeu 23 octobre 2026 · 14:30", created_at: ilYa(20) }),
        lead('g', { status: 'RDV', source: 'site web — rdv', service_interest: 'rdv-decouverte',
          need: "rdv-decouverte — Demande d'appel découverte — Ven 24 octobre 2026 · 09:00", created_at: ilYa(3) }),
        lead('h', { status: 'RDV', source: 'site web — rdv', service_interest: 'rdv-decouverte',
          need: 'rdv-decouverte — Moment souhaité : mardi matin\nBesoin : site', created_at: ilYa(4) }),
        lead('s', { service_interest: 'candidature-stage', created_at: ilYa(1) }), // stage : hors tuiles
        lead('vieux', { created_at: ilYa(24 * 40), status: 'Perdu', last_contact_at: ilYa(24 * 39) }), // hors 30 jours
        lead('prec', { created_at: ilYa(24 * 45), status: 'Contacté', last_contact_at: ilYa(24 * 44) }), // période précédente
      ],
      taches: [
        { id: 't1', lead_id: 'd', title: 'Rappeler', due_at: ilYa(1) },
        { id: 't2', lead_id: 'a', title: 'Rappeler', due_at: new Date(MAINTENANT.getTime() + 3600_000).toISOString() },
      ],
      brouillons: [{ status: 'pending' }, { status: 'sent' }, { status: 'pending' }],
    },
    30,
    MAINTENANT,
  );

  assert.equal(r.nouvelles.n, 8, 'a b c d e f g h (sans le stage, sans les vieilles)');
  assert.equal(r.nouvelles.precedent, 2, 'vieux (40 j) et prec (45 j)');
  assert.equal(r.nouvelles.serie.reduce((x, y) => x + y, 0), 8);
  assert.equal(r.nouvelles.jamaisContactees, 2, 'a et b');
  assert.deepEqual(r.retard, { n: 1, sansContact24h: 1 });

  assert.equal(r.rdv.n, 2, 'f (aujourd’hui 14 h 30) et g (demain 9 h)');
  assert.equal(r.rdv.aujourdhui, 1);
  assert.deepEqual(r.rdv.parJour, [1, 1, 0, 0, 0, 0, 0]);
  assert.deepEqual(r.rendezVous.map((x) => [x.lead.id, x.demain]), [['f', false], ['g', true]]);
  assert.deepEqual(r.rdvAConfirmer.map((x) => [x.lead.id, x.moment]), [['h', 'mardi matin']]);

  assert.deepEqual(r.clients, { n: 1, sur: 8, taux: 13, gagnes: 1 });
  // Priorité, puis la plus ancienne ; le stage (s) reste à rappeler ; RDV, Client et Perdu en sont exclus.
  assert.deepEqual(r.aAppeler.map((x) => [x.lead.id, x.priorite, x.raison]), [
    ['b', 'Urgente', 'jamais_contacte'],
    ['c', 'Haute', 'a_relancer'],
    ['a', 'Haute', 'jamais_contacte'],
    ['s', 'Haute', 'jamais_contacte'],
    ['d', 'Normale', 'tache_en_retard'],
  ]);

  assert.deepEqual(r.sources.map((s) => [s.cle, s.n]), [['contact', 5], ['rdv', 3]]);
  assert.equal(r.brouillons, 2);
  assert.deepEqual(r.compteurs, { demandes: 10, clients: 1, rdv: 3, stages: 1, taches: 2 });

  assert.equal(r.semaines.length, 12);
  assert.equal(r.semaines[11].debut, '2026-10-19T04:00:00.000Z', 'semaine en cours : lundi 19 oct.');
  assert.equal(r.semaines.reduce((x, s) => x + s.demandes, 0), 10, 'les 12 semaines couvrent aussi vieux et prec');
});

test('construireTableau : vide, et période de 7 jours', () => {
  const vide = construireTableau({ leads: [], taches: [], brouillons: [] }, 7, MAINTENANT);
  assert.equal(vide.nouvelles.n, 0);
  assert.equal(vide.clients.taux, null);
  assert.deepEqual(vide.sources, []);
  assert.deepEqual(vide.aAppeler, []);
  assert.equal(vide.semaines.every((s) => s.demandes === 0), true);
  const sept = construireTableau({ leads: [lead('x', { created_at: ilYa(24 * 8) }), lead('y')], taches: [], brouillons: [] }, 7, MAINTENANT);
  assert.equal(sept.nouvelles.n, 1);
  assert.equal(sept.nouvelles.precedent, 1);
});

test('prospection : à part des demandes reçues et du taux, comptée dans les clients gagnés', async () => {
  const { estProspection } = await import('../src/lib/crm/tableau.ts');
  const r = construireTableau(
    {
      leads: [
        lead('a'),
        lead('e', { status: 'Client', status_changed_at: ilYa(10), created_at: ilYa(24 * 10), last_contact_at: ilYa(20) }),
        lead('p1', { status: 'Prospect', source: 'admin — Événement', tags: ['prospection'] }),
        lead('p2', { status: 'Contacté', source: 'admin — Autre', tags: ['prospection'], last_contact_at: ilYa(1) }),
        lead('p3', { status: 'Client', source: 'admin — Autre', tags: ['prospection'], status_changed_at: ilYa(5), last_contact_at: ilYa(6) }),
      ],
      taches: [],
      brouillons: [],
    },
    30,
    MAINTENANT,
  );
  assert.equal(r.nouvelles.n, 2, 'a et e seulement : la prospection n’est pas une demande reçue');
  assert.deepEqual(r.clients, { n: 1, sur: 2, taux: 50, gagnes: 2 }, 'taux sur les demandes ; e et p3 gagnés');
  assert.deepEqual(r.prospection, { enCours: 2, gagnes: 1 }, 'p1 et p2 en cours, p3 devenue cliente');
  assert.equal(r.semaines.reduce((x, s) => x + s.demandes, 0), 2);
  assert.ok(!r.aAppeler.some((x) => x.lead.id === 'p1'), 'un prospect n’est pas « jamais contacté » d’une demande');
  assert.equal(estProspection({ status: 'Prospect', tags: null }), true);
  assert.equal(estProspection({ status: 'Client', tags: ['prospection'] }), true, 'l’étiquette reste après l’étape');
  assert.equal(estProspection({ status: 'Nouveau', tags: [] }), false);
});
