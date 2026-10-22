# État actuel — Vie Solution Web

**Mis à jour : 2026-10-22.** Premier fichier lu par chaque session (après `CLAUDE.md`, avant `docs/ERREURS-CONNUES.md`). ≤ 40 lignes : on remplace, on n'empile pas. Historique : `SUIVI-TACHES.md` (par `grep`, jamais en entier).

Méthode : version 1.2.0 (dépôt `methode-travail`, fichier `VERSION`) — installée le 2026-10-17.

## Chantiers en cours
- **Site plus accessible aux PME et travailleurs autonomes** : livré sur la branche `claude/brave-euler-68e7pl`, PR #1 en brouillon (https://github.com/UneVieQuiNousAppartient/VieSolution---WEB/pull/1), `qa-agent` VERT, `npm run verify` vert. Livré : métiers et partenaires (§3), thème clair (§4), prix sur mesure (§5), animations (§6), sélecteur « Je suis… » (§7). Issues #2 (sections invisibles sans JS) et #3 (menu mobile) ouvertes.
- **Finition premium** livrée (§8 ; issue #3 fermée) et **lot design 21st.dev** livré (§9 : panneau « Avant / après » aligné + bascule mobile, frise du processus, carte d'appel à l'action, hero en deux tons). Restent les éléments de Camille : logo définitif, photos, témoignage. Option : passer « La différence » sur le même panneau (≈ 30 k).
- **Offre élargie** livrée (§10) : 5ᵉ service « CRM et outils sur mesure », FAQ « J'ai déjà un logiciel… », formation IA pour petites entreprises avec le badge Claude Academy de Camille (sans date), **logo ampoule** (variante de viesolution.ca). **Plus tard** (demande de Camille) : gestion des réseaux sociaux et vidéos.
- **Sites et applications web** ajoutés aux services (§11) ; mention « Québec · IA & Zoho » retirée sous le logo. À prévoir : exemples de sites dans « Cas d'usage » quand Camille en aura.
- **Inspiration zoho.com** (§12) : positionnement « on choisit, on installe, on relie, on forme ; sinon on bâtit », installation de Claude, logiciels Zoho par besoin (Bigin, Creator), « Nos engagements ». Aucun élément de marque Zoho. À vérifier par Camille : programme de partenaires Zoho.
- **SEO / AEO** (§13) : plan du site, robots.txt, llms.txt, fiches schema.org, service 07 « Être trouvé sur Google et par les IA ». Domaine **viesolutionweb.ca** (confirmé). **Lot design Agnos** livré (§14) : menu flottant, surtitres encadrés, hero à arcs, bande « Des sites qu'on a bâtis » (Ben's, VieSolution, Khí), services en deux colonnes, mosaïque des engagements. À obtenir par Camille : accord des 3 clients pour leurs captures. Proposé : pages de réalisation (défi / solution / résultat), quand Camille donnera les faits.
- **Pages de service** (§15) : `/sites-web`, `/crm-sur-mesure`, `/referencement` — accessibles par les cartes 05-07 de l'accueil, le pied de page et le lien sous la bande des sites.
- **Refonte visuelle de l'accueil** (§21) : relief du hero, accueil en 12 sections, menu « Services », palette A + fond 1, bandes sombres, « Pourquoi nous », galerie d'écrans d'admin sur `/crm-sur-mesure`. **Un seul bouton partout** (§22) : « Réserver mon appel gratuit » / « Décrire ma situation par écrit » (`appel.ts`) + barre fixe sur téléphone. **Cartes « C'est pour vous si… »** (§23) : ce qui gruge → ce qui change, cases à cocher et jauge (mélange A + B choisi par Camille). **Ton positif partout** (§24) : titres et réponses retournés vers ce qui va mieux, tableau « Ailleurs » barré remplacé par une liste « Avec nous ». Espacements resserrés (sections, en-têtes). **Pied de page premium** (§25) ; **service Accueil IA** (§26, page `/accueil-ia`) ; **Bulle de clavardage en vraie IA** (§27) : livrée, inactive tant que Camille n'a pas saisi `ANTHROPIC_API_KEY` dans Vercel et fixé une limite de dépenses chez Anthropic ; modèle Haiku 5.5 choisi (§28) ; `ANTHROPIC_API_KEY` saisie par Camille le 2026-10-22 (Production seulement) ; reste pour l'activer : SQL `setup-crm-vsw.sql` à exécuter (vérifié le 2026-10-22 : aucune table `vsw_`, pas de `vsw_rate_limit_hit`) et variables Supabase dans Vercel ; issue #5 (insertion anonyme des formulaires) ; **à donner par Camille** : liens WhatsApp et Facebook (`RESEAUX`, `src/lib/site.ts`).
- **Intégration de CRM existants** (demande de Camille) : petit lot de textes, en attente de la liste des CRM qu'elle accepte. Attend la relecture de Camille et son mot pour fusionner.
- **Suivi des demandes inspiré de KHI** (§16) : lot 1 livré (base, moteur horaire `/api/cron/tick`, relances J2/J5 activées par Camille (§17), adresse postale enregistrée, désabonnement LCAP). **Double vérification de /admin** livrée (§18) — nouvelle variable `ADMIN_SECRET` ; l'activer dès la mise en ligne. Next.js mis à jour en 16.4.2 (§20, issue #4). **Lot 2** livré (§19) : onglet « Aujourd'hui », boutons de contact et de désabonnement, onglet « Relances ».
- **Mise en ligne** : SQL `supabase/setup-crm-vsw.sql` non exécuté, projet Vercel `vie-solution-web` créé (§17 : variables à saisir par Camille, domaine à brancher), Resend à configurer (domaine viesolutionweb.ca), variables `CRON_SECRET`, `UNSUBSCRIBE_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`.

## Décisions qui attendent Camille
- Partenaires : accord de Ben's, VieSolution et Khí pour l'affichage de leur logo ; texte « ce qu'on a fait pour eux » à rédiger ou non.
- Chantier PME : durée de la formation courte (« [à confirmer] » visible sur l'accueil) ; « Taxes du Québec configurées » (valider ou retirer) ; nom de l'offre d'entrée (« Démarrer simplement » / « Premier pas ») ; accueil à 14 sections.
- Page prix : valider la phrase de l'étape 03 (« si quelque chose doit changer, on en parle avant, jamais après ») — engagement envers le client.
- Suivi : variables d'environnement du projet Vercel ; rebrancher Claude API pour les brouillons (nouvelle dépendance).
- Courriels `bonjour@` / `stages@viesolutionweb.ca` et téléphone `(418) 555-0143` : placeholders à remplacer.
- Prix : plus aucun montant sur le site (décision du 2026-10-17) ; les 3 niveaux d'accompagnement gardent leurs noms, sans montant.
- Témoignages `site_testimonials` : exemples non publiés ; ne publier que de vrais témoignages.
- Clavardage IA (Loi 25) : évaluation et entente pour le transfert à Anthropic (hors Québec), durée de conservation à écrire dans la politique ; date et courriel `contact@viesolution.com` de la politique à corriger.

## Rappels
- Tout appel d'agent nomme son modèle ; gros chantier (> 1 M ou `Workflow`) = accord préalable (`.claude/rules/budget-jetons.md`).
- Supabase partagé avec CSF : seules les tables `vsw_*` nous appartiennent.
- Hook Git : `git config core.hooksPath .githooks` sur chaque clone.

## Prochaine entrée du suivi
**29**
