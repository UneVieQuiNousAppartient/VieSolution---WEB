# Suivi des tâches — Vie Solution Web

**Dernière mise à jour : 2026-10-21** — dernière section : 15.

Règle : `.claude/rules/suivi-taches.md`. Se consulte par `grep`, jamais en entier.

## 1. ✅ Installation de la méthode de travail (2026-10-17)

**Contexte / demande** : Camille veut que les agents de `methode-travail` travaillent ensemble sur le site, et un rapport réutilisable pour ses autres projets.

**Ce qui a été fait** : copie de `modele/` (agents, règles, skills, scripts, hooks, gabarits) pour les fichiers absents ; `CLAUDE.md` complété (ordre de lecture, Fiche projet) ; `npm run verify` ajouté ; sections « Propre au projet » remplies pour `orchestrateur`, `ux-agent`, `data-agent`, `ai-agent` ; `docs/ETAT-ACTUEL.md`, `docs/ERREURS-CONNUES.md`, ce fichier.

**Vérification technique** : `node scripts/verifier-methode.mjs` → 26 ✔, 0 ✖ ; `npm run typecheck`, `npm run lint` (0 erreur), `next build`, `check-rules`, `check-secrets-suivis` verts. Commit poussé avant `qa-agent` (hook de session) : le `qa-agent` relira ce diff avec celui du chantier pme-accessible à la livraison (section 2).

**Non fait dans ce round** : aucune règle métier propre au projet dans `scripts/check-rules.mjs` (aucun incident vécu encore) ; pas de CI GitHub Actions (exemples dans `methode-travail/exemples/`).

## 2. ✅ Site plus accessible aux PME et travailleurs autonomes (2026-10-17)

**Contexte / demande** : Camille veut qu'un travailleur autonome ou une PME se sente concerné en arrivant sur le site, comprenne que l'IA, Zoho et l'automatisation sont accessibles et font gagner du temps, et voie un premier pas simple (configuration IA de base, mise en place d'un logiciel comme Zoho). Chantier mené avec les agents de `methode-travail` ; accord de Camille sur le plan (≈ 1 M jetons) le 2026-10-17.

**Ce qui a été fait** (documents dans `docs/projets/pme-accessible/` : BRIEF, PRD, APP-FLOW, IMPLEMENTATION-NOTES) :
- `product-manager` (Opus, 115 k) : PRD avec personas, textes prêts à coller, critères d'acceptation ; APP-FLOW (5 parcours, points de contrôle QA).
- `ux-agent` (Opus, 160 k + 8 k de révision) : 3 nouveaux composants `pour-vous-section`, `avant-apres-section`, `demarrer-section` (variantes accueil / ia / zoho, ancre `#demarrer`) ; accueil réordonné (Hero → Pour vous → Avant/après → Démarrer → Services → Processus → Bénéfices → Comparaison → Témoignages → Relève → FAQ → CTA) ; hero, services, IA, Zoho, bénéfices, comparaison, processus, FAQ (5 questions-objections ajoutées en tête), nav (« Démarrer », « Réalisations ») réécrits en français simple ; calculateur : option « Je débute — premier pas » sans montant (constantes et formule de prix intactes) ; chatbot : parcours « Je ne sais pas par où commencer » + actions `goto-ia` / `goto-zoho`. 4 classes CSS ajoutées en fin de `vsw.css` (`/* pme-accessible */`). Aucune nouvelle dépendance, aucun changement de collecte de données.
- `qa-agent` (Opus, 148 k) : verdict VERT, 38 critères vérifiés dans le code (tableau dans le rapport de session) ; une révision (titre dupliqué sur `/zoho`, description de `/ia`, apostrophes du chatbot).

**Vérification technique** : `npm run verify` vert (typecheck 0 erreur ; lint 0 erreur, 10 avertissements préexistants ; build 41/41 pages ; `check-rules` et `check-secrets-suivis` sans violation). Navigateur (Playwright, serveur dev) : captures de `/`, `/ia`, `/zoho`, `/devis` en 1280 px et 390 px ; option « Je débute » et parcours du chatbot cliqués ; défilement réel vers `/ia#demarrer`, `/zoho#demarrer`, `/#demarrer` et via le bouton « Par où commencer ? » (titre à 72 px sous la nav). Seules erreurs console : ressources externes bloquées par le bac à sable (polices Google, Supabase).

**Non fait dans ce round** :
- Décisions de Camille : durée de la formation courte (affichée « [à confirmer] » sur l'accueil) ; mention « Taxes du Québec configurées » (carte Zoho Books, à valider ou retirer) ; les libellés renommés du calculateur partent tels quels dans `type_projet` / `fonctionnalites` du CRM ; « 24h ouvrables » repris dans la confirmation « Je débute » (chiffre existant, à confirmer comme le hero) ; « Je débute » par défaut dans le calculateur (non, pour l'instant) ; accueil à 12 sections (trop long ?).
- Le lien nav « Démarrer » est invisible sous 640 px (menu masqué, comportement existant) ; le bouton du hero compense. Pas de menu mobile dans ce round.
- Pas de page `/demarrer` (recommandation du PRD : inutile sans campagne).
- Les anciennes routes (`/services/*`, `/solutions/*`, `/prix`…) sont encore compilées comme pages bien que redirigées en 308 : nettoyage à prévoir, hors périmètre.
- Footer et `realisations` non retouchés.
- **Coût réel** : ≈ 430 k pour les agents + ≈ 450 k pour la session principale (installation de la méthode, relecture, navigateur, suivi, rapport) ≈ 0,9 M, pour 1 M estimé.

