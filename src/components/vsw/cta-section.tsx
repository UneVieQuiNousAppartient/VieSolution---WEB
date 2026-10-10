import Link from 'next/link';
import { Icon } from './icon';

type CTASectionProps = {
  text?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
};

export function CTASection({
  text,
  primaryLabel = 'Réserver un appel découverte',
  primaryHref = '/rdv',
}: CTASectionProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-banner" style={{ borderTop: 'none' }}>
            <div className="ai-banner-text">
              {text ?? (
                <>
                  Prêt à <em>reprendre le contrôle</em> de votre gestion ? Un appel de
                  30 minutes, gratuit et sans engagement.
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={primaryHref} className="btn btn-primary btn-lg">
                {primaryLabel} <Icon name="arrow" size={14} />
              </Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">
                Nous écrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
