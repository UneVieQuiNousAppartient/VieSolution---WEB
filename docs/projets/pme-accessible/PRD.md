# PRD — Site plus accessible aux PME et travailleurs autonomes

**Date :** 2026-10-17 · **Auteur :** agent `product-manager` · **Source :** `BRIEF.md` (validé par Camille) · **Suivant :** `ux-agent`

> Les textes entre guillemets ou en listes sont **prêts à coller**. `ux-agent` les implémente tels quels.
> `[à confirmer]` = information que seule Camille peut fournir. Ne rien inventer à la place.

## 1. Problème

Le site parle surtout de nous (« quatre expertises », « écosystème Zoho »). Un travailleur autonome ou une petite entreprise ne lit nulle part « c'est pour moi ». Il n'y a pas de premier pas simple : on passe de l'accueil à « Prendre un RDV » ou à un calculateur qui démarre à 1 800 $. Certains mots restent techniques (workflows, API, intégrations inter-apps). La FAQ ne répond pas aux vraies peurs.

## 2. Publics (personas)

| Persona | Qui | Irritants du quotidien |
|---|---|---|
| **Julie, travailleuse autonome** | Seule dans son entreprise (ex. : esthéticienne, consultante, comptable). | Fait ses factures le soir. Répond aux mêmes questions par courriel. Oublie de relancer des clients. « La techno va trop vite, je ne sais pas par où commencer. » |
| **Marc, très petite entreprise (2 à 5 personnes)** | Entrepreneur en construction, traiteur, agence. | Soumissions faites à la main. Clients notés dans un cahier, un fichier Excel et le téléphone. Personne n'a le temps d'apprendre un nouveau logiciel. |
| **Sophie, responsable admin d'une PME (5 à 50 personnes)** | Gère la facturation, le suivi client et les rapports. | Données éparpillées dans plusieurs outils. Copier-coller entre logiciels. Rapports refaits chaque mois. Veut centraliser, mais craint un gros projet long et cher. |

Public secondaire : relève et stagiaires (section `InternsSection` existante, à ne pas casser).

## 3. Objectifs mesurables

1. Le visiteur se reconnaît **en moins de 10 secondes** : la section « C'est pour vous si… » est visible juste sous le hero de l'accueil.
2. Il comprend que c'est **accessible** et que ça **fait gagner du temps** : 5 exemples avant/après, aucun chiffre inventé.
3. Il voit un **premier pas simple** : volet « Démarrer simplement » sur `/`, `/ia`, `/zoho`, option « Je débute » dans `/devis`.
4. **Zéro mot technique non expliqué** dans les textes visibles des fichiers listés en 4.6.
5. La FAQ répond à **5 objections** réelles.

Mesure après mise en ligne (hypothèse, à décider par Camille) : nombre de demandes « Je débute » dans le calculateur et de clics sur « Démarrer simplement ».

## 4. Fonctionnalités — DOIT

### 4.1 Hero et lede de l'accueil (`hero.tsx`)

On garde le titre (promesse de marque). On change l'eyebrow, le lede, le 2e bouton et le défilant.

