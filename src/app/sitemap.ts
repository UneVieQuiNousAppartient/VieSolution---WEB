import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';
import { articles } from '@/lib/blog';
import { PAGES_ANGLAISES, alternates } from '@/lib/i18n';

const absolue = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;

/** Plan du site pour Google et les moteurs de réponses IA (/sitemap.xml). Pages anglaises (étape 1) : /en/…, avec hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...PUBLIC_ROUTES, ...articles().map((a) => ({ path: `/blog/${a.slug}`, priority: 0.6 }))];
  return routes.flatMap(({ path, priority }) => {
    const fr = { url: absolue(path), changeFrequency: 'monthly' as const, priority };
    if (!PAGES_ANGLAISES.includes(path)) return [fr];
    const l = alternates(path).languages;
    const languages = { 'fr-CA': absolue(l['fr-CA']), 'en-CA': absolue(l['en-CA']) };
    return [{ ...fr, alternates: { languages } }, { ...fr, url: absolue(l['en-CA']), alternates: { languages } }];
  });
}
