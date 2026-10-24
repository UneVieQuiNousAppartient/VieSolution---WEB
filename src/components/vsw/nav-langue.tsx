'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cheminAutreLangue, type Lang } from '@/lib/i18n';

/** Bouton FR | EN (étape 1 de l'anglais) : la même page dans l'autre langue, ou l'accueil de l'autre langue. */
export function NavLangue({ lang, onClick }: { lang: Lang; onClick?: () => void }) {
  const autre = cheminAutreLangue(usePathname() || '/');
  return (
    <span className="nav-langue">
      {lang === 'fr' ? (
        <>
          <span aria-current="true">FR</span>
          <span aria-hidden="true">|</span>
          <Link href={autre} hrefLang="en-CA" lang="en-CA" aria-label="English version" onClick={onClick}>EN</Link>
        </>
      ) : (
        <>
          <Link href={autre} hrefLang="fr-CA" lang="fr-CA" aria-label="Version française" onClick={onClick}>FR</Link>
          <span aria-hidden="true">|</span>
          <span aria-current="true">EN</span>
        </>
      )}
    </span>
  );
}