- **Eyebrow :** `// Pour les travailleurs autonomes et les PME du Québec`
- **Titre (inchangé) :** « Une vie qui / nous appartient. »
- **Lede :** « Moins de paperasse, plus de temps pour votre vrai métier. On met en place des outils simples — l'IA, Zoho, des tâches qui se font toutes seules — et on vous montre comment vous en servir. Pas besoin d'être techno. »
- **Bouton 1 (inchangé) :** « Prendre un RDV » → `/rdv`
- **Bouton 2 :** « Par où commencer ? » → `#demarrer` (ancre de la section 4.4 sur l'accueil)
- **hero-meta :** inchangé (les mentions existantes « 24h », « 100% » restent ; à confirmer par Camille comme avant).
- **Défilant (MARQUEE_ITEMS) :** `Moins de paperasse` · `Factures automatiques` · `Relances sans oubli` · `Assistant IA` · `Zoho CRM` · `Zoho Books` · `Formation simple` · `Service en français` · `Premier pas accompagné`

**Critères d'acceptation**
- Le lede contient « Pas besoin d'être techno ».
- Le 2e bouton pointe vers `#demarrer` et la section existe sur `/`.
- Le défilant ne contient plus « Intégrations » ni « Audit de processus ».

### 4.2 Section « C'est pour vous si… » (accueil, nouveau composant `pour-vous-section.tsx`)

Classes : `section`, `section-head`, `eyebrow`, `desc`, `reveal`, `benefits-grid` / `benefit` (icône `check`).

- **Eyebrow :** `// C'est pour vous si…`
- **Titre h2 :** « Vous vous reconnaissez ? / On est là pour vous. »
- **desc :** « Vous êtes seul dans votre entreprise ou vous avez une petite équipe. Vous êtes bon dans votre métier, mais l'administration vous gruge. On commence là. »
- **Situations (6) :**
  1. « Vous faites vos factures le soir ou la fin de semaine. »
  2. « Vous répondez aux mêmes questions par courriel, encore et encore. »
  3. « Vos clients sont notés un peu partout : un cahier, un fichier Excel, votre téléphone. »
  4. « Vous oubliez parfois de relancer une soumission ou un paiement. »
  5. « Vous entendez parler de l'IA, mais vous ne savez pas par où commencer. »
  6. « Vous voulez un logiciel de gestion, mais vous avez peur d'un gros projet compliqué. »
- **Phrase de fin (sous la grille) :** « Une seule de ces phrases vous ressemble ? Un appel de 30 minutes suffit pour voir par où commencer. » + bouton `btn btn-primary` « Prendre un RDV gratuit » → `/rdv`

**Critères d'acceptation**
- Placée juste après le Hero sur `/`.
- 6 situations, chacune une phrase de moins de 15 mots, en « vous ».
- Aucun mot technique.

### 4.3 Section « Avant / après » (accueil, nouveau composant `avant-apres-section.tsx`)

Classes : structure `compare-wrap` / `compare-col` / `compare-head` / `compare-cell` (colonne « Avant » = `others`, « Après » = `us`).

- **Eyebrow :** `// Avant / après`
- **Titre h2 :** « Ce qui change / dans votre semaine. »
- **desc :** « Des exemples concrets de tâches qu'on simplifie. Chaque situation est différente : on regarde la vôtre ensemble. »
- **Lignes (Avant → Après) :**
  1. « Vous tapez chaque facture à la main. » → « La facture part toute seule à la fin du travail. Vous la vérifiez d'un clic. »
  2. « Vous cherchez le numéro d'un client dans trois endroits. » → « Tous vos clients sont au même endroit, dans un carnet de clients en ligne (Zoho CRM). »
  3. « Vous oubliez de relancer une soumission. » → « Un rappel vous avertit, ou un courriel de relance est préparé pour vous. »
  4. « Vous répondez dix fois à la même question. » → « Un assistant IA prépare la réponse. Vous la relisez et l'envoyez. »
  5. « Vous refaites le même rapport chaque mois. » → « Vos chiffres se mettent à jour seuls, sur un seul écran. »
- **Note sous le tableau (petit texte) :** « Exemples illustratifs. Le temps gagné dépend de votre situation : on l'estime avec vous lors de l'appel découverte. »

**Critères d'acceptation**
- Aucun chiffre de temps ou d'argent (« dix fois » est une image, pas une mesure ; `ux-agent` peut le remplacer par « souvent » si Camille préfère).
- La note « Exemples illustratifs » est visible.
- Fonctionne sur mobile comme `ComparisonSection` (même structure).

### 4.4 Volet « Démarrer simplement » (nouveau composant `demarrer-section.tsx`, réutilisé sur `/`, `/ia`, `/zoho`)

Un composant avec une prop `variant: 'accueil' | 'ia' | 'zoho'`. Ancre `id="demarrer"`. Classes : `section`, `ai-wrap`, `ai-top`, `ai-pillars` / `ai-pillar`, `ai-banner`, `btn btn-primary btn-lg`. **Aucun prix** : la mention est « Sur mesure — on en discute à l'appel découverte ».

**Textes communs**
- **Eyebrow :** `// Démarrer simplement`
- **Titre h2 :** « Pas besoin de tout changer. / On commence petit. »
- **Paragraphe :** « Vous n'avez pas à tout comprendre ni à tout faire d'un coup. On choisit avec vous une seule chose qui vous fera gagner du temps, on la met en place, et on vous montre comment l'utiliser. Le reste viendra quand vous serez prêt. »
- **Bannière :** « Un premier pas, *à votre rythme*. Sur mesure — on en discute à l'appel découverte gratuit. » + bouton « Parler de mon premier pas » → `/rdv`

**Variante `accueil` (3 cartes)**
1. **« Configuration IA de base »** — « On installe un assistant IA (comme ChatGPT ou Claude) et on le règle pour votre entreprise : courriels, soumissions, textes. » Items : « Installation et réglages avec vous » · « Exemples adaptés à votre métier » · « Bonnes pratiques et limites ». Lien « En savoir plus » → `/ia#demarrer`
2. **« Mise en place d'un logiciel de gestion (Zoho) »** — « On installe Zoho pour vos clients et vos factures. Un seul endroit, au lieu de cinq. » Items : « Carnet de clients (CRM) » · « Facturation (Books) » · « Transfert de vos données existantes ». Lien → `/zoho#demarrer`
3. **« Formation courte »** — « Une formation pratique, avec vos vrais dossiers, pour être à l'aise seul ensuite. » Items : « En français, sans jargon » · « Pour vous ou votre équipe » · « Durée : `[à confirmer]` ». Lien → `/ia#formation`

**Variante `ia` (3 cartes)** — placée **avant** `AISection` sur `/ia`.
1. « Votre assistant IA, bien réglé » — « On choisit l'outil avec vous et on le configure pour votre façon de travailler. » Items : « Choix de l'outil » · « Réglages pour votre entreprise » · « Premiers usages guidés »
2. « Vos trois premières tâches simplifiées » — « On repère trois tâches qui reviennent souvent : courriels, soumissions, résumés. On les simplifie avec l'IA. » Items : « Courriels types » · « Soumissions plus rapides » · « Résumés de documents »
3. « Une formation pour être autonome » — « On vous apprend à vous en servir seul, sans dépendre de nous. » Items : « Atelier pratique » · « Aide-mémoire » · « Suivi après la formation »

**Variante `zoho` (3 cartes)** — placée **avant** `ZohoSection` sur `/zoho`.
1. « Votre carnet de clients (Zoho CRM) » — « Tous vos clients, vos soumissions et vos suivis au même endroit. » Items : « Configuration de base » · « Import de votre liste de clients » · « Rappels de suivi »
2. « Votre facturation (Zoho Books) » — « Des factures propres, envoyées plus vite, et un œil clair sur qui vous doit quoi. » Items : « Modèles de factures à votre image » · « Taxes du Québec configurées » · « Rappels de paiement »
3. « Une formation courte pour bien partir » — « On vous montre l'essentiel, avec vos vrais clients. Vous repartez à l'aise. » Items : « Formation pratique » · « Pour vous ou votre équipe » · « Soutien après le démarrage »

**Critères d'acceptation**
- `/`, `/ia` et `/zoho` affichent le volet avec `id="demarrer"` ; `/ia#demarrer` et `/zoho#demarrer` défilent jusqu'à lui.
- Aucun montant en $ dans le composant.
- La durée de formation est affichée `[à confirmer]` tant que Camille ne l'a pas donnée.
- « Taxes du Québec configurées » : à valider par Camille (réalisable dans Books) — sinon retirer.

### 4.5 FAQ enrichie (`faq-section.tsx`)

**Ajouter en tête de liste** ces 5 questions (les 5 existantes restent après, avec la correction de jargon de 4.6). Changer aussi le titre h2 : « Vos questions, / nos réponses franches. »

1. **« Je ne suis pas techno. Est-ce que c'est pour moi ? »**
   « Oui. C'est justement pour vous. On s'occupe de la partie technique, et on vous explique le reste en mots simples. Si vous savez envoyer un courriel, vous êtes capable. On avance à votre rythme, et on reste là si vous bloquez. »
2. **« L'IA et Zoho, ce n'est pas pour les grosses compagnies ? »**
   « Non. Ces outils sont aujourd'hui abordables et pensés aussi pour les petites entreprises et les travailleurs autonomes. Une petite équipe a même souvent plus à gagner : chaque heure sauvée compte. On adapte tout à votre taille. »
3. **« Ça doit coûter une fortune ? »**
   « Pas nécessairement. On peut commencer par un premier pas simple, sur mesure, et en discuter à l'appel découverte gratuit. Le calculateur de la page Devis vous donne aussi une fourchette indicative pour les projets plus grands. Pas de frais cachés : le prix est confirmé avant de commencer. »
4. **« Combien de temps ça va me demander ? »**
   « Au départ, un appel de 30 minutes. Ensuite, on fait le gros du travail. On vous demande surtout de nous montrer comment vous travaillez et de participer à la formation. Le temps exact dépend du projet : on vous le dit clairement avant de commencer. » *(Durée de formation : `[à confirmer]`.)*
5. **« Et si je veux juste commencer petit ? »**
   « C'est souvent la meilleure idée. On choisit une seule chose — votre facturation, vos courriels, votre liste de clients — et on la règle. Vous voyez la différence, puis vous décidez de la suite. Aucune obligation d'aller plus loin. »

**Critères d'acceptation**
- 10 questions au total, les 5 nouvelles en premier.
- Aucune durée ou prix nouveau (les durées déjà présentes dans la FAQ existante « 2 à 4 semaines », « 6 à 9 semaines » restent telles quelles, à confirmer par Camille comme le reste).

### 4.6 Audit du jargon — remplacements (textes visibles seulement)

Règle : un mot technique inévitable est expliqué en 5 mots au plus, entre parenthèses ou juste après.

| Fichier | Texte actuel | Remplacement proposé |
|---|---|---|
| `hero.tsx` | Eyebrow « Studio IA & Zoho · Québec, Canada » | voir 4.1 |
| `hero.tsx` | Défilant « Intégrations », « Audit de processus », « Agents IA » | voir 4.1 |
| `services.tsx` | h2 « Quatre expertises pour un même objectif. » | « Quatre façons / de vous simplifier la vie. » |
| `services.tsx` | desc « …reprendre la main sur leur gestion grâce à l'IA et à l'écosystème Zoho. Chaque mandat est traité avec rigueur… » | « On automatise vos tâches répétitives, on installe des outils simples et on vous forme. Pour les travailleurs autonomes et les PME du Québec, avec un accompagnement du début à la fin. » |
| `services.tsx` | 01 desc « Audit de vos processus, automatisation de vos workflows, connexions entre vos outils… propulsés par l'IA » | « Fini les tâches répétitives qui grugent vos journées. On regarde comment vous travaillez, puis on fait en sorte que les relances, les rapports et les copier-coller se fassent tout seuls. » |
| `services.tsx` | 01 tags `Workflows`, `Agents IA`, `Intégrations`, `Rapports` | `Tâches automatiques`, `Relances`, `Liens entre vos outils`, `Rapports` |
| `services.tsx` | 02 titre « Agents & intégrations IA » | « Assistants IA sur mesure » |
| `services.tsx` | 02 desc « …branchés sur vos outils : assistants internes, chatbots clients… 24/7 » | « Un assistant IA (un programme qui travaille pour vous) branché sur vos outils : il répond aux questions de vos clients, trie vos documents, suit vos demandes. Jour et nuit. » |
| `services.tsx` | 02 tags `Claude`, `ChatGPT`, `Chatbots`, `API` | `ChatGPT`, `Claude`, `Clavardage client`, `Tri de documents` |
| `services.tsx` | 03 desc « …vos processus connectés — une entreprise qui roule dans un seul écosystème » | « On installe et règle Zoho chez vous : clients, factures, soutien, infolettres. Tout au même endroit, au lieu d'éparpillé dans plusieurs outils. » |
| `services.tsx` | 03 tags `Books`, `Desk`, `Campaigns` | `Zoho CRM (clients)`, `Books (factures)`, `Desk (soutien)`, `Campaigns (infolettres)` |
| `services.tsx` | 04 desc « Ateliers pratiques, cas d'usage réels, autonomie durable. » | « …Ateliers pratiques, exemples tirés de votre métier, pour être autonome ensuite. » |
| `ai-section.tsx` | h2 « L'IA dans votre quotidien. » | inchangé (simple) |
| `ai-section.tsx` | p « Au-delà de l'automatisation classique… transformeront votre façon de travailler… » | « On vous aide à utiliser l'IA dans votre quotidien, que vous soyez seul ou en équipe. D'abord comprendre, ensuite essayer, puis bâtir ensemble des façons de faire qui vous sauvent du temps. On forme aussi des jeunes en informatique et en IA dans notre studio. » |
| `ai-section.tsx` | Pilier 1 desc « …outils d'IA générative… Copilot… » ; item « Cas d'usage métier » | « …les outils d'IA (comme ChatGPT, Claude ou Copilot)… » ; item « Exemples tirés de votre métier » |
| `ai-section.tsx` | Pilier 2 item « Audit de processus », « Plan d'intégration » | « Portrait de vos façons de faire », « Plan étape par étape » |
| `ai-section.tsx` | Pilier 3 titre « Construction de processus IA » ; desc « …processus, agents et automatisations IA… » ; items « Agents personnalisés », « Workflows automatisés » | « Des outils IA bâtis pour vous » ; « On bâtit sur mesure des assistants et des tâches automatiques qui fonctionnent avec vos outils actuels. » ; « Assistants personnalisés », « Tâches qui s'enchaînent seules » |
| `ai-section.tsx` | Bannière « construire des processus qui s'appuient sur l'IA » | « Nous sommes là pour *simplifier votre travail* avec l'IA — à votre mesure, avec vos outils et votre équipe. » |
| `zoho-section.tsx` | h2 « Votre gestion, centralisée. » | « Toute votre gestion, au même endroit. » |
| `zoho-section.tsx` | p « …dans un seul écosystème abordable… » | « …Zoho réunit toute la gestion de votre entreprise dans une seule plateforme abordable (des logiciels qui se parlent)… » |
| `zoho-section.tsx` | Pilier 1 desc « migration de vos données, paramétrage… » ; items « Configuration & migration », « Automatisations entre apps » | « transfert de vos données, réglages selon votre façon de travailler… » ; « Réglages et transfert de données », « Tâches automatiques entre logiciels » |
| `zoho-section.tsx` | Pilier 3 « Optimisation des processus » | « Amélioration continue » |
| `zoho-section.tsx` | Bannière « la gestion de votre business » | « la gestion de votre entreprise » (anglicisme) |
| `benefits-section.tsx` | « Votre entreprise travaille 24/7 » ; « réponses aux leads… agents IA » | « Votre entreprise avance, même la nuit » ; « Relances, suivis, réponses aux clients potentiels : les tâches automatiques ne dorment jamais. » |
| `benefits-section.tsx` | h2 « Le choix le plus payant pour votre PME. » | « Ce que vous y gagnez, / concrètement. » |
| `comparison-section.tsx` | « Métriques floues » | « Des résultats flous » |
| `comparison-section.tsx` | « Dépendance au fournisseur » | « Vous dépendez du consultant » |
| `process-section.tsx` | « Audit de vos processus » ; « On cartographie… » ; « en validant chaque livrable » | « Portrait de vos façons de faire » ; « On regarde comment vous travaillez et on repère où l'IA et Zoho vous feront gagner du temps. » ; « en validant chaque étape avec vous » |
| `process-section.tsx` | h2 « De l'idée à l'impact » | « Simple, du début / à la fin. » |
| `nav.tsx` | Lien « Cas d'usage » | « Réalisations » (correspond à la route `/realisations`) |
| `nav.tsx` | (ajout) | Lien « Démarrer » → `/#demarrer`, placé en premier |
| `quote-calculator.tsx` | Fonctionnalité « Automatisations inter-apps » | « Liens automatiques entre vos logiciels » |
| `quote-calculator.tsx` | « Intégrations API » | « Connexion à vos autres logiciels » |
| `quote-calculator.tsx` | « Agent IA intégré » | « Assistant IA branché sur vos outils » |
| `quote-calculator.tsx` | Types « Automatisation IA », « Agent IA » | « Tâches automatiques (IA) », « Assistant IA sur mesure » |
| `quote-calculator.tsx` | Fonctionnalités `Zoho Books`, `Zoho Desk` | « Zoho Books (factures) », « Zoho Desk (soutien client) » |
| `chatbot.tsx` | `services` : « quatre expertises… agents et intégrations IA… » | « On peut vous aider de quatre façons : rendre vos tâches automatiques, créer un assistant IA, installer Zoho pour vos clients et vos factures, ou vous former. Qu'est-ce qui vous intéresse ? » |
| `chatbot.tsx` | `zoho` : « un seul écosystème… votre business » | « Zoho réunit vos clients, vos factures, votre soutien client et vos infolettres au même endroit. On l'installe, on le règle selon votre façon de travailler et on vous forme. » |
| `chatbot.tsx` | `agent` : « …selon les intégrations » | « …selon les outils à brancher » (prix existant inchangé) |
| `chatbot.tsx` | `auto` : « On audite vos processus actuels » | « On regarde comment vous travaillez » (prix existant inchangé) |
| `faq-section.tsx` (existant) | « tout est connecté, donc automatisable » ; « l'ajout de nouveaux modules » | « tout est relié, donc plus facile à automatiser » ; « l'ajout de nouvelles fonctions » |

**Critères d'acceptation**
- `grep -niE "workflow|API|inter-apps|écosystème|leads|24/7|business|livrable|cartograph"` sur les fichiers de la liste ne renvoie plus de texte visible non expliqué (les noms de variables et de produits Zoho sont permis).
- Les prix existants ne changent pas.

## 5. Fonctionnalités — DEVRAIT

### 5.1 Option « Je débute / Premier pas » dans le calculateur (`quote-calculator.tsx`)

- Ajouter en **premier** dans `PROJECT_TYPES` : `{ id: 'debut', label: 'Je débute — premier pas', base: null }` (ou un champ `surMesure: true`).
- Quand elle est choisie :
  - les groupes « Fonctionnalités » et « Échéancier » sont cachés (ou désactivés) ;
  - l'aperçu (`calc-preview`) affiche, **au lieu du montant** : titre « Sur mesure », texte « Un premier pas simple : configuration IA de base, mise en place de Zoho ou formation courte. On en discute à l'appel découverte gratuit. » ;
  - le bouton/lien vers `/rdv` reste visible ;
  - l'envoi du formulaire enregistre `type_projet = "Je débute — premier pas"` et `resultat_estimation = "Sur mesure — à discuter à l'appel découverte"`.
- Le type par défaut au chargement reste `auto` (aucun changement pour les visiteurs actuels). Hypothèse : on pourrait mettre `debut` par défaut ; à décider par Camille.

**Critères d'acceptation**
- Aucun montant en $ affiché avec « Je débute ».
- Le calcul des autres types est identique à avant (mêmes valeurs).
- `npm run build` passe (le type TypeScript accepte `base` absent ou nul).
- Aucune modification du schéma Supabase : on réutilise `submitEstimateurRequest` tel quel.

### 5.2 Chatbot : accueillir « je ne sais pas par où commencer » (`chatbot.tsx`)

- Dans `start.chips`, ajouter **en premier** : `{ text: 'Je ne sais pas par où commencer', next: 'debuter' }`.
- Nouveau nœud `debuter` :
  « Bonne nouvelle : c'est la question qu'on préfère ! 😊 Pas besoin d'être techno. On commence souvent par une seule chose. Qu'est-ce qui vous prend le plus de temps ? »
  Chips : « Mes factures et mes clients » → `debut-zoho` · « Mes courriels et mes textes » → `debut-ia` · « Je préfère en parler » → action `goto-rdv`
- Nœud `debut-zoho` : « On peut mettre en place Zoho pour vos clients et vos factures, tout au même endroit. C'est sur mesure : on en discute lors d'un appel gratuit de 30 minutes. » Chips : « Prendre un RDV » (`goto-rdv`) · « Voir Zoho » (lien `/zoho#demarrer` — nouvelle action `goto-zoho` ou réutiliser le routeur)
- Nœud `debut-ia` : « On peut configurer un assistant IA pour votre entreprise et vous montrer comment vous en servir. C'est sur mesure : on en discute lors d'un appel gratuit de 30 minutes. » Chips : « Prendre un RDV » (`goto-rdv`) · « Voir l'IA » (`/ia#demarrer`)
- Corrections de jargon : voir 4.6.

**Critères d'acceptation**
- Les nouveaux nœuds ne contiennent aucun prix.
- Les nœuds existants et leurs prix restent (texte simplifié seulement).
- Si une nouvelle action de navigation est ajoutée, elle suit le modèle de `goto-rdv`.

## 6. Fonctionnalités — POURRAIT

### 6.1 Page dédiée `/demarrer` (ou `/pme`)

**Recommandation : ne pas la créer maintenant.** Les sections de l'accueil (4.2, 4.3, 4.4), les volets sur `/ia` et `/zoho` et l'option du calculateur couvrent le besoin, sans dupliquer de contenu. À reconsidérer si Camille veut une page d'atterrissage pour une publicité ou une infolettre. Si oui, préférer `/demarrer` (verbe d'action, plus clair que le sigle « PME », et inclut les travailleurs autonomes). Contenu : Hero court + 4.2 + 4.3 + 4.4 (variante accueil) + FAQ (5 nouvelles questions) + CTA. Aucun nouveau composant requis.

