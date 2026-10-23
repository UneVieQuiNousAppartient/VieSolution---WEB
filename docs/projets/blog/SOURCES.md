# Sources des brouillons de blogue (2026-10-23)

Chemins relatifs à `src/`. Aucun chiffre, prix, délai, client ou témoignage dans les trois textes (seul « 30 jours » est une suggestion de rythme, marquée [à confirmer]).

## par-ou-commencer-avec-l-ia.md
- Irritants (mêmes questions par courriel, soumissions le soir, rapport mensuel refait) : `lib/metiers.ts` (SITUATIONS, construction)
- Claude, ChatGPT, Copilot ; formation avec vrais dossiers, sans jargon, ce qu'on ne confie pas à une IA : `components/vsw/ai-section.tsx`
- L'IA prépare, vous validez ; seul un simple rappel de rendez-vous peut partir seul ; AMF et Loi 25 ; clavardage qui répond et transmet : `components/vsw/faq-section.tsx`, `lib/metiers.ts` (NOTE_FINANCE), `app/accueil-ia/page.tsx`
- Données hébergées / qui y a accès, vos données vous appartiennent, accès et consentements selon la Loi 25 : `components/vsw/faq-section.tsx`
- Commencer petit, une seule chose, vous voyez la différence puis décidez : `components/vsw/faq-section.tsx`, `components/vsw/demarrer-section.tsx`
- Résumés de documents, courriels types, soumissions : `components/vsw/demarrer-section.tsx` (variante ia)
- Liens /ia, /ia#formation, /metiers/cabinet-comptable, /metiers/conseiller-financier : slugs vérifiés dans `lib/metiers.ts`

## rappels-de-rendez-vous-automatiques.md
- Réception occupée (rappels, confirmations, formulaires), formulaire rempli avant d'arriver, « enfin le temps d'accueillir » : `lib/metiers.ts` (clinique-dentaire, clinique-de-soins)
- Clavardage, prise de rendez-vous, agent vocal, confirmation et rappel qui partent seuls, transfert vers vous, dernier mot, Loi 25 : `app/accueil-ia/page.tsx`
- Clients parlent à un assistant seulement si vous le voulez : `components/vsw/faq-section.tsx`
- Renseignements sensibles, outils pour l'administration jamais pour les soins : `lib/metiers.ts` (note des cliniques)
- « Chaque information entre une seule fois » : `lib/metiers.ts` (BENEFICES)
- Liens /accueil-ia, /metiers/clinique-dentaire, /metiers/clinique-de-soins : slugs vérifiés

## zoho-ou-crm-sur-mesure.md
- Situations (clients éparpillés, relances oubliées, rapport) et carnet de clients en ligne : `lib/metiers.ts` (SITUATIONS)
- Zoho CRM, Bigin, Books, Desk, Campaigns (descriptions) ; « logiciels qui se parlent » ; formation, parcours par rôle, transfert de données : `components/vsw/zoho-section.tsx`
- CRM maison, formulaire relié aux fiches, tableau de suivi, garder son logiciel actuel et le relier, Loi 25 / hébergement : `app/crm-sur-mesure/page.tsx`, `components/vsw/faq-section.tsx`
- Commencer petit, une chose à la fois : `components/vsw/faq-section.tsx`
- Support et amélioration continue : `components/vsw/zoho-section.tsx`
- Liens /zoho, /zoho#formation (ancre présente dans zoho-section.tsx), /crm-sur-mesure, /metiers/cabinet-comptable : vérifiés

## [à confirmer] (aussi marqués dans les textes)
1. Article 1, § 4 et article 2, § 5 : formulation finale Loi 25 (rester général, par Camille).
2. Article 1, § 5 : « 30 jours » et le découpage en 4 semaines sont une suggestion de rythme, absente des sources.
3. Article 2, § 2 : canaux des rappels (courriel et/ou texto), confirmation par le client dans le message, annulation par le client. Les sources parlent seulement de « confirmation et rappel qui partent tout seuls ».
4. Article 3, § 4 : aucun seuil de nombre d'utilisateurs affirmé ; la phrase sur les équipes plus grandes est une généralité à valider.
