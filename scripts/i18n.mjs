#!/usr/bin/env node
// Anglais du site — catalogue des phrases (sans dépendance, même principe que Lingui chez KHI).
//   node scripts/i18n.mjs extract   relève les t(lang, "…") de src/ et met src/i18n/en.po à jour
//                                    (nouvelles phrases ajoutées vides, phrases disparues marquées #~)
//   node scripts/i18n.mjs compile   écrit src/i18n/en.ts depuis en.po
//   node scripts/i18n.mjs check     échoue si le code a des phrases absentes de en.po ou si en.ts n'est
//                                    pas à jour ; avertit des phrases sans traduction (npm run verify)
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('..', import.meta.url));
const PO = join(RACINE, 'src/i18n/en.po');
const TS = join(RACINE, 'src/i18n/en.ts');

function fichiers(dossier) {
  const out = [];
  for (const n of readdirSync(dossier)) {
    const p = join(dossier, n);
    if (statSync(p).isDirectory()) { if (n !== 'node_modules' && n !== '_archive_old_design') out.push(...fichiers(p)); }
    else if (/\.(tsx?|mjs)$/.test(n) && !p.endsWith('src/i18n/en.ts')) out.push(p);
  }
  return out;
}

/** t(lang, "…"), t(lang, '…') ou t(lang, `…`) — premier argument quelconque (lang, 'en', l…) —, et
 *  phrase("…") : phrase française rangée dans une constante (menu, listes), traduite plus loin par t(lang, x). */
export const MOTIF = /\b(?:t\(\s*[\w.'"]+\s*,|phrase\()\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|`((?:\\.|[^`\\$])*)`)/g;
const deguillemeter = (s) => s.replace(/\\(["'`\\])/g, '$1').replace(/\\n/g, '\n');

export function extraire() {
  const vus = new Set();
  for (const f of fichiers(join(RACINE, 'src'))) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(MOTIF)) vus.add(deguillemeter(m[1] ?? m[2] ?? m[3]));
  }
  return [...vus].sort((a, b) => a.localeCompare(b, 'fr'));
}

// --- PO minimal : msgid / msgstr, chaînes sur une ligne (échappées), entrées obsolètes « #~ » ---------------
const po = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
const unpo = (s) => JSON.parse(s.replace(/\\(?!["\\n])/g, '\\\\'));

export function lirePo(texte) {
  const entrees = new Map();
  let id = null;
  for (const ligne of texte.split('\n')) {
    const a = /^(#~ )?msgid (".*")$/.exec(ligne);
    const b = /^(#~ )?msgstr (".*")$/.exec(ligne);
    if (a) id = unpo(a[2]);
    else if (b && id !== null) { if (id !== '') entrees.set(id, unpo(b[2])); id = null; }
  }
  return entrees;
}

function ecrirePo(phrases, anciennes) {
  const tete = 'msgid ""\nmsgstr ""\n"Content-Type: text/plain; charset=UTF-8\\n"\n"Language: en\\n"\n';
  const corps = phrases.map((p) => `msgid ${po(p)}\nmsgstr ${po(anciennes.get(p) || '')}\n`);
  const obsoletes = [...anciennes].filter(([k, v]) => !phrases.includes(k) && v).map(([k, v]) => `#~ msgid ${po(k)}\n#~ msgstr ${po(v)}\n`);
  return [tete, ...corps, ...obsoletes].join('\n');
}

const compiler = (entrees) => {
  const actives = [...entrees].filter(([, v]) => v);
  return `// Fichier compilé par scripts/i18n.mjs depuis src/i18n/en.po — ne pas modifier à la main.\nexport const EN: Record<string, string> = ${JSON.stringify(Object.fromEntries(actives), null, 2)};\n`;
};

const actives = (texte) => {
  // Sans les entrées obsolètes (#~) : elles ne sont pas compilées.
  return lirePo(texte.split('\n').filter((l) => !l.startsWith('#~')).join('\n'));
};

const cmd = process.argv[2];
// Lancé en ligne de commande (même par un lien symbolique), ou importé par les tests.
let direct = false;
try { direct = realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1] || '')); } catch { direct = false; }
if (!direct) {
  // importé par les tests : rien à lancer
} else if (cmd === 'extract') {
  const anciennes = existsSync(PO) ? lirePo(readFileSync(PO, 'utf8')) : new Map();
  const phrases = extraire();
  writeFileSync(PO, ecrirePo(phrases, anciennes));
  const sans = phrases.filter((p) => !anciennes.get(p)).length;
  console.log(`i18n : ${phrases.length} phrase(s), ${sans} sans traduction anglaise.`);
} else if (cmd === 'compile') {
  writeFileSync(TS, compiler(actives(readFileSync(PO, 'utf8'))));
  console.log('i18n : src/i18n/en.ts compilé.');
} else if (cmd === 'check') {
  const texte = existsSync(PO) ? readFileSync(PO, 'utf8') : '';
  const e = actives(texte);
  const manquantes = extraire().filter((p) => !e.has(p));
  const vides = [...e].filter(([, v]) => !v).length;
  const aJour = readFileSync(TS, 'utf8') === compiler(e);
  if (manquantes.length || !aJour) {
    if (manquantes.length) console.error(`i18n : ${manquantes.length} phrase(s) du code absentes de src/i18n/en.po — lancer « node scripts/i18n.mjs extract ».\n  ex. ${manquantes.slice(0, 3).join(' | ')}`);
    if (!aJour) console.error('i18n : src/i18n/en.ts n’est pas à jour — lancer « node scripts/i18n.mjs compile ».');
    process.exit(1);
  }
  console.log(`i18n : catalogue à jour${vides ? `, ${vides} phrase(s) encore sans anglais (affichées en français)` : ''}.`);
} else {
  console.error('usage : node scripts/i18n.mjs extract | compile | check');
  process.exit(2);
}
