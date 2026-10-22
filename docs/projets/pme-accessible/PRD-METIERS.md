# PRD — Addendum « Pour votre métier » et recentrage du message

Projet : `pme-accessible` · Addendum au `PRD.md` (qui reste inchangé) · Rédigé le 2026-10-17 · Valide : Camille

> Quand cet addendum et le `PRD.md` se contredisent, **l'addendum l'emporte** (en particulier le lede du hero, §4.1 du PRD, et l'ordre des sections, §7 du PRD).

## 1. Problème et intention

Demande de Camille, mot pour mot : « On doit parler de plusieurs cas : conseiller financier, conseiller hypothécaire, clinique dentaire, clinique simple, bref tous ces corps de métiers doivent se reconnaître ; on ne promet pas seulement l'IA mais on leur propose d'améliorer leur service pour leur offrir plus de temps. »

Deux changements :
1. **Une nouvelle section d'accueil « Pour votre métier »** : 8 cartes, une par corps de métier, pour que chacun se reconnaisse.
2. **Un message recentré** : la promesse n'est pas « de l'IA ». La promesse, c'est **un meilleur service à vos clients, et du temps qui vous revient**. L'IA, Zoho et l'automatisation sont les moyens.

Règle de rédaction pour tout le site touché ici : **le client final et le temps retrouvé viennent avant les outils** dans chaque phrase.

## 2. Publics visés par la section

Les 8 métiers validés par Camille. Point commun : des professionnels qui servent des clients (ou des patients) un par un, et que le suivi administratif éloigne de ce service. Moment d'usage : visite de l'accueil, après avoir lu « C'est pour vous si… ».

## 3. Objectifs et mesures de succès

- Un visiteur de l'un des 8 métiers trouve sa carte sans faire défiler plus d'une section après le hero (hypothèse de mesure : à vérifier par Camille lors d'un test avec quelques clients réels).
- Aucune phrase du hero, des cartes ou des `desc` recentrés ne commence par un outil (IA, Zoho, automatisation).
- Mesure à suivre après la mise en ligne (hypothèse, pas d'outil d'analyse en place aujourd'hui) : part des demandes de RDV qui mentionnent un métier de la liste.

## 4. Fonctionnalités

### 4.1 DOIT — Section « Pour votre métier » (nouveau composant `src/components/vsw/metiers-section.tsx`)

**En-tête de section**
- **Eyebrow :** `// Pour votre métier`
- **Titre h2 (2 lignes) :** « Un meilleur service pour vos clients. » / « Plus de temps pour vous. »
- **desc :** « On ne vous vend pas de l'IA. On regarde ce qui vous gruge dans votre métier, on améliore le service que vous offrez à vos clients, et vous retrouvez du temps. L'IA, Zoho et l'automatisation ne sont que les moyens. »

**Structure de données proposée** (un tableau constant dans le composant) :

```ts
type Metier = {
  titre: string;        // nom court du métier (h4 de la carte)
  precision?: string;   // sous-titre facultatif (cartes 1, 4, 5, 6, 8)
  gruge: string;        // « Ce qui vous gruge »
  ameliore: string;     // « Pour vos clients »
  temps: string;        // « Le temps retrouvé »
  tags: string[];       // 2 ou 3 étiquettes
  note?: string;        // mention conformité (cartes 1 à 4)
  icon: IconName;       // icône existante de icon.tsx
};
```

Chaque carte affiche, dans cet ordre : icône · titre (et précision) · les trois phrases, chacune précédée de son petit libellé (« Ce qui vous gruge », « Pour vos clients », « Le temps retrouvé ») · les étiquettes · la note de conformité s'il y en a une.

**Les 8 cartes — textes prêts à coller**

Les icônes proposées sont prises dans la liste du `PRD.md` §8 (`check`, `bolt`, `clock`, `grid`, `users`, `arrow`, `calendar`, `chat`). `ux-agent` vérifie dans `icon.tsx` qu'elles existent ; sinon, il prend `check`.

---

**1. Conseiller financier** — icône `users`
- **Précision :** « Conseiller en sécurité financière »
- **Ce qui vous gruge :** « Les suivis annuels, les notes de rencontre et les documents de conformité vous prennent des soirées entières. »
- **Pour vos clients :** « Chaque client reçoit son suivi au bon moment, et retrouve un conseiller qui se souvient de sa situation. »
- **Le temps retrouvé :** « Pour conseiller vos clients, au lieu de remplir des formulaires. »
- **Étiquettes :** « Rappels de suivi » · « Notes de rencontre préparées » · « Dossier client unique »
- **Note :** « Vos notes et vos suivis restent organisés dans le respect de vos obligations de conformité (AMF) et de la Loi 25. Vous validez tout. »

**2. Courtier hypothécaire** — icône `grid`
- **Ce qui vous gruge :** « Courir après les documents manquants et relancer les dossiers en attente vous occupe plus que le conseil lui-même. »
- **Pour vos clients :** « Vos clients savent exactement quoi fournir, et leur dossier est complet du premier coup. »
- **Le temps retrouvé :** « Pour accompagner vos clients, pas pour courir après les papiers. »
- **Étiquettes :** « Liste de documents à fournir » · « Relances automatiques » · « Suivi des dossiers »
- **Note :** « Vos notes et vos suivis restent organisés dans le respect de vos obligations de conformité (AMF) et de la Loi 25. Vous validez tout. »

**3. Clinique dentaire** — icône `calendar`
- **Ce qui vous gruge :** « Les rappels de rendez-vous, les confirmations et les formulaires de nouveaux patients occupent votre réception toute la journée. »
- **Pour vos clients :** « Vos patients reçoivent leur rappel à temps et remplissent leur formulaire avant d'arriver. »
- **Le temps retrouvé :** « Pour une équipe à la réception qui a enfin le temps d'accueillir. »
- **Étiquettes :** « Rappels de rendez-vous » · « Formulaires en ligne » · « Réponses aux questions courantes »
- **Note :** « Les dossiers de vos patients sont des renseignements sensibles, traités selon la Loi 25. Les outils s'occupent de l'administration, jamais des soins. »

**4. Clinique de soins** — icône `clock`
- **Précision :** « Physio, chiro, esthétique, massothérapie »
- **Ce qui vous gruge :** « Entre deux traitements, vous rappelez des clients, confirmez des plages libres et répondez aux mêmes questions. »
- **Pour vos clients :** « Vos clients réservent facilement, reçoivent leur rappel et savent comment se préparer à leur rendez-vous. »
- **Le temps retrouvé :** « Pour vous consacrer à vos soins, pas à votre agenda. »
- **Étiquettes :** « Prise de rendez-vous en ligne » · « Rappels automatiques » · « Suivi après la visite »
- **Note :** « Les dossiers de vos clients sont des renseignements sensibles, traités selon la Loi 25. Les outils s'occupent de l'administration, jamais des soins. »

**5. Cabinet comptable** — icône `check`
- **Précision :** « Comptabilité et tenue de livres »
- **Ce qui vous gruge :** « En période de pointe, vous passez vos journées à réclamer des pièces justificatives à vos clients. »
- **Pour vos clients :** « Vos clients savent ce qu'il manque, l'envoient au bon endroit et ont des nouvelles de leur dossier. »
- **Le temps retrouvé :** « Pour analyser et conseiller, plutôt que trier des reçus. »
- **Étiquettes :** « Collecte de documents » · « Relances des pièces manquantes » · « Facturation simplifiée »

**6. Entrepreneur en construction** — icône `bolt`
- **Précision :** « Construction et rénovation »
- **Ce qui vous gruge :** « Les soumissions se tapent le soir, et les relances de clients ou de paiements passent entre les mailles. »
- **Pour vos clients :** « Vos clients reçoivent leur soumission plus vite et savent où en est leur chantier. »
- **Le temps retrouvé :** « Pour être sur le chantier le jour, et à la maison le soir. »
- **Étiquettes :** « Soumissions plus rapides » · « Suivi des chantiers » · « Relances de paiement »

**7. Agent immobilier** — icône `chat`
- **Ce qui vous gruge :** « Les demandes d'information arrivent à toute heure, et le suivi de chaque acheteur ou vendeur repose sur votre mémoire. »
- **Pour vos clients :** « Chaque demande reçoit une réponse rapide, et personne n'est oublié en cours de route. »
- **Le temps retrouvé :** « Pour les visites et les gens, pas pour la paperasse. »
- **Étiquettes :** « Réponses aux demandes » · « Suivi des acheteurs et vendeurs » · « Dossier client unique »

**8. Commerce ou restaurant** — icône `check` (`arrow` évité : il fait penser à un bouton)
- **Précision :** « Commerce de détail ou restauration »
- **Ce qui vous gruge :** « Entre le comptoir et les fournisseurs, les courriels, les réservations et les avis en ligne s'accumulent. »
- **Pour vos clients :** « Vos clients ont une réponse rapide, une réservation confirmée et une bonne raison de revenir. »
- **Le temps retrouvé :** « Pour être avec vos clients et votre équipe, plutôt que derrière un écran. »
- **Étiquettes :** « Réservations et commandes » · « Réponses aux courriels » · « Infolettre simple »

---

Récapitulatif : champ `precision` sur les cartes 1, 4, 5, 6 et 8 ; champ `note` sur les cartes 1 à 4.

**Phrase de fin (sous la grille)**
- Texte : « Votre métier n'est pas dans la liste ? Si vous servez des clients, on regarde ensemble ce qui vous gruge et ce qu'on peut améliorer. »
- Bouton : `btn btn-ghost` « Parler de mon métier » → `/rdv`.
  Pourquoi `btn-ghost` et pas `btn-primary` : la section précédente (« C'est pour vous si… ») finit déjà par un bouton principal vers `/rdv`. Deux gros boutons identiques à la suite fatiguent l'œil.

**Critères d'acceptation (pour `qa-agent`)**
- [ ] `src/components/vsw/metiers-section.tsx` existe et exporte `MetiersSection`.
- [ ] La section porte `id="metiers"`, et cet `id` apparaît **une seule fois** dans `src/` (grep `id="metiers"` → 1 résultat).
- [ ] Le tableau contient **exactement 8** entrées, dans l'ordre ci-dessus.
- [ ] Chaque entrée a `titre`, `gruge`, `ameliore`, `temps` non vides et **2 ou 3** `tags`.
- [ ] Les entrées 1 à 4 ont une `note` ; la note des cartes 1 et 2 contient « AMF » et « Loi 25 » ; celle des cartes 3 et 4 contient « Loi 25 ».
- [ ] Les textes des cartes sont **identiques** à ce document (copie, pas reformulation).
- [ ] Dans les textes de la section (en-tête, cartes, phrase de fin) : **aucun `$`, aucun chiffre** (grep `[0-9$]` sur les chaînes du tableau et de l'en-tête → 0 résultat ; l'`id`, les classes et les tailles d'icône ne comptent pas).
- [ ] Aucun des mots « rendement », « placement », « garanti », « diagnostic » dans la section.
- [ ] Le bouton de fin pointe vers `/rdv`.
- [ ] Sur `/`, la section est rendue **après** `PourVousSection` et **avant** `AvantApresSection` dans `src/app/page.tsx`.
- [ ] Pas de `service-num` (« 01 / 08 ») ni de flèche `service-arrow` sur les cartes : elles ne sont pas des liens.
- [ ] `npm run verify` passe.

### 4.2 DOIT — Recentrage du hero (`src/components/vsw/hero.tsx`)

- **Titre (inchangé) :** « Une vie qui / nous appartient. »
- **Eyebrow (nouveau, proposé) :** `// Pour les professionnels, les travailleurs autonomes et les PME du Québec`
  Raison : un dentiste ou un conseiller financier ne se dit pas « travailleur autonome ». Si Camille préfère garder l'eyebrow actuel, rien d'autre ne change.
- **Lede (nouveau) :** « Mieux servir vos clients, et retrouver du temps pour votre vrai métier. On améliore votre service au quotidien — rappels, suivis, réponses, paperasse — avec des outils simples comme l'IA et Zoho, et on vous montre comment vous en servir. Pas besoin d'être techno. »
  (Dans le JSX : `l&apos;IA`, `d&apos;être`.)
- **Boutons, hero-meta, défilant :** inchangés.

**Critères d'acceptation**
- [ ] Le `h1` contient toujours « Une vie qui » et « nous appartient. ».
- [ ] Le lede contient « Pas besoin d'être techno » (sous la forme `d&apos;être` dans le source).
- [ ] La première phrase du lede parle des clients et du temps ; « IA » et « Zoho » n'apparaissent qu'après.

### 4.3 DOIT — Recentrage des autres textes (une ligne chacun)

| Fichier | Texte actuel (début) | Nouveau texte |
|---|---|---|
| `services.tsx` — `desc` de l'en-tête | « On automatise vos tâches répétitives, on installe… » | « Un seul but : mieux servir vos clients et vous redonner du temps. Pour y arriver, on automatise vos tâches répétitives, on installe des outils simples et on vous forme, du début à la fin. » |
| `benefits-section.tsx` — `desc` de l'en-tête | « Ce que nos clients gagnent concrètement… » | « Des clients mieux servis, du temps qui vous revient : voilà ce que vous y gagnez. La technologie, elle, reste en coulisses. » |
| `cta-section.tsx` — texte par défaut (`text ??`) | « Prêt à *reprendre le contrôle* de votre gestion ? Un appel de 30 minutes, gratuit et sans engagement. » | « Prêt à *mieux servir vos clients* et à retrouver du temps ? Un appel de 30 minutes, gratuit et sans engagement. » (`<em>` autour de « mieux servir vos clients ») |

« 30 minutes » est repris tel quel du texte actuel ; il n'est pas ajouté par cet addendum (il reste dans la liste des mentions à confirmer du `PRD.md` §10).

**Critères d'acceptation**
- [ ] Les trois textes correspondent au tableau.
- [ ] Les titres h2 de `services.tsx` et `benefits-section.tsx` sont inchangés.
- [ ] Les pages qui passent leur propre `text` à `CTASection` ne changent pas.

### 4.4 DOIT — Placement et navigation

**Placement sur `/` — d'accord avec la proposition.** Nouvel ordre de `src/app/page.tsx` :
1. Hero · 2. C'est pour vous si… · **3. Pour votre métier (nouveau)** · 4. Avant / après · 5. Démarrer simplement · 6. Services · 7. Process · 8. Benefits · 9. Comparison · 10. Testimonials · 11. Interns · 12. FAQ · 13. CTA

Logique : « C'est pour vous si… » parle de situations générales ; « Pour votre métier » précise (« c'est vraiment moi ») ; « Avant / après » montre le gain. Le visiteur se reconnaît deux fois avant de voir le résultat.

**Navigation (`src/components/vsw/nav.tsx`)** : ajouter `<Link href="/#metiers">Métiers</Link>` **juste après « Démarrer »** et avant « IA ». Les deux premiers liens mènent alors à des sections de l'accueil, et « Métiers » vient avant les outils (IA, Zoho) — même ordre que le message : vous d'abord, les moyens ensuite.

Le pied de page (`footer.tsx`) n'est pas touché par cet addendum (voir Questions ouvertes).

**Critères d'acceptation**
- [ ] `nav.tsx` contient un lien `href="/#metiers"` au libellé « Métiers », placé entre « Démarrer » et « IA ».
- [ ] Depuis `/ia` (ou toute autre page), cliquer « Métiers » ouvre l'accueil sur la section. **À tester par Camille** dans le navigateur.
- [ ] La barre de navigation reste lisible sur un écran d'ordinateur portable avec 8 liens. **À tester par Camille.**

### 4.5 DOIT — FAQ : deux questions en tête (`src/components/vsw/faq-section.tsx`)

Les 10 questions actuelles ont été relues : aucun doublon. « Et mes données dans tout ça ? » touche la Loi 25, mais pas les métiers réglementés ni la place de l'humain. Les deux nouvelles questions se placent **avant** « Je ne suis pas techno. Est-ce que c'est pour moi ? ».

1. **q :** « Est-ce que ça convient à un cabinet réglementé (finance, santé) ? »
   **a :** « Oui. On tient compte de vos obligations dès le départ : la conformité de votre secteur (par exemple l'AMF en finance) et la Loi 25 pour les renseignements personnels de vos clients. Ce qui engage votre jugement professionnel — un conseil, une réponse personnalisée, une note au dossier — n'est jamais envoyé sans votre validation. Vous décidez de ce qui peut partir seul, comme un simple rappel de rendez-vous. »

2. **q :** « Mes clients vont-ils parler à un robot ? »
   **a :** « Non. L'outil prépare le travail : un brouillon de réponse, un rappel, un résumé de dossier. Vous relisez, vous ajustez, vous envoyez. Vos clients gardent le contact avec vous — simplement plus vite, et sans oubli. »

**Critères d'acceptation**
- [ ] La FAQ compte **12** questions (grep `q:` dans `faq-section.tsx` → 12).
- [ ] Les deux premières sont celles ci-dessus, dans cet ordre.
- [ ] La réponse 1 contient « AMF », « Loi 25 » et « validation ».

## 5. Contraintes de design et de rédaction

- **Grille : ne pas utiliser `services-grid`.** Vérifié dans `src/app/vsw.css` (lignes 353-386) : cette grille est une mise en page « bento » faite pour 4 cartes (la 1re occupe 2 rangées, la 4e occupe 2 colonnes). Avec 8 cartes, le rendu serait déséquilibré.
- **Grille recommandée :** `benefits-grid` + cartes `benefit` (classes existantes : `benefit-icon`, `benefit h4`, `benefit p`), avec les étiquettes en `service-tags` / `service-tag` (classes existantes, réutilisables hors de `.service` — **hypothèse** à vérifier par `ux-agent` à l'écran).
- **Nouvelles classes, seulement celles-ci** (dans `vsw.css`, jetons existants, jamais `globals.css`) :
  - `metiers-grid`, ajoutée à côté de `benefits-grid` : 4 colonnes sur grand écran (8 cartes = 2 rangées pleines ; à 3 colonnes, la dernière rangée aurait une case vide), 2 colonnes sous 1024 px, 1 colonne sous 640 px (mêmes seuils que `benefits-grid`).
  - `metier-label` : le petit libellé au-dessus de chaque phrase (style des eyebrows mono, petite taille).
  - `metier-note` : la note de conformité (petite, couleur atténuée, ex. `--fg-2`).
  - `metier-precision` : le sous-titre sous le h4, si un simple `p` ne suffit pas.
- Classes de section existantes : `section`, `container`, `section-head`, `eyebrow`, `desc`, `reveal`, `btn btn-ghost`.
- **Aucune nouvelle dépendance.** Icônes de `icon.tsx` seulement.
- Éditions ciblées (str_replace) dans les fichiers existants ; seul `metiers-section.tsx` est un nouveau fichier.
- Français québécois, vouvoiement. Apostrophes échappées dans le JSX (`&apos;`) ; dans les chaînes du tableau, guillemets doubles ou apostrophe typographique.
- **Rien d'inventé** : aucun chiffre, prix, durée, nom ou témoignage dans la section. Si `ux-agent` a besoin d'un texte qui manque, il écrit `[à confirmer]`.
- **Conformité** (cartes 1 et 2) : aucune promesse de rendement, de taux ou d'approbation ; aucun conseil financier. **Cliniques** (cartes 3 et 4) : rien sur le diagnostic ni les soins ; les outils touchent l'administration seulement.
- Formulaires, collecte de données, `/admin` et CRM : inchangés.

## 6. Hors périmètre

Une page par métier · des témoignages par métier · de nouveaux prix ou forfaits · le pied de page · le chatbot (il ne parle pas encore des métiers) · le défilant du hero · la mise en ligne.

## 7. Questions ouvertes pour Camille

1. **Mention AMF exacte** (cartes 1 et 2, FAQ 1) : « dans le respect de vos obligations de conformité (AMF) » vous convient-il ? Vous connaissez ce domaine : à valider ou à reformuler. Faut-il nommer aussi la Chambre de la sécurité financière pour le conseiller en sécurité financière ?
2. **Autres métiers réglementés** : agent immobilier (OACIQ) et cabinet comptable (Ordre des CPA) n'ont pas de note de conformité, faute de consigne. En ajouter une ?
3. **Contradiction à trancher** : la carte « Assistant IA » de `services.tsx` dit qu'il « répond aux questions de vos clients […] Jour et nuit ». La FAQ 2 dit « l'outil prépare, vous validez ». Faut-il reformuler la carte des services (proposition : « il prépare les réponses aux questions de vos clients »), ou nuancer la FAQ ?
4. **« Rappels automatiques »** (cartes 2 et 4) : un rappel de rendez-vous part seul, sans validation à chaque fois. La FAQ 1 le dit (« Vous décidez de ce qui peut partir seul »). Cette nuance vous convient-elle ?
5. **Une page par métier plus tard** (ex. `/metiers/clinique-dentaire`) ? Utile seulement pour une campagne publicitaire par métier. Si oui, les cartes deviendront des liens.
6. **Eyebrow du hero** : nouveau texte « Pour les professionnels, les travailleurs autonomes et les PME du Québec », ou garder l'actuel ?
7. **Lien « Métiers » dans le pied de page** aussi ?
8. **Accueil à 13 sections** : la question du `PRD.md` §10 (trop long ?) se pose encore plus. Option : fusionner « Benefits » et « Comparison » plus tard.
9. **Libellés des cartes** : « Ce qui vous gruge » est familier et chaleureux ; le garder tel quel, ou préférer « Ce qui vous ralentit » pour les cabinets plus formels ?
