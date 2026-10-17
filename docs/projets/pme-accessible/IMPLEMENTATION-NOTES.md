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
