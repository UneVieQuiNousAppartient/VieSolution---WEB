import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RevealInit } from '@/components/vsw/reveal-init';
import { Icon } from '@/components/vsw/icon';
import { APPEL } from '@/components/vsw/appel';
import { ProcessSection } from '@/components/vsw/process-section';
import { CTASection } from '@/components/vsw/cta-section';
import { SERVICES_NAV } from '@/components/vsw/nav';
import { IA_RDV, IA_TACHES, METIERS, SITUATIONS, metierParSlug } from '@/lib/metiers';

/*
 * Page d'un métier (refonte du 2026-10-23, maquette validée par Camille) : comment on peut aider.
 * Textes repris de la carte du métier (src/lib/metiers.ts) : ce qui vous gruge → ce qu'on installe
 * (avec les services liés) → ce que ça change → le temps retrouvé ; les situations qui lui
 * ressemblent ; « Comment on travaille » ; les autres métiers ; l'appel.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return METIERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = metierParSlug((await params).slug);
  if (!m) return {};
  return { title: m.titre, description: `${m.gruge} ${m.ameliore}` };
}

export default async function MetierPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = metierParSlug((await params).slug);
  if (!m) notFound();
  const services = m.services
    .map((href) => SERVICES_NAV.find((s) => s.href === href))
    .filter((s): s is (typeof SERVICES_NAV)[number] => Boolean(s));
  const autres = METIERS.filter((x) => x.slug !== m.slug);

  return (
    <>
      <RevealInit />
      <section className="section page-header" style={{ borderTop: 'none', paddingTop: 72, paddingBottom: 48 }}>
        <div className="hero-grid" aria-hidden="true"></div>
        <div className="container" style={{ position: 'relative' }}>
          <nav className="fil-ariane" aria-label="Fil d’Ariane">
            <Link href="/metiers">Métiers</Link> <span aria-hidden="true">›</span> <span aria-current="page">{m.titre}</span>
          </nav>
          <div className="eyebrow">Pour votre métier</div>
          <h1 className="display" style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', margin: '24px 0 16px', maxWidth: 820, letterSpacing: '-0.03em' }}>
            {m.titre}
          </h1>
          {m.precision && <p className="metier-page-precision">{m.precision}</p>}
          <p style={{ color: 'var(--fg-2)', fontSize: 18, maxWidth: 640, lineHeight: 1.6, margin: '0 0 28px' }}>{m.ameliore}</p>
          <div className="metier-page-appel">
            <Link href={APPEL.href} className="btn btn-primary btn-lg">
              {APPEL.libelle} <Icon name="arrow" size={14} />
            </Link>
            <span className="metier-page-appel-note">30&nbsp;min, sans engagement</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="pm-trio metier-page-trio reveal">
            <div className="pm-bloc">
              <div className="metier-label">Ce qui vous gruge</div>
              <p>{m.gruge}</p>
            </div>
            <div className="pm-bloc">
              <div className="metier-label">Ce qu&apos;on installe</div>
              <div className="service-tags pm-tags">
                {m.tags.map((t) => <span className="service-tag" key={t}>{t}</span>)}
                {m.rdvIa && <Link href={IA_RDV.href} className="service-tag pm-tag-ia">{IA_RDV.libelle}</Link>}
                <Link href={IA_TACHES.href} className="service-tag pm-tag-ia">{IA_TACHES.libelle}</Link>
              </div>
              {services.length > 0 && (
                <ul className="metier-page-services">
                  {services.map((s) => (
                    <li key={s.href}><Link href={s.href}>{s.label} <span aria-hidden="true">→</span></Link></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="pm-bloc metier-ameliore">
              <div className="metier-label">Ce que ça change</div>
              <p><span aria-hidden="true">→ </span>{m.ameliore}</p>
              <p className="metier-page-temps"><strong>Le temps retrouvé :</strong> {m.temps}</p>
            </div>
          </div>
          {m.note && <p className="metier-page-note reveal">{m.note}</p>}

          <h2 className="metier-page-h2 reveal">Vous vous reconnaissez ?</h2>
          <ul className="pv-grille metier-page-situations reveal">
            {m.situations.map((i) => {
              const s = SITUATIONS[i];
              return (
                <li key={s.avant}>
                  <div className="pv-carte" style={{ cursor: 'default' }}>
                    <span className="pv-haut">
                      <span className="pv-icone" aria-hidden="true"><Icon name={s.icone} size={20} /></span>
                    </span>
                    <span className="pv-avant">{s.avant}</span>
                    <span className="pv-apres"><span aria-hidden="true">→</span> {s.apres}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ProcessSection />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="metier-page-autres-titre">Autres métiers</p>
          <ul className="metier-page-autres">
            {autres.map((x) => (
              <li key={x.slug}><Link href={`/metiers/${x.slug}`} className="service-tag">{x.titre}</Link></li>
            ))}
            <li><Link href="/metiers" className="service-tag">Tous les métiers →</Link></li>
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  );
}
