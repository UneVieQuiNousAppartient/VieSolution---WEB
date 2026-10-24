'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { APPEL } from './appel';
import { Icon } from './icon';
import { lienLangue, t, type Lang } from '@/lib/i18n';

/*
 * Barre fixe « Réserver mon appel gratuit » en bas de l'écran, sur téléphone seulement (≤ 640 px,
 * vsw.css). Maquette validée par Camille le 2026-10-22. Elle apparaît une fois le haut de page
 * dépassé (pas par-dessus le premier bouton), se cache au-dessus du pied de page et n'existe pas
 * sur /rdv et /en/rdv (la page de réservation elle-même) ni sur /admin. Quand elle est visible, le bouton de
 * clavardage remonte (attribut data-barre-appel sur <html>).
 */
const SEUIL = 480;

export function BarreAppel({ lang = 'fr' }: { lang?: Lang }) {
  const pathname = usePathname();
  const absente = pathname.startsWith('/rdv') || pathname.startsWith('/en/rdv') || pathname.startsWith('/admin');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (absente) return;
    let piedVisible = false;
    const maj = () => setVisible(window.scrollY > SEUIL && !piedVisible);
    const pied = document.querySelector('footer');
    const obs = pied
      ? new IntersectionObserver(([e]) => {
          piedVisible = e.isIntersecting;
          maj();
        })
      : null;
    if (pied && obs) obs.observe(pied);
    maj();
    window.addEventListener('scroll', maj, { passive: true });
    return () => {
      window.removeEventListener('scroll', maj);
      obs?.disconnect();
    };
  }, [absente]);

  const affichee = visible && !absente;
  useEffect(() => {
    const html = document.documentElement;
    if (affichee) html.dataset.barreAppel = 'on';
    else delete html.dataset.barreAppel;
    return () => {
      delete html.dataset.barreAppel;
    };
  }, [affichee]);

  if (absente) return null;
  return (
    <div className="barre-appel" data-visible={affichee || undefined} inert={!affichee}>
      <Link href={lienLangue(lang, APPEL.href)} className="btn btn-primary btn-lg">
        {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
      </Link>
      <small>{t(lang, "30 minutes · gratuit · sans engagement")}</small>
    </div>
  );
}
