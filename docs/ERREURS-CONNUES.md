# Erreurs connues — <Nom du projet>

<!-- Gabarit de la méthode de travail (règle .claude/rules/suivi-taches.md, « Registre des erreurs connues »).
Remplacer <…>, supprimer les deux lignes d'exemple une fois la première vraie erreur notée. -->

**Lu au début de chaque session**, après `docs/ETAT-ACTUEL.md` (par `grep` sur le message d'erreur si le
fichier devient long). But : ne jamais payer deux fois le diagnostic d'une même erreur.

Une ligne entre ici quand une erreur s'est **produite deux fois**, ou qu'elle a **coûté un vrai diagnostic**
(skill `incident`). Le message est recopié **exactement** (c'est ce qu'on cherche avec `grep`), la cause est
celle qui a été **prouvée**, pas supposée. Numérotation continue (E01, E02…) ; une erreur résolue pour de bon
reste dans la table, marquée « (obsolète : <raison>) », pour que son numéro ne soit jamais réutilisé.

Ce qu'un motif peut détecter devient **en plus** une règle de `scripts/check-rules.mjs`
(`.claude/rules/regles-metier.md`) : la table explique, la règle empêche. Colonne « Règle » : l'`id` de la
règle, sinon « — ».

| # | Erreur (message exact) | Cause | Solution | Règle |
|---|---|---|---|---|
| E01 | `Error: Cannot access refs during render  react-hooks/refs` sur `{...register('nom')}` ; `Error: Calling setState synchronously within an effect` sur `useEffect(() => { load(); }, [load])` | Règles du React Compiler (eslint-config-next 16) qui ne reconnaissent pas le `ref` renvoyé par `register()` de react-hook-form, ni un chargeur `async` | Règles passées en `warn` dans `eslint.config.mjs` (2026-10-17) ; ne pas « corriger » le code pour les faire taire | — |
| E02 | `.next/dev/types/validator.ts(197,1): error TS2304: Cannot find name 'outils'.` (et autres `TS2304` dans `.next/dev/types/validator.ts`) au `npm run typecheck` | Fichier généré par `next dev`, tronqué quand le serveur de test est arrêté (`fuser -k 3100/tcp`) pendant qu'il l'écrit ; `tsc` inclut `.next/dev/types` (prouvé 2026-10-21 : ligne réduite à `outils-sur-mesure/page.tsx`) | `rm -rf .next` (tout le dossier, pas seulement `.next/dev` : voir E03) puis relancer `npm run verify` ; `.next` est ignoré par Git | — |
| E03 | `Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'` (`next dev`, toutes les pages en 500 ; `Error while looking up import map: next/font/google queries have exactly one entry`) | Cache Turbopack incohérent après suppression de `.next/dev` seul (2026-10-21 : apparu juste après `rm -rf .next/dev`, disparu après `rm -rf .next`) | Arrêter le serveur, `rm -rf .next`, relancer `next dev`. Même message pendant `npm run verify` si le serveur de test n'est pas encore arrêté (2026-10-21) : attendre l'arrêt (`fuser -k 3100/tcp; sleep 3`) avant `rm -rf .next` et la vérification. Revu le 2026-10-22 : même erreur sur un `.next` tout neuf (`rm -rf .next` puis `next dev`) ; contournement qui a marché : `npx next build && npx next start -p 3100` | — |
| E04 | `MCP server "Supabase" tool "apply_migration" timed out after 60s` (rien d'appliqué ensuite : aucun objet créé, aucune migration notée, aucun verrou en attente) | Lié à l'instruction destructive `DROP TRIGGER IF EXISTS …` (constaté 2026-10-22 : trois échecs avec `DROP`, le même bloc sans `DROP` passe aussitôt, deux blocs sans `DROP` plus longs passent du premier coup). Cause probable : le connecteur attend une confirmation pour les instructions destructives et l'attente expire | Écrire la migration sans instruction destructive : `CREATE OR REPLACE TRIGGER` au lieu de `DROP TRIGGER` + `CREATE TRIGGER` ; découper en blocs. Avant de relancer, vérifier ce qui a été appliqué (compter les objets) | — |
