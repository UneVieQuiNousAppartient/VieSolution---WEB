'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type Testimonial = {
  id: string;
  auteur: string;
  role: string | null;
  citation: string;
  note: number | null;
};

/**
 * Témoignages chargés depuis Supabase (table site_testimonials, publie = true).
 * La section ne s'affiche que s'il existe des témoignages publiés.
 */
export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('site_testimonials')
      .select('id, auteur, role, citation, note')
      .eq('publie', true)
      .order('ordre', { ascending: true })
      .limit(6)
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setItems(data as Testimonial[]);
      });
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
            Des entreprises québécoises qui travaillent déjà avec nous.
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
              <blockquote>« {t.citation} »</blockquote>
              <figcaption>
                <strong>{t.auteur}</strong>
                {t.role ? <span>{t.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
