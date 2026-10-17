# BRIEF — Site plus accessible aux PME et travailleurs autonomes

**Date :** 2026-10-17 · **Demandé par :** Camille · **Taille :** grosse fonctionnalité (contenu + composants, pas de schéma)

## 1. Problème
Le site actuel parle surtout de *nous* (« quatre expertises », « écosystème Zoho ») et peu d'*eux*. Un travailleur autonome ou une PME de 2 à 20 personnes ne trouve nulle part la phrase « c'est pour moi ». Il n'y a pas de porte d'entrée simple (configuration IA de base, mise en place d'un logiciel comme Zoho) : le visiteur passe directement de l'accueil à « Prendre un RDV » ou à un calculateur qui démarre à 1 800 $. Le vocabulaire reste techno par endroits (workflows, API, intégrations inter-apps). La FAQ ne répond pas aux peurs réelles : « je ne suis pas techno », « c'est pour les grosses compagnies », « ça coûte une fortune », « combien de temps ça me demande ». Constat : lecture complète du site le 2026-10-17 par Claude, à la demande de Camille.

## 2. Publics
- **Public principal :** travailleur autonome ou très petite entreprise québécoise (1 à 5 personnes : consultant, entrepreneur en construction, esthéticienne, comptable, traiteur, agent immobilier…) qui perd des heures en tâches administratives répétitives, se sent dépassé par la vitesse des technologies, et ne sait pas par où commencer.
- **Autres publics :** PME de 5 à 50 employés avec un responsable administratif, gestionnaires qui veulent centraliser leur gestion (Zoho) ; relève et stagiaires (section existante, à ne pas casser).

## 3. Objectifs
1. Le visiteur se reconnaît en moins de 10 secondes : une section « C'est pour vous si… » avec des situations concrètes de son quotidien.
2. Il comprend que ces outils sont **accessibles** (pas réservés aux grandes entreprises, pas besoin d'être techno) et qu'ils lui font **gagner du temps** : exemples avant/après concrets, sans chiffres inventés.
3. Il voit un **premier pas simple** : « Démarrer simplement » — configuration IA de base pour une petite entreprise, mise en place d'un logiciel comme Zoho (CRM, facturation), formation courte. Volet ajouté aux pages `/ia` et `/zoho` et au calculateur (« Je débute »).
4. Le vocabulaire est en français simple partout sur les pages publiques (plus de jargon non expliqué sur l'accueil).
5. La FAQ répond aux objections réelles d'une PME / d'un travailleur autonome.

## 4. Contraintes
- Loi 25 : rien ne change dans la collecte de données (formulaires existants).
- Langue : français québécois, vouvoiement.
- **Aucun prix, date, nom, témoignage ou coordonnée inventé** : marquer `[à confirmer]`. Les prix existants restent tels quels (indicatifs).
- Design system existant (`src/app/vsw.css`, composants `src/components/vsw/*`) : réutiliser les classes existantes ; nouvelles classes ajoutées dans `vsw.css` avec les mêmes jetons. Aucune nouvelle dépendance.
- Budget : ≈ 1 M jetons (palier Gros, accord donné par Camille le 2026-10-17).

## 5. Hors périmètre
- Mise en ligne (Supabase, Vercel) : chantier séparé.
- Admin `/admin` et CRM : inchangés.
- Nouveaux prix ou forfaits : décision de Camille.
- Refonte visuelle : on garde le design, on change le contenu et l'ordre des sections.

## 6. Sources
- Lecture complète de `src/app/**/page.tsx` et `src/components/vsw/*.tsx` (2026-10-17).
- `CLAUDE.md` du projet (marque, promesse, conventions).
- Demande de Camille (2026-10-17) : « rendre les choses simples pour eux mais aussi leur montrer que ces outils sont accessibles et leur feront gagner du temps ».

## 7. Questions ouvertes
- Un forfait d'entrée « Démarrage » (configuration IA de base + Zoho de base) doit-il exister avec un prix ? → à trancher par Camille ; d'ici là, présenté sans prix.
- Nom exact de l'offre d'entrée (« Démarrer simplement », « Premier pas », « Trousse de départ ») : proposition du `product-manager`, choix final de Camille.
