// Anglais du site : t(lang, « phrase française ») — règles dans ./i18n-regles (testées).
import { EN } from '@/i18n/en';
import { traduire, type Lang } from './i18n-regles';

export type { Lang } from './i18n-regles';
export { PAGES_ANGLAISES, phrase, alternates, cheminAutreLangue, langueDe, lienLangue } from './i18n-regles';

/** Traduction d'une phrase française. Écrire la phrase entre guillemets doubles ou accents graves (scripts/i18n.mjs la relève). */
export const t = (lang: Lang, fr: string, vars?: Record<string, string | number>) => traduire(EN, lang, fr, vars);
