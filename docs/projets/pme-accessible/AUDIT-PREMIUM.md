# Audit « premium » — forme seulement (2026-10-17)

Sources : 13 captures (thème clair par défaut, sombre en comparaison) + lecture ciblée de `src/app/vsw.css`.
Les textes ne sont pas jugés. Aucun fichier du site n'a été modifié.

## 1. Verdict

- **Déjà premium** : le hero (grand titre Space Grotesk serré, dégradé sarcelle → violet sur une seule ligne, halo discret), la palette retenue, les animations fines, la carte « Démarrer simplement ».
- **Ce qui fait « gabarit »** : 11 sections construites pareil (surtitre + titre à gauche, paragraphe à droite, grille à joints de 1 px), cartes gris-bleu qui ont l'air désactivées, texte en 12–13,5 px, la police mono partout (étiquettes, champs, pastilles, descriptions).
- **Trois signaux techniques à corriger d'abord** : la nav laisse passer le texte (capture FAQ), il n'y a pas de menu sur mobile, et des couleurs cyan du thème sombre sont restées en dur dans le thème clair.

## 2. Correctifs classés par rendement (impact perçu / effort)

| # | Constat (capture, zone) | Pourquoi ça fait « pas premium » | Correctif précis | Effort |
|---|---|---|---|---|
| 1 | `a-faq-open` : sous la nav, le titre et le paragraphe se lisent à travers le logo. | Un chevauchement illisible, ça se voit en 1 seconde et ça a l'air d'un bogue. | `.nav` (l. 117) : remplacer `oklch(0.985 0.006 250 / 0.8)` par `color-mix(in oklch, var(--bg-0) 94%, transparent)` ; garder le flou de 20 px. | petit |
| 2 | `f-default-mobile` : à ≤ 640 px, `.nav-links { display:none }` (l. 1902) et aucun menu ne le remplace. | Sur mobile, on ne peut aller nulle part, sauf par le pied de page. | Bouton menu de 44 px dans `nav.tsx` + panneau plein écran (liens en 20 px, 56 px de haut). **C'est une fonction qui manque, pas seulement du style** : à ouvrir en issue. | moyen |
| 3 | Partout, y compris `p-devis-forfaits` : le halo de la carte en vedette et le focus des champs sont teintés cyan néon. | Il reste des couleurs en dur du thème sombre (l. 393, 561, 570, 577, 646-647, 1025, 1565, 1617, 1743), ce que `CLAUDE.md` interdit. Les reflets ne s'accordent pas à l'accent. | Remplacer chaque `oklch(0.85 0.18 200 / x)` par `color-mix(in oklch, var(--accent) x, transparent)`, et chaque `oklch(0.72 0.22 305 / x)` par la même chose avec `--accent-2`. | petit |
| 4 | `home-desktop` et `f-default-partenaires` : 120 px de marge en haut et en bas + un filet à chaque section. Page de 10 200 px, avec un vide d'environ 260 px avant « Ils nous font confiance ». | Un rythme mécanique, et des vides qui donnent l'impression qu'il manque du contenu. | Jeton `--section-y: clamp(72px, 9vw, 112px)` sur `.section`. Retirer `border-top` et alterner plutôt un fond de bande (`--bg-band`) environ une section sur trois. Vérifier la section vide au-dessus des partenaires. | petit |
| 5 | `f-default-metiers`, `cmp-pourvous`, `p-devis-top` : les cartes `--bg-1` gris-bleu sont posées sur un fond `--bg-0` gris-bleu à peine différent. | Peu de contraste, l'air d'éléments désactivés, et un ton froid (teinte 250) alors que le thème clair devait être chaleureux. | Ajouter `--surface: oklch(1 0 0)` et l'utiliser pour les cartes, les champs et les questions de la FAQ. Fond : `--bg-0: oklch(0.985 0.005 85)`, un blanc cassé chaud (à valider par Camille). Bordure `--line-soft` + `--shadow-xs`. | petit |
| 6 | Grilles `benefits-grid`, `services-grid`, `metiers-grid`, étapes de devis : `gap:1px` sur un fond de ligne. | La signature reconnaissable des gabarits Framer. Les cartes collées font un tableau, pas une offre. | `gap: 20px; background: none; border: 0` ; chaque carte en `--surface`, `border-radius: var(--radius-lg)` (16 px), bordure 1 px, ombre `--shadow-xs` qui passe à `--shadow-sm` au survol. | moyen |
| 7 | `.section-head` (l. 356) : titre à gauche, paragraphe aligné en bas à droite, loin du titre. Sur `p-devis-top`, la moitié droite reste vide. | L'œil fait des allers-retours, et le même gabarit se répète 11 fois. | Par défaut, empiler : titre puis paragraphe dessous (`max-width: 60ch`, 18 px, marge de 20 px). Garder les 2 colonnes pour 2 ou 3 sections seulement. | petit |
| 8 | `.section-head h2` (l. 363) : `line-height: 1.02` sur 3 lignes ; « la vie. » reste seul sur sa ligne (accueil). | Les lignes accentuées se touchent, et un mot seul en fin de titre fait négligé. | `line-height: 1.08; letter-spacing: -0.025em; text-wrap: balance; max-width: 18ch` ; voir l'échelle de la section 5. | petit |
| 9 | Texte des cartes : `.benefit p` à 13,5 px, `.metier-note` à 12 px, pastilles à 10 px, bas du pied de page à 11 px. | Trop petit pour un public de 40 à 65 ans. Le petit texte gris, ça fait bon marché. | Minimum 15 px pour le texte des cartes, 13 px pour les notes, pastilles en Inter 12,5 px. Couleur `--fg-1` pour le texte et `--fg-2` pour les notes (`--fg-3` seulement pour le décoratif). | petit |
| 10 | Police mono partout : étiquettes de champs, pastilles, descriptions des partenaires, « selon votre situation », titres du pied de page, légendes des chiffres du hero. | Ça fait « outil de développeur », pas « cabinet de confiance ». | Mono réservée aux surtitres `// …` et aux numéros (« 01 »). Partout ailleurs : Inter 14 px, poids 500, en minuscules normales. | petit |
| 11 | `f-default-metiers` : 4 colonnes d'environ 150 mots, intertitres décalés d'une colonne à l'autre (sous-titre présent ou non), même icône ✓ deux fois. | Un mur de texte serré, un alignement cassé et des icônes répétées. | 3 colonnes à 1280 px (2 à ≤ 1024 px) ; `grid-template-rows: subgrid` (ou `min-height` sur le sous-titre) pour aligner les intertitres ; une icône différente par métier. | moyen |
| 12 | `p-devis-form-errors` : champs gris-bleu, flèche de liste native, erreur signalée seulement par le texte, champs en 14 px. | Ça a l'air désactivé. En 14 px, iOS zoome sur le champ. Un champ en erreur sans cadre rouge n'est pas repéré. | Champs en `--surface`, 48 px de haut, 16 px. `[aria-invalid="true"] { border-color: var(--danger); background: color-mix(in oklch, var(--danger) 4%, var(--surface)); }`. Liste : `appearance: none` + flèche SVG. Mise en page 7/12 pour le formulaire, 5/12 pour une colonne de réassurance (contenu déjà validé). | moyen |
| 13 | `p-devis-forfaits` : « Sur mesure » en 40 px trois fois de suite ; « selon votre situation » en mono se coupe sur 2 lignes. | Une répétition qui donne l'impression d'un prix qui manque, et une coupure ratée. | `.pricing-price .amount` à 28 px ; `.period` en bloc dessous, Inter 14 px `--fg-2`. Carte en vedette : bordure accent + pastille, sans halo. | petit |
| 14 | `a-faq-open` : 10 questions encadrées et teintées, symbole « + » en mono. | Des boîtes empilées, lourd. | Une liste sans boîtes : `border-bottom: 1px solid var(--line-soft)`, questions en 18 px, chevron SVG de 16 px, largeur max 760 px. | petit |
| 15 | `cmp-pourvous` : 6 icônes ✓ identiques dans des carrés teintés. | Une décoration répétée qui n'apporte rien. Un signe de gabarit. | Retirer les carrés : coche de 18 px en ligne, couleur `--accent`, ou rien du tout. | petit |
| 16 | Halos (`.btn-primary:hover`, `.logo-mark`, carte en vedette) et violet dans le logo, le hero, « On commence petit », les reflets. | Un héritage « néon ». Trop d'effets dilue l'accent. | Retirer les `box-shadow` lumineux en thème clair (survol : `--accent-hover`, plus foncé de 6 %). Violet seulement dans le dégradé d'un titre par page. | petit |
| 17 | `f-default-mobile` : surtitre centré sur 3 lignes avec son tiret orphelin ; la bulle de clavardage recouvre « Par où commencer ? » ; boutons de largeurs inégales. | Ce sont les 5 premières secondes sur téléphone. | À ≤ 640 px : `.eyebrow::before { display: none }` si centré ; boutons du hero en `width: 100%` ; bulle à `bottom: 88px` ou cachée tant que le hero est visible ; paragraphe d'ouverture en 17 px. | petit |
| 18 | `f-default-partenaires` : logos en couleurs disparates, descriptions en mono, rangée plus étroite que le titre. | Hétéroclite et mal aligné. | Logos en `filter: grayscale(1); opacity: .75` (couleur au survol), hauteur de 40 px ; descriptions en Inter 13 px ; grille alignée sur la largeur du contenant. | petit |

