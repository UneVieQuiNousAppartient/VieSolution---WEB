import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
};

/** En-tête commun des pages intérieures. */
export function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <section className="section page-header" style={{ borderTop: 'none', paddingTop: 96, paddingBottom: 64 }}>
      <div className="hero-grid" aria-hidden="true"></div>
      <div className="container" style={{ position: 'relative' }}>
        <div className="eyebrow">{eyebrow}</div>
        <h1
          className="display"
          style={{ fontSize: 'clamp(40px, 5.5vw, 68px)', margin: '24px 0 20px', maxWidth: 820, letterSpacing: '-0.03em' }}
        >
          {title}
        </h1>
        {lede && (
          <p style={{ color: 'var(--fg-2)', fontSize: 17, maxWidth: 640, lineHeight: 1.6, margin: 0 }}>
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
