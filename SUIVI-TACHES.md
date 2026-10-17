# Suivi des tâches — Vie Solution Web

**Dernière mise à jour : 2026-10-17** — dernière section : 2.

Règle : `.claude/rules/suivi-taches.md`. Se consulte par `grep`, jamais en entier.

## 1. ✅ Installation de la méthode de travail (2026-10-17)

**Contexte / demande** : Camille veut que les agents de `methode-travail` travaillent ensemble sur le site, et un rapport réutilisable pour ses autres projets.

**Ce qui a été fait** : copie de `modele/` (agents, règles, skills, scripts, hooks, gabarits) pour les fichiers absents ; `CLAUDE.md` complété (ordre de lecture, Fiche projet) ; `npm run verify` ajouté ; sections « Propre au projet » remplies pour `orchestrateur`, `ux-agent`, `data-agent`, `ai-agent` ; `docs/ETAT-ACTUEL.md`, `docs/ERREURS-CONNUES.md`, ce fichier.

**Vérification technique** : `node scripts/verifier-methode.mjs` → 26 ✔, 0 ✖ ; `npm run typecheck`, `npm run lint` (0 erreur), `next build`, `check-rules`, `check-secrets-suivis` verts. Commit poussé avant `qa-agent` (hook de session) : le `qa-agent` relira ce diff avec celui du chantier pme-accessible à la livraison (section 2).

**Non fait dans ce round** : aucune règle métier propre au projet dans `scripts/check-rules.mjs` (aucun incident vécu encore) ; pas de CI GitHub Actions (exemples dans `methode-travail/exemples/`).

## 2. ✅ Site plus accessible aux PME et travailleurs autonomes (2026-10-17)

**Contexte / demande** : Camille veut qu'un travailleur autonome ou une PME se sente concerné en arrivant sur le site, comprenne que l'IA, Zoho et l'automatisation sont accessibles et font gagner du temps, et voie un premier pas simple (configuration IA de base, mise en place d'un logiciel comme Zoho). Chantier mené avec les agents de `methode-travail` ; accord de Camille sur le plan (≈ 1 M jetons) le 2026-10-17.

**Ce qui a été fait** (documents dans `docs/projets/pme-accessible/` : BRIEF, PRD, APP-FLOW, IMPLEMENTATION-NOTES) :
- `product-manager` (Opus, 115 k) : PRD avec personas, textes prêts à coller, critères d'acceptation ; APP-FLOW (5 parcours, points de contrôle QA).
- `ux-agent` (Opus, 160 k + 8 k de révision) : 3 nouveaux composants `pour-vous-section`, `avant-apres-section`, `demarrer-section` (variantes accueil / ia / zoho, ancre `#demarrer`) ; accueil réordonné (Hero → Pour vous → Avant/après → Démarrer → Services → Processus → Bénéfices → Comparaison → Témoignages → Relève → FAQ → CTA) ; hero, services, IA, Zoho, bénéfices, comparaison, processus, FAQ (5 questions-objections ajoutées en tête), nav (« Démarrer », « Réalisations ») réécrits en français simple ; calculateur : option « Je débute — premier pas » sans montant (constantes et formule de prix intactes) ; chatbot : parcours « Je ne sais pas par où commencer » + actions `goto-ia` / `goto-zoho`. 4 classes CSS ajoutées en fin de `vsw.css` (`/* pme-accessible */`). Aucune nouvelle dépendance, aucun changement de collecte de données.
- `qa-agent` (Opus, 148 k) : verdict VERT, 38 critères vérifiés dans le code (tableau dans le rapport de session) ; une révision (titre dupliqué sur `/zoho`, description de `/ia`, apostrophes du chatbot).

**Vérification technique** : `npm run verify` vert (typecheck 0 erreur ; lint 0 erreur, 10 avertissements préexistants ; build 41/41 pages ; `check-rules` et `check-secrets-suivis` sans violation). Navigateur (Playwright, serveur dev) : captures de `/`, `/ia`, `/zoho`, `/devis` en 1280 px et 390 px ; option « Je débute » et parcours du chatbot cliqués ; défilement réel vers `/ia#demarrer`, `/zoho#demarrer`, `/#demarrer` et via le bouton « Par où commencer ? » (titre à 72 px sous la nav). Seules erreurs console : ressources externes bloquées par le bac à sable (polices Google, Supabase).

**Non fait dans ce round** :
- Décisions de Camille : durée de la formation courte (affichée « [à confirmer] » sur l'accueil) ; mention « Taxes du Québec configurées » (carte Zoho Books, à valider ou retirer) ; les libellés renommés du calculateur partent tels quels dans `type_projet` / `fonctionnalites` du CRM ; « 24h ouvrables » repris dans la confirmation « Je débute » (chiffre existant, à confirmer comme le hero) ; « Je débute » par défaut dans le calculateur (non, pour l'instant) ; accueil à 12 sections (trop long ?).
- Le lien nav « Démarrer » est invisible sous 640 px (menu masqué, comportement existant) ; le bouton du hero compense. Pas de menu mobile dans ce round.
- Pas de page `/demarrer` (recommandation du PRD : inutile sans campagne).
- Les anciennes routes (`/services/*`, `/solutions/*`, `/prix`…) sont encore compilées comme pages bien que redirigées en 308 : nettoyage à prévoir, hors périmètre.
- Footer et `realisations` non retouchés.
- **Coût réel** : ≈ 430 k pour les agents + ≈ 450 k pour la session principale (installation de la méthode, relecture, navigateur, suivi, rapport) ≈ 0,9 M, pour 1 M estimé.
