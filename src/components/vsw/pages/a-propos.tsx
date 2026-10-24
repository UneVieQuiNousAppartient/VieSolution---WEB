import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { About } from '@/components/vsw/about';
import { ProcessSection } from '@/components/vsw/process-section';
import { InternsSection } from '@/components/vsw/interns-section';
import { CTASection } from '@/components/vsw/cta-section';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaAPropos = (lang: Lang): Metadata => ({
  title: t(lang, "À propos"),
  description: t(lang, "Vie Solution Web : un studio québécois indépendant qui aide PME et travailleurs autonomes à reprendre le contrôle de leur gestion grâce à l'IA et à Zoho."),
  alternates: { canonical: lang === 'en' ? '/en/a-propos' : '/a-propos', ...alternates('/a-propos') },
});

export function PageAPropos({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "À propos")}
        title={<>{t(lang, "Comprendre d'abord,")}<br />{t(lang, "bâtir ensuite.")}</>}
        lede={t(lang, "Un studio indépendant, basé au Québec, qui croit qu'une entreprise bien outillée appartient vraiment à ceux qui la font vivre.")}
      />
      <About lang={lang} />
      <ProcessSection lang={lang} />
      <InternsSection lang={lang} />
      <CTASection lang={lang} />
    </>
  );
}
