// Règles de conservation et d'effacement (Loi 25).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aConserverJusquau, aSupprimer, derniereActivite, empreinteCourriel, motifExact } from '../src/lib/crm/conservation.ts';

test('dernière activité : la plus récente des dates connues', () => {
  assert.equal(derniereActivite({ created_at: '2024-01-10T12:00:00Z', last_contact_at: '2024-06-01T12:00:00Z', status_changed_at: null }).toISOString(), '2024-06-01T12:00:00.000Z');
  assert.equal(derniereActivite({ created_at: 'n’importe quoi' }), null);
});

test('24 mois sans contact, mois civils (31 août + 24 mois = 31 août)', () => {
  const l = { created_at: '2024-08-31T12:00:00Z' };
  assert.equal(aConserverJusquau(l).toISOString(), '2026-08-31T12:00:00.000Z');
  assert.equal(aSupprimer(l, new Date('2026-08-31T11:59:00Z')), false);
  assert.equal(aSupprimer(l, new Date('2026-08-31T12:00:00Z')), true);
  assert.equal(aConserverJusquau({ created_at: '2024-02-29T00:00:00Z' }, 12).toISOString(), '2025-02-28T00:00:00.000Z');
});

test('un contact récent repousse la suppression', () => {
  assert.equal(aSupprimer({ created_at: '2023-01-01T00:00:00Z', last_contact_at: '2026-01-01T00:00:00Z' }, new Date('2026-10-24T00:00:00Z')), false);
  assert.equal(aSupprimer({ created_at: 'x' }, new Date()), false);
});

test('empreinte du courriel : jamais le courriel, insensible à la casse, liée au secret', () => {
  const cle = 'x'.repeat(32);
  const e = empreinteCourriel(' Marie@Exemple.CA ', cle);
  assert.equal(e, empreinteCourriel('marie@exemple.ca', cle));
  assert.notEqual(e, empreinteCourriel('marie@exemple.ca', 'y'.repeat(32)));
  assert.ok(!e.includes('marie'));
  assert.equal(empreinteCourriel('marie@exemple.ca', ''), '');
});

test('motif exact : les jokers sont échappés', () => {
  assert.equal(motifExact('A_b%c@x.ca'), 'a\\_b\\%c@x.ca');
});
