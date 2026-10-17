# Suivi des tâches — Vie Solution Web

**Dernière mise à jour : 2026-10-17** — dernière section : 1.

Règle : `.claude/rules/suivi-taches.md`. Se consulte par `grep`, jamais en entier.

## 1. ✅ Installation de la méthode de travail (2026-10-17)

**Contexte / demande** : Camille veut que les agents de `methode-travail` travaillent ensemble sur le site, et un rapport réutilisable pour ses autres projets.

**Ce qui a été fait** : copie de `modele/` (agents, règles, skills, scripts, hooks, gabarits) pour les fichiers absents ; `CLAUDE.md` complété (ordre de lecture, Fiche projet) ; `npm run verify` ajouté ; sections « Propre au projet » remplies pour `orchestrateur`, `ux-agent`, `data-agent`, `ai-agent` ; `docs/ETAT-ACTUEL.md`, `docs/ERREURS-CONNUES.md`, ce fichier.

**Vérification technique** : `node scripts/verifier-methode.mjs` → 26 ✔, 0 ✖ ; `npm run typecheck`, `npm run lint` (0 erreur), `next build`, `check-rules`, `check-secrets-suivis` verts. Commit poussé avant `qa-agent` (hook de session) : le `qa-agent` relira ce diff avec celui du chantier pme-accessible à la livraison (section 2).

**Non fait dans ce round** : aucune règle métier propre au projet dans `scripts/check-rules.mjs` (aucun incident vécu encore) ; pas de CI GitHub Actions (exemples dans `methode-travail/exemples/`).