## 3. ✅ Section « Pour votre métier », hero recentré, partenaires (2026-10-17)

**Contexte / demande** : Camille veut que chaque corps de métier (conseiller financier, courtier hypothécaire, clinique dentaire, clinique de soins…) se reconnaisse, avec un message « on améliore votre service pour vous redonner du temps » plutôt que « on vend de l'IA » ; puis une section « Ils nous font confiance » avec les logos et liens de Ben's, KHI et VieSolution, et une courte description de leur domaine. Palier Moyen (≈ 450 k estimés).

**Ce qui a été fait** :
- `product-manager` (Opus, 62 k) : `docs/projets/pme-accessible/PRD-METIERS.md` (8 cartes avec textes, conformité AMF / Loi 25, hero, FAQ, critères).
- `ux-agent` (Opus, 67 k) : `metiers-section.tsx` (8 cartes, ancre `#metiers`), `partners-section.tsx`, hero (eyebrow + lede « Mieux servir vos clients, et retrouver du temps… »), `desc` de services / bénéfices / CTA, carte « Assistants IA » (« vous validez ce qui part »), nav « Métiers », FAQ 12 questions, pied de page « Partenaires », CSS en fin de `vsw.css`.
- Agent principal : recherche des sites des partenaires, logos (`public/partenaires/`), noms, liens et descriptions relevés sur leurs sites ; carte « même la nuit » alignée sur « vous validez ».
- `qa-agent` (Opus, 56 k) : VERT, 24 critères prouvés ; a relevé les notes périmées (corrigées) et les descriptions partenaires (réduites au domaine de chacun).

**Vérification technique** : `npm run verify` (voir ligne ci-dessous) ; navigateur : grille 4 / 2 / 1 colonnes, lien « Métiers » depuis `/ia` (ancre à 72 px sous la nav), 3 cartes partenaires cliquables (`_blank`), aucune erreur de page.

**Non fait dans ce round** :
- Accord écrit des trois partenaires pour l'affichage de leur logo : **à obtenir par Camille**.
- Texte « ce qu'on a fait pour eux » sous chaque logo : non affiché (à rédiger par Camille si souhaité).
- Questions du PRD-METIERS §7 : formulation AMF exacte, autres ordres (OACIQ, CPA), page par métier, lien « Métiers » dans le pied de page.
- « 24/7 » subsiste dans les pages de l'ancien design (redirigées en 308) : nettoyage de l'ancien design toujours à prévoir.
- Design sombre : Camille se demande s'il convient à la clientèle visée ; comparaison avec une variante claire proposée (chantier séparé, ≈ 150-200 k).
- **Coût réel du round 2** : ≈ 185 k agents + ≈ 250 k session principale ≈ 0,45 M (estimé 0,45 M).

## 4. ✅ Thème clair par défaut (2026-10-17)

**Contexte / demande** : Camille doute que le design sombre convienne à la clientèle visée (dentistes, conseillers financiers, comptables). Comparaison sombre / clair sur 7 vues (captures Playwright, mêmes composants, seuls les jetons changent) ; Camille choisit « clair par défaut ».

**Ce qui a été fait** (agent principal, palier petit) : dans `src/app/vsw.css`, les jetons clairs deviennent la valeur de `:root` (`color-scheme: light`) ; les jetons sombres et les surcharges de composants (`.nav`, `.hero-grid`, `.hero-glow`, logos partenaires) passent sous `html[data-theme="dark"]`. Logos partenaires : variantes à texte foncé (`viesolution-fonce.svg`, `khi-succes-academique-fonce.png`) affichées sur fond clair, variantes blanches sur fond sombre (`logoClair` dans `partners-section.tsx`). `CLAUDE.md` (section Design) mis à jour.

**Vérification technique** : `qa-agent` (Opus) ROUGE au premier passage — un seul bloquant : la couleur des messages d'erreur de formulaire (`oklch(0.75 0.18 25)` en dur, illisible sur fond clair) → jeton `--danger` (clair 0.55 / sombre 0.75), corrigé ; tout le reste conforme (18 jetons présents dans les deux blocs, contrastes estimés AA, logos partenaires). `npm run verify` vert après correction ; captures clair (défaut) et sombre (`data-theme="dark"`) sur hero, métiers, partenaires, calculateur ; vue mobile 390 px.

