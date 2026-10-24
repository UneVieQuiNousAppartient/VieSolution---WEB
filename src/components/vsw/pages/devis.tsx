import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { CommentPrixSection } from '@/components/vsw/comment-prix-section';
import { SituationForm } from '@/components/vsw/situation-form';
import { PricingSection } from '@/components/vsw/pricing-section';
import { CTASection } from '@/components/vsw/cta-section';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaDevis = (lang: Lang): Metadata => ({
  title: t(lang, "Combien ça coûte ?"),
  description: t(lang, "Un prix clair avant de commencer, sans frais cachés : on regarde votre situation, on propose un premier pas, vous décidez."),
  alternates: { canonical: lang === 'en' ? '/en/devis' : '/devis', ...alternates('/devis') },
});

export function PageDevis({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "Combien ça coûte ?")}
        title={<>{t(lang, "Un prix clair,")}<br />{t(lang, "avant de commencer.")}</>}
        lede={t(lang, "Chaque entreprise est différente, alors chaque prix l'est aussi. On regarde votre situation, on vous propose un premier pas, et vous connaissez le prix avant de dire oui. Pas de frais cachés.")}
      />
      <CommentPrixSection lang={lang} />
      <SituationForm lang={lang} />
      <PricingSection lang={lang} />
      <CTASection
        lang={lang}
        ecrit
        text={<>{t(lang, "Une question sur le prix ? On y répond")} <em>{t(lang, "franchement")}</em>{t(lang, ", à l'appel découverte gratuit.")}</>}
      />
    </>
  );
}
