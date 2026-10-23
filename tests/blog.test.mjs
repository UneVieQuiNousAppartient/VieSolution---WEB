// Règles du Blog : lecture des articles approuvés (src/content/blog) et de leur Markdown.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { ancre, cheminArticle, lienPermis, slugValide, lireCorps, lireEnTete, lireLigne, minutesDeLecture, planDe } from '../src/lib/blog-markdown.ts';

const DOSSIER = new URL('../src/content/blog/', import.meta.url);
const articles = readdirSync(DOSSIER).filter((f) => f.endsWith('.md')).map((f) => ({ slug: f.slice(0, -3), source: readFileSync(new URL(f, DOSSIER), 'utf8') }));

test('les 6 articles approuvés ont un en-tête complet et une adresse simple', () => {
  assert.equal(articles.length, 6);
  for (const a of articles) {
    const { enTete } = lireEnTete(a.source);
    assert.match(a.slug, /^[a-z0-9-]+$/);
    assert.ok(enTete.resume.length <= 160, a.slug);
    assert.ok(enTete.description.length <= 155, a.slug);
    assert.match(enTete.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(enTete.auteur, 'Camille Yvan, Vie Solution Web');
  }
  assert.equal(new Set(articles.map((a) => lireEnTete(a.source).enTete.ordre)).size, 6);
});

test('aucun article publié ne garde une mention [à confirmer]', () => {
  for (const a of articles) assert.ok(!/à confirmer/i.test(a.source), a.slug);
});

test('aucun montant en dollars dans les articles', () => {
  for (const a of articles) assert.ok(!/\d\s*\$|\$\s*\d/.test(a.source), a.slug);
});

test('chaque lien d’article est interne ou https', () => {
  for (const a of articles) {
    for (const b of lireCorps(lireEnTete(a.source).corps)) {
      const lignes = b.type === 'ul' || b.type === 'ol' ? b.elements : [b.morceaux];
      for (const l of lignes) for (const m of l) if (m.t === 'lien') assert.ok(lienPermis(m.href), `${a.slug} ${m.href}`);
    }
  }
});

test('lireLigne : gras, liens, et un lien javascript: reste du texte', () => {
  assert.deepEqual(lireLigne('Voir **ceci** et [la page](/ia).'), [
    { t: 'texte', v: 'Voir ' }, { t: 'gras', v: 'ceci' }, { t: 'texte', v: ' et ' }, { t: 'lien', v: 'la page', href: '/ia' }, { t: 'texte', v: '.' },
  ]);
  assert.deepEqual(lireLigne('[piège](javascript:alert(1))'), [{ t: 'texte', v: 'piège' }, { t: 'texte', v: ')' }]);
  assert.equal(lienPermis('//exemple.com'), false);
  assert.equal(lienPermis('http://exemple.com'), false);
  assert.equal(lienPermis('/\\exemple.com'), false);
  assert.equal(lienPermis('data:text/html,x'), false);
  assert.equal(lienPermis('/ia#formation'), true);
});

test('lireCorps : titres, paragraphes et listes', () => {
  const blocs = lireCorps('Intro\nsuite.\n\n## 1. Partir d’une tâche\n- un\n- deux\n\n1. a\n2. b\n\n## À retenir\n- x');
  assert.deepEqual(blocs.map((b) => b.type), ['p', 'h2', 'ul', 'ol', 'h2', 'ul']);
  assert.equal(blocs[1].id, 'partir-d-une-tache');
  assert.deepEqual(planDe(blocs).map((p) => p.id), ['partir-d-une-tache']);
  assert.equal(ancre('## Sources'.replace('## ', '')), 'sources');
});

test('adresse d’article : seuls les noms simples passent, et le chemin est encodé', () => {
  assert.equal(slugValide('claude-ou-chatgpt'), true);
  for (const s of ['javascript:x', '../x', 'a b', 'A', '-x', 'x-', '']) assert.equal(slugValide(s), false, s);
  assert.equal(cheminArticle('a/b'), '/blog/a%2Fb');
  for (const a of articles) assert.ok(slugValide(a.slug), a.slug);
});

test('minutesDeLecture : au moins 1', () => {
  assert.equal(minutesDeLecture('un deux'), 1);
  assert.equal(minutesDeLecture('mot '.repeat(1200)), 6);
});