**Non fait dans ce round** : pas de bouton clair/sombre pour le visiteur (le sombre est une option technique) ; 22 couleurs en dur subsistent dans `vsw.css` (lueurs à faible opacité, acceptables sur les deux fonds — à passer en jetons à l'occasion) ; les pages de l'ancien design (redirigées) n'ont pas été revues ; contraste AA à mesurer avec un outil (estimé bon : texte `--fg-1` oklch 0.34 sur fond 0.985).

## 5. ✅ Prix sur mesure : page « Combien ça coûte ? », retrait de tous les montants (2026-10-17)

**Contexte / demande** : Camille juge que le calculateur de prix fait fuir les clients et que ses montants ne sont pas fiables : le prix est sur mesure. Décision (question posée, réponse « Tout sur mesure ») : plus aucun montant sur le site public. Chantier « argent » : accord explicite obtenu avant le code.

**Ce qui a été fait** : `docs/projets/pme-accessible/PRD-PRIX.md` ; `ux-agent` (Opus, 86 k, repris une fois après sa limite de 25 tours) : `/devis` = `PageHeader` « Un prix clair, avant de commencer » → `comment-prix-section.tsx` (3 étapes, ce qui fait varier le prix) → `situation-form.tsx` (métier, ce qui gruge, nom, courriel, téléphone ; envoi par `submitEstimateurRequest` vers `estimateur_requests`, `resultat_estimation = « Sur mesure — à discuter à l'appel découverte »`) → forfaits sans montant → CTA ; `quote-calculator.tsx` supprimé ; chatbot, comparaison, FAQ sans montant ; `CLAUDE.md` (Pages, [à confirmer]). Agent principal : pied de page « Combien ça coûte ? », conditions d'utilisation §5 (« Prix et propositions »), politique de confidentialité (formulaire de situation), état et suivi.

**Vérification technique** : `ux-agent` : typecheck 0 erreur, lint 0 erreur, build 41/41, `grep` des montants vide dans le nouveau design (7 lignes restantes dans l'ancien design, redirigé en 308). `qa-agent` (Opus, 70 k) : VERT, aucun bloquant ; 3 points à trancher et 5 mineurs, corrigés dans la foulée (« Deux minutes suffisent » retiré, formulation de l'étape 03 adoucie, « Décrivez-nous », couleur d'erreur de `contact.tsx` en `--danger`, notes et suivi corrigés). `npm run verify` vert (typecheck, lint 0 erreur, build 41/41, règles, secrets). Captures `/devis` clair / sombre / mobile et messages d'erreur du formulaire. **À tester par Camille** : un envoi réel du formulaire de situation (table `estimateur_requests`, projet Supabase partagé — pas de test automatique pour ne pas créer de fausses demandes).

**Non fait dans ce round** : classes CSS `calc-*` : `.calc-option` sert encore à `/admin`, les autres sont à nettoyer avec précaution ; le brouillon IA de l'Edge Function `vsw-lead-followup` (hors périmètre, non déployée) libelle encore « Estimation en ligne » / « Service visé » — à ajuster quand elle sera déployée ; montants dans les pages de l'ancien design (redirigées) ; l'admin `/admin` affiche toujours `resultat_estimation` tel quel (« Sur mesure… »), à revoir si Camille veut un champ « métier » distinct.

## 6. ✅ Animations sobres et premium (2026-10-17)

**Contexte / demande** : Camille veut des animations pour rendre le site plus haut de gamme ; choix « Sobre et premium » (6 effets, CSS pur, désactivés sous « réduire les animations »).

**Ce qui a été fait** : `docs/projets/pme-accessible/PRD-ANIMATIONS.md` ; `ux-agent` (Opus, 83 k) : bloc `/* pme-accessible — animations */` en fin de `vsw.css` (entrée du hero en séquence, reflet lent sur « nous appartient », halo qui respire, cascade des cartes dans 9 grilles, survols, défilement doux, FAQ fluide, bandeau en pause, règle globale `prefers-reduced-motion`), `nav-scroll.tsx` (nav compacte dès 24 px) monté dans `layout.tsx`. Agent principal : `:where()` sur le hero (bloquant du QA), `data-scroll-behavior="smooth"`, lueur de la carte « Populaire » au survol.

**Vérification technique** : `qa-agent` (Opus, 61 k) ROUGE → un bloquant (délai du h1 écrasé par la spécificité) corrigé, 2 à trancher (tranchés : transitions de la nav gardées ; attribut Next ajouté), 3 mineurs traités ; `npm run verify` vert ; navigateur (Playwright) : hero à 60 / 900 ms, cascade des métiers, nav 72 → 61 px, survol +3 px, bandeau en pause, FAQ, mouvement réduit, thème sombre.

**Non fait dans ce round** : issue #2 (sections invisibles sans JavaScript, bug préexistant : `.reveal { opacity: 0 }` sans repli) — correctif proposé dans l'issue, ≈ 30 k ; les tuiles collées (`.benefit`, `.service`, `.process-step`) n'ont pas de montée au survol (grilles à joints de 1 px qui rogneraient la rangée du haut) ; pas de vidéo de contrôle, seulement des captures à instants fixes.

## 7. ✅ Sélecteur « Je suis… » et cartes métiers repliées (2026-10-17)

**Contexte / demande** : Camille demande si les métiers se reconnaissent facilement ; mesure : section métiers après 2,2 écrans (ordinateur) / 3,7 (téléphone), dernière carte au 9ᵉ écran, menu caché sur téléphone. Décision « A + B » (sélecteur dans le hero + cartes lisibles), en s'inspirant de la présentation par métier de sites reconnus (Jobber, Square, Jane ; les concurrents québécois Nuagix et Automiv étaient inaccessibles).

**Ce qui a été fait** : `PRD-JE-SUIS.md` ; `ux-agent` (Opus, 85 k) : 9 pastilles « Je suis… » dans le hero avec icône par métier (8 nouvelles icônes dans `icon.tsx`), lien direct vers la carte (`id="metier-<slug>"`, mise en évidence `:target`), cartes repliées (icône + titre + « ce qui vous gruge » ; le reste sous `<details>` « Voir ce qu'on améliore pour vous »). Agent principal : `scroll-padding-top` sur `<html>` (Chrome ignorait `scroll-margin-top` sur les cartes), pastilles en retour à la ligne sur téléphone, `min-height: 40px`, pulsation sur `::after`.

**Vérification technique** : `qa-agent` (Opus, 62 k) ROUGE → un bloquant (cible tactile 37 px) corrigé, 3 à trancher traités, textes des 8 cartes vérifiés identiques au PRD (56 chaînes) ; `npm run verify` vert ; navigateur : sélecteur dans le premier écran sur ordinateur (bas à 855 px / 900), section métiers 1,4 écran (ordinateur) et 3,1 (téléphone, contre ≈ 5,4), clic → carte à 76 px sous le haut, passage d'une carte à l'autre sans disparition, ouverture des cartes, thème sombre.

**Non fait dans ce round** : hero trop long sur téléphone (sélecteur au 2ᵉ écran) → lot « finition premium » ; AUDIT-PREMIUM.md (18 correctifs) à implémenter ; issue #3 (menu mobile).

## 8. ✅ Finition premium (2026-10-17)

**Contexte / demande** : « Ça doit être un site premium. » Audit par un directeur artistique (agent Opus, 126 k) sur 13 captures → `docs/projets/pme-accessible/AUDIT-PREMIUM.md` (18 correctifs classés, jetons recommandés, références Wealthsimple / Mercury / Pilot). Accord de Camille : tout le lot, menu mobile inclus (issue #3), fond blanc cassé chaud.

**Ce qui a été fait** : `PRD-PREMIUM.md` (19 critères) ; `ux-agent` (Opus, 136 k) : jetons (`--fs-*`, `--section-y`, `--grid-gap`, `--surface`, `--bg-band`, ombres, `--accent-hover`, hauteurs de boutons et de champs) en clair et en sombre, fond teinte 85, 9 couleurs en dur converties ; sections sans filet avec bandes de fond (avant/après, processus, FAQ) ; en-têtes empilés ; échelle typographique ; texte des cartes ≥ 15 px ; mono réservée aux surtitres et numéros ; grilles détachées (cartes blanches, r16, 20 px, montée au survol), métiers 3 colonnes ; coches en ligne ; halos retirés en clair, violet réservé à deux titres ; nav opaque à 94 % et **menu mobile** (`nav-menu.tsx`, `NAV_LINKS` partagé) ; formulaires (champs 48 px / 16 px, erreur encadrée, liste stylée), `/devis` en 7/12 + colonne ; forfaits et FAQ allégés ; partenaires en gris doux ; mobile (hero plus court, boutons pleine largeur, bulle à 88 px). Agent principal : volets IA/Zoho/Démarrer en cartes détachées (oubli), libellé « Je suis… » en `--fg-2`, ombre du clavardage en jeton, colonne de `/devis` = « Ce qui fait varier le prix » (les 3 étapes ne sont plus affichées deux fois).

**Vérification technique** : `qa-agent` (Opus, 100 k, repris une fois) VERT avec 2 points à trancher (traités) ; contrastes estimés `--fg-1` 11:1, `--fg-2` 5,7:1, accent 4,8:1 ; `npm run verify` vert ; navigateur (Playwright) : sections 112 px, grilles 20 px, cartes r16 blanches, métiers 3 colonnes, champs 48 px / 16 px avec cadre rouge, bouton menu 44×44, panneau 9 liens × 56 px, Échap → focus bouton, défilement bloqué pendant l'ouverture, bulle à 88 px, sélecteur « Je suis… » à 655 px sur téléphone, thème sombre, aucune erreur de page.

**Non fait dans ce round** : en sombre, `--surface` = `--bg-band` (cartes distinguées par la bordure seulement) ; pas de piège de focus dans le menu (non modal, acceptable) ; `body { overflow: hidden }` imparfait sur très vieux iOS ; éléments de Camille toujours attendus pour la dernière marche « premium » : logo définitif, photos de vraies personnes, vrai témoignage.

## 9. ✅ Lot design 21st.dev (2026-10-21)

**Contexte / demande** : « Utilise le plugin 21st.dev pour ajuster et améliorer le design. » Compte 21st.dev en palier gratuit : recherches illimitées, 1 seul téléchargement de code restant ce jour, génération IA désactivée. Les aperçus ont servi d'inspiration ; un seul composant téléchargé (« Comparison 03 », Hirael, MIT). Accord de Camille : tout le lot (4 sections, ≈ 300 k estimés).

**Ce qui a été fait** (agent principal, pas d'`ux-agent`) :
- **Avant / après** (`avant-apres-section.tsx`, client) : un seul panneau `.compare-panel` en grille 2 colonnes ; chaque ligne « avant » partage la rangée (donc la hauteur) de sa ligne « après » — fini le décalage des deux colonnes ; colonne « après » légèrement teintée (`--accent` 4 %) ; marques « — » / coche ; bandeau de conclusion `.compare-outcomes` (3 résultats qualitatifs, aucun chiffre : « Moins de ressaisie », « Rien d'oublié », « Clients mieux servis » + bouton « Voir pour votre métier » → `#metiers`) ; note « Exemples illustratifs » conservée. Téléphone : bascule Avant / Après (`aria-pressed`, 40 px), rendue seulement côté client (`useSyncExternalStore`) ; sans JavaScript, colonnes empilées (`order`).
- **Processus** (`process-section.tsx`, accueil et `/a-propos`) : `<ol class="process-grid process-grid--timeline">`, pastille 01-04 (40 px) reliée par une ligne fine au-dessus des cartes ; ligne par rangée en 2 colonnes, verticale derrière les cartes en 1 colonne ; cartes de même hauteur ; le modificateur ne touche pas `/devis` ni `/postuler-stagiaire`.
- **Appel à l'action** (`cta-section.tsx`, 6 pages) : carte `.cta-card` arrondie (`--radius-xl`), voile `--accent` / `--accent-2`, surtitre, titre `<h2>` centré, boutons centrés (empilés pleine largeur ≤ 640 px). Props inchangées.
- **Hero** : `.hero-glow` en deux tons (bleu-sarcelle à gauche, violet discret à droite) au lieu d'un halo centré.
- `vsw.css` : bloc « Lot 21st.dev » (jetons seulement) inséré avant la règle `prefers-reduced-motion` finale, qui reste dernière.

**Vérification technique** : `npm run verify` vert (0 erreur, avertissements préexistants). Navigateur (Playwright, captures `l21-*.png`) : 5 rangées avec `top` et hauteur identiques ; bascule absente à 1280, visible à 390 (boutons 81×40 / 82×40), clic Avant → AAAAA, Après → BBBBB ; sans JavaScript : bascule absente, 10 cellules visibles, ordre AAAAAABBBBBB ; 4 pastilles 40×40 ; pas de défilement horizontal ; thème sombre ; aucune erreur de page. `qa-agent` (Opus, 65 k) VERT, aucun correctif exigé ; 2 points mineurs corrigés (`role="group"` sur le panneau, marge basse de la dernière cellule en vue « Avant ») ; contrastes calculés ≥ 4,77:1 en clair, 4,97:1 en sombre. Coût réel du lot ≈ 250 k (session principale ≈ 185 k + QA 65 k).

**Non fait dans ce round** : surtitre « // Prochaine étape » ajouté dans la carte d'appel à l'action (6 pages) — **gardé par Camille le 2026-10-21** ; « La différence » (`comparison-section.tsx`, 7 lignes) garde l'ancien tableau à deux colonnes séparées — à passer sur `.compare-panel` si Camille le souhaite (≈ 30 k) ; aucun composant 21st.dev installé tel quel (le site n'est pas sur shadcn/ui : tout est porté sur `vsw.css`) ; second téléchargement 21st.dev possible dès demain (quota 2 / jour).

## 10. ✅ CRM et outils sur mesure, formation IA, logo ampoule (2026-10-21)

**Contexte / demande** : Camille : « on peut aussi faire des CRM maison sur mesure, installer plusieurs outils sur mesure » ; « il me faut un logo » ; « on offre des formations sur l'utilisation de l'IA, j'ai reçu un certificat récemment sur Claude » (PDF du badge fourni) ; « la gestion des réseaux sociaux et les vidéos, ce sera pour plus tard ». Réponses de Camille : lancer les points 1 (CRM / outils) et 2 (formation IA) ; son nom peut paraître ; **pas de date** pour le badge ; aucun contrat avec Zoho ; logo = **variante de l'ampoule de viesolution.ca** aux couleurs du site. Surtitre « // Prochaine étape » gardé.

**Ce qui a été fait** (agent principal) :
- **Services** : 5ᵉ carte « CRM et outils sur mesure » (CRM maison, outils internes, tableaux de suivi, liens avec vos outils → `/devis#situation`), pleine largeur sous les quatre autres ; titre « Cinq façons de vous simplifier la vie » ; numéros « 0X / 05 » calculés.
- **FAQ** : « J'ai déjà un logiciel pour mes clients. Faut-il tout changer ? » — on part de ce que vous avez ; Zoho ou outil maison. Aucune autre marque de CRM nommée.
- **Formulaire de situation** : le texte d'aide demande aussi les outils déjà utilisés (même champ, aucune donnée ni colonne nouvelle).
- **Formation à l'IA** (volet 01, `/ia`) : « Formation à l'IA pour petites entreprises » (courriels, documents, suivi des clients ; ce qu'on ne confie pas à une IA) + mention : « Formation donnée par Camille Yvan Mbiakop, qui a suivi le cours « AI Fluency for small businesses » de Claude Academy (Anthropic). » Titre recopié du PDF ; « a suivi le cours » et non « certifiée » (le PDF est un *course completion badge*) ; date et lien de vérification omis (la page de vérification affiche la date).
- **Marques** : ligne en pied de page « Zoho, Claude, ChatGPT et Copilot sont des marques de leurs propriétaires respectifs. Vie Solution Web n'est affiliée à aucune de ces entreprises. »
- **Logo** : `logo-mark.tsx` — l'ampoule de viesolution.ca (tracé repris du SVG du site) en variante : corps et socle `--accent`, halo, rayons et dernier anneau `--accent-2`, personne en `--logo-on` (nouveau jeton) ; suit le thème ; menu et pied de page. Onglet du navigateur : `src/app/icon.svg` (couleurs du thème clair figées) ; `favicon.ico` par défaut de Next supprimé.

**Vérification technique** : `npm run verify` vert. Navigateur (Playwright, captures `l10-*.png`) : 5 cartes « 01 / 05 … 05 / 05 », logo 28×28 dans le menu (clair, sombre, téléphone), note du badge sur `/ia`, nouvelle question de FAQ, texte d'aide du formulaire, mention des marques, `/icon.svg` servi (200, `image/svg+xml`) et seule icône déclarée, pas de défilement horizontal à 390 px, aucune erreur de page. `qa-agent` (Opus, 70 k) ROUGE sur un point : le style de `.ai-pillar-note` était écrasé par `.ai-pillar p` (15 px `--fg-1` au lieu de 13 px `--fg-2`) — corrigé par un sélecteur doublé, mesuré 13 px après correction ; point à trancher corrigé aussi : à 1024 et 820 px la carte 4 laissait un trou (carte 3 seule sur sa ligne) → grille 1-2 / 3-4 / 5 pleine largeur, mesurée. Contrastes calculés ≥ 5,25:1 (note, mentions), logo 4,83:1 en clair. Coût réel du lot ≈ 210 k (session principale ≈ 140 k + QA 70 k).

**Non fait dans ce round** : **gestion des réseaux sociaux et vidéos** — reporté par Camille (« plus tard, aussitôt que j'aurai fait les miens ») ; image de partage (`og-image`) et icône Apple non refaites ; le logo de Vie Solution Assurance n'est pas modifié ; ampoule à faire valider par la personne responsable de la conformité du cabinet d'assurance (même famille de logo, entreprises distinctes) — **à confirmer par Camille**.

## 11. ✅ Sites et applications web ; mention retirée sous le logo (2026-10-21)

**Contexte / demande** : Camille : « enlève Québec IA Zoho en bas du logo ; on ne mentionne nulle part que nous faisons aussi des sites web, des applications web, des pages… »

**Ce qui a été fait** (agent principal) :
- Menu : « Québec · IA & Zoho » retiré sous le nom (le pied de page garde « Québec · Canada » sous le logo).
- Services : nouvelle carte **05 « Sites et applications web »** (sites vitrines, pages de destination, applications web, formulaires reliés à vos outils → `/contact`), icône `globe` ajoutée ; « CRM et outils sur mesure » devient **06** ; « Six façons… » ; texte d'introduction : « on crée votre site web ». Grille : 1 | 2 | 3 / 4 (2 col.) / 5 (2 col.) | 6 ; en deux colonnes 1-2 / 3-4 / 5-6 ; place réservée à la flèche des cartes (`padding-right` des étiquettes).
- Pied de page : « Automatisation, IA, sites web et implantation Zoho… » + lien « Sites et applications web ».
- Formulaire de contact : le choix « Site web » devient « Site ou application web ».
- Métadonnées : description du site et mots-clés « site web », « application web ».
- Aucun lien vers les partenaires ni les réalisations : le site ne dit pas que Vie Solution Web a bâti leurs sites (texte « ce qu'on a fait pour eux » toujours en attente de Camille).

**Vérification technique** : `npm run verify` vert. Navigateur (Playwright) à 1280 / 1024 / 820 / 390 px : 6 cartes aux positions attendues, aucune étiquette sous la flèche, pas de défilement horizontal, mention absente sous le logo, aucune erreur de page. `qa-agent` (Opus, 45 k) VERT, aucun correctif ; la valeur « Site web » n'est validée nulle part côté serveur (`sujet` : `z.string().min(1)`), le renommage est sans risque. Coût réel du lot ≈ 110 k (session principale ≈ 65 k + QA 45 k).

**Non fait dans ce round** : pas de page dédiée « Sites web » ni d'exemples de sites dans « Cas d'usage » (les exemples actuels sont IA et Zoho) — à prévoir quand Camille aura des réalisations web à montrer ; chatbot non mis à jour (pas de choix « site web »).

## 12. ✅ Inspiration zoho.com : positionnement, logiciels par besoin, engagements, installation de Claude (2026-10-21)

**Contexte / demande** : Camille : « https://www.zoho.com/ prends ce qui est bon, notamment le branding de Zoho » ; puis « regarder avec ce que j'essaie d'offrir » ; accord sur la proposition, avec précision : « je peux aussi installer des affaires comme Claude, faire des CRM ; je veux offrir tout ce dont les PME peuvent avoir besoin ». **Décision** : aucun élément de l'identité de Zoho (logo, carrés de couleur, chiffres, logos de leurs clients) — confusion possible et aucun contrat avec Zoho ; seulement des idées de structure.

**Ce qui a été fait** (agent principal) :
- **Accueil, intro des services** : « Les logiciels existent déjà : Zoho, Claude et bien d'autres. Nous, on choisit les bons pour vous, on les installe, on les relie et on vous forme. Et quand rien n'existe, on le bâtit : votre site, votre CRM, vos outils. »
- **Service 02** : « On installe Claude ou ChatGPT pour votre équipe, prêts à l'emploi, ou on bâtit un assistant IA… » ; étiquette « Installation de Claude ».
- **/ia, volet 03** : « Des outils IA installés et bâtis pour vous » (installation et réglage de Claude ou ChatGPT, règles d'utilisation claires).
- **/zoho** : phrase « Zoho fait les logiciels. Nous, on les fait marcher chez vous » ; les 8 noms en pastilles deviennent **10 cartes par besoin** (Clients, Clients en simple = **Bigin**, Facturation, Service client, Marketing, Stock, Équipe, Projets, Sur mesure = **Zoho Creator**, Liens) — idée de la section « Featured apps » de zoho.com ; descriptions de Bigin et Creator d'après zoho.com.
- **Accueil, « Nos engagements »** (`engagements-section.tsx`, après « La différence ») : 4 cartes — vos besoins d'abord ; vous gardez le dernier mot ; vos données vous appartiennent (Loi 25) ; on reste après. Chaque engagement reprend un texte déjà publié (FAQ, « La différence ») : aucune promesse nouvelle.

**Vérification technique** : `npm run verify` vert. Navigateur (Playwright) à 1280 / 1024 / 820 / 390 px : catalogue Zoho 10 cartes en 5 / 2 / 2 / 1 colonnes, engagements 4 cartes en 4 / 2 / 2 / 1 colonnes, 0 chevauchement, pas de défilement horizontal, aucune erreur de page. `qa-agent` (Opus, 45 k) VERT ; engagements comparés mot à mot aux textes publiés ; contrastes ≥ 5,04:1. Suite au QA : « avec des règles d'utilisation claires » retiré du volet 03 (promesse absente du reste du site) ; titres « Vos besoins d'abord » et « Vous gardez le dernier mot » (plus fidèles à la FAQ que « Les bons outils, pas les nôtres » et « Rien ne part sans vous »). Coût réel du lot ≈ 150 k (session principale ≈ 105 k + QA 45 k). Incident en route : `.next/dev/types/validator.ts` tronqué par l'arrêt du serveur de test → registre E02.

**Non fait dans ce round** : programme de partenaires Zoho non étudié (conditions à vérifier par Camille avant toute mention « partenaire ») ; outil Zoho de gestion des réseaux sociaux non vérifié (pour le chantier « réseaux sociaux », plus tard) ; accueil passé à 16 sections — à alléger si Camille le trouve long.

## 13. ✅ Site prêt pour Google et les IA (SEO / AEO) ; service « SEO et AEO » (2026-10-21)

**Contexte / demande** : Camille : « Il y a AEO, SEO etc. » + modèle Framer « Agnos » comme inspiration visuelle. Accord de Camille sur trois lots : A (site prêt SEO/AEO), B (service SEO et AEO), C (design inspiré d'Agnos — **maquettes demandées avant tout code**, voir §14). Domaine confirmé par Camille : **viesolutionweb.ca**. Surtitres : style Agnos (pour le lot C).

**Ce qui a été fait** (agent principal) :
- `src/lib/site.ts` : `SITE_URL` (seul endroit où le domaine est écrit) et liste des pages publiques.
- `src/app/sitemap.ts` → `/sitemap.xml` (11 pages publiques ; anciennes URL redirigées et `/admin` exclues) ; `src/app/robots.ts` → `/robots.txt` (tout ouvert, y compris aux robots des assistants IA ; `/admin` et `/api/` fermés).
- `layout.tsx` : `metadataBase`, `og:url` ; fiche **ProfessionalService** (schema.org) sans coordonnées (courriel et téléphone encore [à confirmer]). `json-ld.tsx` : `<script type="application/ld+json">` avec `<` échappé.
- FAQ : données **FAQPage** générées depuis les mêmes questions que la liste affichée.
- `public/llms.txt` : résumé du site pour les assistants IA (services, engagements, pages, aucune affiliation).
- **Service 07 « Être trouvé sur Google et par les IA »** (SEO + AEO), « Sept façons… », provisoirement en rangée complète (mise en page à deux colonnes au lot C) ; FAQ « C'est quoi l'AEO ? » ; pied de page « SEO et AEO » ; description et mots-clés du site.

**Vérification technique** : `npm run verify` vert. Navigateur : `/sitemap.xml` 200 `application/xml`, `/robots.txt` 200, `/llms.txt` 200 ; accueil : JSON-LD `ProfessionalService` + `FAQPage` (14 questions = 14 visibles) ; `og:url` = https://viesolutionweb.ca ; 7 cartes de services sans trou ; aucune erreur de page. Incident en route : E03 (cache Turbopack) → registre. `qa-agent` (Opus, 50 k) ROUGE sur un point : la fiche schema.org nommait Camille « fondatrice », fait absent du site (son nom n'y paraît que comme formatrice) → ligne `founder` retirée ; à remettre si Camille confirme. Tout le reste vert (11 URL du plan du site en 200, FAQPage 14 = 14 visibles, domaine écrit seulement dans `site.ts` et `llms.txt`). Coût réel du lot ≈ 130 k (session principale ≈ 80 k + QA 50 k).

**Non fait dans ce round** : image de partage (`og:image`) non créée ; Google Search Console et fiche Google d'entreprise à créer par Camille **après la mise en ligne** ; scores Lighthouse à mesurer sur le site en ligne seulement (aucun score affiché sur le site).

## 14. ✅ Lot design inspiré d'Agnos, avec la bande « Des sites qu'on a bâtis » (2026-10-21)

**Contexte / demande** : maquettes demandées par Camille (« je veux des mockups si possible ») sur le modèle Framer « Agnos » (sa copie publiée, camitest.framer.website, est identique au modèle) ; ajout demandé : « on peut mettre les pages des sites que l'on a déjà faits, les accueils » ; capture de Ben's « quand les produits sont affichés ». Accord : « oui, lance le lot design avec la bande des sites ». Maquettes : `scratchpad/maquettes/m1-m5` (hors dépôt).

**Ce qui a été fait** (agent principal) :
- **Surtitres** : petite étiquette encadrée « › … ‹ » (choix de Camille) ; les « // » retirés des 20 surtitres.
- **Menu flottant** : barre détachée (12 px du haut, coins 16 px, ombre), « Prendre un RDV » ; panneau mobile en carte arrondie.
- **Boutons** : coins 12 px (au lieu de pilules) ; nouveau `.btn-dark` (jetons `--ink` / `--on-ink`, clair et sombre). Les pastilles de métiers restent rondes.
- **Hero** : arcs fins, 6 tuiles d'outils flottantes (décoratives, `aria-hidden`, cachées sous 1100 px, immobiles sous « mouvement réduit »), « appartient. » en couleur pleine, texte d'accroche élargi (IA, Zoho, sites web, CRM sur mesure), « Par où commencer ? » en bouton foncé, note manuscrite « appel gratuit de 30 min » (police Caveat via next/font), séparateur « Je suis… ». **Retirés** : les chiffres du hero (« IA + Zoho / 24h / 100 % / FR » — absents de la maquette validée ; « 24h » et « 100 % » restaient à confirmer) et le bandeau de mots défilants.
- **Bande « Des sites qu'on a bâtis »** (`sites-band.tsx`) : Les Jus Naturels Ben's (produits affichés, promotion datée et barre d'inscription retirées de la capture), VieSolution, Khí Succès Académique ; captures du 2026-10-21 en WebP (≈ 40 Ko chacune) dans `public/realisations/` ; défilement CSS lent, pause au survol et au focus, arrêt + défilement manuel sous « mouvement réduit » ; liste rendue 3 fois pour une boucle sans trou, copies 2-3 cachées aux lecteurs d'écran et hors tabulation ; liens dans un nouvel onglet.
- **Services** : deux colonnes — titre, texte, bouton « Décrire votre situation » et « 01 — 07 » fixes à gauche ; 7 cartes empilées dans un plateau (`--tray`), numéro, icône en haut à droite, étiquettes en pastilles.
- **Nos engagements** : mosaïque dans un plateau — 4 engagements, carte « Un appel de 30 minutes » (« proposition écrite » reprend l'étape 02 de `/devis`) avec bouton foncé, liste des 8 métiers en pointillés (liens vers leurs cartes) ; titre centré.

**Vérification technique** : `npm run verify` vert. Navigateur (Playwright) à 1440 / 1280 / 1024 / 820 / 390 px : menu 1200 / 992 / 788 / 366 px de large, pas de défilement horizontal, 7 cartes de services et 6 cases d'engagements sans chevauchement, 9 cartes de sites dont 3 atteignables au clavier, tuiles cachées sous 1100 px ; 0 surtitre « // » restant ; « mouvement réduit » : animation de la bande `none`, défilement manuel `auto` ; thème sombre vérifié ; aucune erreur de page ni d'hydratation. `qa-agent` (Opus, 73 k) VERT, aucun correctif ; contrastes ≥ 4,83:1 (clair et sombre), menu mobile, colonne fixe, défilement, mouvement réduit vérifiés. Suite à ses remarques : décors « › ‹ » et « ✦ » rendus muets pour les lecteurs d'écran (`content: … / ""`) ; **bouton Pause / Lecture** sur la bande (case à cocher, sans JavaScript, WCAG 2.2.2 sur écran tactile). Laissé à Camille : « // FAIT AU QUÉBEC AVEC RIGUEUR » en pied de page (pas un surtitre). Coût réel du lot ≈ 300 k avec les maquettes (session principale ≈ 225 k + QA 73 k).

**Non fait dans ce round** : accord des trois clients pour l'affichage de leur page d'accueil (comme pour leurs logos) — **à obtenir par Camille** ; captures à refaire si leurs sites changent ; processus « en arc » et pages de réalisation (« Le défi / La solution / Le résultat ») non faits — attendent les informations de Camille ; anciennes règles CSS `.services-grid` / `.service` laissées en place (plus utilisées par l'accueil).

## 15. ✅ Trois pages de service : sites web, CRM sur mesure, référencement (2026-10-21)

**Contexte / demande** : Camille : « c'est une landing page ou multi pages ? » → site de 11 pages publiques, mais 3 services sans page à eux ; « oui, crée les trois pages » (≈ 150 k). Skill `nouvelle-page` suivie. Pas de maquette séparée : gabarit déjà validé des pages `/ia` et `/zoho`.

**Ce qui a été fait** (agent principal) :
- `src/app/sites-web/page.tsx` (« Un site qui travaille pour votre entreprise ») : 3 volets (sites vitrines, pages de destination, applications web), bandeau vers `/referencement`, **grille « Des sites qu'on a bâtis »** (`realisations-grid.tsx`, mêmes données et captures que la bande de l'accueil, `SITES` exporté de `sites-band.tsx`).
- `src/app/crm-sur-mesure/page.tsx` (« Un outil fait pour votre façon de travailler ») : on part de ce que vous avez (votre logiciel, Zoho, un outil maison), CRM maison, outils internes et tableaux de suivi ; bandeau Loi 25 ; bouton vers `/devis#situation`.
- `src/app/referencement/page.tsx` (« Être trouvé sur Google et par les IA ») : SEO, AEO, fiche d'entreprise ; aucune promesse de classement ; bandeau « le même travail que sur notre propre site ».
- `service-detail-section.tsx` : section « trois volets » commune (styles `.ai-wrap` existants).
- Textes repris (après QA) des cartes de services, de « Avant / après », de la FAQ (« J'ai déjà un logiciel… », « C'est quoi l'AEO ? », « Et mes données… ») et de `llms.txt` ; aucun prix, aucun chiffre.

**Par où les pages sont accessibles** : cartes de services 05, 06 et 07 de l'accueil (`services.tsx`) ; pied de page, colonne « Services » (3 liens) ; lien « Nos sites et applications web → » sous la bande de l'accueil (vers `/sites-web`) ; `/sites-web` → `/referencement`. **Pas** dans la barre de navigation (déjà 8 liens). Plan du site : 3 routes ajoutées à `PUBLIC_ROUTES` (`src/lib/site.ts`) ; `public/llms.txt` mis à jour. Langue : FR seul. Pages statiques : aucun état de chargement, vide ou erreur à prévoir.

**Vérification technique** : `npm run verify` vert. Les 3 routes répondent 200 et figurent dans `/sitemap.xml` ; atteintes **en cliquant** depuis l'accueil (3 cartes, lien du pied de page, lien sous la bande) avec le bon `h1` ; 1 seul `h1` par page ; aucun débordement à 375 px ; aucune erreur de page. Pas de test e2e automatisé (le projet n'en a pas encore : « Tests ciblés : — »). `qa-agent` (Opus, 70 k) ROUGE : (1) capacités non sourcées sur `/sites-web` (« portail client », « boutique en ligne », « suivi de dossiers », « adapté au téléphone ») et `/referencement` (« région servie ») → remplacées par des formulations déjà publiées (carte 05, « Avant / après », FAQ) ; (2) saut de titre h2 → h4 dans les volets → `h3` (styles identiques). Coût réel du lot ≈ 175 k (session principale ≈ 105 k + QA 70 k).

**Non fait dans ce round** : pages de réalisation détaillées (défi / solution / résultat) — attendent les faits de Camille ; données structurées `Service` par page non ajoutées ; liens dans la barre de navigation non ajoutés (à décider par Camille si elle les veut).
