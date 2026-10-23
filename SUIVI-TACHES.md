# Suivi des tâches — Vie Solution Web

**Dernière mise à jour : 2026-10-23** — dernière section : 46.

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

## 16. ✅ Suivi des demandes inspiré de KHI — lot 1 : base, moteur horaire, désabonnement (2026-10-21)

**Contexte / demande** : Camille : « comment est fait le CRM, s'inspirer de KHI actuellement pour le suivi ». Choix (questions) : relances « comme KHI : automatiques », « le cœur du suivi », moteur « comme KHI » (Vercel Cron + route Next). Plan en deux lots accepté (« oui deux lots, utilise Resend, d'accord pour les relances »). Lot 1 ≈ 700 k annoncé. Question de Camille : « est-ce que je peux utiliser la même BD que VieSolutionCSF ? » → oui, c'était déjà le cas (tables `vsw_*` seulement).

**Ce qui a été fait** (agent principal) :
- `supabase/setup-crm-vsw.sql` (toujours non exécuté) : 7 étapes (Nouveau, Contacté, RDV, **Qualifié**, Client, **À relancer**, Perdu) en contrainte ; source de désabonnement contrôlée ; trigger d'intake : tâche « Rappeler » (dans l'heure de 8 h à 20 h, sinon 9 h le lendemain — `vsw_echeance_rappel`) et étape « RDV » automatique quand un créneau est choisi sur le site ; verrou `vsw_claim_job_lock` / `vsw_release_job_lock` (service_role seulement) ; gabarits `followup_new_1` / `followup_new_2` (brouillon Dale Carnegie à relire) ; réglages `postal_address` (vide = aucune relance) et `sender_name` ; anciennes règles `relance` / `cron_secret` retirées ; secours pg_cron documenté.
- `src/lib/crm/` : `regles.ts` et `jeton.ts` (règles pures : LCAP 6 mois / 2 ans, désabonnement par adresse, délais avec fenêtre de rattrapage de 72 h, contact humain, pied anti-pourriel, jeton HMAC), `moteur.ts` (catalogue repris de KHI : brouillon `first_reply` à approuver, alerte 24 h, relances J2 et J5 **désactivées par défaut**, « À relancer » + tâche d'appel à J7, « Reprendre contact » à 30 jours ; réservation unique par règle/fiche/période ; rien n'est réservé tant que Resend, l'expéditeur, l'adresse postale ou le secret manquent), `envoi.ts` (Resend, clé d'idempotence), `fiche.ts` (contact humain, tâches, désabonnement), `tick.ts`.
- Routes : `/api/cron/tick` (Bearer `CRON_SECRET`, comparaison en temps constant), `/api/desabonnement` (GET confirmation sans effet, POST désabonnement, « en un clic » RFC 8058). `vercel.json` : passage à :20 chaque heure.
- `/api/admin/action` : actions `contact` (appel, courriel, SMS, RDV → arrête les relances), `opt_out` (désabonnement reçu par l'équipe), 7 étapes, `next_action_at` recalculé quand une tâche est faite ; « Envoyé » d'un brouillon = contact humain.
- Edge Function `supabase/functions/vsw-lead-followup` supprimée (jamais déployée, remplacée). `npm test` ajouté à `npm run verify`. `CLAUDE.md` : flux, règle des courriels automatiques, variables d'environnement.

**Vérification technique** : `npm test` 17/17 (règle cassée deux fois → les tests échouent, puis rétablie) ; `npm run verify` vert (10 avertissements eslint préexistants) ; SQL rejoué dans un Postgres 16 local avec tables factices : échéances du rappel (jour, soir, nuit, été, hiver, bornes 8 h / 20 h), dédoublonnage + passage en RDV, tâches, contraintes, verrou, droits `anon` refusés, clé unique. Routes : cron sans secret / mauvais secret → 401. `qa-agent` (Opus, ≈ 98 k) **VERT** ; révision unique : échec Resend définitif non réessayé, clé d'idempotence, gabarit absent ne consomme pas la relance, borne de 30 jours sur J7, journal sans contenu de Resend, phrase sans fondement retirée de la page de désabonnement, gabarits reformulés (« Merci encore pour votre demande », plus de promesse de « pistes concrètes »). Moteur **non testé contre un vrai Supabase** (pas de PostgREST ici) : **à tester par Camille** après exécution du SQL. Coût réel ≈ 310 k (session ≈ 210 k + QA 98 k).

**Non fait dans ce round** : lot 2 (onglet « Aujourd'hui », boutons « Appel / Courriel / RDV » et « Désabonner » dans `/admin`, réglage des règles) ; adresse postale (Camille) ; plan Vercel (Hobby probablement limité à un cron par jour → pg_cron en secours) ; les réponses des prospects par courriel ne sont pas lues (pas de boîte synchronisée) : Camille doit noter le contact dans `/admin`, sinon J5 part ; rédaction des brouillons par Claude API retirée avec l'Edge Function (gabarits seulement ; à rebrancher avec `@anthropic-ai/sdk`, modèle Haiku, sur accord) ; `supabase/setup-complet-nouveau-projet.sql` (historique) mentionne encore l'Edge Function ; le fichier SQL n'est pas rejouable deux fois (`CREATE POLICY`, antérieur au lot).

## 17. ✅ Suivi des demandes : adresse postale, relances activées, projet Vercel (2026-10-21)

**Contexte / demande** : réponses de Camille aux questions du §16 : adresse postale « 40 rue de l'église J4G1H9 », puis ville « Longueuil » ; textes des deux relances : « oui » ; Vercel : « j'ai déjà un compte vercel », puis « oui crée le projet vercel » (projet séparé, recommandé).

**Ce qui a été fait** (agent principal) : `vsw_settings.postal_address` amorcé avec « 40 rue de l'église, Longueuil J4G1H9 » (`supabase/setup-crm-vsw.sql`) ; relances J2 et J5 actives par défaut (`src/lib/crm/moteur.ts`), commentaires et `CLAUDE.md` à jour. Vercel (connecteur, lecture seule) : équipe `viesolution` avec les projets `khieduc`, `vie-solution-csf`, `jus-naturels-bens` ; les mises en production de KHI (cron horaire documenté dans son `CLAUDE.md`) sont « READY » → le cron horaire de VSW devrait passer dans la même équipe (le forfait n'est pas lisible par le connecteur). Projet **`vie-solution-web`** créé (connecteur Vercel), relié au dépôt GitHub ; branche de production = branche par défaut du dépôt (`claude/nextjs-web-project-RPcId`, ancien site) ; protection par défaut de l'équipe ; aucun domaine, aucune variable d'environnement.

**Vérification technique** : `npm run verify` vert ; `npm test` 17/17 ; `qa-agent` (Opus, ≈ 30 k) **VERT** (adresse fidèle à ce que Camille a dit, garde d'envoi intacte, documents cohérents) ; à savoir : un formulaire de test soumis après la mise en ligne recevra une vraie relance 48 h plus tard si aucun contact n'est noté dans `/admin`. Première mise en ligne Vercel « READY » : la branche de production (ancien site) est publiée sur `vie-solution-web.vercel.app`. Coût réel ≈ 80 k (session ≈ 50 k + QA 30 k). Rien ne part encore : SQL non exécuté, Resend et variables non configurés.

**Non fait dans ce round** : variables d'environnement Vercel (à saisir par Camille : clés Supabase, `ADMIN_ACCESS_CODE`, `CRON_SECRET`, `UNSUBSCRIBE_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`) ; domaine viesolutionweb.ca ; branche de production à changer au moment de la fusion ; compte Resend ; exécution du SQL ; lot 2 (onglet « Aujourd'hui ») en attente du feu vert de Camille.

## 18. ✅ Double vérification (MFA) de /admin (2026-10-21)

**Contexte / demande** : Camille, à propos de `ADMIN_ACCESS_CODE` : « je peux avoir MFA ? », puis « oui fais la MFA puis le lot 2 » (plan ≈ 200 k accepté). Constat avant : un seul code, aucune limite d'essais, jeton de session fixe (empreinte du code) réutilisable tant que le code ne change pas.

**Ce qui a été fait** (agent principal) : KHI utilise le MFA de Supabase Auth (comptes) — inapplicable ici (pas de comptes) : TOTP RFC 6238 écrit sans dépendance.
- `src/lib/admin/mfa.ts` (pur) : base32, HOTP/TOTP (±30 s, anti-rejeu par pas), secret de 160 bits, lien `otpauth://`, 8 codes de secours `XXXX-XXXX` (empreinte HMAC seulement), session `exp.m.signature` (HMAC, 8 h, clé = **`ADMIN_SECRET`** + empreinte du code d'accès), chiffrement AES-256-GCM du secret TOTP, comparaison du code en temps constant.
- `src/lib/admin/mfa-store.ts` + SQL (`vsw_rate_limit_hit`, `vsw_totp_accept`, `vsw_use_backup_code`, `vsw_mfa_enroll`, service_role seulement) : secret chiffré, dernier pas, codes de secours dans `vsw_settings` ; compteurs dans `vsw_rate_limits` (purgés après un jour par le passage horaire).
- Routes : `/api/admin/login` (code + code à 6 chiffres ou code de secours ; 8 essais par IP par 15 min ; 20 échecs du second facteur au total par 15 min, comptés seulement quand le code d'accès est juste ; échecs et connexions au journal ; alerte en cas de code de secours ou d'échecs répétés ; base injoignable ou `ADMIN_SECRET` absent = refus), `/api/admin/mfa` (activation atomique : sans session complète, seulement s'il n'existe aucun secret ; alerte à chaque activation), `/api/admin/logout`. `src/lib/admin-auth.ts` : `isAuthed` exige la double vérification — une session « code seulement » ne sert qu'à l'activer.
- `/admin` : second champ à la connexion, écran d'activation en 3 étapes (application, clé ou lien, premier code), écran des codes de secours, bouton « Se déconnecter ».

**Vérification technique** : `npm test` 28/28 (vecteurs officiels RFC 6238 ; anti-rejeu cassé une fois → test rouge ; jeton forgé avec le seul code d'accès refusé ; chiffrement) ; SQL rejoué dans un Postgres 16 local (compteur, anti-rejeu, code de secours unique, activation atomique, droits `anon` refusés) ; parcours d'écran dans Chromium à 390 px (réponses du serveur simulées). `qa-agent` (Opus, ≈ 74 k) **VERT** avec 3 points ; `securite` (Opus, ≈ 129 k) **NON** : session forgeable avec le seul code d'accès (critique, prouvé par un script), activation non atomique, blocage de Camille par le compteur global, secret TOTP en clair dans une base partagée avec CSF → tout corrigé dans la révision unique, puis re-vérifié par `securite` (≈ 30 k) : **OK pour la mise en ligne** une fois `ADMIN_SECRET` saisi et le SQL exécuté (secret serveur `ADMIN_SECRET`, `vsw_mfa_enroll`, compteur global limité aux échecs du second facteur, chiffrement, empreintes HMAC, messages de refus identiques, `x-real-ip`, purge, journal et alertes). Dépendances : `next` 16.1.6 vulnérable (critique) → issue [#4](https://github.com/UneVieQuiNousAppartient/VieSolution---WEB/issues/4). Non testé contre un vrai Supabase : **à tester par Camille** après exécution du SQL.

**Non fait dans ce round** : « se souvenir de cet appareil » (KHI : 30 jours) ; plusieurs téléphones ; code QR (il faudrait une dépendance : lien `otpauth://` sur téléphone ou clé à taper) ; aucun écran pour régénérer les codes de secours ou changer de téléphone (l'API le permet avec une session complète) ; révocation des sessions côté serveur (un cookie volé reste valable jusqu'à 8 h ; changer `ADMIN_ACCESS_CODE` ou `ADMIN_SECRET` les coupe toutes) ; mise à jour de Next.js (issue #4). `.env.local.example` non complété (fichiers `.env*` protégés par le hook du projet : liste des variables dans `CLAUDE.md`).

## 19. ✅ Suivi des demandes — lot 2 : page « Aujourd'hui », boutons de contact, réglage des relances (2026-10-21)

**Contexte / demande** : lot 2 du plan du §16 (« cœur du suivi » : page « Aujourd'hui », séquence de relance réglable, contact humain qui arrête tout), feu vert de Camille : « oui fais la MFA puis le lot 2 » (≈ 450 k annoncé).

**Ce qui a été fait** (agent principal) :
- `src/lib/crm/aujourdhui.ts` (pur, sans import) : `construireAujourdhui` — tâches en retard, tâches du jour (fin de journée à l'heure de Montréal), demandes sans contact depuis 24 h, dossiers « À relancer », brouillons à approuver, alertes ; `validerReglage` (marche/arrêt, délai en jours entiers de 1 à 90).
- `/api/admin/data` : renvoie aussi `aujourdhui` et `regles` (200 fiches, 200 tâches). `/api/admin/regles` (POST, accès complet exigé) : règle connue seulement, validation, surcharge dans `vsw_automation_rules`, journal. `moteur.ts` : `listerRegles`, `reglerRegle`.
- `/admin` : onglet **« Aujourd'hui »** par défaut (compteur dans l'onglet ; message quand il n'y a rien à faire) ; sur chaque fiche, boutons **« Appel fait », « Courriel envoyé », « RDV pris »** (action `contact` du lot 1 : arrête les relances, fait avancer l'étape) et **« Désabonner »** (confirmation, désabonnement LCAP de toute l'adresse) ; liens `mailto:` et `tel:` ; « Fait » sur les tâches, « Lu » sur les alertes ; onglet **« Relances »** : chaque règle avec sa description, marche/arrêt et nouveau délai en jours.

**Vérification technique** : `npm test` 32/32 (fin de journée été/hiver, classement de la page, validation des réglages) ; `npm run verify` vert ; parcours dans Chromium à 1280 et 390 px avec des données simulées : sections affichées, chaque bouton envoie la bonne action (`contact`/`appel`, `opt_out`, réglage marche/arrêt et délai), aucun débordement ni erreur. `qa-agent` (Opus, ≈ 70 k) **VERT** ; révision unique : la relance 2 ne peut plus être réglée avant la relance 1, « Désabonnement enregistré » (sans genre). Coût réel du lot ≈ 170 k (session ≈ 100 k + QA 70 k). Non testé contre un vrai Supabase : **à tester par Camille**.

**Non fait dans ce round** : `finDeJournee` décalée d'une heure les deux jours de changement d'heure ; seules les 200 fiches les plus récentes sont chargées (une tâche d'une fiche plus ancienne s'affiche sans nom) ; réglage du texte des courriels depuis l'admin (les gabarits restent dans le SQL) ; tableau en colonnes (kanban) et courriel du matin (non retenus par Camille) ; bouton « Envoyer tel quel » (non retenu) ; historique (timeline) d'une fiche à l'écran.

## 20. ✅ Mise à jour de Next.js 16.1.6 → 16.4.2 (issue #4) (2026-10-21)

**Contexte / demande** : la revue de sécurité du §18 a relevé `next` 16.1.6 vulnérable (critique : contrebande de requêtes dans les rewrites, cache `next/image` sans borne, etc.) et `nanoid` (élevé) — issue [#4](https://github.com/UneVieQuiNousAppartient/VieSolution---WEB/issues/4). Camille : « oui fais la mise à jour de Next.js ».

**Ce qui a été fait** (agent principal) : `next` et `eslint-config-next` 16.1.6 → **16.4.2** (dernière version stable, 15 oct. 2026), versions toujours figées ; `npm audit fix` (sans `--force`) pour les dépendances transitives (`nanoid`…). `package.json`, `package-lock.json`.

**Vérification technique** : `npm audit --omit=dev` : **0 vulnérabilité** en production. `npm run verify` vert (32/32 tests, 0 erreur eslint, 10 avertissements préexistants, build). Build de production lancé (`next start`) : 15 routes répondent 200 (`/`, `/ia`, `/zoho`, `/devis`, `/rdv`, `/contact`, `/admin`, les 3 pages de service, `/realisations`, `/a-propos`, `sitemap.xml`, `robots.txt`, `llms.txt`), 404 sur une page inexistante, `/api/cron/tick` sans secret → 401 ; titres `h1` corrects ; aucune erreur de page (seules erreurs : ressources externes bloquées par le réseau de l'environnement, et le 401 attendu de `/admin` avant connexion) ; parcours de double vérification et page « Aujourd'hui » rejoués (données simulées) sans erreur ni débordement. `qa-agent` (Opus, ≈ 48 k) **VERT** : versions figées et cohérentes avec le verrou, diff du verrou sans surprise (sharp 0.35, postcss, nanoid, binaires facultatifs de sharp), aucun avertissement nouveau au build. Coût réel ≈ 90 k (session ≈ 40 k + QA 48 k).

**Non fait dans ce round** : `braces` (via `micromatch`, outils de lint seulement, pas dans le site publié) reste signalé par `npm audit` : la seule « correction » proposée (`--force`) rétrograderait `eslint-config-next` en 14 — refusée.


## 21. ✅ Relief du haut de page, réorganisation de l'accueil, menu Services, couleurs vives, galerie d'admin (2026-10-22)

**Contexte / demande** : brief design de Camille (relief du hero, sélecteur « Je suis… », palette plus dynamique, typographie), puis « mieux disposer les sections, le navbar mettre des redirections qui font du sens, être cohérent dans la présentation ». Choix de Camille sur maquettes (`scratchpad/maquettes-structure/`) : mini tableau de bord, mini-cartes métiers, bande des sites sur fond sombre, note manuscrite + flèche ; « Clair + plus de bandes sombres » ; « Services en menu déroulant » ; ordre de l'accueil en 11 sections ; « fond 1, couleurs A ». Le 2026-10-22 : « j'ai des artefacts des admin crm que j'ai fait, tu peux les utiliser comme exemple » → page CRM sur mesure, KHI nommé (accord de Camille).

**Ce qui a été fait** (agent principal) :
- **Hero** (`hero.tsx`) : 4 cartes décoratives (Nouvelle demande, Rappeler demain, RDV confirmé, Relance envoyée — `aria-hidden`), « nous appartient. » en dégradé, note manuscrite « appel gratuit de 30 min » avec flèche SVG, métiers en mini-cartes + lien « Autre métier ? », sur-titre en pilule.
- **Navigation** : menu déroulant « Services » (`nav-services.tsx`, 6 services avec icône et description + « Voir par où commencer ») — clic, survol, clavier ; Échap rend le focus au bouton ; un survol suivi d'un clic ne referme plus le menu. Menu mobile : sous-liste « Services » repliable. Liens : Métiers, Réalisations, Prix (`/devis`), À propos, Contact. Pied de page : colonne Services tirée de la même liste (`SERVICES_NAV`), « Prix : combien ça coûte ? ».
- **Accueil** (`page.tsx`) : Hero, Pour vous, Avant/après (bande sombre), Services, Métiers, Démarrer, Processus, **Pourquoi nous** (nouvelle `pourquoi-section.tsx` : les 4 engagements + 5 des 7 lignes du comparatif + carte « Un appel de 30 minutes »), Partenaires, Témoignages, FAQ, appel final (carte sombre). Retirés de l'accueil : Bénéfices, Comparatif, Engagements, Stagiaires (toujours sur `/a-propos`).
- **Couleurs** (`vsw.css`) : palette A (sarcelle intense `oklch(0.51 0.17 218)`, violet vif), fond 1 (blanc + halos cyan et violet, sections blanc / bleu très pâle) ; `.section--nuit` redéfinit les jetons sombres localement. Contraste vérifié (boutons ≥ 4,5:1). Thème sombre `data-theme="dark"` vérifié.
- **Galerie « À quoi ça ressemble »** sur `/crm-sur-mesure` (`outils-galerie.tsx`) : 4 écrans tirés des artefacts « Maquette tableau de bord VieSolution » et « Maquette admin KHI » (Aujourd'hui, Leads ; Accueil, Statistiques), images `public/realisations/outils/*.webp` (66 à 102 Ko), mention « Données fictives », présentés comme des écrans *conçus* pour ces clients (ce sont des maquettes). Accessible par Services → CRM et outils sur mesure (menu, pied de page, carte 06 de l'accueil).

**Vérification technique** : `npm run verify` vert (32/32 tests, 0 erreur, 10 avertissements eslint préexistants, build). Captures 1440 px et 390 px : aucun débordement, aucune erreur de page ; les 10 liens du menu répondent 200. Le vide de la colonne « Avant » vu sur une capture pleine page était un artefact de l'outil de capture (animations relancées), pas un défaut : colonne complète dans le navigateur et en mouvement réduit. `qa-agent` (Opus, ≈ 94 k) **OK**, rien de bloquant ; corrigé ensuite : lien mort « Retour au site » de `/postuler-stagiaire` (`/#stagiaires` → `/a-propos#stagiaires`), contraste de la colonne « Ailleurs » (`--fg-3` → `--fg-2`), libellés du menu Services en `--fg-0`, « maquettes d'écrans » dans la galerie, minuteur du menu nettoyé au démontage, panneau du menu en une colonne sous 860 px (il dépassait à droite entre 641 et 830 px). `npm run verify` relancé : vert. Coût réel du lot ≈ 450 k (session ≈ 350 k + QA 94 k).

**Non fait dans ce round** : points mineurs de la QA laissés tels quels (sans effet visible) : sous-liste « Services » du menu mobile non refermée à la fermeture du menu, reflet blanc décoratif des cartes du hero ; les pages de service (`/ia`, `/zoho`, `/sites-web`, `/crm-sur-mesure`, `/referencement`) n'ont pas encore la même structure que l'accueil (promis par la maquette) ; inspiration tooly.ca / inovision.ca (demande du 2026-10-22) : Camille a retenu « un seul bouton partout » — maquette à faire, prochain lot.

## 22. ✅ Un seul bouton partout + barre fixe sur téléphone (2026-10-22)

**Contexte / demande** : inspiration tooly.ca et inovision.ca demandée par Camille (« le meilleur des deux dans l'organisation de mes services pour ne pas perdre mes leads, ressort le côté positif »). Analyse présentée ; Camille a retenu « un seul bouton partout » ; maquette `scratchpad/maquettes-structure/6-un-seul-bouton.png` ; accord : « oui applique le bouton s'il y a une plus-value ».

**Ce qui a été fait** (agent principal) :
- `src/components/vsw/appel.ts` : les deux textes écrits une seule fois — `APPEL` « Réserver mon appel gratuit » → `/rdv` (« Appel gratuit » dans la barre du haut, faute de place) et `ECRIT` « Décrire ma situation par écrit » → `/devis#situation`. Avant : 12 libellés différents menaient à `/rdv`.
- Appliqués : barre du haut, menu mobile, hero, pied de page, Pour vous, Services (les deux boutons), Métiers, Démarrer, Pourquoi nous, Engagements, sections IA et Zoho, carte d'appel final (second bouton : « Décrire ma situation par écrit » au lieu de « Nous écrire » ; Contact reste dans la barre et le pied), formulaire de situation, niveaux d'accompagnement de `/devis` (« Commencer »), pages `/ia`, `/zoho`, `/sites-web`, `/devis`, `/crm-sur-mesure`, `/referencement`, sur-titre et titre de `/rdv`, puces du clavardage. Note du hero : « 30 min, sans engagement » (le bouton dit déjà « gratuit »).
- `barre-appel.tsx` : barre fixe en bas de l'écran, téléphone seulement (≤ 640 px) ; apparaît après 480 px de défilement, se cache au pied de page et quand le menu mobile est ouvert, absente de `/rdv` et `/admin`, `inert` quand cachée ; le bouton de clavardage remonte au-dessus.
- Liens d'information (« Par où commencer ? », « En savoir plus », « Voir le référencement ») et la puce « Je préfère en parler » du clavardage (réponse du visiteur, pas un bouton) : inchangés.

**Vérification technique** : `npm run verify` vert (32/32 tests, 0 erreur, 10 avertissements préexistants, build). Barre testée à 390 px (cachée en haut, visible au milieu, cachée au pied et sur `/rdv`, cachée menu ouvert, clavardage à 112 px) ; invisible à 1440 px. `/devis` à 1440, 1024, 390 px : boutons sur une ligne, aucun débordement. `qa-agent` (Opus, ≈ 65 k) **OK** ; corrigé ensuite : bouton « Commencer » des niveaux de `/devis`. Coût réel ≈ 170 k (session ≈ 105 k + QA 65 k).

**Non fait dans ce round** : focus clavier perdu si la barre se cache pendant que son bouton a le focus (cas rare, QA mineur) ; autres idées tooly/inovision non retenues (« Être rappelé » en 20 s, ton positif partout, menu Ressources). Les carrés « Vous vous reconnaissez ? » (« trop simple », Camille) : 3 maquettes proposées (`7-carres-option-A/B/C.png`), en attente de son choix.

## 23. ✅ Cartes « C'est pour vous si… » : ce qui change + cases à cocher (2026-10-22)

**Contexte / demande** : Camille, sur la section « Vous vous reconnaissez ? » : « trop simple ces carrés ». Trois maquettes (`scratchpad/maquettes-structure/7-carres-option-A/B/C.png`) ; réponse : « un mélange » — mélange suggéré dans la proposition : cartes de A + jauge de B.

**Ce qui a été fait** (agent principal) : `pour-vous-section.tsx` réécrit (composant client) — chaque carte : icône, ce qui gruge (gris), « → ce qui change » (gras), case à cocher (`button aria-pressed`). Bande sombre en dessous : « N sur 6 vous ressemblent », jauge, phrase qui change (0, 1, plusieurs, toutes), bouton `APPEL`. Titre : « Vous vous reconnaissez ? / Voici ce qui change. » (dégradé). Rien n'est envoyé ni enregistré. Les textes « → » reprennent `avant-apres-section.tsx` et `demarrer-section.tsx` (rien de nouveau promis). Styles `.pv-*` en fin de `vsw.css` (3 → 2 → 1 colonnes) ; anciens styles `.pv-card`, `.pv-check`, `.pv-situation` retirés.

**Vérification technique** : `npm run verify` vert. Captures 1440 px et 390 px, 3 cartes cochées : phrase et jauge correctes, aucun débordement, aucune erreur de page. `qa-agent` (Opus, ≈ 56 k) **OK** ; corrigé ensuite : `aria-atomic` sur la phrase annoncée, « Les six ? » → « Toutes ? », phrase « C'est plus courant qu'on le pense » retirée (affirmation absente du reste du site). Coût réel ≈ 120 k (session ≈ 65 k + QA 56 k).

**Non fait dans ce round** : sur téléphone, le bouton de la bande et la barre fixe peuvent être visibles en même temps (choix assumé) ; le soulèvement des cartes au survol devient instantané (pas supprimé) en mouvement réduit.

## 24. ✅ Ton positif partout (2026-10-22)

**Contexte / demande** : Camille, « fais le ton positif partout maintenant » (idée tirée de tooly.ca, §22). Règle suivie : retourner les phrases vers ce qui va mieux, sans fait ni promesse nouvelle ; les difficultés que le visiteur doit reconnaître restent, suivies de ce qui change ; les questions de la FAQ restent les vraies inquiétudes, seules les réponses changent.

**Ce qui a été fait** (agent principal), avant → après :
- Hero : « Pas besoin d'être techno. » → « On s'occupe de la technique. » (déjà dit dans la FAQ).
- Services 01 : « Fini les tâches répétitives qui grugent vos journées. » → « Vos journées, libérées des tâches répétitives. » ; carte CRM et `/crm-sur-mesure` : « Votre façon de travailler vous est propre. Si aucun logiciel tout fait ne lui convient… » ; intro : « On part de ce que vous avez. »
- Démarrer : « Pas besoin de tout changer. » → « Un premier pas suffit. » ; « Vous n'avez pas à tout comprendre… » → « On avance une étape à la fois. »
- Métiers : « On ne vous vend pas de l'IA… ne sont que les moyens » → « On part de votre métier… sont nos outils pour y arriver » ; « Ce qu'on améliore » visible sous « Ce qui vous gruge » (avant : caché dans « Voir plus ») ; « Votre métier n'est pas dans la liste ? » → « Un autre métier ? » ; agent immobilier : « personne n'est oublié » → « chaque acheteur ou vendeur est suivi jusqu'au bout ».
- Pourquoi nous : tableau « Ailleurs » barré → liste « Avec nous » à coches (5 mêmes lignes).
- FAQ (réponses) : « Non. » → « C'est toujours à vous qu'ils parlent. », « C'est aussi pour vous. », « On part de ce que vous avez. » ; « Pas nécessairement. » → « Ça peut rester simple : … » ; « Aucune obligation d'aller plus loin. » → « vous décidez librement de la suite. » ; « On ne disparaît pas. » → « On continue avec vous. » ; « sans oubli » → « avec chaque suivi en place ».
- Prix étape 01 : « Aucune obligation. » → « Vous restez libre de la suite. » ; Zoho Desk : « sans qu'aucune ne se perde » → « chacune suivie jusqu'à sa réponse » ; Avant/après : « Rien d'oublié » → « Tout est suivi » ; menu Services : « Vous ne savez pas par où commencer ? » → « Un premier pas, à votre rythme ».

**Vérification technique** : `npm run verify` vert. Captures 1440 px et 390 px (Pourquoi nous, Métiers) : aucun débordement, aucune erreur. `qa-agent` (Opus, ≈ 62 k) **OK** ; corrigé ensuite : sens exact rétabli pour la phrase « logiciel tout fait » (la première version élargissait le cas), titre « Avec nous » (lecture fluide des lignes), réponse « coûter une fortune » qui répond de nouveau à la question, deux répétitions. Coût réel ≈ 160 k (session ≈ 100 k + QA 62 k).

**Non fait dans ce round** (gardé exprès) : « sans engagement », « sans frais cachés », « sans jargon » (réassurances attendues) ; « quand rien n'existe, on le bâtit » (positionnement validé, §12) ; les « pour X, pas pour Y » des métiers (temps retrouvé, dans « Voir plus ») ; l'étape 03 du prix (« jamais après » : engagement qui attend la validation de Camille) ; pages de l'ancien design redirigées.

*Correctif du 2026-10-22 (après §24)* : grand vide sous l'en-tête des pages intérieures, signalé par Camille sur `/ia` (« pourquoi trop d'espace ») — 64 px sous l'en-tête + jusqu'à 112 px au-dessus de la section suivante. Règle `.page-header + .section` (hors bandes et fonds sombres) dans `vsw.css` : écart mesuré à 72 px sur les 10 pages (`/ia`, `/zoho`, `/devis`, `/crm-sur-mesure`, `/sites-web`, `/referencement`, `/realisations`, `/a-propos`, `/contact`, `/rdv`). `npm run verify` vert. Un seul fichier de style : pas de `qa-agent` (règle `agent-workflow.md`).

*Correctif du 2026-10-22 (après §24, suite)* : Camille, « oui fais la page IA aussi, un petit [souci] sur l'accordéon ». (1) `/ia` : « — même si vous n'êtes pas techno. » → « On s'occupe de la technique. » (phrase du hero). (2) Métiers : une carte ouverte étirait ses voisines (grand vide) ; règle `.metiers-grid:has(.metier-plus[open]) { align-items: start; }`. Mesuré à 1440 et 900 px : fermées 427/427/427 → première ouverte 709/403/403 → refermée 427/427/427. Compromis noté par la QA : tant qu'une carte est ouverte, les cartes repliées des autres rangées perdent aussi leur hauteur commune (impossible de viser une seule rangée en CSS) ; petit saut à l'ouverture et à la fermeture. Navigateurs sans `:has` : comportement d'avant. `npm run verify` vert ; `qa-agent` (Opus, ≈ 47 k) **OK**. **À voir par Camille** sur la version d'essai.

*Correctif du 2026-10-22 (après §24, espacement)* : Camille, « tous les onglets ont beaucoup d'espace entre les sections » (capture `/devis`). Cause : deux sections au même fond blanc additionnaient leurs marges (jusqu'à 224 px). `vsw.css` : la seconde ne rajoute plus sa marge du haut (`.section + .section`, hors bandes et fonds sombres), et `--section-y` passe de `clamp(72px, 9vw, 112px)` à `clamp(56px, 7vw, 88px)`. Mesuré à 1440 px sur 11 pages : même fond 224 → 88 px ; changement de fond 224 → 176 px (88 de chaque côté) ; sous l'en-tête des pages intérieures 72 px. `npm run verify` vert. Un seul fichier de style : pas de `qa-agent`.

*Correctif du 2026-10-22 (pied de page)* : Camille, « le footer n'est pas premium, on voit toujours le logo avec Québec Canada, bref enlever ». `footer.tsx` : « Québec · Canada » retiré sous le logo et dans la colonne Contact (c'était aussi un `<a>` sans lien). Reste sur la page `/contact` (`contact.tsx:78`, carte « Où ») : question posée à Camille. `npm run verify` vert ; un seul fichier, pas de `qa-agent`.

## 25. ✅ Pied de page premium (option A) (2026-10-22)

**Contexte / demande** : Camille, « le footer n'est pas premium ». Deux maquettes (`scratchpad/maquettes-structure/8-pied-de-page-A/B.png`) ; choix : « option A ; Vie Solution Web ne doit pas trop toucher la fin de la page et penser aussi mobile ; enlever // FAIT AU QUÉBEC ; mettre les logos WhatsApp et Facebook ».

**Ce qui a été fait** (agent principal) : `footer.tsx` réécrit — fond nuit (jetons `.section--nuit`, halos cyan et violet), slogan « Une vie qui nous appartient. » en dégradé, phrase de présentation, bouton `APPEL`, colonnes Services / Entreprise / Nous joindre, mentions légales et des marques, grand « Vie Solution Web » en filigrane (`aria-hidden`, une ligne à toutes les largeurs, 24 à 40 px d'air sous lui). Retirés : « // FAIT AU QUÉBEC AVEC RIGUEUR », le lien « Réserver mon appel gratuit » de la colonne Entreprise (le bouton est au-dessus). Téléphone : Entreprise et Nous joindre côte à côte ; une seule colonne sous 400 px (le courriel ne se coupe pas). Icônes WhatsApp et Facebook (logos Simple Icons, CC0) tirées de `RESEAUX` dans `src/lib/site.ts` : **liens vides, `[à confirmer]` par Camille** — une icône n'apparaît que lorsque son lien est rempli (jamais de lien inventé).

**Vérification technique** : `npm run verify` vert. Mesuré à 320, 360, 390, 820 et 1440 px (avec des liens d'exemple pour l'affichage des icônes, retirés ensuite) : aucun débordement, grand nom entier, courriel dans sa colonne. `qa-agent` (Opus, ≈ 61 k) **OK** (contrastes : `--fg-1` 12,7:1, `--fg-2` 7,8:1, mention des marques 4,5:1, bouton 12:1) ; corrigé ensuite : grand nom et courriel à 320 px. Coût réel ≈ 150 k (session ≈ 90 k + QA 61 k).

**Non fait dans ce round** : liens WhatsApp et Facebook à donner par Camille (icônes cachées d'ici là) ; courriel et téléphone toujours des exemples `[à confirmer]` ; « Québec · Canada » reste sur la page `/contact` (question posée).

## 26. ✅ Nouveau service « Accueil IA : clavardage, rendez-vous et voix » + retrait de la mention des marques (2026-10-22)

**Contexte / demande** : Camille, « on supprime [la mention des marques] et rajoute les logos Facebook WhatsApp ; je veux aussi un chatbot, on offre aussi ce service, j'avais oublié ; on facilite la prise de rdv, prise de rendez-vous avec IA ; la voix c'est aussi un bon service ». Réponses : chatbot « les deux » (service offert + vraie IA sur le site), « une seule page », agent vocal : répond au téléphone, prend les rendez-vous, prend les messages, rappels et confirmations ; liens WhatsApp/Facebook « plus tard ».

**Ce qui a été fait** (agent principal) :
- Page `/accueil-ia` (gabarit `ServiceDetailSection`) : « Bien accueillir chaque client. », trois volets (clavardage sur le site, prise de rendez-vous par IA, agent vocal au téléphone), bandeau « Vous gardez le dernier mot : l'assistant ne donne ni conseil ni réponse personnalisée ; il vous les transmet. », bouton `APPEL`. Aucun outil, prix ni délai nommé.
- **Raccordement** (skill `nouvelle-page`) : carte 03 de l'accueil (suivantes renumérotées 04-08, « Huit façons »), menu Services (barre et mobile) et pied de page via `SERVICES_NAV`, plan du site (`PUBLIC_ROUTES`), `llms.txt`, `knowsAbout` et description de l'organisation (`layout.tsx`), redirection `/services/chatbots-ia` → `/accueil-ia`. Atteinte en cliquant depuis l'accueil vérifiée.
- FAQ « Mes clients vont-ils parler à un robot ? » adaptée (elle contredisait le nouveau service) : « Seulement si vous le voulez, et seulement pour l'accueil… Pour tout le reste, c'est à vous qu'ils parlent… ».
- Pied de page : mention « Zoho, Claude, ChatGPT et Copilot sont des marques… » retirée (ajoutée par Claude au §10, pas exigée) ; styles `.footer-marques` retirés. La phrase de non-affiliation reste dans `public/llms.txt` (lu par les IA, pas affiché).

**Vérification technique** : `npm run verify` vert. Captures 1440 et 390 px, aucun débordement ; `h1` unique ; page présente au plan du site. `qa-agent` (Opus, ≈ 65 k) **OK** ; corrigé ensuite (promesses que Camille n'avait pas faites) : « Toujours là pour vos clients » → « Bien accueillir chaque client », « même en dehors de vos heures », « Réponses en français » et « sans échange de courriels » retirés, agent vocal limité à ce qu'elle a coché, bandeau reformulé, icône téléphone. Coût réel ≈ 190 k (session ≈ 125 k + QA 65 k).

**Non fait dans ce round** : la bulle de clavardage du site reste scriptée — la rendre « vraie IA » (réponses + prise de rendez-vous) est un lot à part, plan à faire valider par Camille (clé API, coût par message, données des visiteurs). Liens WhatsApp et Facebook toujours attendus.

*Correctif du 2026-10-22 (slogan du pied de page)* : Camille : une phrase liée aux services, qui commence toujours par « Une vie », avec l'appartenance, et qui mène à la satisfaction de ses clients parce que le service est plus rapide ; puis « UNE VIE QUI VOUS APPARTIENT ». Slogan du pied de page : « Une vie qui vous appartient, des clients mieux servis, plus vite. » (`footer.tsx`, coupure des lignes équilibrée dans `vsw.css`). « Clients mieux servis : des réponses plus rapides » existait déjà (avant/après). `npm run verify` vert ; `qa-agent` (Opus, ≈ 40 k) **OK**. **Question à Camille** : « Une vie qui nous appartient » reste ailleurs (fiche JSON-LD et description dans `layout.tsx`, `llms.txt`, page et section Zoho, `CLAUDE.md`) — passer partout à « vous » ?

*Correctif du 2026-10-22 (slogan partout)* : Camille, « même dans l'entête, le hero, même slogan ». Hero : h1 « Une vie qui *vous appartient,* des clients mieux servis, plus vite. » (seconde moitié plus petite, `.hero-h1-suite`), introduction « Et du temps retrouvé pour votre vrai métier… » (évite la répétition). « nous » → « vous » aussi dans la fiche JSON-LD et la description (`layout.tsx`), `llms.txt`, la page et la section Zoho, `CLAUDE.md`. Plus aucun « nous appartient » dans le site actif. `npm run verify` vert ; `qa-agent` (Opus, ≈ 47 k) : un seul défaut (espace manquant entre les deux moitiés du h1 dans le HTML), corrigé et vérifié dans la page construite. Hors périmètre : le nom du dépôt GitHub (UneVieQuiNousAppartient).

*Correctif du 2026-10-22 (hero, stage)* : Camille, « oui applique l'option 1, arranger au niveau de retour, mettre dans l'accueil cette partie pour les stagiaires ». (1) Sous-titre du hero : « Concentrez-vous sur votre vrai métier. IA, Zoho, sites web et CRM sur mesure : on choisit les bons outils, on les installe et on vous forme. On s'occupe de la technique. » (2) `/postuler-stagiaire` : le bouton « Retour au site » collé au sur-titre devient un lien « Retour à l'accueil » seul sur sa ligne, vers `/#stagiaires`. (3) Accueil : nouvelle section « Programme de stage » (`stage-section.tsx`, après Partenaires) — titre, introduction et 3 offres repris tels quels de la page de stage (`OFFRES_STAGE` partagé), bouton « Postuler comme stagiaire ». `npm run verify` vert ; `qa-agent` (Opus, ≈ 49 k) **OK** ; ajouté ensuite : `aria-hidden` sur les deux flèches.

## 27. ✅ Bulle de clavardage en vraie IA, qui répond à partir du site seulement (2026-10-22)

**Contexte / demande** : Camille : « oui lance le chatbot IA et bloque les questions malicieuses, on répond du site seulement ». Elle a approuvé le plan présenté au § 26 : réponses tirées du site seulement, jamais de prix ni de conseil, demande de rendez-vous relue par le visiteur, avis « vous parlez à une IA », conversation non conservée, quotas, repli sur l'ancienne bulle, clé saisie par Camille dans Vercel.

**Ce qui a été fait**
- **Route serveur `src/app/api/chat/route.ts`**, avec le SDK officiel `@anthropic-ai/sdk` 0.135.0, épinglé ; c'est une nouvelle dépendance, `npm audit` ne signale aucune faille.
  - Modèle `claude-opus-5-5`, effort `low`, `max_tokens` 800, consigne mise en cache.
  - `GET` indique si l'IA est branchée (clé `ANTHROPIC_API_KEY` et base). Sans clé, la bulle garde ses réponses toutes faites.
  - Pas de modèle de repli en cas de refus : un refus donne une réponse fixe.
- **Consigne `src/lib/chat/connaissances.ts`**, construite à partir des mêmes constantes que les pages : services, métiers, démarche de prix, engagements, FAQ, stage, pages. `FAQS` et `SERVICES` sont désormais exportés.
  - Elle refuse : montants, conseils professionnels, hors sujet, révélation ou changement de consigne.
  - Elle ne donne jamais de courriel ni de téléphone, puisque ce sont des valeurs de démonstration.
- **Trois barrières, dans `src/lib/chat/regles.ts`** (fonctions pures, `tests/chat-regles.test.mjs`, 13 tests vérifiés en cassant la règle une fois) :
  - Avant l'appel :
    - forme et taille de l'historique : 12 questions de 600 caractères au plus, réponses de 1 200 caractères au plus, caractères invisibles retirés ;
    - détournements évidents, cherchés dans tout l'historique : réponse fixe, sans appel payant ;
    - quotas `vsw_rate_limit_hit` : 30 par heure et 80 par jour par adresse IP (IPv6 regroupées par réseau /64, une empreinte seulement est gardée, effacée après 24 h par `tick.ts`), 400 par jour pour tout le site.
  - Pendant l'appel : la consigne.
  - Après l'appel : toute réponse qui contient un montant est remplacée par la phrase « prix sur mesure ».
- **Rendez-vous** : l'outil `proposer_rendez_vous` (`strict`) ne fait qu'afficher un résumé. Le visiteur le relit, puis clique « Envoyer ma demande » ou « Corriger ».
  - L'envoi fait la même insertion que le formulaire de rendez-vous : `contact_requests`, `sujet` `rdv-decouverte`, `source` `chatbot-ia`. Il crée la fiche, la tâche « Confirmer l'appel découverte » et les relances.
  - Un nouveau résumé désactive les anciens.
- **Bulle `chatbot.tsx`** :
  - avis « Vous parlez à une IA… Nous ne conservons pas la conversation… », avec un lien vers la politique de confidentialité ;
  - le statut affiche « Assistant IA » seulement si l'IA est branchée ;
  - repli sur les réponses toutes faites dès un échec ;
  - limite de conversation, avec le bouton d'appel en fin de conversation ;
  - accessibilité : focus dans le champ sur ordinateur, Échap ferme la bulle, `aria-live`, `role="status"`.
- **Politique de confidentialité** : nouveau paragraphe « Assistant IA de la bulle de clavardage » sur la transmission des messages à Anthropic (États-Unis), qui les traite selon ses propres conditions.
- `CLAUDE.md` : `ANTHROPIC_API_KEY` ajoutée aux variables attendues. Issue créée pour un risque qui existait déjà : https://github.com/UneVieQuiNousAppartient/VieSolution---WEB/issues/5 (insertion anonyme sans contrôle, relances J2/J5 possibles vers le courriel d'un tiers).

**Coût par message, estimation à vérifier dans la console Anthropic après quelques jours.** Base de calcul : consigne d'environ 6 500 jetons, tarifs Opus 5.5 de 4 $ US par million de jetons en entrée, 20 $ US en sortie, 0,20 $ US en lecture du cache.
- **Opus 5.5** : environ 1 ¢ US par message, et jusqu'à 4 ¢ US quand le cache est à refaire (premier message après 5 minutes sans visite). Pour 1 000 messages par mois, de 10 $ à 30 $ US. Au pire, avec le plafond de 400 messages par jour, de 4 $ à 16 $ US par jour.
- **Haiku 5.5** (0,10 $ / 0,50 $ US par million de jetons) : environ 40 fois moins cher, sous 0,1 ¢ US par message. Il est moins solide face aux tentatives de détournement.
- Le choix se fait dans la constante `MODELE` de `route.ts`, une seule ligne à changer.

**Vérification technique**
- `npm run verify` vert : 45 tests, 0 erreur, les 10 avertissements déjà connus.
- Essai de bout en bout avec une fausse API Claude et une fausse base locales, sans vraie clé, sur ordinateur et téléphone (375 px) :
  - détournement bloqué sans appel ;
  - montant remplacé ;
  - refus géré ;
  - résumé affiché puis envoyé, avec la bonne ligne `contact_requests` ;
  - repli quand les services sont injoignables.
- `securite` (Opus, ≈ 73 k) **VERT**, aucun point bloquant.
  - Corrigé : `max_tokens` réduit, détournement cherché dans tout l'historique, IPv6 regroupées par /64, formulation « Nous ne conservons pas ».
  - Non corrigé : réponses de l'assistant non signées (risque mineur : seul l'auteur voit le résultat).
- `qa-agent` (Opus, ≈ 78 k) **VERT**.
  - Corrigé : cinq faux positifs du filtre (ajoutés aux tests), adresse IP remplacée par une empreinte, boutons désactivés pendant l'attente, anciens résumés désactivés, accessibilité.
  - Son constat « compteurs jamais purgés » est faux : `src/lib/crm/tick.ts:30` les efface après 24 h.

**Non fait dans ce round**
- **À faire par Camille** :
  - créer la clé Claude, la saisir dans Vercel (`ANTHROPIC_API_KEY`) et fixer une **limite de dépenses mensuelle** dans la console Anthropic (c'est le seul plafond en dollars) ;
  - choisir Opus ou Haiku.
- **À valider par Camille (Loi 25)** : l'évaluation et l'entente exigées pour un transfert de renseignements hors Québec (Anthropic) ; la durée de conservation d'Anthropic à indiquer dans la politique ; la date « Janvier 2025 » et le courriel `contact@viesolution.com` de la politique, qui existaient déjà et ne sont pas corrigés.
- **À tester par Camille**, une fois la clé saisie : quelques vraies questions, et quelques tentatives de détournement, sur la version d'essai.
- Non fait : signature des réponses de l'assistant ; `.env.local.example` non modifié (fichier protégé).
- Coût réel du round : ≈ 400 k jetons (session principale ≈ 250 k, plus 151 k pour les deux agents).

## 28. ✅ Clavardage IA : passage au modèle Haiku 5.5 (2026-10-22)

**Contexte / demande** : Camille, après l'estimation du § 27 : « Haiku, c'est moins cher ».

**Ce qui a été fait** : `src/app/api/chat/route.ts`, constante `MODELE` → `claude-haiku-5-5`, `thinking: { type: 'disabled' }` (permis sur Haiku jusqu'à l'effort `high`), `max_tokens` 800 → 500. Coût estimé : moins de 0,1 ¢ US par message (0,10 $ / 0,50 $ US par million de jetons, consigne d'environ 6 500 jetons), moins de 1 $ US pour 1 000 messages par mois. Haiku n'a pas de modèle de repli côté serveur : un refus donne la réponse fixe, comme avant. Les trois barrières du § 27 (filtre avant l'appel, consigne, filtre des montants après) ne changent pas.

**Vérification technique** : `npm run verify` vert ; `qa-agent` (Opus). Le 2026-10-22, le projet Vercel `vie-solution-web` n'a encore **aucune** variable d'environnement : la clé n'est pas saisie.

**Non fait dans ce round**
- Je n'ai pas accès au compte Anthropic de Camille : aucun outil de cette session ne s'y connecte. La clé reste à créer et à saisir par Camille dans Vercel, sans passer par la conversation.
- **À tester par Camille** : Haiku résiste moins bien que Opus aux tentatives de détournement. Essayer quelques questions hors sujet une fois la clé saisie ; si besoin, revenir à Opus en une ligne.

## 29. ✅ Base du suivi des demandes installée dans Supabase (2026-10-22)

**Contexte / demande** : Camille : « oui exécute le SQL » (`supabase/setup-crm-vsw.sql`, nécessaire au clavardage IA pour ses quotas et au suivi des demandes).

**Ce qui a été fait**
- Avant d'exécuter :
  - fichier relu en entier : il ne crée ou ne modifie que des objets `vsw_`, plus quatre déclencheurs `trg_vsw_intake` posés sur les tables de formulaires du site (`contact_requests`, `chatbot_leads`, `estimateur_requests`, `audit_requests`) ;
  - vérifié dans la base : aucune table `vsw_` existante ; toutes les colonnes lues par `fn_vsw_lead_intake` existent ; aucun déclencheur déjà présent sur ces quatre tables ; aucune table de CSF touchée.
- Exécuté en quatre migrations :
  - `vsw_setup_crm_1_tables` : 21 tables, index, RLS, 4 politiques ;
  - `vsw_setup_crm_2_fonctions` : 8 fonctions et leurs droits ;
  - `vsw_setup_crm_3_declencheurs` : les 4 déclencheurs ;
  - `vsw_setup_crm_4_donnees` : 3 gabarits de courriel, 3 réglages dont l'adresse postale, 5 plages de disponibilité.
- Le premier essai, en un seul bloc, a dépassé le délai sans rien appliquer : voir `docs/ERREURS-CONNUES.md` E04.
- `setup-crm-vsw.sql` aligné sur ce qui a été exécuté : `CREATE OR REPLACE TRIGGER` remplace `DROP` + `CREATE`, et les politiques (bloc `IF NOT EXISTS`) comme les disponibilités ne se répètent plus : le fichier peut être rejoué (bloc des politiques exécuté une fois de plus dans la base : sans effet, 4 politiques ; le reste vérifié par relecture). E03 a été complété (reproduit sur un `.next` neuf).

**Vérification technique**
- Comptes dans la base : 21 tables `vsw_` (RLS active sur les 21), 8 fonctions, 4 déclencheurs, 4 politiques, 3 gabarits, 3 réglages, 5 plages.
- La clé anon ne peut pas appeler `vsw_rate_limit_hit`.
- Essai dans une transaction annulée : une demande `rdv-decouverte` envoyée par `chatbot-ia` crée un dossier à l'étape « RDV » (source « site web — rdv »), avec la tâche « Confirmer l'appel découverte demandé par … » ; le compteur renvoie 1, puis 2. Après l'annulation, 0 dossier, 0 tâche, 0 compteur et 0 ligne d'essai.
- `npm run verify` vert (45 tests).
- `qa-agent` (Opus, ≈ 55 k) **VERT**. Corrigé ensuite : politiques gardées pour qu'on puisse rejouer le fichier, cause de E04 écrite comme « probable ».

**Non fait dans ce round**
- Variables Supabase à saisir par Camille dans Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) ; case « Preview » de `ANTHROPIC_API_KEY`.
- Le passage horaire (`/api/cron/tick`) ne tourne que sur la production, avec `CRON_SECRET`. Les relances J2/J5 partiront seulement avec Resend configuré (`RESEND_API_KEY`, `EMAIL_FROM`) : à décider avec l'issue #5 avant de les activer en ligne.
- Activation de la double vérification de `/admin` dès la mise en ligne (`ADMIN_ACCESS_CODE`, `ADMIN_SECRET`).

## 30. ✅ Accusé de réception au prospect et alerte de nouvelle demande (2026-10-22)

**Contexte / demande** : Camille a demandé si les gens reçoivent une confirmation après un formulaire : seulement un message à l'écran. Elle a répondu « oui ajoute les deux, le texte est bon » à deux propositions : l'accusé de réception (texte proposé dans la conversation) et une alerte pour elle à chaque nouvelle demande.

**Ce qui a été fait**
- Deux nouvelles règles dans `src/lib/crm/moteur.ts`. Elles paraissent d'elles-mêmes dans l'onglet « Relances » de `/admin`, avec marche/arrêt.
- **`accuse_reception`** (écrit au prospect) :
  - envoie le gabarit `accuse_reception` (« Nous avons bien reçu votre demande »), au passage horaire qui suit une demande du site ;
  - mêmes protections que les relances J2/J5 : pied LCAP, désabonnement, rien tant que l'envoi n'est pas prêt ;
  - pas aux candidatures de stage (`candidature-stage`), **pas aux demandes de rendez-vous** (`rdv-decouverte` : le texte invite à « choisir le moment de notre appel », ce que la personne vient de faire), pas si un contact humain a déjà été noté, et plus envoyé après 24 h ;
  - ne note pas `relance_sent_at`.
- **`nouvelle_demande`** :
  - courriel à l'adresse d'alerte (`vsw_settings.notify_email`) pour chaque demande du site, stages compris : nom, coordonnées, entreprise, formulaire, demande, lien vers `/admin` ;
  - rien n'est réservé tant que l'adresse ou Resend manquent.
- Fonctions pures dans `src/lib/crm/regles.ts` : `estDemandeDuSite`, `estDemandeProspect`, `recoitAccuseReception`, `alerteNouvelleDemande`, plus six tests dans `tests/crm-regles.test.mjs`. Le test du filtre des stages a été vérifié en cassant la règle une fois (19 réussis, 1 échec).
- **Après la revue de sécurité** (ROUGE) :
  - `prenomDe` ne garde plus qu'un prénom fait de lettres, d'apostrophes et de traits d'union. Sinon, le courriel commence par « Bonjour, ». Un « nom » comme `https://faux-site…` devenait un lien cliquable en tête des courriels, relances J2/J5 comprises.
  - Plafond par passage : au-delà de 20 accusés ou de 10 alertes en attente, la règle est suspendue et l'équipe est notifiée.
  - L'objet de l'alerte est nettoyé et limité à 80 caractères, et ses liens ne sont pas cliquables.
- Gabarit ajouté à `supabase/setup-crm-vsw.sql` et inséré dans la base le 2026-10-22. Vérifié par une requête : 4 gabarits, dont `accuse_reception`.

**Délai réel** : au **passage horaire** (`vercel.json`, à :20 chaque heure), donc **dans l'heure**, pas dans la minute comme je l'avais écrit à Camille. Un envoi à la minute demanderait de faire passer les formulaires par une route serveur, ce qui serait un autre chantier.

**Vérification technique**
- `npm run verify` vert.
- `qa-agent` (Opus, ≈ 76 k) **VERT**. Sa question sur les demandes de rendez-vous a conduit à les exclure, et `CLAUDE.md` est mis à jour.
- `securite` (Opus, ≈ 63 k) **ROUGE** sur le prénom et le volume, corrigé ci-dessus. La revue n'a pas été relancée après la correction (une révision au plus, `budget-jetons.md`).
- **À tester par Camille** : le premier envoi réel en production (accusé et alerte).

**Non fait dans ce round**
- **Adresse d'alerte à donner par Camille** : `notify_email` est vide.
- Les courriels ne partiront qu'en production, avec Resend (`RESEND_API_KEY`, `EMAIL_FROM` d'un domaine vérifié), `CRON_SECRET`, et un lien de désabonnement (`UNSUBSCRIBE_SECRET` ou `CRON_SECRET`).
- **À décider par Camille** : un accusé pour les demandes de rendez-vous, avec un texte adapté.
- **Constaté, non corrigé** : les relances J2/J5 ne filtrent pas les candidatures de stage. Un ou une stagiaire recevrait donc les relances « appel découverte ». C'est à Camille de décider : même filtre (`estDemandeProspect`) ou non.
- Issue #5 (insertion anonyme) toujours ouverte : l'accusé de réception part à l'adresse saisie dans le formulaire.

## 31. ✅ Relances sans les stages, accusé de réception pour les rendez-vous (2026-10-22)

**Contexte / demande** : Camille : « oui corrige les stages, et ajoute l'accusé pour les rdv ». Ce sont les deux questions du § 30 : l'issue #6 (relances J2/J5 envoyées aux candidatures de stage) et l'accusé de réception des demandes de rendez-vous.

**Ce qui a été fait**
- `new_lead_j2` et `new_lead_j5` (`src/lib/crm/moteur.ts`) écartent les candidatures de stage (`estHorsProspection`, `src/lib/crm/regles.ts`). `new_lead_j7` reste inchangée : la tâche « Appeler » sert aussi à répondre à un candidat.
- `accuse_reception` envoie désormais aussi aux demandes de rendez-vous (`estDemandeRdv`, sujet `rdv-decouverte`, venues de `/rdv` ou du clavardage IA), avec le gabarit `accuse_rdv` :
  - objet : « Votre demande d'appel est bien arrivée » ;
  - texte : « Bonjour {{prenom}}, Merci, votre demande d'appel est bien arrivée. Je vous confirme l'heure par courriel sous 24 h ouvrables. Au plaisir, Camille, Vie Solution Web ».
  La phrase centrale est celle que Camille a acceptée. L'objet, la salutation et la signature reprennent ceux de l'accusé approuvé.
- `recoitAccuseReception` est retiré, et son test est remplacé.
- Gabarit ajouté à `supabase/setup-crm-vsw.sql` et à la base le 2026-10-22. Une requête le confirme : 5 gabarits, dont `accuse_rdv`. Le commentaire « ni relance commerciale » relevé au § 30 est désormais exact.
- `CLAUDE.md` est à jour. Le correctif du test signalé par CodeQL (commit 5d28ce3 : échappement vérifié quelle que soit la casse) est consigné ici.

**Vérification technique**
- `npm run verify` : code 0, 51 tests.
- `qa-agent` (Opus, ≈ 30 k) **VERT**. Après sa revue, la description de la règle et `CLAUDE.md` disent « acceptés » au lieu d'« approuvés ».
- Le filtre des stages dans J2/J5 n'a pas de test direct ; la fonction pure qu'il utilise est testée.

**Non fait dans ce round**
- L'adresse d'alerte (`notify_email`) est toujours à donner par Camille.
- **À tester par Camille** : le premier envoi réel, en production avec Resend.

## 32. ✅ Courriel du site : info@viesolutionweb.ca ; durée de formation retirée (2026-10-22)

**Contexte / demande** : Camille, « finissons d'abord et prenons une décision ». Réponses à quatre questions : « info@ partout » ; « je donne mon numéro » (le numéro n'est pas encore donné) ; « retirer la durée » ; mise en ligne « variables puis fusion ».

**Ce qui a été fait**
- **info@viesolutionweb.ca** remplace les exemples :
  - `bonjour@` : page Contact (`contact.tsx`), pied de page (texte et `mailto:`), réponse toute faite du chatbot (`chatbot.tsx`) ;
  - `stages@` : page `/postuler-stagiaire` ;
  - l'adresse d'un autre domaine `contact@viesolution.com` : politique de confidentialité (2 fois) et conditions d'utilisation.
- La consigne du clavardage IA (`connaissances.ts`) permet maintenant de donner cette seule adresse, et jamais de téléphone.
- Carte « Formation » de « Démarrer simplement » (`demarrer-section.tsx`) : « Durée : [à confirmer] » retiré, sans durée inventée.
- `CLAUDE.md` : la liste « [à confirmer] » est mise à jour, ainsi que la règle de contenu de 4 agents (`.claude/agents/`) qui donnait encore `bonjour@`/`stages@` comme exemples.

**Vérification technique** : `npm run verify` vert (51 tests) ; `qa-agent` (Opus, ≈ 45 k) **VERT** ; ses remarques sur `ETAT-ACTUEL.md` et les fichiers d’agents ont été corrigées.

**Non fait dans ce round**
- ~~Le téléphone `(418) 555-0143` reste un exemple~~ : remplacé au § 33 par (438) 506-5243.
- **À faire par Camille** :
  - le renvoi de info@ dans Cloudflare (Email Routing) avant la mise en ligne, sinon les messages envoyés à cette adresse sont perdus ;
  - le CNAME `rsend` de Resend ;
  - les variables Vercel.
- La date « Janvier 2025 » de la politique de confidentialité reste à corriger après la relecture Loi 25.

## 33. ✅ Téléphone du site : (438) 506-5243 (2026-10-22)

**Contexte / demande** : Camille a donné son numéro (« 438 506 5243 ») avec le mot « fusionne ».

**Ce qui a été fait**
- `(438) 506-5243` remplace l'exemple `(418) 555-0143` sur la page Contact (`contact.tsx`) et dans le pied de page (`footer.tsx`, lien `tel:+14385065243`).
- La consigne du clavardage IA (`connaissances.ts`) autorise ces deux seules coordonnées : info@ et ce numéro.
- `CLAUDE.md`, la règle de contenu des 4 agents et `docs/ETAT-ACTUEL.md` sont à jour.

**Vérification technique** : `npm run verify` vert (51 tests) ; `qa-agent` (Opus, ≈ 50 k) **VERT** ; ensuite : liens `mailto:` et `tel:` sur la page Contact, commentaire périmé de `layout.tsx` corrigé.

**Non fait dans ce round** : coordonnées dans la fiche JSON-LD (à proposer à Camille). Sinon rien de plus. La suite, c'est la fusion de la PR #1 et la mise en ligne.

## 34. ✅ Mise en ligne : fusion de la PR #1 (2026-10-22)

**Contexte / demande** : Camille a dit « fusionne » après avoir saisi les variables d'environnement dans Vercel.

**Ce qui a été fait**
- PR #1 fusionnée dans la branche de production `claude/nextjs-web-project-RPcId` ; Vercel l'a déployée.
- Contrôle en ligne sur `vie-solution-web.vercel.app` : pages en 200, coordonnées justes, `/api/chat` en GET répond `actif: true`, `/api/cron/tick` refuse sans secret (401).
- Clavardage IA : chaque appel reçoit une erreur 400 de l'API (la bulle se replie sur ses réponses toutes faites). Cause probable : crédits du compte Anthropic. PR #7 ouverte pour journaliser le motif exact (sans le contenu des messages).

**Vérification technique** : contrôle des pages et des journaux Vercel ; PR #7 : CodeQL vert.

**Non fait dans ce round** : cause de l'erreur 400 non prouvée (PR #7 à fusionner, crédits à vérifier par Camille) ; activation de la double vérification de `/admin` (**à faire par Camille**) ; test d'un formulaire de contact en production (**à tester par Camille**).

## 35. ✅ Domaine viesolutionweb.ca branché (2026-10-23)

**Contexte / demande** : Camille a accepté de brancher le domaine, puis a ajouté les lignes DNS dans Cloudflare (« DNS faits »).

**Ce qui a été fait**
- Projet Vercel `vie-solution-web` : `viesolutionweb.ca` et `www.viesolutionweb.ca` ajoutés ; `www` redirige en 308 vers `viesolutionweb.ca`.
- Lignes données à Camille et vérifiées : A `@` → `216.150.1.1` et `216.150.16.1`, CNAME `www` → `6790139f978fdc0b.vercel-dns-016.com`, nuage gris.
- Certificat : rien d'automatique après 10 min ; demandé à Vercel (`cert_P7LMt6nmjhxoE2eZ8DXt6Zjc`, renouvellement automatique), servi aussitôt.

**Vérification technique** : `get_domain_config` : `misconfigured: false` ; en HTTPS, `/`, `/ia`, `/zoho`, `/devis`, `/realisations`, `/a-propos`, `/rdv`, `/contact`, `/postuler-stagiaire`, `/admin` et la politique de confidentialité répondent 200 ; `www` → 308 ; `/api/chat` → `actif: true` ; cron sans secret → 401 ; `og:url` = `https://viesolutionweb.ca`.

**Non fait dans ce round** : CNAME `rsend` (Resend) et renvoi Cloudflare Email Routing de info@ (aucun MX) — **à faire par Camille** ; adresse d'alerte `notify_email` à recevoir de Camille.

## 36. ✅ Clavardage IA actif en production (2026-10-23)

**Contexte / demande** : la bulle répondait par ses réponses toutes faites (erreur 400 de l'API, § 34). Camille a dit « fusionne » pour la PR #7, puis a remplacé la clé (« clé remplacée »).

**Ce qui a été fait**
- PR #7 fusionnée : le journal donne le type et le motif d'un refus de l'API (jamais le contenu des messages).
- Cause prouvée par ce motif : clé Anthropic hors de tout espace de travail (`docs/ERREURS-CONNUES.md` E05). Ce n'était pas un problème de crédits.
- Camille a créé une clé dans un espace de travail et l'a saisie dans Vercel ; production redéployée (`dpl_9cPWwuRMD772ZEVcTAPAwhTmDUVv`).

**Vérification technique** : `POST https://viesolutionweb.ca/api/chat` : « Bonjour, que faites-vous ? » → présentation du studio et question sur le métier ; « Combien coûte une implantation Zoho ? » → aucun montant, renvoi vers l'appel découverte et demande du nom et du courriel.

**Non fait dans ce round** : suppression de l'ancienne clé et plafond de dépenses mensuel dans la console Anthropic — **à faire par Camille** ; essai complet d'une demande de rendez-vous par la bulle — **à tester par Camille** (après le renvoi de info@).

## 37. ✅ Admin : connexion en deux écrans et code QR à l'activation (2026-10-23)

**Contexte / demande** : Camille trouvait la page de connexion trop chargée, et voulait un code QR (« oui aux deux », nouvelle dépendance acceptée). Puis : « même dans la page du QR il y a beaucoup trop d'info ».

**Ce qui a été fait**
- `src/app/api/admin/login/route.ts` : un code d'accès juste sans code à 6 chiffres renvoie `{ otp_requis: true }`, sans session ni échec compté ; cette confirmation est journalisée (`login_code_ok`, revue `securite`).
- `src/app/admin/page.tsx` :
  - écran 1 : le code d'accès seul ;
  - écran 2 : le code à 6 chiffres, avec « Téléphone perdu ? » (code de secours) et « ← Code d'accès » ;
  - message si le champ est vide, et le code d'accès effacé de la mémoire après la connexion ;
  - activation : le code QR s'affiche tout de suite, avec une seule phrase et le champ « Code à 6 chiffres » ; le lien et la clé à taper restent sous « Impossible de scanner ? ».
- Le code QR est dessiné dans le navigateur avec `uqr@0.1.3` (MIT, aucune dépendance, version exacte) : le secret ne part vers aucun service externe. Noir sur blanc dans les deux thèmes, marge de 4 modules.

**Vérification technique** : `npm run verify` vert (51 tests, 10 avertissements connus) ; captures des 4 états avec réponses d'API simulées ; QR décodé par jsQR, identique au lien otpauth. `qa-agent` (Opus, ≈ 48 k) **VERT** ; `securite` (Opus, ≈ 54 k) **VERT**, ses deux points bas sont corrigés.

**Non fait dans ce round** : longueur minimale imposée à `ADMIN_ACCESS_CODE` (proposée par `securite`, non faite pour ne pas bloquer Camille avant qu'elle ait choisi sa phrase). Une connexion consomme maintenant 2 des 8 essais par IP. Activation réelle avec son téléphone — **à tester par Camille** (son code d'accès est refusé depuis le 2026-10-23 : valeur à vérifier dans Vercel).

## 38. ✅ Admin : tableau de bord sur le modèle de l'image de Camille (2026-10-23)

**Contexte / demande** : Camille a montré l'image d'un tableau de bord (« je veux la version finale comme sur l'image »). Elle a accepté le plan (≈ 650 k), puis la maquette : « maquette OK » (https://claude.ai/artifact/M75jd86KJkbjrTEXWRPBKn).

**Ce qui a été fait**
- `src/lib/crm/tableau.ts` (fonctions pures, sans import) calcule :
  - les 4 tuiles sur 7, 30 ou 90 jours : nouvelles demandes et période précédente, rappels en retard, rendez-vous des 7 prochains jours, part des demandes devenues clientes ;
  - la courbe des 12 dernières semaines (lundi à dimanche, heure de Montréal) et la provenance des demandes ;
  - « À appeler maintenant » : « Urgente » pour une demande jamais contactée depuis plus de 24 h, « Haute » pour une demande jamais contactée ou à relancer, « Normale » pour un rappel en retard ;
  - les rendez-vous d'aujourd'hui et de demain, et ceux « à confirmer ».

  Les stages sont exclus des chiffres (parité avec `SUJETS_HORS_PROSPECTION`).
- `src/components/vsw/admin-tableau.tsx` dessine l'écran : tuiles, petites courbes, barres et anneaux en SVG (aucune bibliothèque), bandeau des brouillons à approuver, alertes, et les trois cartes du bas.
- `src/app/admin/page.tsx` :
  - menu à gauche : Aujourd'hui, Demandes, Tâches, Rendez-vous, Clients, Brouillons à approuver, Courriels et relances, Stagiaires ;
  - recherche par nom, courriel, téléphone ou entreprise, et sélecteur de période ;
  - les anciens onglets restent, comme pages du menu.
- `src/app/vsw.css` : classes `.adm-*`, faites uniquement de jetons (clair et sombre), avec un menu replié en rangées sur téléphone. Le menu du site, le pied de page et la bulle sont masqués dans l'admin.
- Aucune modification de la base ni des routes : l'écran calcule tout à partir des données que `/api/admin/data` envoyait déjà.

**Vérification technique** : `npm run verify` vert (58 tests dont 7 nouveaux, 10 avertissements connus). Le test a échoué quand deux règles ont été cassées volontairement, puis est repassé. Captures prises sur ordinateur, en sombre, sur téléphone (390 px, sans défilement horizontal), à vide et avec une recherche, avec des réponses d'API simulées. `qa-agent` (Opus, ≈ 76 k) **VERT**. Corrigé ensuite, à sa demande : un seul `<main>` sur la page, le compteur « Rendez-vous » du menu égal à la liste, la barre du jour qui ne compte que les rendez-vous à venir, la case « tâche faite » qui revient décochée si l'action échoue. Laissé tel quel : la tuile « Rappels en retard » compte aussi les rappels des stagiaires, qu'il faut rappeler eux aussi.

**Non fait dans ce round** :
- Les rendez-vous ne sont que des **demandes** : le site ne confirme aucun créneau et n'a pas d'agenda. L'heure vient du texte écrit par le calendrier de /rdv ; une demande faite par la bulle IA apparaît « à confirmer ». Branchement à un agenda (Google Agenda, Zoho) : à décider par Camille.
- Pages Événements, Contenu du site, Équipe et Statistiques : laissées de côté, faute de données.
- `/api/admin/data` ne lit que les 200 demandes les plus récentes : à élargir quand il y en aura davantage.
- Écran réel avec de vraies demandes : **à tester par Camille**.

## 39. ✅ Admin, étape A : fiche détaillée, ajout à la main, envoi depuis l'admin (2026-10-23)

**Contexte / demande** : Camille veut « tout » l'admin. Le chantier complet a été accepté (« oui, 1,75 M »), en 6 étapes :
- A (≈ 370 k) : fiche détaillée, ajout à la main, envoi de la première réponse ;
- B (≈ 600 k) : boîte de réception par Resend, qui remplacera le renvoi Cloudflare de info@ ;
- C (≈ 300 k) : Google Agenda ;
- D (≈ 100 k) : statistiques ;
- E (≈ 80 k) : témoignages ;
- F (≈ 300 k) : événements avec page publique et inscriptions.

Pas de page Équipe : Camille est seule dans l'admin. Maquette A acceptée : « maquette A OK » (https://claude.ai/artifact/M75jd86KJkbjrTEXWRPBKn). Décision de Camille : **aucune relance automatique** pour une fiche ajoutée à la main, sauf si l'accord est coché.

**Ce qui a été fait**
- `src/lib/crm/saisie.ts` (pur, testé) : validations des coordonnées, de la nouvelle demande, de la note, de la tâche et de la réponse ; provenances manuelles ; source « admin — … ».
- `src/lib/crm/regles.ts` : `recoitRelances` (demandes du site sans les stages, ou fiche ajoutée à la main avec `consent_at`). Elle est utilisée par les relances 1 et 2 de `moteur.ts`.
- `src/lib/crm/moteur.ts` : `envoyerCourrielFiche`, avec les mêmes garde-fous que les envois automatiques (configuration, désabonnement de l'adresse, consentement LCAP, pied et en-têtes de désabonnement). Le courriel est rangé dans `vsw_email_messages`.
- `src/app/api/admin/fiche/route.ts` (session complète exigée) :
  - GET : la fiche, son historique, ses tâches, ses brouillons, ses courriels ;
  - POST : `creer` (refus si une demande ouverte existe pour le même courriel), `note`, `coordonnees`, `tache` (à 9 h, heure de Montréal), `envoyer` (contact noté, brouillon marqué « envoyé », idempotence en cas de double clic).

  Chaque opération est inscrite dans `vsw_admin_audit_log`.
- `src/components/vsw/admin-fiche.tsx` et `admin-nouvelle.tsx`, raccordés dans `src/app/admin/page.tsx` :
  - le nom ouvre la fiche partout (liste, tableau de bord, brouillons, tâches) ;
  - bouton « + Nouvelle demande » ;
  - provenance « Ajoutée à la main » sur l'anneau du tableau de bord.

  Classes `.adm-*` ajoutées dans `vsw.css`, avec les jetons seulement.
- Aucun changement de schéma : toutes les colonnes existaient déjà.

**Vérification technique** :
- `npm run verify` vert (65 tests ; 11 avertissements, dont 1 nouveau du type déjà connu E01).
- Tests de mutation : en cassant une règle, le test correspondant échoue.
- Captures de la fiche et de la fenêtre (bureau, sombre, téléphone 390 px sans défilement horizontal) avec une API simulée ; le contenu envoyé à l'API a été contrôlé.
- `qa-agent` (Opus, ≈ 79 k) **VERT**. `securite` (Opus, ≈ 70 k) **ORANGE**, sans rien de bloquant.

Corrigé à la suite des revues, en prenant toujours l'option la plus prudente :
- **Loi anti-pourriel** : aucun courriel ne peut partir depuis la fiche à une personne ajoutée à la main qui n'a rien demandé elle-même (recommandation, événement, réseaux sociaux, autre) tant que son accord n'est pas noté (`accordManquant`). Bouton « Cette personne m'a donné son accord » (opération `accord`). « Appel reçu » et « Courriel reçu » restent permis : la personne a elle-même fait une demande.
- « * » refusé dans les courriels saisis (joker de recherche).
- Brouillon déjà envoyé ou rejeté : il n'est plus réécrit.
- Double clic : le courriel n'est noté qu'une fois.
- Liens `tel:` et `mailto:` encodés.
- Expéditeur décrit sans adresse écrite en dur.
- Formulations neutres (« cette personne »).
- Le curseur reste en place dans la fenêtre.

Laissé tel quel :
- La modification du courriel d'une fiche ne vérifie pas les doublons.
- La fenêtre ne garde pas le focus quand on appuie sur Tab.
- La recherche `ilike` de `desabonnerAdresse` (antérieure à ce lot) n'échappe pas « * ». C'est sans effet pour les demandes du site, car le formulaire valide le courriel.

**Non fait dans ce round** : aucun courriel réellement envoyé depuis la fiche, et aucune fiche réellement créée — **à tester par Camille**, avec son adresse. Les courriels reçus des prospects viendront à l'étape B.

## 40. ✅ Admin, étape B : boîte de réception, courriels aux couleurs du site, modèles de réponse, suggestion IA (2026-10-23)

**Contexte / demande** : étape B du chantier « Admin complet ». Accords de Camille :
- « fusionne, maquette B OK, avec la mise en page et les modèles ; l'IA va aider à formuler des réponses, il faut qu'elle soit canalisée, donc c'est mieux d'avoir des templates » ;
- « oui aux 4, Haiku 4.5 » : colonnes `traite_at` et `ignore_at`, réglages Resend et Cloudflare faits par elle, l'IA choisit parmi les modèles sans rien inventer, modèle Haiku. On garde Haiku 5.5, celui du clavardage ;
- « les modèles sont bons », plus le modèle 6 de prospection (« modèle 6 OK ») ;
- signature « Camille Yvan, Fondateur · Développeur et formateur IA » ;
- bouton « Réserver un appel » « pas pour tout ».

**Ce qui a été fait**
- **Base**, migration `vsw_boite_reception_modeles`, tables `vsw_` seulement, recopiée dans `setup-crm-vsw.sql` :
  - colonnes `traite_at` et `ignore_at` de `vsw_email_messages` ;
  - index unique partiel sur `resend_id` pour les courriels reçus ;
  - index de la boîte ;
  - les 6 modèles `modele_*`.
- **Habillage des courriels** (`src/lib/crm/gabarit-courriel.ts`, `public/courriel/logo.png`) : logo, signature encadrée et bouton « Réserver un appel » seulement pour les accusés, les relances, la première réponse, la relance après un appel et la prospection. Il s'applique aux relances, aux accusés et à tout envoi depuis l'admin. Le pied légal donne la bonne raison selon la provenance (`raisonPied`).
- **Réception** (`src/app/api/courriels/entrant/route.ts`, règles pures dans `src/lib/crm/entrant.ts`) :
  - webhook Resend `email.received`, avec signature Svix vérifiée (5 min, temps constant) et corps limité à 256 Ko ;
  - texte lu chez Resend, courriel rangé une seule fois et relié à la fiche dont l'adresse correspond exactement ;
  - copie vers `notify_email` (Gmail de Camille), avec en-tête `Auto-Submitted`, pas de boucle (notre domaine, adresse d'alerte) et 30 copies par jour au plus ;
  - réponses automatiques (absence, infolettre) rangées « ignorées », sans alerte ni copie ;
  - expéditeur en échec DMARC ou DKIM+SPF jamais rangé dans une fiche.
- **Règle du moteur** (revue qa) : la réponse d'une personne **n'est pas un contact humain**. Elle arrête seulement les relances 1 et 2 (`sansReponseRecue`) ; l'alerte 24 h et la tâche d'appel du 7ᵉ jour attendent la réponse de Camille.
- **Boîte de réception** (`/api/admin/courriels`, `src/lib/crm/boite.ts`, `src/components/vsw/admin-boite.tsx`, menu avec le nombre de conversations à répondre) :
  - filtres « À répondre », « Tout » et « Inconnus » ;
  - réponse dans le même fil (`In-Reply-To`), qui marque la conversation traitée et note un contact ;
  - « Marquer comme traité », « Ignorer », « Créer une demande avec ce courriel » ;
  - répondre à quelqu'un qui nous a écrit est permis (LCAP) ; sinon, même règle d'accord que la fiche.
- **Modèles** : « Insérer un modèle » dans la boîte et dans la fiche. Section « Courriels » sur la fiche. Éditeur des modèles dans « Courriels et relances » (`/api/admin/modeles`) ; l'ancienne version reste dans le journal.
- **Suggestion IA** (`/api/admin/courriels/suggestion`, `src/lib/crm/suggestion.ts`, Haiku 5.5) :
  - outil strict à liste fermée de modèles, ou « aucun » ;
  - courriel reçu balisé comme donnée ;
  - proposition écartée si elle contient un montant ;
  - crochets restants signalés, ainsi que les chiffres absents des sources et les liens absents du modèle ;
  - 80 suggestions par jour au plus.

  **Éteinte par défaut** (réglage `ia_courriels` de `vsw_settings`) tant que la politique de confidentialité n'en parle pas (Loi 25).

**Vérification technique**
- `npm run verify` vert : 80 tests (dont `tests/crm-entrant.test.mjs` et `tests/crm-suggestion.test.mjs`), 14 avertissements eslint, dont 4 nouveaux du type déjà connu E01.
- Le test « la réponse d'un prospect n'est pas un contact humain » a échoué avant la correction et passe après.
- Aperçu réel d'un courriel habillé, sur ordinateur et sur téléphone de 375 px.
- `qa-agent` (Opus, ≈ 109 k) ROUGE sur la règle du contact, corrigé. `securite` (Opus, ≈ 98 k) À CORRIGER, sans rien de critique : boucles et quota, expéditeur usurpé, filtre des destinataires, liens glissés dans la suggestion, taille du corps, classe de caractères, `includes`, tout corrigé. Le point Loi 25 est traité par la suggestion éteinte.
- CodeQL (2 alertes « Incomplete multi-character sanitization » sur `texteDepuisHtml`) : balises retirées jusqu'à stabilité, chevrons restants retirés ; un vrai bogue trouvé au passage (une entité numérique invalide faisait lever `RangeError` et échouer la réception) est corrigé (commit 3dc5fce, `qa-agent` Opus ≈ 42 k VERT).
- **À tester par Camille, après la mise en ligne et ses réglages** : un vrai courriel à info@ (réception, copie Gmail, réponse depuis l'admin, fil chez le destinataire).

**Non fait dans ce round**
- Texte « Courriels que vous nous écrivez » de la politique de confidentialité (Resend, copie Gmail, aide à la rédaction par Anthropic, durée de conservation) et évaluation des facteurs relatifs à la vie privée : à valider par Camille, puis allumer `ia_courriels`.
- Réglages de Camille : réception Resend activée sur viesolutionweb.ca, ligne MX dans Cloudflare, webhook `email.received` vers `/api/courriels/entrant`, `RESEND_WEBHOOK_SECRET` dans Vercel, redéploiement.
- Non vérifié : que Resend fournit bien les en-têtes (`Auto-Submitted`, `Authentication-Results`) dans `GET /emails/receiving/{id}`. Sans eux, seules les réponses automatiques reconnaissables à leur objet sont écartées, et l'expéditeur n'est pas contrôlé.
- Laissé tel quel (revue securite, faible) : une personne dont la fiche a plus de 6 mois et qui nous réécrit ne peut pas recevoir de réponse depuis l'admin (consentement tacite calculé sur la création de la fiche) ; elle peut être appelée.
- Pièces jointes : listées seulement, à ouvrir dans Gmail ou dans Resend.

**Coût** : estimé ≈ 720 k (600 k + 120 k d'habillage et de modèles) ; réel ≈ 550 k (agents ≈ 207 k + session ≈ 350 k).

## 41. ✅ CRM : étape « Prospect », sans courriel automatique (2026-10-23)

**Contexte / demande** : ajouter au CRM une étape « Prospect » pour les personnes que Camille va chercher elle-même, que le moteur ignore (aucun courriel automatique). Plan présenté, puis accord de Camille (« Oui, les deux choix ») :
- au premier contact noté, la fiche passe à « Contacté » ;
- les prospects sont comptés à part dans les statistiques.

**Ce qui a été fait**
- **Base**, migration `vsw_leads_etape_prospect`, `vsw_leads` seulement : la règle des étapes accepte « Prospect ». Recopiée dans `setup-crm-vsw.sql`.
- `src/lib/crm/regles.ts` : « Prospect » ajouté en tête de `STATUTS`. `sansCourrielAutomatique` est vérifiée par `relancer` (accusés et relances) et par les candidats de l'accusé de réception. Les autres règles ne visent déjà que « Nouveau », « RDV », « Contacté » ou « Qualifié ». `statutApresContact` : Prospect → « Contacté », ou « RDV » si un rendez-vous est pris.
- `src/lib/crm/tableau.ts` : `estProspection` repose sur l'étape « Prospect » ou sur l'étiquette `prospection` (colonne `tags`, déjà présente), qui reste quand la fiche avance.
  - Ces fiches sont exclues des demandes reçues, du taux de conversion, de la courbe et de la provenance.
  - Elles restent comptées dans les clients gagnés.
  - Une ligne « prospection à part : N en cours, M devenues clientes » s'ajoute sur la tuile « Devenues clientes ».
- **Admin** :
  - case « C'est un prospect : je vais le contacter moi-même » dans « + Nouvelle demande » (`etapeInitiale`) ;
  - le choix « Prospect » dans l'étape d'une fiche pose l'étiquette ;
  - la fiche affiche « Relances : Aucune : prospect ».
- Inchangé : le modèle de prospection ne part qu'avec un accord noté (`accordManquant`).

**Vérification technique** :
- `npm run verify` vert : 84 tests, dont un par règle (étape et contact, étape initiale, statistiques à part, accord du prospect, parité de l'étiquette). La règle des étapes a été vérifiée dans la base après la migration.
- `qa-agent` (Opus, ≈ 70 k) **VERT** : aucun chemin automatique n'atteint un prospect.
- `securite` (Opus, ≈ 66 k) **À CORRIGER**, corrigé :
  - un prospect créé avec la provenance « Appel reçu » (le choix par défaut) échappait au blocage anti-pourriel ;
  - `accordManquant` bloque maintenant toute fiche étiquetée `prospection` sans accord noté, quelle que soit la provenance, y compris dans la boîte de réception ;
  - la combinaison prospect + « Appel reçu » / « Courriel reçu » est refusée (le formulaire passe à « Autre ») ;
  - l'étiquette et l'étape sont écrites dans une seule mise à jour.

**Non fait dans ce round**
- Issue #13 : un prospect qui remplit ensuite le formulaire du site reste « Prospect ». La correction passe par une migration, donc accord de Camille d'abord.
- Pas de test du moteur lui-même : la garde de `relancer` n'est testée qu'à travers la fonction pure.
- `/api/admin/action` ne vérifie pas que l'id est un UUID et renvoie l'erreur brute. C'était déjà le cas avant ce lot ; seul l'admin connecté y a accès.
- Pas d'onglet « Prospects » séparé : les prospects apparaissent dans « Demandes », avec leur étape.

**Coût** : estimé ≈ 100 k ; réel ≈ 230 k (agents ≈ 136 k + session ≈ 95 k), à cause du correctif de sécurité et de ses tests.

## 42. ✅ Réorganisation du site public (fusionnée, PR #14, en ligne le 2026-10-23) : menus Services et Métiers, solutions en 3 piliers, section métier unique, pages /services, /metiers, /emplois (2026-10-23)

**Contexte / demande** : Camille veut « mieux organiser ce que l'on a déjà », sans réécrire les textes ni perdre d'affaires. Plan validé dans la maquette (tableaux `SiteAccueil`, `SiteNavigation`, `SiteMetier`, `SiteExemples` de l'artefact Design), puis « ok » et « tu as mon autorisation jusqu'à la fin ». Points de Camille :
- le hero ne change pas ;
- la bande qui défile est gardée, avec en plus les écrans du CRM (et de Zoho plus tard) ;
- « C'est pour vous si… », « Avant / après » et « Pour votre métier » deviennent une seule section ;
- l'offre de stage passe sur une page « Emplois », avec « sous la supervision de Camille, qui valide tout ce qui est livré » ;
- un menu inspiré de Supabase et Vercel : Services ▾, Métiers ▾, Prix, À propos, « Appel de découverte gratuit ».

**Ce qui a été fait**
- **Données** : `src/lib/metiers.ts` est la source unique des 8 métiers, des 7 situations et des 3 bénéfices. Chaque métier y reçoit 3 situations choisies pour lui, ses pages de service, et `rdvIa` (prise de rendez-vous par l'IA). Les textes viennent des anciens `metiers-section.tsx` et `avant-apres-section.tsx`, retirés.
- **Accueil** (`src/app/page.tsx`), dans l'ordre de Camille : Hero (inchangé) → Nos solutions → section métier → Démarrer simplement → Comment on travaille → Pourquoi nous → Partenaires → Témoignages → FAQ → appel final (un seul bouton).
- **Nos solutions** (`services.tsx`) : 9 cartes en 3 piliers (`PILIERS`).
  - IA et automatisation : Automatisation et IA, Accueil IA, Formation IA.
  - Zoho : Implantation Zoho, Formation Zoho.
  - Web et visibilité : Sites, CRM sur mesure, Référencement.
  - « Formation IA et Zoho » est séparée en deux cartes (`/ia#formation`, `/zoho#formation`).
- **Section métier** (`pour-vous-section.tsx`, `id="metiers"`) : on choisit son métier, une fiche montre ce qui gruge, ce qu'on améliore, le temps retrouvé et ce qu'on installe, avec 3 situations à cocher et la jauge. Le métier « Autre ou PME » montre les 7 situations.
  - Étiquettes IA ajoutées : « IA qui prend les rendez-vous (clavardage ou téléphone) » pour les métiers à rendez-vous, et « Assistant IA pour les petites tâches du quotidien » pour les 8.
  - Le « Je suis… » du hero ouvre la fiche du bon métier (`#metier-<slug>`).
  - Sans JavaScript, chaque métier est un lien vers sa page.
- **Menu** :
  - `nav-services.tsx` devient `nav-deroulant.tsx`, un menu déroulant générique ;
  - Services ▾ : 3 colonnes, une carte « Réalisations », « Tous les services → » ;
  - Métiers ▾ : les 8 métiers, « Tous les métiers → » ;
  - le menu mobile (`nav-menu.tsx`) a les mêmes sous-menus ;
  - bouton « Appel de découverte gratuit » (`APPEL.court`).
- **Pied de page** : colonnes par pilier, puis Entreprise (Métiers, Réalisations, Prix, À propos, Emplois, Contact).
- **Nouvelles pages**, accessibles par le menu, le pied de page et les liens de l'accueil :
  - `/services` : les 3 piliers et Démarrer simplement ;
  - `/metiers` : les 8 cartes ;
  - `/metiers/<slug>` : 8 pages statiques. Chacune a un fil d'Ariane, ce qui gruge, ce qu'on installe (avec les liens vers les services) et ce que ça change, les situations, la démarche et les autres métiers.
  - `/emplois` remplace `/postuler-stagiaire`, redirigée en 308.
  - `/services` n'est plus redirigée vers l'accueil (les sous-adresses de l'ancien design vont vers `/ia`) ; `/solutions` mène à `/services`.
- **Réalisations** :
  - la bande qui défile mêle sites et écrans du CRM sur mesure (`ECRANS` de `outils-galerie.tsx`) et mène à `/realisations` ;
  - `/realisations` montre les sites et la galerie d'écrans ;
  - l'ancien `portfolio.tsx` est retiré.
- **Stagiaires** : les mentions des jeunes sont retirées des pages de vente (`ai-section.tsx`, `zoho-section.tsx`). La carte « Démarrer » devient « Mise en place d'un logiciel de gestion (Zoho ou CRM sur mesure) ». Le bouton « Décrire ma situation par écrit » reste seulement sur Prix (`/devis`) ; la page Contact est déjà le formulaire écrit.
- Le plan du site (`PUBLIC_ROUTES`, `src/lib/site.ts`) et les connaissances de la bulle de clavardage listent les nouvelles pages.
- Le lien Blog et le choix FR/EN ne sont pas dans le menu (accord de Camille). Le Blog viendra avec 3 vrais articles, le FR/EN avec une vraie version anglaise, sur le modèle Lingui de KHI.

**Vérification technique**
- `npm run verify` vert : 89 tests, dont 5 nouveaux dans `tests/metiers.test.mjs` (slugs uniques, 3 situations valides par métier, toutes utilisées, services existants, liste `rdvIa`, mention AMF).
- Captures sur 1280 px et 390 px : accueil, deux menus, section métier, page métier, `/metiers`, `/services`, `/realisations`, `/emplois`. Aucun débordement horizontal.
- Un débordement réglé en cours de route : la colonne de la fiche métier grandissait avec la liste, réglé par `minmax(0,1fr)` et `min-width: 0`.
- `qa-agent` (Opus, ≈ 96 k) **VERT** : redirections, 200 sur toutes les nouvelles routes, 404 sur un métier inconnu, plan du site, 43 liens internes et toutes les ancres, coordonnées, aucun montant, un seul h1 par page, CSS en jetons seulement. Corrigé ensuite :
  - un `aria-live` en double sur la fiche métier (le lecteur d'écran relisait toute la fiche) ;
  - Ctrl/Cmd + clic sur un métier ouvre de nouveau sa page ;
  - le commentaire et le suivi disaient « Contact et Prix » : le bouton écrit n'est que sur Prix.

**Non fait dans ce round**
- Captures de Zoho (données fictives ou masquées, accord du client, décision sur le logo).
- Faits réels et accord des clients pour des fiches de réalisation détaillées.
- Blog (3 articles) et version anglaise : chantiers à part.
- « relève » reste dans `pricing-section` et `about.tsx` (hors pages de vente visées).
- Anciennes pages `src/app/services/*` et `src/app/solutions/*` de l'ancien design : toujours dans le dépôt, inaccessibles (redirigées). À retirer dans un lot de ménage.
- Règles CSS mortes de l'ancienne section « Avant / après » (`pv-outro`) laissées dans `vsw.css`.
- `tests/metiers.test.mjs` recopie la liste des pages de service au lieu de l'importer du menu (remarque mineure du `qa-agent`).
- `StageSection` n'est plus affichée nulle part (seul `OFFRES_STAGE` sert) ; son lien pointe maintenant vers `/emplois`.
- Textes écrits par Claude, à relire par Camille :
  - le titre et l'intro de `/services` ;
  - l'intro de `/realisations` ;
  - les descriptions courtes des métiers et des services dans le menu.
- À tester par Camille : les menus sur son téléphone.

**Coût** : estimé ≈ 250 k ; réel ≈ 450 k (session, y compris les rondes de maquette) + `qa-agent`.

## 43. ✅ Menu flottant de retour, avec animations (2026-10-23)

**Contexte / demande** : Camille aimait le menu flottant du lot Agnos (§ 14), remplacé par une barre pleine largeur à la réorganisation (§ 42) : « mon menu flottant je l'aimais, si on peut rajouter des animations ». Plan annoncé (≈ 60 k), accord « oui oui ».

**Ce qui a été fait** (`src/app/vsw.css` seulement)
- La surcharge « barre pleine largeur » est retirée : les règles « 1. Menu flottant » reprennent effet (barre détachée, coins arrondis, ombre ; panneau mobile flottant). Les grands menus Services et Métiers sont gardés.
- Animations, toutes en CSS : arrivée de la barre au chargement ; ouverture des grands menus en fondu et glissement, éléments en cascade ; trait sous les liens au survol ; léger décalage des éléments et soulèvement du bouton d'appel au survol ; menu mobile et sous-menus qui glissent ; barre plus opaque au défilement (thème clair).
- Tout est coupé par `prefers-reduced-motion`. Aucune dépendance.

**Vérification technique** : `npm run verify` vert (89 tests). Captures à 1440 px (barre, menu Services pendant et après l'animation, barre au défilement) et à 390 px (menu mobile) ; aucun débordement (390 px).

**Non fait dans ce round** : à tester par Camille sur son téléphone et son ordinateur (le ressenti des animations ne se voit pas sur une capture).

**Décisions de Camille notées le même jour** (réponses aux questions, 2026-10-23), pour les chantiers suivants :
- Blog : ses 3 sujets proposés (IA par où commencer ; rappels de rendez-vous ; Zoho ou CRM sur mesure), relus par elle avant publication ; lien « Blog » au menu seulement avec les 3 articles approuvés.
- Version anglaise : français inchangé à la racine, anglais sous `/en` ; relecture par Camille.
- Page Avis (étape E) : nouvelle table `vsw_avis` acceptée (`site_testimonials`, sans préfixe, n'est pas touchée) ; texte de consentement à la publication accepté ; affichage nom, métier, note ; WhatsApp et code QR comme KHI ; bibliothèque `qrcode` acceptée ; liens Google et Facebook fournis plus tard (cases dans l'admin).

**Coût** : estimé ≈ 60 k ; réel ≈ 130 k (session ≈ 70 k + `qa-agent` ≈ 60 k, VERT ; ses remarques corrigées : transition de la marge, décalage au survol par `translate`, ligne de l'état).

## 44. ✅ Blog : 6 articles approuvés, pages /blog et /blog/<slug>, lien au menu (2026-10-23)

**Contexte / demande** : un vrai Blog (maquette SiteBlog validée). Camille choisit 3 sujets métier, puis demande une série sur Claude, ChatGPT et ce que l'IA apporte aux PME, appuyée sur ce que publient Anthropic, OpenAI et les grands magazines. Décisions de Camille : garder les 6 articles ; rappels par courriel ou texto, confirmation et annulation par le client (« j'offre tout ce que l'IA peut faire ») ; formulation Loi 25, rythme sur 4 semaines, phrase sur les équipes plus grandes : « oui » ; signature « Camille Yvan, Vie Solution Web ».

**Ce qui a été fait**
- **Rédaction** (Sonnet) : 3 articles métier à partir des seuls textes du site ; 3 articles de la série IA à partir de sources vérifiées une à une dans le document d'origine (`docs/projets/blog/SOURCES-SERIE-IA.md` : ISQ nov. 2025, OpenAI déc. 2025, Anthropic juin 2026, Brynjolfsson et coll. QJE 2025, pages de confidentialité). Deux sources écartées faute d'avoir pu les lire (Gusto, Harvard/BCG). Chaque chiffre est cité avec sa date et son lien, avec une section « Sources ».
- **Contenu** : `src/content/blog/*.md` (6 articles, date du 2026-10-23, signature, ordre) ; brouillons et sources gardés dans `docs/projets/blog/`.
- **Lecture** : `src/lib/blog-markdown.ts` (pur : en-tête, sous-ensemble de Markdown, ancres, plan, temps de lecture ; liens permis : internes ou https seulement ; rendu en éléments React, jamais de HTML brut), `src/lib/blog.ts` (lecture au build).
- **Pages** : `/blog` (remplace l'ancienne page de l'ancien design aux articles d'exemple ; filtres par pilier, `blog-liste.tsx`) ; `/blog/<slug>` (6 pages statiques ; fil d'Ariane, signature, date, plan, texte, « À retenir », sources, appel ; côté : service lié, métiers, « À lire aussi » ; fiche schema.org Article). Slug inconnu : 404.
- **Raccordement** : « Blog » dans le menu (bureau et mobile, `NAV_LINKS`) et le pied de page ; redirection `/blog` → `/` retirée ; plan du site (`sitemap.ts` lit les articles) ; bulle de clavardage (`connaissances.ts`).

**Vérification technique** : `npm run verify` vert, dont 7 tests nouveaux (`tests/blog.test.mjs` : 6 articles et en-têtes, aucune mention [à confirmer] publiée, aucun montant, liens internes ou https, lecture du Markdown, lien `javascript:` neutralisé). 200 sur `/blog` et les articles, 404 sur un article inconnu, 7 adresses du Blog dans le plan du site. Captures 1280 px et 390 px, aucun débordement.

**Non fait dans ce round**
- Version anglaise du Blog (avec le chantier FR/EN).
- Pas d'image par article.
- À relire par Camille sur l'aperçu : la phrase d'introduction du Blog (« ce qu'on explique à nos clients pendant l'appel découverte, écrit pour vous »).

`qa-agent` (Opus, ≈ 80 k) **ROUGE puis corrigé** : les parts 20 / 9 / 7 / 6 % viennent de l'analyse des conversations de Claude, pas de l'enquête auprès de 9 700 répondants (attribution corrigée dans « 5 tâches » et « Claude ou ChatGPT », et dans les sources) ; « environ deux fois moins » au lieu de « un peu moins vite » ; « aide davantage ceux qui débutent » ramené à l'étude sur le service à la clientèle ; `lienPermis` refuse aussi `/\…` (tests ajoutés). Le reste : vert (chiffres, rendu sans HTML brut, routes, plan du site, menu, CSS).

Après la PR : 2 alertes CodeQL (« stored XSS » sur les liens des articles, venant des noms de fichiers) corrigées : adresses vérifiées (`slugValide`) et encodées (`cheminArticle`), tests ajoutés ; CodeQL vert. Fusionnée (PR #16) et en ligne le 2026-10-23.

**Coût** : estimé ≈ 250 k (série) + ≈ 100 k (pages) ; réel ≈ 560 k (rédaction ≈ 190 k, recherche et vérification ≈ 80 k, pages et tests ≈ 130 k, `qa-agent` ≈ 80 k, corrections ≈ 80 k).

## 45. ✅ Couleurs plus vives sur tout le site, palette B (2026-10-23)

**Contexte / demande** : « mettre plus de couleur plus vive », sur tout le site, mêmes teintes plus saturées. Maquette SiteCouleurs (A aujourd'hui, B plus vif, C très vif) : Camille choisit **B**.

**Ce qui a été fait** (`src/app/vsw.css`, bloc « Couleurs plus vives, palette B » en fin de fichier, thème clair seulement) : sarcelle et violet plus saturés (`--accent`, `--accent-2`, `--accent-vif`, `--accent-soft`, `--accent-glow`) ; sections alternées plus colorées (`--bg-1`, `--bg-2`, `--bg-band`, `--tray`) ; bouton principal en dégradé sarcelle → violet ; mot en couleur du hero plus vif ; icônes sur pastille colorée (services, menu, avantages), une couleur par pilier (sarcelle, vert, violet) ; titres de piliers et surtitres en couleur. Thème sombre inchangé.

**Vérification technique** : `npm run verify` vert. Captures de l'accueil (hero, solutions, section métier). `qa-agent` (Opus, ≈ 45 k) **ROUGE puis corrigé**, contrastes recalculés (sRGB, WCAG) : texte blanc sur le bouton 4,99 et 6,74 (le départ à 0,53 donnait 4,41, la couleur sortant de l'espace sRGB) ; `--accent` abaissé à 0,49 (≥ 4,55 sur blanc et sur les sections pâles) ; `--ok` du pilier Zoho à 0,49 (≥ 4,96) ; règle `.eyebrow` en double retirée.

**Non fait dans ce round** : à regarder par Camille sur son téléphone et son ordinateur (aperçu de la PR).

**Coût** : estimé ≈ 50 k ; réel ≈ 120 k (session ≈ 75 k + `qa-agent` ≈ 45 k).

## 46. ✅ Blog en couleur, compilation des réalisations sur À propos, phrase du stage (2026-10-23)

**Contexte / demande** (Camille) : « blog n'a pas de couleur, il faut en mettre même dans les articles » ; « À propos : il manque une image ou une petite vidéo, une compilation de ce que l'on a déjà fait » ; la phrase « On forme des jeunes en informatique, en IA et sur Zoho — apprenez le métier sur de vrais mandats clients » « ne rassure pas : seulement parler de l'offre de stagiaire, on ne rajoute pas plus ».

**Ce qui a été fait**
- **Blog** : une couleur par pilier (`clePilier`, attribut `data-pilier` : sarcelle IA, vert Zoho, violet Web). Cartes avec bande et fond teintés, pastille du pilier ; article avec halo de couleur en haut, pastille dans le fil d'Ariane, plan teinté, barre de couleur devant chaque titre, « À retenir » en dégradé, blocs du côté soulignés de la couleur du pilier.
- **À propos** : la case photo vide est remplacée par une compilation (`about-compilation.tsx`) des vrais sites (3) et écrans de CRM (4), déjà publiés dans la bande de l'accueil, en fondu enchaîné CSS (4 s par image), avec légende et lien vers Réalisations. Avec « réduire les animations » : première image seule, fixe.
- **Stage** : bannière de À propos (`interns-section.tsx`) réduite à l'offre : « Vous êtes aux études en informatique, en IA ou en administration ? Découvrez notre offre de stage. » ; paragraphe « Nous formons aussi la relève… » retiré de `about.tsx`.

**Vérification technique** : `npm run verify` vert ; test de `clePilier` ajouté. Captures du Blog, d'un article et de À propos (deux images de la compilation) ; aucun débordement à 390 px.

**Non fait dans ce round**
- « relève » reste dans `benefits-section.tsx` (« On forme vos gens — et la relève — ») et `pricing-section.tsx` (« Formations trimestrielles (équipe & relève) ») : à décider par Camille.
- Pas de vraie vidéo (MP4) : un fondu d'images en CSS, plus léger. Une vidéo pourra remplacer la compilation si Camille en fournit une.
- Accord des clients (Ben's, Khí) pour leurs captures : toujours à obtenir par Camille (mêmes images que la bande de l'accueil).

`qa-agent` (Opus, ≈ 35 k) **ROUGE puis corrigé** : texte de la pastille du pilier sous 4,5:1 sur les fonds teintés (3,43 à 4,69) → couleur du pilier mêlée à 20 % de noir en thème clair (5,38 à 7,26). Le reste vert : légende de la compilation ≥ 9,88:1, une seule image annoncée, animation coupée si réduite, « 3 sites et 4 écrans » calculé.

**Coût** : estimé ≈ 60 k ; réel ≈ 105 k (session ≈ 70 k + `qa-agent` ≈ 35 k).

