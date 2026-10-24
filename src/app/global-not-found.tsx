import Link from 'next/link';
import { Racine, metaRacine } from '@/components/vsw/racine';
import { PageHeader } from '@/components/vsw/page-header';
import { APPEL } from '@/components/vsw/appel';

// 404 d'une adresse inconnue. Deux mises en page racines depuis l'anglais (app/(fr)/, app/en/) : une
// adresse qui ne correspond à aucune page n'en a pas, et Next affiche ce fichier avec sa propre <html>
// (experimental.globalNotFound, next.config.ts) — même principe que KHI. En français, avec un lien anglais.
export const metadata = { ...metaRacine('fr'), title: 'Page introuvable', robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <Racine lang="fr">
      <PageHeader
        eyebrow="Erreur 404"
        title="Cette page n'existe pas."
        lede={
          <>
            L&apos;adresse a peut-être changé. Retournez à l&apos;<Link href="/">accueil</Link>, ou{' '}
            <Link href={APPEL.href}>réservez votre appel gratuit</Link>.{' '}
            <span lang="en-CA">Page not found — <Link href="/en">English home page</Link>.</span>
          </>
        }
      />
    </Racine>
  );
}
