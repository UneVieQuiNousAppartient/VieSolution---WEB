// Tests de la page « Aujourd'hui » et du réglage des relances (src/lib/crm/aujourdhui.ts). npm test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finDeJournee, construireAujourdhui, validerReglage } from '../src/lib/crm/aujourdhui.ts';

test('finDeJournee : 23 h 59 min 59,999 s, heure de Montréal (été et hiver)', () => {
  // 21 oct. 2026, 15 h UTC = 11 h à Montréal (UTC-4) → fin de journée 22 oct. 03:59:59.999 UTC
  assert.equal(finDeJournee(new Date('2026-10-21T15:00:00Z')), '2026-10-22T03:59:59.999Z');
  // 2 déc. 2026, 2 h UTC = 21 h le 1er déc. à Montréal (UTC-5) → fin 2 déc. 04:59:59.999 UTC
  assert.equal(finDeJournee(new Date('2026-12-02T02:00:00Z')), '2026-12-02T04:59:59.999Z');
});

const lead = (id, extra = {}) => ({
  id,
  name: `Personne ${id}`,
  email: `${id}@ex.ca`,
  phone: '',
  status: 'Nouveau',
  source: 'site web — contact',
  created_at: '2026-10-21T14:00:00Z',
  last_contact_at: null,
  email_opt_out_at: null,
  ...extra,
});

test('construireAujourdhui : tâches en retard / du jour, sans contact 24 h, à relancer, brouillons, alertes', () => {
  const maintenant = new Date('2026-10-21T15:00:00Z');
  const r = construireAujourdhui(
    {
      leads: [
        lead('a', { created_at: '2026-10-19T10:00:00Z' }),
        lead('b'),
        lead('c', { status: 'À relancer', created_at: '2026-10-10T10:00:00Z' }),
        lead('d', { created_at: '2026-10-18T10:00:00Z', last_contact_at: '2026-10-19T10:00:00Z' }),
        lead('e', { status: 'Contacté', created_at: '2026-10-01T10:00:00Z' }),
      ],
      taches: [
        { id: 't1', lead_id: 'a', title: 'Rappeler A', due_at: '2026-10-20T13:00:00Z' },
        { id: 't2', lead_id: 'b', title: 'Rappeler B', due_at: '2026-10-21T16:00:00Z' },
        { id: 't3', lead_id: 'c', title: 'Appeler C', due_at: '2026-10-23T13:00:00Z' },
        { id: 't4', lead_id: 'x', title: 'Sans fiche', due_at: null },
      ],
      brouillons: [
        { id: 'd1', target_id: 'b', status: 'pending', subject: 'Réponse', created_at: '2026-10-21T14:05:00Z' },
        { id: 'd2', target_id: 'a', status: 'sent', subject: 'Envoyé', created_at: '2026-10-19T11:00:00Z' },
      ],
      alertes: [
        { id: 'n1', title: 'vieille', body: '', created_at: '2026-10-20T10:00:00Z' },
        { id: 'n2', title: 'récente', body: '', created_at: '2026-10-21T10:00:00Z' },
      ],
    },
    maintenant,
  );
  assert.deepEqual(r.enRetard.map((t) => t.id), ['t1']);
  assert.equal(r.enRetard[0].lead.name, 'Personne a');
  assert.deepEqual(r.duJour.map((t) => t.id), ['t2'], 'la tâche du 23 et celle sans échéance n’y sont pas');
  assert.deepEqual(r.sansContact.map((l) => l.id), ['a'], 'b a moins de 24 h, d a été contactée');
  assert.deepEqual(r.aRelancer.map((l) => l.id), ['c']);
  assert.deepEqual(r.brouillons.map((b) => b.id), ['d1']);
  assert.equal(r.brouillons[0].lead.id, 'b');
  assert.deepEqual(r.alertes.map((a) => a.id), ['n2', 'n1'], 'plus récente d’abord');
  assert.equal(r.total, 1 + 1 + 1 + 1 + 1 + 2);
});

test('construireAujourdhui : rien à faire → total 0', () => {
  const r = construireAujourdhui({ leads: [], taches: [], brouillons: [], alertes: [] });
  assert.equal(r.total, 0);
});

test('validerReglage : marche/arrêt, délai en jours entiers de 1 à 90, rien d’autre', () => {
  assert.deepEqual(validerReglage({ enabled: false }, true), { patch: { enabled: false } });
  assert.deepEqual(validerReglage({ delai_jours: 3 }, true), { patch: { delay_hours: 72 } });
  assert.deepEqual(validerReglage({ enabled: true, delai_jours: 90 }, true), { patch: { enabled: true, delay_hours: 2160 } });
  assert.match(validerReglage({ delai_jours: 0 }, true).erreur, /délai invalide/);
  assert.match(validerReglage({ delai_jours: 91 }, true).erreur, /délai invalide/);
  assert.match(validerReglage({ delai_jours: 2.5 }, true).erreur, /délai invalide/);
  assert.match(validerReglage({ delai_jours: '3' }, true).erreur, /délai invalide/);
  assert.match(validerReglage({ delai_jours: 3 }, false).erreur, /ne se règle pas/);
  assert.match(validerReglage({ enabled: 'oui' }, true).erreur, /invalide/);
  assert.match(validerReglage({}, true).erreur, /rien à changer/);
  assert.match(validerReglage(null, true).erreur, /manquant/);
});
