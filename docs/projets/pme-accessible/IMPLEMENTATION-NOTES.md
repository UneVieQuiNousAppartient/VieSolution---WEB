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