## 3. Ce qui demande des éléments de Camille / ce qu'on peut faire sans

**Il faut Camille** : un logo définitif (le carré dans un carré actuel se lit comme un logo provisoire), des photos de vraies personnes (Camille, l'équipe, un vrai client à l'œuvre ; jamais de banque d'images avec des visages), de vrais témoignages (aujourd'hui `publie = false`), l'accord sur un fond plus chaud (n° 5).
**On peut faire sans** : des visuels abstraits (dégradés `--accent` → `--accent-2` à 8–12 %, formes douces) pour les cartes de services ; un grain très léger (SVG `feTurbulence`, opacité de 2 à 3 %) sur les bandes ; un jeu d'icônes cohérent (un seul trait, 1,5 px, 20 px) ; des aperçus d'écran fictifs **clairement génériques** (gabarit de rappel, tableau Zoho flou) sans nom ni chiffre de client.

## 4. Trois références (trait à reprendre, pas de copie)

1. **Wealthsimple** (finance grand public) : fond chaud presque blanc, beaucoup d'air autour d'un seul message par écran, typographie de titre très grande mais calme. → Reprendre une idée par section et le fond chaud.
2. **Mercury** (services bancaires aux entreprises) : une palette retenue, des filets fins, des ombres presque invisibles, la confiance par la sobriété. → Reprendre les cartes blanches avec bordure de 1 px et ombre minimale, sans halo.
3. **Pilot** (tenue de livres pour PME) : formulaires et parcours de prix très lisibles, gros champs, hiérarchie nette entre un titre, une phrase et l'action. → Reprendre le formulaire de devis et les cartes de forfait.

