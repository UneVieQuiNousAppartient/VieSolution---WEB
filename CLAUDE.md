# Vie Solution Web — contexte du projet

Site vitrine de Vie Solution Web (studio québécois : automatisation, agents IA,
implantation Zoho, formation). Marque et promesse : « Une vie qui vous appartient » (slogan complet depuis le 2026-10-22 : « Une vie qui vous appartient, des clients mieux servis, plus vite. »).
Langue : français québécois (vouvoiement). Tout le contenu visible est en français.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind 4
- Supabase (projet partagé **VieSolutionCSF**, ref `gflkfwalfaeeknauxyig`) :
  formulaires + CRM isolé en tables préfixées `vsw_`
- react-hook-form + zod pour les formulaires
- Polices via next/font : Space Grotesk (display), Inter (body), JetBrains Mono (mono)

## Design

- Design system dans `src/app/vsw.css` (porté d'un handoff Claude Design, structure
  inspirée du template Framer « Agenium ») : jetons oklch, eyebrows mono `// …`, grilles fines.
  **Thème clair par défaut depuis le 2026-10-17** (choix de Camille : plus chaleureux pour
  dentistes, conseillers, comptables) — fond blanc cassé, accent bleu-sarcelle (`--accent`) et
  violet assombri (`--accent-2`). L'ancien thème sombre bleu nuit / néon reste disponible avec
  `<html data-theme="dark">` (jetons et surcharges en fin de `vsw.css`). Tout nouveau style passe
  par les jetons : jamais une couleur en dur qui ne tient que sur un des deux fonds.
- NE PAS utiliser les classes de `globals.css` (ancien design) pour du nouveau contenu.
- Composants du site : `src/components/vsw/*` uniquement.
  `src/components/{home,landing,chatbot,forms,layout}` + `_archive_old_design/` = ancien
  design conservé pour référence, ne pas réutiliser.

## Pages

`/` (accueil), `/services` (les 9 solutions en 3 piliers), `/ia`, `/accueil-ia`, `/zoho`, `/sites-web`, `/crm-sur-mesure`,
`/referencement`, `/metiers` et `/metiers/<slug>` (8 métiers, données dans `src/lib/metiers.ts`), `/devis` (« Combien ça coûte ? » :
démarche de prix, formulaire de situation, niveaux d'accompagnement sans montant), `/realisations`, `/blog` et `/blog/<slug>` (articles approuvés par Camille, `src/content/blog/*.md`), `/avis` (témoignages, table `vsw_avis`, modération dans l'onglet « Avis » de `/admin`), `/a-propos`, `/rdv`, `/contact`,
`/emplois` (offre de stage ; ancienne `/postuler-stagiaire`), `/admin` (+ pages légales ; onglet « Statistiques » : visites dans `vsw_page_views` par `/api/visite`, sans cookie ni donnée personnelle — `site_page_views` est à CSF, ne plus y écrire).
Les anciennes URLs sont redirigées en 308 dans `next.config.ts`.

## CRM (réplique du modèle KHI EDUC, isolé par préfixe vsw_)

- Schéma complet : `supabase/setup-crm-vsw.sql` (fichier DÉFINITIF — remplace
  `vsw-lead-system.sql` et `setup-crm-complet.sql`, conservés pour historique).
  ⚠️ Le projet Supabase est PARTAGÉ avec la plateforme CSF : ne JAMAIS toucher aux
  tables sans préfixe (`leads`, `settings`, `bookings`… appartiennent à CSF).
