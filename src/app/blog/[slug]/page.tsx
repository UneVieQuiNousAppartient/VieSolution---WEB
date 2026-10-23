import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/vsw/icon';
import { APPEL } from '@/components/vsw/appel';
import { JsonLd } from '@/components/vsw/json-ld';
import { BlogTexte } from '@/components/vsw/blog-texte';
import { SERVICES_NAV } from '@/components/vsw/nav';
import { articleParSlug, articles, dateLisible } from '@/lib/blog';
import { cheminArticle } from '@/lib/blog-markdown';
import { metierParSlug } from '@/lib/metiers';
import { SITE_URL } from '@/lib/site';

/*
 * Page d'un article du Blog (maquette validée par Camille le 2026-10-23) : fil d'Ariane, titre,
 * signature et date d'approbation, chapeau, plan, texte, appel ; sur le côté, le service lié, les
 * métiers et « À lire aussi ». Le texte vient de src/content/blog/<slug>.md, approuvé par Camille.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return articles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = articleParSlug((await params).slug);
  if (!a) return {};
  return {
    title: a.titre,
    description: a.description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { type: 'article', title: a.titre, description: a.description, publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = articleParSlug((await params).slug);
  if (!a) notFound();
  const [chapeau, ...suite] = a.blocs[0]?.type === 'p' ? a.blocs : [null, ...a.blocs];
  const services = a.liens
    .map((href) => SERVICES_NAV.find((s) => s.href === href))
    .filter((s): s is (typeof SERVICES_NAV)[number] => Boolean(s));
  const metiers = a.liens
    .filter((href) => href.startsWith('/metiers/'))
    .map((href) => metierParSlug(href.slice('/metiers/'.length)))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const autres = articles()
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => Number(y.pilier === a.pilier) - Number(x.pilier === a.pilier))
    .slice(0, 3);
  const auteur = a.auteur.split(',')[0].trim();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: a.titre,
          description: a.description,
          datePublished: a.date,
          inLanguage: 'fr-CA',
          author: { '@type': 'Person', name: auteur },
          publisher: { '@type': 'Organization', name: 'Vie Solution Web', url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
        }}
      />
      <article className="section blog-article" style={{ borderTop: 'none', paddingTop: 72 }}>
        <div className="container blog-grille">
          <div className="blog-principal">
            <nav className="fil-ariane" aria-label="Fil d’Ariane">
              <Link href="/blog">Blog</Link> <span aria-hidden="true">›</span> <span>{a.pilier}</span>
            </nav>
            <h1 className="blog-titre">{a.titre}</h1>
            <p className="blog-meta">
              Par {a.auteur} · publié le <time dateTime={a.date}>{dateLisible(a.date)}</time> · {a.minutes} min de lecture
            </p>
            {chapeau && chapeau.type === 'p' && <BlogTexte blocs={[chapeau]} />}
            {a.plan.length > 1 && (
              <nav className="blog-plan" aria-label="Plan de l’article">
                <p className="blog-encadre-titre">Plan de l&apos;article</p>
                <ol>
                  {a.plan.map((p) => <li key={p.id}><a href={`#${p.id}`}>{p.texte.replace(/^\d+\.\s*/, '')}</a></li>)}
                </ol>
              </nav>
            )}
            <BlogTexte blocs={suite.filter((b): b is NonNullable<typeof b> => Boolean(b))} />
            <div className="blog-appel section--nuit">
              <p className="blog-appel-titre">Vous voulez voir par où commencer chez vous ?</p>
              <div className="metier-page-appel">
                <Link href={APPEL.href} className="btn btn-primary btn-lg">
                  {APPEL.libelle} <Icon name="arrow" size={14} />
                </Link>
                <span className="blog-appel-note">30&nbsp;min, sans engagement</span>
              </div>
            </div>
          </div>
          <aside className="blog-cote" aria-label="Pour aller plus loin">
            {services.length > 0 && (
              <div className="blog-cote-bloc">
                <p className="blog-encadre-titre">Le service lié</p>
                <ul>
                  {services.map((s) => <li key={s.href}><Link href={s.href}>{s.label} <span aria-hidden="true">→</span></Link></li>)}
                </ul>
              </div>
            )}
            {metiers.length > 0 && (
              <div className="blog-cote-bloc">
                <p className="blog-encadre-titre">Pour votre métier</p>
                <ul>
                  {metiers.map((m) => <li key={m.slug}><Link href={`/metiers/${m.slug}`}>{m.titre} <span aria-hidden="true">→</span></Link></li>)}
                </ul>
              </div>
            )}
            <div className="blog-cote-bloc">
              <p className="blog-encadre-titre">À lire aussi</p>
              <ul>
                {autres.map((x) => <li key={x.slug}><Link href={cheminArticle(x.slug)}>{x.titre}</Link></li>)}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
