# Vie Solution Web — contexte du projet

Site vitrine de Vie Solution Web (studio québécois : automatisation, agents IA,
implantation Zoho, formation). Marque et promesse : « Une vie qui nous appartient ».
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

`/` (accueil), `/ia`, `/zoho`, `/devis` (« Combien ça coûte ? » : démarche de prix, formulaire de situation, niveaux d'accompagnement sans montant), `/realisations`,
`/a-propos`, `/rdv`, `/contact`, `/postuler-stagiaire`, `/admin` (+ pages légales).
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
  « Reprendre contact » (30 jours). Tout s'arrête dès un contact humain noté dans `/admin`.
- **Courriels automatiques** : seules les relances 1 et 2 (textes approuvés et activées par
  Camille le 2026-10-21) partent seules ; la première réponse reste un brouillon à
  approuver. Envoi par Resend (`src/lib/crm/envoi.ts`). Loi anti-pourriel (LCAP,
  `src/lib/crm/regles.ts`) : pied avec adresse postale (`vsw_settings.postal_address`) et
  lien de désabonnement (`/api/desabonnement`) — sans adresse postale, rien ne part.
- Règles pures testées : `npm test` (`tests/*.test.mjs`, Node retire les types).
- Admin `/admin` : code d'accès (`ADMIN_ACCESS_CODE`) → cookie httpOnly ; routes
  `/api/admin/*` utilisent `SUPABASE_SERVICE_ROLE_KEY` côté serveur.

## .env.local attendu

```
NEXT_PUBLIC_SUPABASE_URL=https://gflkfwalfaeeknauxyig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon>
SUPABASE_SERVICE_ROLE_KEY=<clé service_role — jamais côté client>
ADMIN_ACCESS_CODE=<code d'accès admin>
CRON_SECRET=<32 caractères au hasard — Vercel l'envoie au passage horaire>
UNSUBSCRIBE_SECRET=<32 caractères au hasard — signe les liens de désabonnement ; ne plus le changer>
RESEND_API_KEY=<clé Resend>
EMAIL_FROM=Vie Solution Web <adresse d'un domaine vérifié dans Resend>
EMAIL_REPLY_TO=<adresse qui reçoit les réponses des prospects>
```

## État au 2026-10-10

- Site : terminé, build OK (`npm run build`).
- CRM : code livré ; le SQL `setup-crm-vsw.sql` n'a PAS encore été exécuté dans
  Supabase ; projet Vercel `vie-solution-web` créé le 2026-10-21 (équipe `viesolution`, relié
  au dépôt ; KHI s'y déploie déjà avec un cron horaire dans son `vercel.json`) — variables d'environnement à
  saisir par Camille ; secours pg_cron en fin de fichier SQL.
- Pas encore en ligne : la branche de production Vercel est la branche par défaut du dépôt
  (`claude/nextjs-web-project-RPcId`) ; aucun domaine branché.
- Domaine : **viesolutionweb.ca** (confirmé par Camille le 2026-10-21) — écrit une seule fois, dans `src/lib/site.ts`.

## [à confirmer] avant mise en ligne — ne pas inventer, demander à Camille

- Courriels `bonjour@viesolutionweb.ca` / `stages@viesolutionweb.ca` et téléphone
  `(418) 555-0143` : placeholders du design.
- Aucun montant sur le site public (décision de Camille, 2026-10-17) : les prix sont donnés par écrit après l'appel découverte.
- Témoignages `site_testimonials` : exemples non publiés (`publie = false`) —
  ne publier que de vrais témoignages.

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
