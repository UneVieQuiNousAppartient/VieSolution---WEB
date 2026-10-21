import Link from 'next/link';
import { Icon } from './icon';

type CTASectionProps = {
  text?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
};

/* Carte d'appel à l'action : grand cadre arrondi, voile de couleur doux (jetons --accent /
   --accent-2), contenu centré. Inspiration « Gradient CTA Banner », 21st.dev. */
export function CTASection({
  text,
  primaryLabel = 'Réserver un appel découverte',
  primaryHref = '/rdv',
}: CTASectionProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-card reveal">
          <div className="eyebrow cta-card-eyebrow">{'// Prochaine étape'}</div>
          <h2 className="cta-card-title">
            {text ?? (
              <>
                Prêt à <em>mieux servir vos clients</em> et à retrouver du temps ? Un appel
                de 30 minutes, gratuit et sans engagement.
              </>
            )}
          </h2>
          <div className="cta-card-actions">
            <Link href={primaryHref} className="btn btn-primary btn-lg">
              {primaryLabel} <Icon name="arrow" size={14} />
            </Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
