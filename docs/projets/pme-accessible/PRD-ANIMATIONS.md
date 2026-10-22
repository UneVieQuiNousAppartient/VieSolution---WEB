# PRD — Animations fines (« Sobre et premium »)

Chantier PME accessible, round 5. Plan approuvé par Camille le 2026-10-17 (« Sobre et premium »).

## Intention

Donner au site une impression haut de gamme par des mouvements **discrets et rapides**, sans jamais gêner la
lecture d'un public peu techno (dentistes, conseillers, comptables, travailleurs autonomes). Le contenu reste le
même : aucune phrase du site ne change.

## Les six effets

1. **Hero en séquence** — eyebrow, titre, texte d'introduction, boutons et chiffres clés apparaissent l'un après
   l'autre au chargement (fondu + montée de 12 px, décalage de 80 ms). Reflet lent sur « nous appartient. »
   (une traversée environ toutes les 8 s) ; halo du haut qui « respire » très lentement (échelle 1 → 1,04, ~9 s).
2. **Cascade** — dans les grilles (bénéfices, métiers, services, partenaires, étapes, niveaux d'accompagnement,
   FAQ, piliers IA, avant/après), les cartes arrivent l'une après l'autre (70 ms d'écart, 8 cartes au plus)
   quand la section apparaît à l'écran.
3. **Survols soignés** — cartes : légère montée, contour couleur accent adouci, ombre douce ; boutons : la flèche
   glisse de 3 px ; logos partenaires : couleurs légèrement adoucies au repos, pleines au survol ; FAQ : le « + »
   tourne en « × » à l'ouverture.
4. **Défilement doux et FAQ fluide** — défilement animé vers les ancres, sans que le titre passe sous la barre
   de navigation ; la réponse de la FAQ s'ouvre en douceur (hauteur animée là où le navigateur le permet,
   sinon fondu).
5. **Barre de navigation compacte** — après 24 px de défilement, la barre s'amincit et prend une ombre douce.
6. **Bandeau défilant** — il s'arrête quand la souris passe dessus (lecture possible).

## Contraintes

- CSS pur, aucune dépendance. Un seul petit composant client (`nav-scroll.tsx`) pour la nav compacte.
- Durée ≤ 600 ms par mouvement (sauf les deux effets d'ambiance du hero, lents par nature) ; courbe
  `cubic-bezier(0.22, 1, 0.36, 1)`.
- Toutes les couleurs et ombres passent par les jetons de `src/app/vsw.css` (thème clair par défaut, sombre via
  `html[data-theme="dark"]`).
- **`prefers-reduced-motion: reduce`** : une règle globale en fin de `vsw.css` neutralise animations,
  transitions, délais, défilement doux et déplacements au survol. Le contenu reste entièrement visible.
- Le contenu ne doit jamais disparaître à cause d'une animation : la cascade ne s'applique qu'aux enfants d'un
  `.reveal` passé en `.in` (pas de nouvel état caché).
- CSS ajouté en fin de `vsw.css`, sous `/* pme-accessible — animations */` ; `layout.tsx` : une seule ligne
  ajoutée (plus l'import).

## Critères d'acceptation (vérifiables par `qa-agent`)

1. `grep -n "pme-accessible — animations" src/app/vsw.css` : un bloc, en fin de fichier.
2. `grep -n "prefers-reduced-motion" src/app/vsw.css` : la règle globale existe après ce bloc et couvre
   `animation-*`, `transition-*`, `scroll-behavior` et les déplacements au survol des classes ajoutées.
3. Aucune couleur `oklch(`/`#`/`rgb(` en dur dans le bloc ajouté, hors définitions de jetons.
4. Aucune durée de mouvement > 600 ms dans le bloc, hors `vsw-shine` (reflet) et `vsw-breathe` (halo).
5. `src/components/vsw/nav-scroll.tsx` : `'use client'`, écouteur `scroll` passif, seuil 24 px, nettoyage au
   démontage, aucun `useState`. Monté dans `src/app/layout.tsx` à côté de `TrackPageview`.
6. `nav.tsx`, `hero.tsx` et tous les textes du site : inchangés (`git diff --stat`).
7. Accolades de `vsw.css` équilibrées ; `npm run typecheck`, `npm run lint` (0 erreur) et `npx next build` verts.
8. À tester dans le navigateur (humain) : thèmes clair et sombre, mobile, réglage « Réduire les animations » du
   système activé.
