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