## 7. Ordre recommandé des sections de l'accueil (`src/app/page.tsx`)

1. Hero (4.1)
2. **C'est pour vous si…** (nouveau, 4.2)
3. **Avant / après** (nouveau, 4.3)
4. **Démarrer simplement** — variante accueil, `id="demarrer"` (nouveau, 4.4)
5. Services
6. Process
7. Benefits
8. Comparison
9. Testimonials
10. Interns (inchangé)
11. FAQ (enrichie, 4.5)
12. CTA

Logique : se reconnaître → voir le gain → voir le premier pas → détails des services → comment ça se passe → pourquoi nous → objections → action.

## 8. Contraintes dures pour `ux-agent`

- **Rien d'inventé** : aucun prix, date, durée, nom, témoignage, chiffre ou coordonnée. Si un texte en demande, écrire `[à confirmer]`. Les prix existants (calculateur, forfaits, chatbot) restent tels quels.
- **Classes CSS existantes de `src/app/vsw.css`** : `section`, `container`, `section-head`, `eyebrow`, `desc`, `reveal`, `services-grid`/`service`, `benefits-grid`/`benefit`, `compare-wrap`/`compare-col`/`compare-head`/`compare-cell`, `process-grid`/`process-step`, `faq-list`/`faq-item`, `ai-wrap`/`ai-top`/`ai-pillars`/`ai-pillar`/`ai-banner`, `pricing-*`, `calc-*`, `btn btn-primary` / `btn-ghost` / `btn-lg`.
- Nouvelles classes **seulement si nécessaire**, ajoutées dans `vsw.css` avec les jetons existants (`--accent`, `--accent-2`, etc.). Jamais `globals.css`.
- Composants dans `src/components/vsw/` uniquement. Ne pas réutiliser l'ancien design.
- **Aucune nouvelle dépendance.** Icônes : celles de `icon.tsx` (`check`, `bolt`, `clock`, `grid`, `users`, `arrow`, `calendar`, `chat`…).
- **Éditions ciblées** (str_replace), pas de réécriture complète.
- Formulaires et collecte de données inchangés (Loi 25). `/admin` et CRM inchangés.
- Français québécois, vouvoiement. Apostrophes JSX échappées (`&apos;`).
- Vérification finale : `npm run build` passe.

