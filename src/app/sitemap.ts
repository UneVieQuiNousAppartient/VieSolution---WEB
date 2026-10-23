import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';
import { articles } from '@/lib/blog';

/** Plan du site pour Google et les moteurs de réponses IA (/sitemap.xml). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...PUBLIC_ROUTES, ...articles().map((a) => ({ path: `/blog/${a.slug}`, priority: 0.6 }))];
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority,
  }));
}
