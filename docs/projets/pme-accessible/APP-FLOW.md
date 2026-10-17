# APP-FLOW — Site plus accessible aux PME et travailleurs autonomes

**Date :** 2026-10-17 · **Auteur :** agent `product-manager` · **Compagnon de :** `PRD.md`
Inventaire vérifié dans `src/app/` et `next.config.ts` le 2026-10-17.

## 1. Inventaire des routes

### Routes existantes touchées par ce chantier

| Route | Fichier | Changement |
|---|---|---|
| `/` | `src/app/page.tsx` | 3 sections ajoutées (`PourVousSection`, `AvantApresSection`, `DemarrerSection variant="accueil"` avec `id="demarrer"`), nouvel ordre (PRD §7). Hero, Services, Benefits, Process, Comparison, FAQ : textes simplifiés. |
| `/ia` | `src/app/ia/page.tsx` | `DemarrerSection variant="ia"` (`id="demarrer"`) inséré **entre** `PageHeader` et `AISection`. Lede du `PageHeader` : voir §3. |
| `/zoho` | `src/app/zoho/page.tsx` | `DemarrerSection variant="zoho"` (`id="demarrer"`) inséré **entre** `PageHeader` et `ZohoSection`. Eyebrow et lede : voir §3. |
| `/devis` | `src/app/devis/page.tsx` | Aucune modif de la page ; option « Je débute — premier pas » dans `QuoteCalculator` (PRD §5.1). |
| Toutes | `nav.tsx` (layout) | Lien « Démarrer » → `/#demarrer` ajouté ; « Cas d'usage » renommé « Réalisations ». |
| Toutes | `chatbot.tsx` (layout) | Nœuds `debuter`, `debut-ia`, `debut-zoho` (PRD §5.2). |

### Routes existantes non touchées

`/realisations`, `/a-propos`, `/rdv`, `/contact`, `/postuler-stagiaire`, `/admin`, `/api/*`, `/politique-confidentialite`, `/conditions-utilisation`.

### Anciennes routes (redirigées en 308, `next.config.ts`) — inchangées

`/services`→`/`, `/services/*`→`/ia`, `/solutions`→`/`, `/solutions/*`→`/` (dont `/solutions/pme`), `/particuliers(/*)`→`/`, `/portfolio`→`/realisations`, `/estimateur`→`/devis`, `/prix`→`/devis`, `/audit-gratuit`→`/contact`, `/diagnostic`→`/ia`, `/blog`→`/`.
Les dossiers de ces anciennes pages existent encore dans `src/app/` mais ne sont pas servis.

### Nouvelles routes

**Aucune** dans ce chantier. Ancres nouvelles : `/#demarrer`, `/ia#demarrer`, `/zoho#demarrer` (l'ancre existante `/ia#formation` est réutilisée).
Si Camille choisit la page `/demarrer` (PRD §6.1, « Pourrait ») : nouveau dossier `src/app/demarrer/page.tsx`, et la redirection `/solutions/pme` pourrait alors pointer vers `/demarrer` (hypothèse, à décider).

## 2. Parcours principaux

### Parcours A — Julie, travailleuse autonome, « je ne sais pas par où commencer »
1. **Accueil `/`** — lit le lede « Pas besoin d'être techno ».
2. Défile → **« C'est pour vous si… »** — se reconnaît (« Vous faites vos factures le soir »).
3. → **« Avant / après »** — voit ce qui change pour la facture.
4. → **« Démarrer simplement »** (`#demarrer`) — clique la carte « Mise en place d'un logiciel de gestion (Zoho) ».
5. **`/zoho#demarrer`** — lit les 3 cartes, « Sur mesure — on en discute à l'appel découverte ».
6. Clique **« Parler de mon premier pas »** → **`/rdv`** (formulaire existant).

Raccourci : bouton hero **« Par où commencer ? »** → saute directement à l'étape 4.

### Parcours B — Marc, petite équipe, veut un ordre de prix
1. **Accueil** ou **nav « Devis »** → **`/devis`**.
2. Dans le calculateur, choisit **« Je débute — premier pas »**.
3. L'aperçu affiche **« Sur mesure »** (aucun montant) et le lien vers `/rdv`.
4. Remplit nom + courriel → envoi existant (`submitEstimateurRequest`, `type_projet = "Je débute — premier pas"`).
5. Confirmation existante du calculateur ; la demande arrive dans `/admin` par le flux CRM existant (inchangé).
   - Variante : choisit un autre type (ex. Implantation Zoho) → calcul et fourchette **comme avant**.

### Parcours C — Visiteur hésitant, via le chatbot
1. N'importe quelle page → ouvre le **chatbot**.
2. Clique **« Je ne sais pas par où commencer »** → nœud `debuter`.
3. Choisit **« Mes courriels et mes textes »** → nœud `debut-ia` (sans prix).
4. **« Prendre un RDV »** → **`/rdv`** ; ou **« Voir l'IA »** → **`/ia#demarrer`**.

### Parcours D — Sophie, responsable admin d'une PME, compare et se rassure
1. **Nav « Zoho »** → **`/zoho`** → lit « Démarrer simplement » puis les piliers détaillés (`ZohoSection`).
2. Revient à l'accueil → **FAQ** : « Ça doit coûter une fortune ? », « Combien de temps ça va me demander ? ».
3. Clique le lien de la FAQ vers **`/devis`** (s'il est ajouté) ou le **CTA** final → **`/rdv`**.

### Parcours E — Relève / stagiaire (à ne pas casser)
1. **Accueil** → section **Interns** (position 10, inchangée sur le fond) → **`/postuler-stagiaire`**.

## 3. Textes des en-têtes de page (`PageHeader`) proposés

- **`/ia`** lede : « Un assistant IA bien réglé, des tâches qui se font toutes seules, et une formation pour être à l'aise. Trois façons d'utiliser l'IA dans votre quotidien — même si vous n'êtes pas techno. » (titre « L'IA qui travaille pour vous. » inchangé)
- **`/zoho`** eyebrow : `// Zoho, simplement` · titre : « Toute votre gestion, / au même endroit. » · lede : « Vos clients, vos factures, votre soutien client, vos infolettres : on installe Zoho chez vous, on le règle selon votre façon de travailler et on vous forme jusqu'à ce que vous soyez à l'aise. »
- **Métadonnées** `/zoho` description : remplacer « un seul écosystème » par « au même endroit ».

## 4. Points de contrôle pour `qa-agent`

- Les 3 ancres `#demarrer` existent et défilent correctement (desktop + mobile).
- Lien nav « Démarrer » fonctionne depuis une page autre que `/` (`/#demarrer`).
- « Je débute » : aucun `$` visible ; les 6 autres types donnent les mêmes montants qu'avant.
- Chatbot : chaque chip des nouveaux nœuds mène quelque part (aucun cul-de-sac).
- `npm run build` OK ; aucune nouvelle dépendance dans `package.json`.
