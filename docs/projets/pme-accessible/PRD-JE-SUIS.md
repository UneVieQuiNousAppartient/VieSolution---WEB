# PRD — « Je suis… » et cartes métiers plus courtes

Chantier PME accessible, round 6. Plan approuvé par Camille le 2026-10-17 (« A + B »).

## Constat (mesuré par l'agent principal, 2026-10-17)

- Sur ordinateur, la section « Pour votre métier » commence après **2,2 écrans** de défilement.
- Sur téléphone, elle commence après **3,7 écrans**, et la dernière carte arrive au **9ᵉ écran** ; le lien
  « Métiers » de la barre de navigation est caché dans ce format.
- Chaque carte demande de lire **3 paragraphes** (« Ce qui vous gruge », « Pour vos clients », « Le temps
  retrouvé ») avant que la personne se reconnaisse.
- Inspiration retenue (Jobber, Square, Jane) : un sélecteur « Je suis… » dès le premier écran, des cartes
  courtes avec une icône propre au métier, un lien direct vers sa carte.

## A — Sélecteur « Je suis… » dans le hero

- Sous les boutons du hero, avant les chiffres clés : libellé mono `// Je suis…` et 9 pastilles.
- Pastilles (texte exact → ancre) : « Conseiller financier » → `#metier-conseiller-financier` ;
  « Courtier hypothécaire » → `#metier-courtier-hypothecaire` ; « Clinique dentaire » → `#metier-clinique-dentaire` ;
  « Clinique de soins » → `#metier-clinique-de-soins` ; « Cabinet comptable » → `#metier-cabinet-comptable` ;
  « Entrepreneur en construction » → `#metier-construction` ; « Agent immobilier » → `#metier-agent-immobilier` ;
  « Commerce ou restaurant » → `#metier-commerce-restaurant` ; « Autre métier » → `#metiers`.
- Chaque pastille porte l'icône de son métier (14 px). Téléphone : une rangée qui défile à l'horizontale
  (aimantation, barre masquée, léger dégradé au bord droit pour signaler la suite).
- Arrivée sur la carte : défilement doux, carte sous la barre de navigation (marge de 96 px), bordure accent,
  lueur, deux pulsations sur une seconde ; mouvement réduit : bordure seulement.

## B — Cartes métiers plus lisibles

- Visible d'emblée : icône propre au métier, titre, précision, « Ce qui vous gruge » (libellé + phrase).
- Replié dans « Voir ce qu'on améliore pour vous » (`<details>` natif, sans JavaScript, chevron qui tourne,
  ouverture fluide comme la FAQ) : « Pour vos clients », « Le temps retrouvé », étiquettes, note de conformité.
- 8 icônes nouvelles, tracé 24×24 identique aux icônes existantes : mallette + courbe (conseiller), maison + clé
  (courtier), dent (dentaire), cœur + pouls (soins), calculatrice (comptable), marteau (construction),
  maison + panneau (immobilier), devanture avec auvent (commerce / restaurant).
- **Aucun texte du `PRD-METIERS.md` ne change** (ni reformulation ni chiffre).

## Critères d'acceptation (vérifiables)

1. `grep -c "slug: '" src/components/vsw/metiers-section.tsx` → **8** (les `id="metier-…"` sont générés à partir des slugs ; 8 dans le HTML compilé).
2. Le hero affiche 9 pastilles ; un clic sur l'une amène sa carte sous la barre de navigation, mise en évidence.
3. Le sélecteur est visible dans le **premier écran** sur ordinateur (1440 × 900) ; sur téléphone (390 × 844),
   il est atteint en moins d'un défilement.
4. Cartes repliées de hauteur homogène dans chaque rangée ; sur téléphone, la section entière tient en
   **~3 écrans** (contre ~6 avant).
5. Sans JavaScript, les `<details>` s'ouvrent et se ferment (natif).
6. Mouvement réduit : aucune pulsation, aucune entrée animée, bordure accent sur la carte ciblée.
7. Thèmes clair et sombre lisibles (jetons seulement). `npm run typecheck`, `npm run lint`, `npx next build` : 0 erreur ;
   la règle `prefers-reduced-motion` globale reste la dernière de `vsw.css`.