## 5. Jetons et valeurs recommandés (à ajouter dans `:root`, puis en version sombre)

```css
--fs-h1: clamp(44px, 6.4vw, 84px);  /* lh 1.0, ls -0.035em */
--fs-h2: clamp(32px, 4vw, 52px);    /* lh 1.08, ls -0.025em, text-wrap: balance, max 18ch */
--fs-h3: clamp(20px, 1.6vw, 24px);  /* lh 1.25 */
--fs-lede: clamp(17px, 1.4vw, 20px);/* lh 1.55, max 60ch */
--fs-body: 16px; --fs-card: 15px; --fs-small: 13px; --fs-eyebrow: 12px; /* ls .12em */
--measure: 64ch;
--section-y: clamp(72px, 9vw, 112px); --head-gap: clamp(32px, 4vw, 56px); --grid-gap: 20px;
--radius-sm: 8px; --radius: 12px; --radius-lg: 16px;  /* cartes 16, champs 12, pastilles 8 ; boutons : rester en 999px partout */
--surface: oklch(1 0 0); --bg-band: oklch(0.97 0.006 85);
--shadow-xs: 0 1px 2px oklch(0.25 0.03 260 / 0.06);
--shadow-sm: 0 1px 2px oklch(0.25 0.03 260 / 0.05), 0 8px 24px -12px oklch(0.25 0.03 260 / 0.14);
--accent-hover: color-mix(in oklch, var(--accent) 88%, black);
--btn-h: 44px; --btn-h-lg: 52px;    /* Inter 15px / 600 */
--field-h: 48px;                    /* 16px, fond --surface */
```
Règle de couleur : **un seul accent fonctionnel** (`--accent` : boutons, liens, focus, surtitres) ; **`--accent-2` violet réservé au dégradé d'un titre par page** ; zéro couleur en dur (n° 3).
