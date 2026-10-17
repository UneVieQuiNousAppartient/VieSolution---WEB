# État actuel — Vie Solution Web

**Mis à jour : 2026-10-17.** Premier fichier lu par chaque session (après `CLAUDE.md`, avant `docs/ERREURS-CONNUES.md`). ≤ 40 lignes : on remplace, on n'empile pas. Historique : `SUIVI-TACHES.md` (par `grep`, jamais en entier).

Méthode : version 1.2.0 (dépôt `methode-travail`, fichier `VERSION`) — installée le 2026-10-17.

## Chantiers en cours
- **Site plus accessible aux PME et travailleurs autonomes** : livré sur la branche `claude/brave-euler-68e7pl`, PR #1 en brouillon (https://github.com/UneVieQuiNousAppartient/VieSolution---WEB/pull/1), `qa-agent` VERT, `npm run verify` vert. Round 2 livré (métiers, hero recentré, partenaires — `SUIVI-TACHES.md` §3). Attend la relecture de Camille et son mot pour fusionner.
- **Mise en ligne** : SQL `supabase/setup-crm-vsw.sql` non exécuté, Edge Function `vsw-lead-followup` non déployée, cron non planifié, projet Vercel non créé.

## Décisions qui attendent Camille
- Partenaires : accord de Ben's, VieSolution et Khí pour l'affichage de leur logo ; texte « ce qu'on a fait pour eux » à rédiger ou non.
- Design : garder le sombre, le réchauffer, ou tester une variante claire (comparaison ≈ 150-200 k) ?
- Chantier PME : durée de la formation courte (« [à confirmer] » visible sur l'accueil) ; « Taxes du Québec configurées » (valider ou retirer) ; nom de l'offre d'entrée (« Démarrer simplement » / « Premier pas ») ; forfait d'entrée avec prix ou non ; accueil à 12 sections.
- Courriels `bonjour@` / `stages@viesolutionweb.ca` et téléphone `(418) 555-0143` : placeholders à remplacer.
- Tous les prix (calculateur, forfaits, chatbot) : indicatifs, à confirmer.
- Témoignages `site_testimonials` : exemples non publiés ; ne publier que de vrais témoignages.

## Rappels
- Tout appel d'agent nomme son modèle ; gros chantier (> 1 M ou `Workflow`) = accord préalable (`.claude/rules/budget-jetons.md`).
- Supabase partagé avec CSF : seules les tables `vsw_*` nous appartiennent.
- Hook Git : `git config core.hooksPath .githooks` sur chaque clone.

## Prochaine entrée du suivi
**4**
