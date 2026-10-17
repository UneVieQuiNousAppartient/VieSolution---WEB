# PRD — Finition premium (round 7, 2026-10-17)

Source : `AUDIT-PREMIUM.md` (§2 = 18 correctifs, §5 = jetons). Accord de Camille : « tout le lot », fond blanc cassé chaud.
Périmètre : forme seulement (`src/app/vsw.css`, composants `src/components/vsw/*`). **Aucun texte du site modifié.**
Règle de couleur : un seul accent fonctionnel (`--accent`) ; `--accent-2` (violet) réservé au dégradé du h1 du hero
et du titre « On commence petit » ; zéro couleur en dur hors des blocs de jetons.

| # | Point | Critère vérifiable |
|---|---|---|
| 1 | Nav opaque | `.nav` : `background: color-mix(in oklch, var(--bg-0) 94%, transparent)` + flou 20 px ; le texte ne se lit plus sous le logo (capture FAQ). |
| 2 | Menu mobile (issue #3) | À ≤ 640 px : bouton « Menu » 44×44, `aria-expanded`/`aria-controls` ; panneau plein écran sous la nav, 8 liens + « Prendre un RDV » (20 px, lignes 56 px) ; fermeture bouton / Échap / clic sur un lien ; corps bloqué ; focus rendu au bouton ; animation 220 ms, coupée sous `prefers-reduced-motion`. Invisible > 640 px. |
| 3 | Zéro couleur en dur | `grep -nE "oklch\(0\.85 0\.18 200\|oklch\(0\.72 0\.22 305" vsw.css` ne trouve rien hors du bloc `html[data-theme="dark"]`. |
| 4 | Rythme des sections | `.section { padding-block: var(--section-y) }` (72-112 px), pas de `border-top` ; `section--band` (fond `--bg-band`) sur « Avant / après », « Processus », « FAQ » ; plus de vide anormal avant « Ils nous font confiance ». |
| 5 | Surfaces et fond chaud | `--bg-0: oklch(0.985 0.005 85)`, `--bg-1/2/3`, `--line(-soft)` en teinte 85 ; cartes, champs en `--surface` (blanc) ; version sombre : `--surface` = `--bg-1`. |
| 6 | Grilles détachées | `.benefits-grid`, `.services-grid`, `.metiers-grid`, `.process-grid` (y compris étapes de `/devis`), `.ai-pillars` : `gap: var(--grid-gap)` (20 px), sans fond ni bordure ; cartes rayon 16 px, bordure `--line-soft`, `--shadow-xs` → `--shadow-sm` + montée 3 px au survol. |
| 7 | En-tête de section empilé | `.section-head` : titre puis paragraphe (`max-width: 60ch`, marge 20 px) ; 2 colonnes seulement avec `section-head--split` (accueil-services, accueil-bénéfices). |
| 8 | Titres | h1 `--fs-h1` (lh 1.0, ls -0.035em), h2 `--fs-h2` (lh 1.08, ls -0.025em, `text-wrap: balance`, `max-width: 18ch`), h3/h4 de cartes `--fs-h3` (lh 1.25). |
| 9 | Taille du texte | texte des cartes ≥ 15 px (`--fs-card`) en `--fg-1` ; notes 13 px en `--fg-2` ; pastilles 12,5 px ; bas du pied de page ≥ 13 px. |
| 10 | Mono réservée | mono seulement pour les surtitres `// …` et les numéros ; étiquettes de champs, pastilles, descriptions partenaires, « selon votre situation », titres du pied de page, légendes du hero, étiquettes métiers : Inter 13-14 px, poids 500, sans capitales forcées. |
| 11 | Métiers | 3 colonnes ≥ 1100 px, 2 ≥ 700 px, 1 en dessous ; intertitres alignés (`min-height` sur `.metier-titres`). Icônes : déjà une par métier (rien à changer). |
| 12 | Formulaires | champs `--surface`, hauteur 48 px, 16 px ; `[aria-invalid="true"]` bordure `--danger` + fond teinté ; `select` sans flèche native, chevron SVG ; `/devis` : formulaire 7/12 + réassurance 5/12 (les 3 étapes existantes, textes inchangés). |
| 13 | Forfaits | « Sur mesure » 28 px ; `.period` en bloc, Inter 14 px `--fg-2` ; carte en vedette : bordure accent + pastille, sans halo. |
| 14 | FAQ | liste sans boîtes, `border-bottom` `--line-soft`, questions 18 px, chevron SVG 16 px, `max-width: 760px`. |
| 15 | « C'est pour vous si… » | coche en ligne 18 px couleur `--accent`, sans carré. |
| 16 | Halos retirés (clair) | `.btn-primary:hover` = fond `--accent-hover`, sans lueur ; `.logo-mark` sans lueur ; carte en vedette et colonne « nous » sans halo ; violet limité aux 2 titres du point « Règle de couleur ». |
| 17 | Mobile (≤ 640 px) | `.eyebrow::before` masqué quand centré ; boutons du hero 100 % ; bulle de clavardage `bottom: 88px` ; lede 17 px ; hero raccourci (sélecteur « Je suis… » sous ≈ 900 px à 390 px de large). |
| 18 | Partenaires | logos `grayscale(1)`, opacité .75, couleur au survol ; hauteur 40 px ; descriptions Inter 13 px ; grille sur toute la largeur du contenant. |
| 19 | Animations conservées | cascades, survols, hero, FAQ du round 5/6 toujours actifs ; règle globale `prefers-reduced-motion` = dernière règle de `vsw.css`. |

Hors périmètre : textes, logo définitif, photos, témoignages, icônes nouvelles, `src/app/admin/**`, `src/app/api/**`, `src/lib/**`, `supabase/**`, ancien design.
