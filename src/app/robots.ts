import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * /robots.txt — tout le site public est ouvert aux moteurs de recherche ET aux robots des
 * assistants IA (AEO : être cité par ChatGPT, Claude, Perplexity, réponses IA de Google).
 * Seuls l'administration et les routes d'API sont fermées.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
