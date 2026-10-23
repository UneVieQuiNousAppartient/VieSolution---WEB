'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Testimonial = { id: string; nom: string; metier: string | null; message: string; note: number };

/**
 * Témoignages publiés par Camille dans l'onglet « Avis » de l'admin (table vsw_avis, lue par /api/avis :
 * prénom et initiale seulement). Remplace site_testimonials le 2026-10-23 (étape E). La section ne
 * s'affiche que s'il existe des témoignages publiés.
 */
export function Testimonials() {
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
            <div className="eyebrow">Témoignages</div>
            <h2>Ils ont repris<br />le contrôle.</h2>
          </div>
          <p className="desc">
            Des entreprises québécoises qui travaillent déjà avec nous.{' '}
            <Link href="/avis">Vous êtes client ? Laissez un avis <span aria-hidden="true">→</span></Link>
          </p>
        </div>
        <div className="testimonials-grid">
          {items.map((t) => (
            <figure key={t.id} className="testimonial">
              {t.note ? (
                <div className="testimonial-stars" aria-label={`${t.note} sur 5`}>
                  {'★'.repeat(t.note)}
                </div>
              ) : null}
              <blockquote>« {t.message} »</blockquote>
              <figcaption>
                <strong>{t.nom}</strong>
                {t.metier ? <span>{t.metier}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
