import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { CTASection } from '@/components/vsw/cta-section';
import { BlogListe } from '@/components/vsw/blog-liste';
import { articles } from '@/lib/blog';

/* Blog (maquette validée par Camille le 2026-10-23) : les articles approuvés, filtrés par pilier.
   Remplace l'ancienne page de l'ancien design (articles d'exemple, jamais publiés). */
export const metadata: Metadata = {
  title: 'Blog',
  description:
    "IA, Claude et ChatGPT, Zoho, outils de gestion : des conseils simples pour les PME et travailleurs autonomes du Québec, une étape à la fois.",
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const cartes = articles().map(({ slug, titre, pilier, resume, minutes }) => ({ slug, titre, pilier, resume, minutes }));
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Blog"
        title={
          <>
            Des conseils simples,<br />pour avancer une étape à la fois.
          </>
        }
        lede="IA, Zoho, outils de gestion : ce qu'on explique à nos clients pendant l'appel découverte, écrit pour vous."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <BlogListe articles={cartes} />
        </div>
      </section>
      <CTASection />
    </>
  );
}
