# Notes d'implémentation — pme-accessible (ux-agent, 2026-10-17)

Implémentation des sections 4 (DOIT), 5 (DEVRAIT) et 7 (ordre de l'accueil) du `PRD.md`,
et des en-têtes `PageHeader` de `APP-FLOW.md` §3.

## Fichiers créés

- `src/components/vsw/pour-vous-section.tsx` — 4.2, section `id="pour-vous"`.
- `src/components/vsw/avant-apres-section.tsx` — 4.3, section `id="avant-apres"`.
- `src/components/vsw/demarrer-section.tsx` — 4.4, prop `variant: 'accueil' | 'ia' | 'zoho'`, `id="demarrer"`.

## Fichiers modifiés

- `src/app/vsw.css` — ajout en fin de fichier (commentaires `/* pme-accessible */`) : `.pv-situation`,
  `.pv-outro` (phrase de fin + bouton), `.compare-note` (note « Exemples illustratifs »),
  `.ai-pillar-link` (lien « En savoir plus » dans une carte).
- `src/app/page.tsx` — ordre §7 : Hero, Pour vous, Avant/après, Démarrer (accueil), Services, Process,
  Benefits, Comparison, Testimonials, Interns, FAQ, CTA.
- `src/app/ia/page.tsx` — lede APP-FLOW §3 ; `DemarrerSection variant="ia"` avant `AISection`.
- `src/app/zoho/page.tsx` — eyebrow, titre, lede APP-FLOW §3 ; description des métadonnées
  (« au même endroit ») ; `DemarrerSection variant="zoho"` avant `ZohoSection`.
- `src/components/vsw/hero.tsx` — 4.1 (eyebrow, lede, bouton 2 « Par où commencer ? » → `#demarrer`, défilant).
- `src/components/vsw/faq-section.tsx` — 4.5 : 5 nouvelles questions en tête (10 au total), h2
  « Vos questions, nos réponses franches. », corrections de jargon des 5 existantes.
- 4.6 : `services.tsx`, `ai-section.tsx`, `zoho-section.tsx`, `benefits-section.tsx`,
  `comparison-section.tsx`, `process-section.tsx`, `nav.tsx` (« Démarrer » → `/#demarrer` en premier,
  « Cas d'usage » → « Réalisations »).
- `src/components/vsw/quote-calculator.tsx` — 5.1 : type `debut` « Je débute — premier pas » en premier
  (`surMesure: true`, `base: 0` jamais affichée) ; Fonctionnalités et Échéancier cachés ; aperçu
  « Sur mesure » + texte, aucun montant ; lien `/rdv` conservé ; envoi `type_projet = "Je débute — premier pas"`,
  `resultat_estimation = "Sur mesure — à discuter à l'appel découverte"` (sans délai ni fonctionnalités).
  Type par défaut toujours `auto`. Constantes (`base`, `price`, `mult`, `UNIT_PRICE`) et formule
  `estimate` inchangées. Libellés renommés selon 4.6.
- `src/components/vsw/chatbot.tsx` — 5.2 : chip « Je ne sais pas par où commencer » en premier, nœuds
  `debuter`, `debut-zoho`, `debut-ia` (aucun prix) ; actions `goto-zoho` (`/zoho#demarrer`) et `goto-ia`
  (`/ia#demarrer`) sur le modèle de `goto-rdv` ; jargon de `services`, `zoho`, `agent`, `auto` (prix inchangés).
- `src/components/vsw/about.tsx`, `src/components/vsw/portfolio.tsx` — occurrences restantes du grep de
  contrôle (« écosystème », « Workflow ») remplacées.

## Écarts par rapport au PRD

- `zoho/page.tsx` : le texte du `CTASection` disait « la gestion de votre business » → « votre entreprise »
  (même anglicisme que la bannière de `zoho-section.tsx` visée par 4.6 ; hors tableau, corrigé par cohérence).
- Numérotation des cartes « Démarrer » : `01 · Premier pas` (modèle `ai-pillar-num` de `AISection`).
- FAQ existante : en plus des 2 corrections du tableau, « écosystème complet… migration » → « installation
  complète… transfert de vos données », « dès l'audit » → « dès le départ », « dans un seul écosystème » →
  « au même endroit », « On commence par un audit » → « On commence par regarder comment vous travaillez ».
  Durées « 2 à 4 semaines » / « 6 à 9 semaines » inchangées.
- `zoho-section.tsx` : eyebrow « // Écosystème Zoho » → « // Les outils Zoho » (grep de contrôle) ; h2
  « Votre gestion, centralisée. » conservé (révision QA : le remplacement 4.6 aurait répété le titre du
  `PageHeader` de `/zoho`).
- `process-section.tsx` étape 03 : « Automatisations, agents IA… on déploie » → « Tâches automatiques,
  assistants IA… on avance » (même esprit que 4.6).
- Chatbot : chips de `estimer` et `services` renommées comme le calculateur (« Tâches automatiques (IA) »,
  « Assistant IA sur mesure ») ; la phrase « Une vie qui vous appartient dans la gestion de votre business ! »
  du nœud `zoho` disparaît (texte du PRD repris tel quel).
- Calculateur « Je débute » : libellés du bloc d'envoi adaptés (« Être contacté pour mon premier pas »,
  « Envoyer ma demande », confirmation sans « soumission détaillée »).
- Couleur de `.compare-note` : `--fg-2` plutôt que `--fg-3` pour le contraste du petit texte.

## Reste à faire / à confirmer par Camille

- « Durée : [à confirmer] » (carte Formation courte, accueil).
- « Taxes du Québec configurées » (carte Zoho Books) : à valider, sinon retirer (commentaire dans le code).
- Le menu `.nav-links` est masqué sous 640 px (comportement existant) : le lien « Démarrer » n'est donc pas
  visible sur mobile ; le bouton 2 du Hero (« Par où commencer ? ») couvre ce cas.

- Hors du tableau 4.6, non touché : autres textes « Agents IA »
  hors des fichiers listés (footer, etc.) — à passer dans un prochain round si souhaité.
- « Assistant IA… Jour et nuit » (services 02) et « 24h » du hero : à confirmer comme les autres mentions.

## Vérifications (2026-10-17)

- `npm run typecheck` : OK, 0 erreur.
- `npm run lint` : 0 erreur, 10 avertissements (tous préexistants : admin, contact.tsx, anciennes pages).
- `npx next build` : « Compiled successfully », 41/41 pages générées.
- `grep -niE "workflow|inter-apps|écosystème|leads|24/7|business|livrable|cartograph" src/components/vsw/*.tsx` :
  seuls restent des noms de variables (`leadSending`, `leadSent` dans `quote-calculator.tsx`).
- `grep -n '\$'` sur les 3 nouveaux composants : aucun résultat.
- **Révision QA (verdict vert, révision unique)** : h2 de `zoho-section.tsx` remis à « Votre gestion,
  centralisée. » ; métadonnées de `/ia` « agents IA sur mesure » → « assistants IA sur mesure » ;
  `chatbot.tsx` : 5 apostrophes typographiques des nouveaux nœuds remplacées par `\'`. Après révision :
  `npm run typecheck` OK (0 erreur), `npm run lint` 0 erreur / 10 avertissements préexistants ;
  `next build` laissé à l'agent principal.
- Non vérifié visuellement (pas de navigateur) : rendu mobile, défilement des ancres `#demarrer` — **à tester
  par le qa-agent / Camille**.

## Round 2 — Métiers et partenaires (2026-10-17, `ux-agent`)

Source : `PRD-METIERS.md` (§4.1 à §4.5, contraintes §5) + demande de Camille pour « Ils nous font confiance ».

### Mission A — « Pour votre métier » (fait)

- **Créé** `src/components/vsw/metiers-section.tsx` (`MetiersSection`, `id="metiers"`, 8 cartes dans l'ordre du PRD,
  type `Metier`, textes copiés du PRD). Icônes `users`, `grid`, `calendar`, `clock`, `check`, `bolt`, `chat`, `check` :
  toutes présentes dans `icon.tsx`.
- **CSS** (fin de `src/app/vsw.css`, bloc `/* pme-accessible — métiers */`) : `metiers-grid`, `metier-label`,
  `metier-note`, `metier-precision`. Cartes = `benefits-grid` + `benefit` ; étiquettes = `service-tags` / `service-tag`.
- **Modifiés** : `src/app/page.tsx` (après `PourVousSection`, avant `AvantApresSection`) ; `hero.tsx` (eyebrow + lede) ;
  `services.tsx` (desc d'en-tête + carte 02 sans « Jour et nuit », texte décidé par l'agent principal) ;
  `benefits-section.tsx` (desc) ; `cta-section.tsx` (texte par défaut) ; `nav.tsx` (« Métiers » → `/#metiers`
  entre « Démarrer » et « IA ») ; `faq-section.tsx` (2 questions en tête, 12 au total).

### Écarts (mission A)

- Seuils de la grille : **900 px → 2 colonnes, 560 px → 1 colonne** (consigne de l'agent principal), et non
  1024 / 640 px comme le dit le PRD §5.
- Phrase de fin : réutilise la classe existante `pv-outro` (même mise en page que « C'est pour vous si… ») — aucune
  classe nouvelle hors des quatre prévues.
- Contradiction interne du PRD : « aucun chiffre » dans les textes de la section, mais les notes 1 à 4 doivent
  contenir « Loi 25 ». Le grep `[0-9$]` sur `metiers-section.tsx` remonte donc les tailles d'icône **et** les lignes
  « Loi 25 » ; aucun autre chiffre ni `$`.

### Mission B — « Ils nous font confiance » (fait)

- **Créé** `src/components/vsw/partners-section.tsx` (`PartnersSection`, `id="partenaires"`, composant serveur, sans JS).
  Tableau `PARTNERS` à deux entrées (`name`, `url`, `logo`, `hasLogo`, `description`). Carte = `<a target="_blank"
  rel="noopener noreferrer">` si `url` non vide, sinon `<div>` ; logo `<img loading="lazy">` seulement si
  `hasLogo: true`, sinon le nom en grand (`partner-name`) dans un cadre de même hauteur. `next/image` n'est pas
  utilisé dans `src/components/vsw/` : `<img>` simple + `eslint-disable-next-line @next/next/no-img-element`.
- **Créé** `public/partenaires/.gitkeep` (dossier où déposer les logos).
- **CSS** (fin de `vsw.css`, bloc `/* pme-accessible — partenaires */`) : `partners-grid` (cartes centrées,
  `auto-fit` 220-280 px, soit 1 à 4 par rangée), `partner-card` (hauteur min. 120 px, bordure `--line-soft`, fond
  `--bg-1`, montée de 2 px au survol, désactivée si « réduire les animations »), `partner-logo`, `partner-name`,
  `partner-desc`. Classe `partner-logo` ajoutée (cadre du logo) en plus des quatre demandées.
- **Modifiés** : `src/app/page.tsx` (après `ComparisonSection`, avant `Testimonials`) ; `footer.tsx` (colonne
  « Entreprise » : « Partenaires » → `/#partenaires`, après « Cas d'usage »). Nav non touchée.

### À confirmer par Camille

- **Noms exacts** des deux partenaires (« Les Jus Naturels Ben's », « KHI Succès académique ») et leurs
  **descriptions**.
- **Adresses des sites** : `url: ''` pour les deux, donc aucune carte n'est cliquable aujourd'hui, alors que la
  description de section dit « Cliquez pour visiter leur site ». Remplir les URL (ou retirer cette phrase).
- **Logos** : déposer `public/partenaires/jus-naturels-bens.svg` et `public/partenaires/khi-succes-academique.svg`,
  puis passer `hasLogo` à `true`. Vérifier l'accord des deux entreprises pour l'affichage de leur logo.
- Reste du PRD-METIERS §7 (mention AMF, autres métiers réglementés, « Rappels automatiques », eyebrow du hero,
  libellé « Ce qui vous gruge », accueil désormais à 14 sections).
- Tension résiduelle hors périmètre : `benefits-section.tsx`, carte « Votre entreprise avance, même la nuit »
  (« réponses aux clients potentiels : les tâches automatiques ne dorment jamais ») face à la FAQ 2 (« l'outil
  prépare, vous validez »). Non modifiée.

### Vérifications (round 2, 2026-10-17)

- `npm run typecheck` : OK, 0 erreur.
- `npm run lint` : 0 erreur, 10 avertissements (préexistants) ; `eslint --report-unused-disable-directives` sur les
  10 fichiers touchés : aucun message.
- `node scripts/check-rules.mjs` : 2 règles, aucune violation.
- `npx next build` : « Compiled successfully », 41/41 pages générées.
- `grep -rc 'id="metiers"' src` → 1 (seul `metiers-section.tsx`). `grep -c "q:" faq-section.tsx` → 12.
- `grep -nE '[0-9$]' metiers-section.tsx` → commentaires du type, `h2`/`h4`, `size={20}`/`size={14}`, et les trois
  lignes « Loi 25 » (exigées par le PRD). Aucun `$`, aucun autre chiffre dans les textes.
- `grep -n "Jour et nuit" services.tsx` → vide. Mots « rendement / placement / garanti / diagnostic » → absents.
- Non vérifié à l'écran (pas de navigateur) : rendu des 8 cartes à 4 / 2 / 1 colonnes, `service-tag` hors `.service`,
  ancre `/#metiers` depuis une autre page, nav à 8 liens, cartes partenaires — **à tester par Camille**.

### Complément de l'agent principal (round 2, après l'`ux-agent` et le `qa-agent`)

Corrige les lignes périmées ci-dessus (section « Mission B » et « À confirmer ») :
- `PARTNERS` compte **3 entrées**, toutes avec lien et logo : Les Jus Naturels Ben's (https://lesjusnaturelsbens.com/,
  `les-jus-naturels-bens.svg` = icône officielle du site), VieSolution (https://viesolution.ca/, `viesolution.svg` =
  mot-symbole recréé d'après leur image de partage, « Vie » #FF7A00 / « Solution » blanc), Khí Succès Académique
  (https://khisuccesacademique.com/, lien fourni par Camille ; `khi-succes-academique.png` = symbole officiel détouré +
  nom sur deux lignes). `.gitkeep` retiré.
- **Descriptions** : uniquement le domaine de chaque partenaire, relevé sur son propre site le 2026-10-17 (balise
  description / page d'accueil). Ce que Vie Solution Web a réalisé pour eux n'est pas affiché : à rédiger par Camille
  si elle le souhaite.
- `benefits-section.tsx`, carte « Votre entreprise avance, même la nuit » : **modifiée** (« … et vous validez ce qui
  part ») pour lever la tension avec la FAQ 2.
- `npm run verify` relancé par l'agent principal après ces ajouts (résultat dans `SUIVI-TACHES.md` §3).
- Reste à confirmer par Camille : l'accord des trois entreprises pour l'affichage de leur logo ; VieSolution est sa
  propre plateforme (le `qa-agent` demande si elle compte comme « client »).

## Round 3 — Prix sur mesure (2026-10-17, `ux-agent`, Opus)

Décision de Camille : plus aucun montant en dollars sur le site public. Trace : `PRD-PRIX.md`.

### Fichiers (au fil de l'eau)

- Créé : `docs/projets/pme-accessible/PRD-PRIX.md`.
- Créés : `src/components/vsw/comment-prix-section.tsx` (serveur), `src/components/vsw/situation-form.tsx` (client).
- Modifiés : `src/app/devis/page.tsx`, `src/components/vsw/pricing-section.tsx`, `src/components/vsw/chatbot.tsx`,
  `src/components/vsw/comparison-section.tsx`, `src/components/vsw/faq-section.tsx`, `CLAUDE.md`.
- Supprimé : `src/components/vsw/quote-calculator.tsx` (aucun import restant).

### Écarts et choix

- Étapes et bloc « Ce qui fait varier le prix » en `h3` (pas `h4` comme `process-section.tsx`) pour garder l'ordre des
  titres h1 → h2 → h3 ; style recopié en ligne avec les jetons. Étapes dans un `ol` (liste ordonnée lue par les lecteurs
  d'écran), classes `process-grid cols-3` / `process-step`. Bloc des facteurs : `ai-pillar` bordé (flèches `→`).
- `SituationForm` : schéma zod local au composant (pas de modification de `src/lib/**`) ; métier obligatoire (le champ
  `type_projet` de `estimateur_requests` est requis) ; erreur générale en `var(--danger)` (le `contact.tsx` d'origine a
  une couleur en dur, non corrigée ici) ; `role="alert"` / `role="status"`, `aria-invalid`, `autoComplete`.
- Chatbot : en plus des chips demandés, le chip « Estimer une implantation » (nœud `zoho`) devient aussi
  « Combien ça coûte ? » — « estimer » promettait un chiffre que le nœud ne donne plus.
- FAQ : le premier « sur mesure » de la réponse est retiré pour éviter la répétition avec la nouvelle phrase.
- `CTASection` : bouton principal « Réserver un appel » via `primaryLabel` ; le bouton « Nous écrire » du composant reste.
- Non touchés, à décider par Camille : libellé du pied de page « Devis en ligne » (`footer.tsx`, lien conservé comme
  demandé) ; pages légales `conditions-utilisation` (§5 « outil d'estimation en ligne ») et `politique-confidentialite`
  (« notre estimateur de projet ») — texte juridique, hors périmètre ; classes CSS `calc-*` de `vsw.css` désormais inutilisées.
- `SituationForm` : pot de miel lu sur le formulaire soumis (`event.target.elements`) plutôt qu'avec une `ref`, pour ne
  pas ajouter l'avertissement `react-hooks/refs` que porte `contact.tsx`.

### Vérifications (round 3, 2026-10-17)

- `grep -rnE '[0-9][0-9 ]*\$|\$ ?[0-9]|CAD' src/components/vsw src/app --include=*.tsx` : **aucun résultat dans
  `src/components/vsw`** ni dans les pages du nouveau design. Restent 7 lignes, toutes dans l'ancien design redirigé en
  308 (hors périmètre) : `src/app/services/outils-internes/page.tsx:62`, `src/app/services/chatbots-ia/page.tsx:119`,
  `src/app/services/developpement-web/page.tsx:59`, `src/app/particuliers/sites-personnels/page.tsx:21`,
  `src/app/diagnostic/page.tsx:171-173` (redirections `/services/:path*`, `/particuliers/:path*`, `/diagnostic` vérifiées
  dans `next.config.ts`).
- `grep -rn "QuoteCalculator\|quote-calculator" src` : vide.
- `npm run typecheck` : 0 erreur. `npm run lint` : 0 erreur, 10 avertissements (préexistants, même nombre qu'au round 2).
- `npx next build` : « ✓ Compiled successfully », 41/41 pages générées, `/devis` statique.
- `node scripts/check-rules.mjs` : 2 règles, aucune violation. `node scripts/check-secrets-suivis.mjs` : aucun fichier sensible.
- Non vérifié : rendu à l'écran (thèmes clair et sombre, mobile) et envoi réel du formulaire de situation vers
  `estimateur_requests` — **à tester par Camille**.

### Complément de l'agent principal (round « Prix sur mesure », après le `qa-agent`)

- Pied de page (« Combien ça coûte ? ») et pages légales (`conditions-utilisation` §5 « Prix et propositions », `politique-confidentialite`) **ont été modifiés** par l'agent principal — la ligne « Non touchés » ci-dessus est périmée.
- Les classes `calc-*` ne sont **pas** toutes inutilisées : `src/app/admin/page.tsx` utilise `.calc-option`. Ne pas les supprimer sans vérifier.
- Révision après QA : « Deux minutes suffisent » retiré (durée non validée) ; « ce qui est convenu est ce qui est facturé » remplacé par « si quelque chose doit changer, on en parle avant, jamais après » ; « Décrivez-moi » → « Décrivez-nous » ; couleur d'erreur de `contact.tsx` passée en `var(--danger)`.

## Round 5 — Animations (2026-10-17, `ux-agent`, Opus)

Plan approuvé par Camille (« Sobre et premium »). Trace : `PRD-ANIMATIONS.md`.

### Fichiers

- Créés : `docs/projets/pme-accessible/PRD-ANIMATIONS.md`, `src/components/vsw/nav-scroll.tsx` (client, sans état React,
  écouteur `scroll` passif, seuil 24 px, nettoyage au démontage).
- Modifiés : `src/app/vsw.css` (bloc ajouté en fin de fichier, `/* pme-accessible — animations */`, aucune règle
  existante réécrite : surcharges placées après), `src/app/layout.tsx` (import + `<NavScroll />` sous `<TrackPageview />`).
- Non touchés : `hero.tsx`, `nav.tsx`, `reveal-init.tsx`, aucun texte du site.

### Écarts et choix

- **Survols des tuiles en mosaïque** (`.benefit`, `.service`, `.ai-pillar`, `.process-step`) : contour accent 40 % (ombre
  intérieure de 1 px, ces tuiles n'ont pas de bordure) + `--shadow-soft`, **sans la montée de 3 px** : leurs grilles ont
  des joints de 1 px et `overflow: hidden`, une montée serait rognée en haut sur la première rangée et laisserait une
  bande grise dessous. Montée de 3 px gardée pour les cartes détachées (`.partner-card`, `.pricing-card`). Pour la
  remettre partout : ajouter `transform: translateY(-3px)` à la règle `.benefit:hover, …`.
- `.pricing-card.featured` garde sa bordure accent pleine au survol (sinon elle pâlissait à 40 %).
- **`scroll-padding-top` non ajouté** : `section[id] { scroll-margin-top: 72px; }` existe déjà (ligne ~74) ; les deux
  s'additionnent, l'ancre se serait arrêtée 144 px trop bas. `scroll-behavior: smooth` existait déjà dans `globals.css`,
  redéclaré dans `vsw.css` pour ne pas dépendre de l'ancien design.
- Nav compacte : hauteur de `.nav-inner` 72 → 60 px ; `margin-bottom: 12px` sur `.nav.scrolled` compense, pour que le
  contenu sous la nav (collante, donc dans le flux) ne saute pas de 12 px au passage du seuil. Ombre : jeton `--shadow-nav`.
- Nouveaux jetons (fin de `vsw.css`, variantes sombres) : `--vsw-ease`, `--accent-40`, `--shine`, `--shadow-nav`.
- Déplacements de la cascade, du hero et de la FAQ via la propriété `translate` (pas `transform`) : ne combat pas les
  `transform` des survols. Remplissage `backwards` : les enfants ne sont cachés que pendant leur délai, après le passage
  du parent en `.in` ; aucune règle nouvelle ne cache quoi que ce soit avant.
- Cascade : délai `(rang − 1) × 70 ms`, plafonné au 8ᵉ (490 ms) ; avant/après et comparatif : pas de classe propre, couverts
  par `.reveal.in .compare-col > *` (les lignes de chaque colonne).
- Flèche des boutons : visée par `svg:has(> path[d^="M5 12h14"])` (tracé de l'icône `arrow`), car l'icône « check » est
  elle aussi le seul élément enfant du bouton ; navigateur sans `:has()` : pas de glissement, rien d'autre.
- FAQ : hauteur animée par `::details-content` + `interpolate-size` (Chrome/Edge récents), sous `@supports` ; ailleurs,
  fondu + 4 px du `.faq-body` à l'ouverture.
- `prefers-reduced-motion` : règle universelle (`*`, `::before`, `::after`) — elle neutralise aussi des animations
  **antérieures** au round : le bandeau défilant s'arrête, l'apparition `.reveal` et la bulle du chatbot deviennent
  instantanées (comportement voulu pour l'accessibilité, plus large que les seuls ajouts).

### Constat préexistant (non corrigé, hors périmètre)

- `.reveal { opacity: 0 }` n'a **aucun repli sans JavaScript** : si `RevealInit` ne s'exécute pas (JS bloqué, erreur
  d'hydratation), les sections marquées `.reveal` restent invisibles. Toutes les pages actuelles montent `RevealInit`.
  À ouvrir en issue (`bug`) par l'agent principal.

### Vérifications (round 5, 2026-10-17)

- Accolades de `vsw.css` : 407 `{` / 407 `}`.
- `grep -n "prefers-reduced-motion" src/app/vsw.css` : ligne 2044 (règle partenaires préexistante) et ligne ~2202
  (règle globale, dernière du fichier).
- `npm run typecheck` : 0 erreur. `npm run lint` : 0 erreur, 10 avertissements (préexistants, même nombre qu'au round 3).
- `npx next build` : build terminé, toutes les pages statiques générées ; CSS compilé contrôlé (`vsw-rise`, `@supports`
  de `::details-content`, sélecteur `:has()`, règle `prefers-reduced-motion` présents).
- `node scripts/check-rules.mjs` : aucune violation. `node scripts/check-secrets-suivis.mjs` : aucun fichier sensible.
- Non vérifié : rendu réel dans le navigateur — **à tester par Camille** (voir le rapport de l'agent).

### Complément de l'agent principal (round 5, après le `qa-agent`)

- Bloquant corrigé : `:is(` → `:where(` sur la règle d'entrée du hero (la spécificité de `:is(.eyebrow…)` écrasait le délai de 80 ms du `h1`) ; les 5 délais s'appliquent maintenant.
- `data-scroll-behavior="smooth"` ajouté sur `<html>` (`layout.tsx`) : Next 16 coupe ainsi le défilement doux lors d'un changement de page (sinon remontée animée à chaque navigation + avertissement en dev).
- `.pricing-card.featured:hover` garde sa lueur accent.
- Décision : les transitions `height` / `margin-bottom` de la nav compacte sont **gardées** (une seule transition de 240 ms au passage du seuil, compensation exacte, aucun saut mesuré dans le navigateur).
- Correction des notes : `.ai-pillars` n'a ni `overflow: hidden` ni bordure ; le choix « sans montée » sur les tuiles collées reste valable pour `.benefit`, `.service`, `.process-step`.
- Vérifié dans le navigateur par l'agent principal (Playwright) : séquence du hero, cascade des métiers, nav 72 → 61 px avec ombre, survol +3 px, bandeau en pause, FAQ, mouvement réduit (tout visible, immobile), thème sombre.
- Bug préexistant ouvert en issue : UneVieQuiNousAppartient/VieSolution---WEB#2 (sections invisibles sans JavaScript).

## Round 6 — Je suis… (ux-agent, 2026-10-17, `PRD-JE-SUIS.md`)

### Fichiers
- Créé : `docs/projets/pme-accessible/PRD-JE-SUIS.md`.
- `src/components/vsw/icon.tsx` : 8 icônes ajoutées au type `IconName` et au `switch` (`briefcase-chart`, `house-key`,
  `tooth`, `heart-pulse`, `calculator`, `hammer`, `house-sign`, `storefront`) ; même `common` (24×24, `stroke-width` 1.6,
  `fill="none"`), 1 à 4 tracés chacune.
- `src/components/vsw/metiers-section.tsx` : champ `slug` ajouté, `METIERS` et `Metier` exportés (source unique pour le
  hero), icônes remplacées par celles du métier, carte `benefit metier-card` avec `id={`metier-${slug}`}` ;
  « Pour vos clients », « Le temps retrouvé », étiquettes et note passent dans `<details className="metier-plus">`.
  **Aucun texte modifié** (seul l'ordre d'affichage dans la carte change).
- `src/components/vsw/hero.tsx` : bloc `.hero-metiers` entre `.hero-ctas` et `.hero-meta` (8 pastilles tirées de
  `METIERS` + « Autre métier » → `#metiers`).
- `src/app/vsw.css` : liste `:where(…)` du round 5 complétée par `.hero-metiers` (320 ms) et `.hero-meta` décalé à 400 ms ;
  nouveau bloc `/* pme-accessible — je suis */` juste avant la règle `prefers-reduced-motion` finale.

### Décisions et écarts
- **Ancres natives `<a href="#metier-…">` au lieu de `<Link>`** : vérifié dans `node_modules/next/dist/client/app-dir/link.js`
  (Next 16.1.6) — `Link` fait `preventDefault()` puis `history.pushState`, qui **ne met pas à jour `:target`** ; la mise
  en évidence de la carte n'aurait jamais eu lieu après un clic. Le hero n'est monté que sur `/` (`src/app/page.tsx`),
  donc `#metier-…` équivaut à `/#metier-…`. Le retour arrière reste géré (`onPopState` de Next ignore une entrée sans état).
- `grep -c 'id="metier-' metiers-section.tsx` renvoie **1** (le commentaire du type) : les ids sont générés par
  `id={`metier-${m.slug}`}` à partir des 8 `slug`. Vérification équivalente faite sur le HTML compilé
  (`.next/server/app/index.html`) : 8 `id="metier-…"` distincts.
- Cascade vs carte ciblée : `reveal-init.tsx` passe le `.reveal` en `.in` à la première intersection (seuil 0,12) ; le
  rappel initial de l'`IntersectionObserver` part dès l'observation, donc à l'arrivée par ancre (chargement ou clic) la
  grille est révélée. De plus, la règle `.metiers-grid > .metier-card:target` (même spécificité 0,3,0 que la cascade,
  placée après) **remplace** l'animation de cascade par `vsw-target-pulse` : la carte ciblée n'attend aucun délai.
  `opacity: 1` ajouté par sûreté.
- Pulsation : 1 s, 2 pulsations de `--shadow-glow`, délai 350 ms (pour qu'elle se voie après le défilement doux) ;
  bordure par `outline` 1 px accent (indépendante de l'ombre animée). Mouvement réduit : outline seule.
- `scroll-margin-top: 96px` sur `.metiers-grid .metier-card` (les cartes sont des `div`, la règle `section[id]` ne s'y
  applique pas).
- Hauteur homogène : `margin-top: auto` sur `.metier-plus` (le résumé s'aligne en bas de chaque carte d'une rangée).
  Une carte ouverte agrandit sa rangée ; les autres cartes de la rangée s'étirent (fond continu de la mosaïque).
- Téléphone (≤ 560 px) : la carte passe en grille 2 colonnes (icône 36 px à côté du titre), padding 22/20 px.
- Sélecteur sur téléphone (≤ 640 px) : rangée `nowrap` qui défile, `scroll-snap-type: x mandatory`, barre masquée,
  bord droit en fondu par `mask-image` (masque en alpha : indépendant du thème), débord jusqu'aux bords de l'écran
  (`margin-inline: -20px`).
- Le minifieur fusionne mon petit bloc `prefers-reduced-motion` avec la règle globale (adjacents) ; l'ordre est
  conservé, la règle globale reste en dernier dans le CSS compilé.

### Vérifications (round 6)
- Accolades de `vsw.css` : 444 `{` / 444 `}`.
- `grep -n "prefers-reduced-motion" src/app/vsw.css` : 2044 (partenaires), 2328 (bloc je suis), 2334 (globale, dernière du fichier).
- `npm run typecheck` : 0 erreur. `npm run lint` : 0 erreur, 10 avertissements (préexistants, inchangés).
- `npx next build` : terminé, pages statiques générées ; CSS compilé contrôlé (`vsw-target-pulse`, `.hero-metiers`
  dans la séquence, délais 320/400 ms).
- `node scripts/check-rules.mjs` : aucune violation. `node scripts/check-secrets-suivis.mjs` : aucun fichier sensible.
- Non vérifié : rendu dans le navigateur — **à tester** (agent principal / Camille).

### Complément de l'agent principal (round 6, après captures et `qa-agent`)

- **Ancre des cartes** : `scroll-margin-top` sur les cartes était ignoré par Chrome lors d'un clic sur une pastille (carte sous la nav, mesuré à −20 px) ; remplacé par `html { scroll-padding-top: 96px }` (la règle `section[id] { scroll-margin-top }` est retirée, même décalage pour toutes les ancres). Mesures après : carte 76 px, sections 96 px, depuis une autre page 96 px.
- **Téléphone** : le défilement horizontal des pastilles en cachait 7 sur 9 → retour à la ligne (2 par rangée, compactes). Le sélecteur descend à ≈ 1 150 px (2ᵉ écran) ; à raccourcir dans le lot « finition premium » (hero mobile).
- **QA** : bloquant corrigé (`min-height: 40px` sur les pastilles, mesuré 40 px) ; pulsation déplacée sur `::after` (plus de relance de la cascade quand on passe d'une carte à l'autre : opacité de la carte A = 1 pendant le changement) ; délai 500 ms / durée 1,6 s ; critère 1 du PRD réécrit.
- Captures : `js2-telephone-selecteur.png`, `js2-cible.png`, `js-ordinateur-hero.png`.

## Round 7 — Finition premium (ux-agent, Opus, 2026-10-17, `PRD-PREMIUM.md`, cahier `AUDIT-PREMIUM.md`)

Progression consignée groupe par groupe (reprise possible en cas de coupure).

### Groupe 1 — Jetons et fond : FAIT
- `:root` : jetons §5 ajoutés (`--fs-*`, `--measure`, `--section-y`, `--head-gap`, `--grid-gap`, `--surface`, `--bg-band`,
  `--shadow-xs/sm`, `--accent-hover`, `--btn-h(-lg)`, `--field-h`) ; rayons ramenés à 8 / 12 / 16 px (`--radius-xl` 28 px inchangé).
- Fond blanc cassé chaud : `--bg-0: oklch(0.985 0.005 85)` ; `--bg-1/2/3`, `--line`, `--line-soft` sur la teinte 85, mêmes luminosités
  (chroma réduite à 0,008-0,014 pour éviter le jaune).
- `html[data-theme="dark"]` : `--surface` et `--bg-band` = `var(--bg-1)`, ombres plus marquées, `--accent-hover` éclairci (mélange avec blanc).
- Couleurs en dur hors bloc de jetons : 11 cyan + 3 violet convertis par script en `color-mix(in oklch, var(--accent|--accent-2) X%, transparent)`
  (les 9 de l'audit + halo du hero + bulle utilisateur du clavardage).

### Groupe 2 — Typographie et rythme : FAIT
- `.section` : `padding-block: var(--section-y)`, filet supprimé ; `.section--band` (fond `--bg-band`) sur « Avant / après », « Processus », « FAQ ».
  Règle mobile `.section { padding: 80px 0 }` retirée (le `clamp` donne 72 px).
- Vide avant les partenaires : la section « Témoignages » qui suit renvoie `null` (aucun témoignage publié) ; le vide venait de deux
  marges de 120 px empilées. Correctif : `#partenaires.section { padding-top: clamp(48px, 6vw, 72px) }`.
- `.section-head` empilé (flex colonne, gap 20 px, paragraphe 18 px / 60ch) ; `.section-head--split` (2 colonnes) posé sur `services.tsx`
  et `benefits-section.tsx` seulement ; la règle ≤ 1024 px vise maintenant `--split`.
- Titres : h1 du hero `--fs-h1`/lh 1 ; h2 (`.section-head`, `.ai-top`, `.about-content`) `--fs-h2`, lh 1.08, ls -0.025em, `text-wrap: balance`,
  18ch ; titres de cartes (`.service h3`, `.benefit h4`, `.ai-pillar h4`, `.process-step h4`) `--fs-h3`, lh 1.25.
- Texte des cartes : 15 px (`--fs-card`) en `--fg-1` (services, bénéfices, piliers, processus, forfaits, comparatif, témoignages) ;
  notes métiers 13 px `--fg-2`.
- Mono retirée (Inter 13-14 px, 500, sans capitales forcées) : étiquettes de champs, pastilles (`.service-tag`, `.zoho-app`, `.pricing-badge`),
  étiquettes métiers, descriptions partenaires, légendes du hero, titres et bas du pied de page (13 px), notes (`.compare-note`, `.pricing-note`),
  `.ai-pillar li`, `.ai-pillar-link`, `.contact-item .txt`, `.about-stat span`, légendes des témoignages, `.booking-meta`.
  Mono conservée : surtitres `// …`, numéros (`.service-num`, `.step-num`, `.ai-pillar-num`), calendrier de `/rdv`, bandeau défilant, `.logo small`.

### Groupe 3 — Cartes et grilles : FAIT
- `.services-grid`, `.benefits-grid` (donc `.metiers-grid`), `.process-grid` (donc les 3 étapes de `/devis`, `cols-3`) : `gap: var(--grid-gap)`,
  sans fond ni bordure ni `overflow: hidden`. Cartes `.service`, `.benefit`, `.process-step` : `--surface`, bordure `--line-soft`, rayon 16 px,
  `--shadow-xs`. Survol (bloc round 5 modifié sur place) : montée 3 px, bordure `--accent-40`, `--shadow-sm` ; fond de survol `--bg-2` retiré.
  `.ai-pillar` (mosaïque dans `.ai-wrap`) garde son survol sans montée. Règle globale de mouvement réduit : `transform: none` étendu aux 3 cartes.
- Forfaits, témoignages, colonnes du comparatif : fond `--surface` + `--shadow-xs`.
- Métiers : 1 colonne, 2 à ≥ 700 px, 3 à ≥ 1100 px (anciennes règles 4 col / ≤ 900 / ≤ 560 retirées) ; `.metier-titres` a un `min-height`
  (titre + ligne de précision) pour aligner « Ce qui vous gruge » ; remis à 0 sous 560 px. Icônes : déjà une par métier, rien changé.
- « C'est pour vous si… » (`pour-vous-section.tsx`) : carré `.benefit-icon` remplacé par `.pv-check` (coche 18 px en ligne, `--accent`, `aria-hidden`) ;
  carte en rangée (`.benefit.pv-card`). Texte inchangé.
- Halos retirés en clair : `.btn-primary:hover` = fond/bordure `--accent-hover` ; `.logo-mark` et son point sans lueur, dégradé du logo
  `--accent-hover → --accent` (plus de violet) ; carte en vedette et colonne « nous » = bordure accent seule ; point des piliers sans lueur ;
  bulle de clavardage en `--shadow-sm`. Halos rétablis sous `html[data-theme="dark"]` (bouton, logo, carte en vedette, bulle).
- Violet : seulement dans le h1 du hero (`.highlight`) et `#demarrer .ai-top h2 .glow` (« On commence petit »). `.glow` de `/ia` et `/zoho`
  = `--accent` plein ; fonds de `.ai-wrap`/`.zoho-wrap` et halo du hero en `--accent` ; surcharges violettes de `.zoho-wrap` supprimées ;
  avatar du clavardage `--accent → --accent-hover`.

### Groupe 4 — Nav et menu mobile : FAIT
- `.nav` : `color-mix(in oklch, var(--bg-0) 94%, transparent)` (sombre : 90 %), flou de 20 px conservé.
- `nav.tsx` : `NAV_LINKS` (8 liens) et le type `NavLinkItem` exportés ; la barre fait un `map` dessus ; `<NavMenu links={NAV_LINKS} />` ajouté
  après le bouton RDV (qui reçoit la classe `nav-cta`). Pas d'import circulaire : `nav-menu.tsx` n'importe que le type.
- Nouveau `src/components/vsw/nav-menu.tsx` (client) : bouton 44 × 44 (`aria-label="Menu"`, `aria-expanded`, `aria-controls`), icône 3 traits → croix
  (CSS, 220 ms) ; panneau `hidden` quand fermé, sous la nav (`position: absolute; top: 100%; height: calc(100dvh - 100%)`, la nav étant
  le bloc conteneur à cause de `backdrop-filter`) ; 8 liens 20 px / 56 px + « Prendre un RDV » pleine largeur ; fermeture par le bouton,
  Échap, clic sur un lien, ou passage au-delà de 640 px ; `body { overflow: hidden }` pendant l'ouverture (valeur précédente rétablie) ;
  focus rendu au bouton à la fermeture. Entrée 220 ms (`vsw-menu-in`), coupée sous `prefers-reduced-motion`.
- **Écart** : à ≤ 640 px, le bouton « Prendre un RDV » de la barre est masqué (logo + bouton + menu dépassaient 350 px de largeur utile) ;
  il reste en bas du panneau du menu et dans le hero.

### Groupe 5 — Formulaires, forfaits, FAQ, partenaires, mobile : FAIT
- Boutons : `min-height: var(--btn-h)` (44 px), `.btn-lg` `var(--btn-h-lg)` (52 px) ; police des boutons inchangée (14/15 px, 500) pour ne pas
  élargir la nav entre 1024 et 1280 px (**écart** mineur avec « Inter 15 px / 600 » de §5).
- Champs `.form-field` (devis, contact, stagiaires) : `--surface`, 48 px, 16 px ; `select` sans flèche native + chevron SVG (data URI, `%23667`) ;
  `[aria-invalid="true"]` : bordure `--danger` + fond `color-mix(--danger 4 %, --surface)` ; message d'erreur 13 px.
- `/devis` : `situation-form.tsx` enveloppe le formulaire dans `.situation-layout` (7fr / 5fr, empilé ≤ 1024 px) avec une colonne `<aside>`
  qui reprend `ETAPES` (exporté de `comment-prix-section.tsx`) : « Étape 0X », titre, phrase — textes identiques, aucune ligne nouvelle.
  `comment-prix-section.tsx` : tailles en ligne 19/20 px → `var(--fs-h3)`.
- Forfaits : « Sur mesure » 28 px ; `.period` en bloc, Inter 14 px `--fg-2`.
- FAQ : liste sans boîtes (filet haut de liste + `border-bottom` par question), questions 18 px, chevron SVG 16 px en `mask` (couleur `--accent`,
  rotation 180° à l'ouverture), réponses 16 px `--fg-1` limitées à `--measure`, `max-width: 760px` ; `focus-visible` ajouté.
- Partenaires : grille `minmax(220px, 1fr)` sur toute la largeur, cartes `--surface` ; logos 40 px, `grayscale(1)` + opacité .75, couleur au survol
  et au focus (bloc round 5 modifié sur place) ; descriptions Inter 13 px.
- Téléphone (≤ 640 px) : hero 40/56 px, surtitre centré sans tiret, lede 17 px, boutons du hero pleine largeur empilés, `hero-meta` en 2 colonnes
  (chiffres 22 px), bulle de clavardage à `bottom: 88px` (panneau à 156 px).

### Vérifications (round 7)
- Accolades de `vsw.css` : 502 `{` / 502 `}`.
- `grep -nE "oklch\(0\.85 0\.18 200|oklch\(0\.72 0\.22 305" src/app/vsw.css` : seulement les lignes 75-83 (bloc de jetons `html[data-theme="dark"]`).
- `grep -n "prefers-reduced-motion" src/app/vsw.css` : 2112 (partenaires), 2409 (je suis), 2486 (menu mobile), 2537 (globale, dernière du fichier) ;
  CSS compilé : la règle globale ferme bien le fichier.
- `npm run typecheck` : 0 erreur. `npm run lint` : 0 erreur, 10 avertissements (préexistants ; aucun dans les fichiers touchés hors `react-hooks/refs`
  déjà présent sur `handleSubmit`).
- `npx next build` : terminé, toutes les pages générées. `check-rules` : aucune violation. `check-secrets-suivis` : aucun fichier sensible.
- Non vérifié : rendu dans le navigateur — **à tester** (agent principal / Camille).

### Complément de l'agent principal (round 7, après captures et `qa-agent`)

- `.ai-pillars` (volets IA / Zoho / Démarrer) : passé en cartes détachées comme les autres grilles (critère 6 — l'`ux-agent` l'avait laissé en mosaïque sans le déclarer) ; survol aligné.
- Libellé `// Je suis…` en `--fg-2` (contraste AA) ; ombre du panneau de clavardage en `--shadow-sm` (couleur en dur retirée).
- `/devis` : les 3 étapes s'affichaient deux fois (section « Comment on établit un prix » + colonne à côté du formulaire). Décision : la section garde l'en-tête, « Ce qui fait varier le prix » et la phrase de conclusion ; les 3 étapes ne restent que dans la colonne du formulaire, là où elles rassurent au moment d'écrire.
- Correction des notes : l'avertissement `react-hooks/refs` restant est dans `contact.tsx` (fichier non touché), pas dans un fichier du lot.
- Vérifié dans le navigateur (Playwright, voir `pr-*.png`) : sections 112 px à 1280, grilles 20 px, cartes blanches r16, métiers 3 colonnes, champs 48 px / 16 px avec cadre rouge, bouton menu 44×44, panneau 9 liens × 56 px, Échap → focus sur le bouton, bulle à 88 px, sélecteur « Je suis… » à 655 px sur téléphone (< 900), aucune erreur de page.

## Round 8 — lot design 21st.dev (2026-10-21, agent principal)

### Ce que le plugin 21st.dev permet vraiment (à retenir pour les autres projets)
- Palier gratuit : recherche du catalogue illimitée (noms, descriptions, **aperçus PNG**), **2 téléchargements de code par jour**, génération IA désactivée.
- Les composants sont en React + Tailwind + shadcn/ui. Le site n'utilise ni Tailwind pour ses composants ni shadcn : on n'installe rien tel quel, on **reprend la structure** et on **porte les styles sur les jetons de `vsw.css`**. Les aperçus suffisent souvent ; le code téléchargé a servi pour les détails (bascule mobile, bandeau de conclusion, grille à 1 px de « gap » qui fait office de filet).
- Méthode : `search` (plusieurs requêtes courtes) → télécharger les aperçus (`curl`) et les regarder → choisir **un** composant pour le téléchargement du jour → adapter.

### Décisions de design
- **Avant / après** : grille unique `grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line-soft)` — le gap devient le filet, et chaque paire de cellules est dans la même rangée (hauteurs égales). Pas de texte barré (lisibilité pour la clientèle) : marque « — » grise à gauche, coche accent à droite, colonne « après » teintée à 4 % d'accent. Bandeau de conclusion **qualitatif** (aucun chiffre inventé) + bouton vers `#metiers`.
- **Bascule mobile** : rendue seulement après hydratation (`useSyncExternalStore(subscribeNoop, () => true, () => false)` — aucun `setState` dans un effet, aucun avertissement ESLint). Sans JavaScript, `order` regroupe avant puis après (vérifié avec `javaScriptEnabled: false`).
- **Processus** : `::before` de chaque `.process-step` dessine le segment de ligne (débordant de `--grid-gap / 2` de chaque côté pour franchir l'espace entre cartes) ; premier / dernier de rangée coupés à 50 % ; en 1 colonne, segment vertical derrière la carte (`.step-body { position: relative; z-index: 1 }`). `flex: 1` sur `.step-body` pour des cartes de même hauteur.
- **CTA** : `h2` dans la carte (une seule par page ; la section n'a pas d'autre titre). Voile `radial-gradient` en `color-mix` sur `--accent` et `--accent-2`, donc correct en sombre sans règle dédiée.
- **Hero** : deux ellipses au lieu d'un halo centré, `left: 0; right: 0` (plus de largeur fixe de 900 px).

### Vérifications (round 8)
- Script `lot21.cjs` : rangées `[top, top, h, h]` identiques par paire ; bascule `none` à 1280 / `inline-flex` à 390 ; boutons 81×40, 82×40 ; sans JS : 10 cellules, ordre `AAAAAABBBBBB` ; `scrollWidth <= clientWidth` à 390 ; 4 pastilles 40×40 ; aucune `pageerror`.
- `npm run verify` vert. Captures : `l21-hero`, `l21-avantapres`, `l21-processus`, `l21-cta`, `l21-tab-*`, `l21-mob-*`, `l21-dark-*`.