- Flux : formulaires du site → triggers `fn_vsw_lead_intake` → `vsw_leads` (dédup
  par courriel) + tâche « Rappeler » (dans l'heure, ou 9 h le lendemain) → passage horaire
  `/api/cron/tick` (Vercel Cron, `vercel.json`, Bearer `CRON_SECRET`) → moteur
  `src/lib/crm/moteur.ts` (repris de KHI `lib/automations.js`) : brouillon `first_reply`
  à approuver, alerte 24 h, relances 1 et 2 (J2, J5), « À relancer » + tâche d'appel (J7),
  « Reprendre contact » (30 jours). Tout s'arrête dès un contact humain noté dans `/admin`
  (boutons « Appel fait », « Courriel envoyé », « RDV pris »). `/admin` s'ouvre sur
  « Aujourd'hui » (`src/lib/crm/aujourdhui.ts`) ; onglet « Relances » : marche/arrêt et délai
  de chaque règle (`/api/admin/regles`, surcharge dans `vsw_automation_rules`).
- **Courriels automatiques** : seuls l'accusé de réception (textes acceptés par Camille le 2026-10-22 :
  un pour les demandes, un pour les rendez-vous — `SUIVI-TACHES.md` § 30-31 ; pas aux stages) et les relances 1 et 2 (textes approuvés et activées par
  Camille le 2026-10-21 ; pas aux stages) partent seuls, avec l'alerte de nouvelle demande à l'équipe (`notify_email`) ; la première réponse reste un brouillon à
  approuver. Envoi par Resend (`src/lib/crm/envoi.ts`). Loi anti-pourriel (LCAP,
  `src/lib/crm/regles.ts`) : pied avec adresse postale (`vsw_settings.postal_address`) et
  lien de désabonnement (`/api/desabonnement`) — sans adresse postale, rien ne part.
- Règles pures testées : `npm test` (`tests/*.test.mjs`, Node retire les types).
- Admin `/admin` : code d'accès (`ADMIN_ACCESS_CODE`) **+ double vérification** (code à 6
  chiffres d'une application d'authentification, TOTP maison `src/lib/admin/mfa.ts`, sans
  dépendance ; secret CHIFFRÉ et empreintes des codes de secours dans `vsw_settings`,
  `src/lib/admin/mfa-store.ts`) → cookie httpOnly signé avec `ADMIN_SECRET` — jamais avec le
  seul code d'accès —, 8 h (`src/lib/admin-auth.ts`). Essais limités : 8 par IP, et 20 échecs du
  code à 6 chiffres au total par 15 min. Première connexion : activation obligatoire avant toute
  donnée (à faire dès la mise en ligne). Téléphone et codes de secours perdus : supprimer la
  ligne `admin_totp_secret` de `vsw_settings`, puis réactiver aussitôt. Routes
  `/api/admin/*` : `SUPABASE_SERVICE_ROLE_KEY` côté serveur.

## .env.local attendu

```
NEXT_PUBLIC_SUPABASE_URL=https://gflkfwalfaeeknauxyig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon>
SUPABASE_SERVICE_ROLE_KEY=<clé service_role — jamais côté client>
ADMIN_ACCESS_CODE=<code d'accès admin — une phrase longue>
ADMIN_SECRET=<32 caractères au hasard — signe les sessions /admin et chiffre le secret de double vérification ; le changer déconnecte et oblige à réactiver la double vérification>
CRON_SECRET=<32 caractères au hasard — Vercel l'envoie au passage horaire>
UNSUBSCRIBE_SECRET=<32 caractères au hasard — signe les liens de désabonnement ; ne plus le changer>
RESEND_API_KEY=<clé Resend>
ANTHROPIC_API_KEY=<clé Claude (Anthropic) — assistant IA de la bulle de clavardage, /api/chat ; sans elle, réponses toutes faites>
EMAIL_FROM=Vie Solution Web <adresse d'un domaine vérifié dans Resend>
EMAIL_REPLY_TO=<adresse qui reçoit les réponses des prospects>
```

## État (au 2026-10-10 ; SQL du CRM : 2026-10-22)

