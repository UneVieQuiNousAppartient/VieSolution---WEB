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

`/` (accueil), `/ia`, `/zoho`, `/devis` (calculateur + forfaits), `/realisations`,
`/a-propos`, `/rdv`, `/contact`, `/postuler-stagiaire`, `/admin` (+ pages légales).
Les anciennes URLs sont redirigées en 308 dans `next.config.ts`.

## CRM (réplique du modèle KHI EDUC, isolé par préfixe vsw_)

- Schéma complet : `supabase/setup-crm-vsw.sql` (fichier DÉFINITIF — remplace
  `vsw-lead-system.sql` et `setup-crm-complet.sql`, conservés pour historique).
  ⚠️ Le projet Supabase est PARTAGÉ avec la plateforme CSF : ne JAMAIS toucher aux
  tables sans préfixe (`leads`, `settings`, `bookings`… appartiennent à CSF).
- Flux : formulaires du site → triggers `fn_vsw_lead_intake` → `vsw_leads` (dédup
  par courriel) → Edge Function `vsw-lead-followup` (brouillon IA `first_reply`,
  relance 48h) → `vsw_outreach_drafts` en `pending` → approbation humaine dans `/admin`.
  Aucun courriel n'est envoyé automatiquement.
- Edge Function : `supabase/functions/vsw-lead-followup/index.ts` (Deno — exclu du
  tsconfig). Auth : Bearer = `vsw_settings.cron_secret`. Claude API si
  `ANTHROPIC_API_KEY` est défini, sinon gabarits de `vsw_email_templates`.
- Admin `/admin` : code d'accès (`ADMIN_ACCESS_CODE`) → cookie httpOnly ; routes
  `/api/admin/*` utilisent `SUPABASE_SERVICE_ROLE_KEY` côté serveur.

## .env.local attendu

```
NEXT_PUBLIC_SUPABASE_URL=https://gflkfwalfaeeknauxyig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon>
SUPABASE_SERVICE_ROLE_KEY=<clé service_role — jamais côté client>
ADMIN_ACCESS_CODE=<code d'accès admin>
```

## État au 2026-10-10

- Site : terminé, build OK (`npm run build`).
- CRM : code livré ; le SQL `setup-crm-vsw.sql` n'a PAS encore été exécuté dans
  Supabase, l'Edge Function n'est PAS déployée, le cron n'est PAS planifié
  (bloc commenté en fin de fichier SQL).
- Pas encore déployé en ligne (Vercel à créer après un git push).

## [à confirmer] avant mise en ligne — ne pas inventer, demander à Camille

- Courriels `bonjour@viesolutionweb.ca` / `stages@viesolutionweb.ca` et téléphone
  `(418) 555-0143` : placeholders du design.
- Tous les prix (calculateur `quote-calculator.tsx`, forfaits `pricing-section.tsx`,
  chatbot) : indicatifs.
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
| Pile | Next.js 16 (App Router, Turbopack), TypeScript, Tailwind 4 ; Supabase (projet partagé `gflkfwalfaeeknauxyig`, tables `vsw_*`) ; Edge Function Deno `vsw-lead-followup` ; hébergement Vercel (projet à créer) ; IA : Claude API (brouillons CRM) ; FR seul |
| Dossiers de code | `src/`, `supabase/`, `.claude/`, `scripts/` |
| Hors périmètre de Claude | — |
| Vérification | `npm run verify` |
| Tests ciblés | — (aucun test automatisé pour l'instant) |
| Serveur local | `npm run dev` → http://localhost:3000 |
| Déploiement | fusion de la PR sur `main` → déploiement Vercel automatique (projet Vercel à créer, voir `docs/ETAT-ACTUEL.md`) |
| Contrôle après déploiement | ouvrir `/`, `/ia`, `/zoho`, `/devis`, `/rdv`, `/contact`, `/admin` ; soumettre le formulaire de contact en test |
| Routes publiques | `src/app/` |
| Sitemap et navigation | `src/components/vsw/nav.tsx`, `src/components/vsw/footer.tsx` (pas de sitemap généré) |
| Langues | FR (français québécois, vouvoiement) |
| Valide les livraisons | Camille |

Détail des étapes de `npm run verify` : `tsc --noEmit` · `eslint` · `next build` · `node scripts/check-rules.mjs` · `node scripts/check-secrets-suivis.mjs`.
