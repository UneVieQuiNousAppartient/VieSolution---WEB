# PRD — Prix sur mesure (page « Combien ça coûte ? »)

Chantier PME accessible, round 3. Décision de Camille du 2026-10-17 (« Tout sur mesure »).

## Problème

- Le calculateur de `/devis` fait fuir les clients : un montant affiché avant toute discussion
  décourage une PME ou un travailleur autonome qui ne sait pas encore ce dont il a besoin.
- Les montants affichés (calculateur, forfaits, chatbot) ne sont pas fiables : ils étaient indicatifs
  et jamais confirmés.

## Décision

- **Plus aucun montant en dollars sur le site public.** Le prix est sur mesure, donné par écrit après
  l'appel découverte, avant tout engagement.
- La page `/devis` reste (même adresse, même lien « Devis » dans la nav et le pied de page) et devient
  une page qui rassure : « Combien ça coûte ? ».
- Les trois forfaits (Essentiel / Croissance / Partenaire) restent, comme **niveaux d'accompagnement
  sans prix** (« Sur mesure — selon votre situation »).

## Structure de `/devis`

1. `PageHeader` — eyebrow `// Combien ça coûte ?`, titre « Un prix clair, / avant de commencer. »,
   lede « Chaque entreprise est différente, alors chaque prix l'est aussi. On regarde votre situation,
   on vous propose un premier pas, et vous connaissez le prix avant de dire oui. Pas de frais cachés. »
2. `CommentPrixSection` (`id="comment"`) — « Trois étapes, / aucune surprise. » :
   01 Un appel gratuit de 30 minutes · 02 Une proposition écrite · 03 Le prix est fixé avant de commencer ;
   bloc « Ce qui fait varier le prix » (4 facteurs) ; phrase « On commence souvent petit… ».
3. `SituationForm` (`id="situation"`, client) — « Dites-nous ce qui / vous gruge. » : métier (8 métiers
   + « Autre »), ce qui prend le plus de temps (obligatoire, 10 caractères min.), nom, courriel,
   téléphone facultatif. Envoi par `submitEstimateurRequest` existant (`type_projet` = métier,
   `description` = texte, `resultat_estimation` = « Sur mesure — à discuter à l'appel découverte »).
   Succès : « Merci ! On vous revient sous 24h ouvrables. » ; lien secondaire « Je préfère réserver
   un appel » → `/rdv`.
4. `PricingSection` — niveaux d'accompagnement, « Sur mesure », sans montant.
5. `CTASection` — « Une question sur le prix ? On y répond franchement, à l'appel découverte gratuit. »,
   bouton « Réserver un appel ».

Métadonnées : title « Combien ça coûte ? », description « Un prix clair avant de commencer, sans frais
cachés : on regarde votre situation, on propose un premier pas, vous décidez. »

## Ailleurs sur le site

- Chatbot : nœuds `auto`, `agent`, `zoho-estim`, `formation` → « Le prix est sur mesure : on vous le
  donne par écrit, avant de commencer. » ; chips « Combien ça coûte ? » et « Voir comment on établit
  un prix » (action `goto-devis` conservée).
- Comparaison : « Un prix clair avant de commencer, sans frais cachés ».
- FAQ « Ça doit coûter une fortune ? » : plus de mention du calculateur.
- `quote-calculator.tsx` supprimé.

## Hors périmètre

Aucune nouvelle table, aucune modification de `src/lib/**`, `supabase/**`, `src/app/admin/**`,
`src/app/api/**`, `next.config.ts`, `package.json`, ni de l'ancien design (pages redirigées en 308).

## Critères d'acceptation

- `grep -rnE '[0-9][0-9 ]*\$|\$ ?[0-9]|CAD' src/components/vsw src/app --include=*.tsx` : aucun montant
  sur une page publique du nouveau design (pages de l'ancien design listées, hors périmètre).
- `grep -rn "QuoteCalculator\|quote-calculator" src` : vide.
- `npm run typecheck`, `npm run lint` : 0 erreur ; `next build` vert.
- Le formulaire de situation enregistre une ligne dans `estimateur_requests` — **à tester par Camille**
  (soumission réelle, la base n'est pas jointe depuis l'environnement de développement).
- Thème clair et sombre : aucune couleur en dur, tout passe par les jetons de `vsw.css`.
