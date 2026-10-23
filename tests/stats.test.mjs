// Règles des statistiques (étape D) : ce qui est gardé d'une visite, et les chiffres de l'onglet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appareilDe, cheminVisite, chiffresCourriels, derniersJours, estRobot, resumeVisites, sourceVisite } from '../src/lib/stats.ts';

test('chemin de visite : pages du site seulement, sans paramètres', () => {
  assert.equal(cheminVisite('/blog/claude-ou-chatgpt?utm=x#plan'), '/blog/claude-ou-chatgpt');
  assert.equal(cheminVisite('/'), '/');
  assert.equal(cheminVisite('/ia/'), '/ia');
  for (const v of ['/admin', '/admin/x', '/api/avis', '//exemple.com', '/\\x', 'https://x.ca/', '/<script>', '', 42, '/' + 'a'.repeat(250)]) assert.equal(cheminVisite(v), '', String(v));
});

test('source : le domaine seulement, jamais le site lui-même', () => {
  assert.equal(sourceVisite('https://www.google.com/search?q=courtier+nom', 'viesolutionweb.ca'), 'google.com');
  assert.equal(sourceVisite('https://viesolutionweb.ca/ia', 'viesolutionweb.ca'), null);
  assert.equal(sourceVisite('https://www.viesolutionweb.ca/', 'viesolutionweb.ca'), null);
  assert.equal(sourceVisite('https://vie-solution-web.vercel.app/', 'viesolutionweb.ca'), null);
  for (const v of ['', 'pas une adresse', 'javascript:alert(1)', null]) assert.equal(sourceVisite(v, 'viesolutionweb.ca'), null);
});

test('appareil et robots', () => {
  assert.equal(appareilDe('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Mobile/15E148'), 'mobile');
  assert.equal(appareilDe('Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari'), 'mobile');
  assert.equal(appareilDe('Mozilla/5.0 (iPad; CPU OS 18_0)'), 'tablette');
  assert.equal(appareilDe('Mozilla/5.0 (Linux; Android 14; SM-X710) Safari'), 'tablette');
  assert.equal(appareilDe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130'), 'ordinateur');
  assert.equal(estRobot('Mozilla/5.0 (compatible; Googlebot/2.1)'), true);
  assert.equal(estRobot('HeadlessChrome/130'), true);
  assert.equal(estRobot(''), true);
  assert.equal(estRobot('Mozilla/5.0 (Windows NT 10.0) Chrome/130'), false);
});

test('30 jours de calendrier, même au changement d’heure', () => {
  const j = derniersJours(new Date('2026-11-02T05:30:00Z'), 30); // 0 h 30 à Montréal, lendemain du retour à l'heure normale
  assert.equal(j.length, 30);
  assert.equal(j[29], '2026-11-02');
  assert.equal(j[0], '2026-10-04');
  assert.equal(new Set(j).size, 30);
  const p = derniersJours(new Date('2027-03-15T04:30:00Z'), 30); // 0 h 30, lendemain du passage à l'heure avancée
  assert.ok(p.includes('2027-03-14') && p.includes('2027-03-13'));
});

test('résumé des visites : jour local, semaine, pages, articles, sources', () => {
  const maintenant = new Date('2026-10-23T16:00:00Z');
  const v = (chemin, created_at, source = null, appareil = 'ordinateur') => ({ chemin, created_at, source, appareil });
  const r = resumeVisites([
    v('/', '2026-10-23T15:00:00Z', 'google.com', 'mobile'),
    v('/blog/claude-ou-chatgpt', '2026-10-23T03:30:00Z'), // 23 h 30 le 22 à Montréal
    v('/blog/claude-ou-chatgpt', '2026-10-20T12:00:00Z', 'google.com'),
    v('/blog/loi-25', '2026-10-10T12:00:00Z'),
    v('/ia', '2026-09-01T12:00:00Z'), // hors des 30 jours
  ], maintenant);
  assert.equal(r.total30, 4);
  assert.equal(r.total7, 3);
  assert.equal(r.parJour.length, 30);
  assert.equal(r.parJour.find((d) => d.jour === '2026-10-22').total, 1);
  assert.deepEqual(r.articles, [{ cle: 'claude-ou-chatgpt', total: 2 }, { cle: 'loi-25', total: 1 }]);
  assert.deepEqual(r.sources[0], { cle: 'Accès direct ou inconnu', total: 2 });
  assert.deepEqual(r.appareils, { mobile: 1, tablette: 0, ordinateur: 3 });
  assert.equal(r.pages[0].cle, '/blog/claude-ou-chatgpt');
});

test('courriels envoyés et reçus, 7 et 30 jours', () => {
  const maintenant = new Date('2026-10-23T16:00:00Z');
  const c = [
    { direction: 'out', received_at: '2026-10-22T12:00:00Z' },
    { direction: 'out', received_at: '2026-10-05T12:00:00Z' },
    { direction: 'in', received_at: '2026-10-21T12:00:00Z' },
    { direction: 'in', received_at: '2026-08-01T12:00:00Z' },
  ];
  assert.deepEqual(chiffresCourriels(c, maintenant), { envoyes7: 1, envoyes30: 2, recus7: 1, recus30: 1 });
});
