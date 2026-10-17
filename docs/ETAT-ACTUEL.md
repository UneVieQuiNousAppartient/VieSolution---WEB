# État actuel — Vie Solution Web

**Mis à jour : 2026-10-17.** Premier fichier lu par chaque session (après `CLAUDE.md`, avant `docs/ERREURS-CONNUES.md`). ≤ 40 lignes : on remplace, on n'empile pas. Historique : `SUIVI-TACHES.md` (par `grep`, jamais en entier).

Méthode : version 1.2.0 (dépôt `methode-travail`, fichier `VERSION`) — installée le 2026-10-17.

## Chantiers en cours
- **Site plus accessible aux PME et travailleurs autonomes** : livré sur la branche `claude/brave-euler-68e7pl`, PR #1 en brouillon (https://github.com/UneVieQuiNousAppartient/VieSolution---WEB/pull/1), `qa-agent` VERT, `npm run verify` vert. Livré : métiers et partenaires (§3), thème clair (§4), prix sur mesure (§5), animations (§6), sélecteur « Je suis… » (§7). Issues #2 (sections invisibles sans JS) et #3 (menu mobile) ouvertes.
- **Finition premium** livrée (§8) : fond chaud, cartes détachées, typographie, menu mobile (issue #3 à fermer après le test de Camille sur son téléphone). Restent les éléments de Camille : logo définitif, photos, témoignage.
- **Intégration de CRM existants** (demande de Camille) : petit lot de textes, en attente de la liste des CRM qu'elle accepte. Attend la relecture de Camille et son mot pour fusionner.
- **Mise en ligne** : SQL `supabase/setup-crm-vsw.sql` non exécuté, Edge Function `vsw-lead-followup` non déployée, cron non planifié, projet Vercel non créé.

## Décisions qui attendent Camille
- Partenaires : accord de Ben's, VieSolution et Khí pour l'affichage de leur logo ; texte « ce qu'on a fait pour eux » à rédiger ou non.
- Chantier PME : durée de la formation courte (« [à confirmer] » visible sur l'accueil) ; « Taxes du Québec configurées » (valider ou retirer) ; nom de l'offre d'entrée (« Démarrer simplement » / « Premier pas ») ; accueil à 14 sections.
- Page prix : valider la phrase de l'étape 03 (« si quelque chose doit changer, on en parle avant, jamais après ») — engagement envers le client.
- Courriels `bonjour@` / `stages@viesolutionweb.ca` et téléphone `(418) 555-0143` : placeholders à remplacer.
- Prix : plus aucun montant sur le site (décision du 2026-10-17) ; les 3 niveaux d'accompagnement gardent leurs noms, sans montant.
- Témoignages `site_testimonials` : exemples non publiés ; ne publier que de vrais témoignages.

## Rappels
- Tout appel d'agent nomme son modèle ; gros chantier (> 1 M ou `Workflow`) = accord préalable (`.claude/rules/budget-jetons.md`).
- Supabase partagé avec CSF : seules les tables `vsw_*` nous appartiennent.
- Hook Git : `git config core.hooksPath .githooks` sur chaque clone.

## Prochaine entrée du suivi
**9**
