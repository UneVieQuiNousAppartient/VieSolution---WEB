import Link from 'next/link';
import { Icon } from './icon';
import { APPEL, ECRIT } from './appel';

type CTASectionProps = {
  text?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  /** Deuxième bouton « Décrire ma situation par écrit » : seulement sur Prix (refonte du 2026-10-23, un seul bouton ailleurs). */
  ecrit?: boolean;
};

/* Carte d'appel à l'action : grand cadre arrondi, voile de couleur doux (jetons --accent /
   --accent-2), contenu centré. Inspiration « Gradient CTA Banner », 21st.dev. */
export function CTASection({
  text,
  primaryLabel = APPEL.libelle,
  primaryHref = APPEL.href,
  ecrit = false,
}: CTASectionProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-card section--nuit reveal">
          <div className="eyebrow cta-card-eyebrow">{'Prochaine étape'}</div>
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
            {ecrit && (
              <Link href={ECRIT.href} className="btn btn-ghost btn-lg">
                {ECRIT.libelle}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