## 9. Hors périmètre

Mise en ligne (Supabase, Vercel) · `/admin` et CRM · nouveaux prix ou forfaits · refonte visuelle · page `/demarrer` (sauf décision contraire de Camille).

## 10. Questions ouvertes (pour Camille)

1. **Nom de l'offre d'entrée.** Proposition : « Démarrer simplement » (titre de section) et « Premier pas » (calculateur, chatbot). Autre option : « Trousse de départ ». À choisir.
2. **Forfait d'entrée avec prix ?** D'ici votre décision : « Sur mesure — on en discute à l'appel découverte ».
3. **Durée d'une formation courte** : `[à confirmer]`.
4. **« Taxes du Québec configurées »** (carte Zoho Books) : le confirmez-vous comme service offert ?
5. **Calculateur** : « Je débute » doit-il être sélectionné par défaut ? (proposition : non, pour ne pas changer l'existant).
6. **Accueil à 12 sections** : trop long ? Option : fusionner Benefits et Comparison plus tard.
7. **Durées existantes de la FAQ** (« 2 à 4 semaines », « 6 à 9 semaines ») et mentions du hero (« 24h », « 100% ») : à confirmer comme les autres placeholders.
8. **Page `/demarrer`** : recommandée seulement si une campagne publicitaire est prévue.
