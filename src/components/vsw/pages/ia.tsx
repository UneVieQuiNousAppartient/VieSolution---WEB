import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { AISection } from '@/components/vsw/ai-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { CTASection } from '@/components/vsw/cta-section';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaIa = (lang: Lang): Metadata => ({
  title: t(lang, "Intelligence artificielle"),
  description: t(lang, "Automatisation des processus, assistants IA sur mesure et formation à l'IA pour PME et travailleurs autonomes québécois."),
  alternates: { canonical: lang === 'en' ? '/en/ia' : '/ia', ...alternates('/ia') },
});

export function PageIa({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "Intelligence artificielle")}
        title={<>{t(lang, "L'IA qui travaille")}<br />{t(lang, "pour vous.")}</>}
        lede={t(lang, "Un assistant IA bien réglé, des tâches qui se font toutes seules, et une formation pour être à l'aise. Trois façons d'utiliser l'IA dans votre quotidien. On s'occupe de la technique.")}
      />
      <DemarrerSection variant="ia" lang={lang} />
      <AISection lang={lang} />
      <CTASection
        lang={lang}
        text={<>{t(lang, "Un irritant à")} <em>{t(lang, "automatiser")}</em> {t(lang, "? On identifie les gains rapides lors d'un appel gratuit de 30 minutes.")}</>}
      />
    </>
  );
}
