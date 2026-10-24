'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lienLangue, t, type Lang } from '@/lib/i18n';

type Testimonial = { id: string; nom: string; metier: string | null; message: string; note: number };

/**
 * Témoignages publiés par Camille dans l'onglet « Avis » de l'admin (table vsw_avis, lue par /api/avis :
 * prénom et initiale seulement). Remplace site_testimonials le 2026-10-23 (étape E). La section ne
 * s'affiche que s'il existe des témoignages publiés.
 */
export function Testimonials({ lang = 'fr' }: { lang?: Lang }) {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/avis')
      .then((r) => (r.ok ? r.json() : { avis: [] }))
      .then((j: { avis?: Testimonial[] }) => {
        if (!cancelled && Array.isArray(j.avis)) setItems(j.avis);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="temoignages" className="section">
      <div className="container">
        <div className="section-head reveal in">
          <div>
            <div className="eyebrow">{t(lang, "Témoignages")}</div>
            <h2>{t(lang, "Ils ont repris")}<br />{t(lang, "le contrôle.")}</h2>
          </div>
          <p className="desc">
            {t(lang, "Des entreprises québécoises qui travaillent déjà avec nous.")}{' '}
            <Link href={lienLangue(lang, '/avis')}>{t(lang, "Vous êtes client ? Laissez un avis")} <span aria-hidden="true">→</span></Link>
          </p>
        </div>
        <div className="testimonials-grid">
          {items.map((a) => (
            <figure key={a.id} className="testimonial">
              {a.note ? (
                <div className="testimonial-stars" aria-label={t(lang, "{note} sur 5", { note: a.note })}>
                  {'★'.repeat(a.note)}
                </div>
              ) : null}
              <blockquote>« {a.message} »</blockquote>
              <figcaption>
                <strong>{a.nom}</strong>
                {a.metier ? <span>{a.metier}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