- Site : terminé, build OK (`npm run build`).
- CRM : code livré ; le SQL `setup-crm-vsw.sql` a été exécuté dans Supabase le 2026-10-22
  (accord de Camille, `SUIVI-TACHES.md` § 29) ; projet Vercel `vie-solution-web` créé le 2026-10-21 (équipe `viesolution`, relié
  au dépôt ; KHI s'y déploie déjà avec un cron horaire dans son `vercel.json`) — variables d'environnement à
  saisir par Camille ; secours pg_cron en fin de fichier SQL.
- En ligne depuis le 2026-10-22 sur `vie-solution-web.vercel.app` (PR #1 fusionnée) : la branche de production Vercel est la branche
  par défaut du dépôt (`claude/nextjs-web-project-RPcId`) ; domaine **viesolutionweb.ca** branché le
  2026-10-23 (`www` redirige en 308, `SUIVI-TACHES.md` § 34-35).
- Domaine : **viesolutionweb.ca** (confirmé par Camille le 2026-10-21) — écrit une seule fois, dans `src/lib/site.ts`.

## [à confirmer] avant mise en ligne — ne pas inventer, demander à Camille

- Coordonnées du site (données par Camille le 2026-10-22) : **info@viesolutionweb.ca** et **(438) 506-5243**, partout.
- Aucun montant sur le site public (décision de Camille, 2026-10-17) : les prix sont donnés par écrit après l'appel découverte.
- Témoignages : depuis le 2026-10-23, table `vsw_avis` (formulaire `/avis`, publiés par Camille dans l'admin) ;
  `site_testimonials` (sans préfixe) n'est plus lue. Ne publier que de vrais témoignages.

## Conventions de travail (préférences de Camille)

- Ne jamais modifier silencieusement dates, noms ou chiffres : marquer `[à confirmer]`.
- Éditions ciblées (str_replace) plutôt que réécriture complète des fichiers.
- Un problème à la fois, itératif. Solutions copier-coller, peu de dépendances.
- Ton des courriels/brouillons : style Dale Carnegie — sincère, humain, chaleureux.

## Méthode de travail (dépôt `methode-travail`, version 1.2.0 — installée le 2026-10-17)

## Ordre de lecture

1. Ce fichier → 2. **`docs/ETAT-ACTUEL.md`** (chantiers, décisions en attente, PR ouvertes) →
   3. **`docs/ERREURS-CONNUES.md`** (erreurs déjà diagnostiquées) → 4. documents du projet (`docs/projets/<slug>/`).
- **Jamais `SUIVI-TACHES.md` en entier** (grep + lecture ciblée) — règle `.claude/rules/suivi-taches.md`.
- Budget et modèles : `.claude/rules/budget-jetons.md` — tout appel d'agent nomme son modèle.
- Processus : `.claude/rules/agent-workflow.md` (plan avant action, `qa-agent` avant tout commit de 2+ fichiers).
- Hook Git : `git config core.hooksPath .githooks` (une fois par clone).

## Fiche projet

| Clé | Valeur |
|---|---|
| Pile | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind 4 ; Supabase (projet partagé `gflkfwalfaeeknauxyig`, tables `vsw_*`) ; passage horaire Vercel Cron `/api/cron/tick` ; courriels Resend ; hébergement Vercel (projet `vie-solution-web`, équipe `viesolution`) ; brouillons CRM par gabarits (rédaction par Claude API à rebrancher) ; FR seul |
| Dossiers de code | `src/`, `supabase/`, `tests/`, `.claude/`, `scripts/` |
| Hors périmètre de Claude | — |
| Vérification | `npm run verify` |
| Tests ciblés | `npm test` (`tests/*.test.mjs` — règles du suivi des demandes) |
| Serveur local | `npm run dev` → http://localhost:3000 |
| Déploiement | fusion de la PR sur `main` → déploiement Vercel automatique (projet Vercel `vie-solution-web`, voir `docs/ETAT-ACTUEL.md`) |
| Contrôle après déploiement | ouvrir `/`, `/ia`, `/zoho`, `/devis`, `/rdv`, `/contact`, `/admin` ; soumettre le formulaire de contact en test |
| Routes publiques | `src/app/` |
| Sitemap et navigation | `src/components/vsw/nav.tsx`, `src/components/vsw/footer.tsx` (pas de sitemap généré) |
| Langues | FR (français québécois, vouvoiement) |
| Valide les livraisons | Camille |

Détail des étapes de `npm run verify` : `tsc --noEmit` · `eslint` · `npm test` · `next build` · `node scripts/check-rules.mjs` · `node scripts/check-secrets-suivis.mjs`.
