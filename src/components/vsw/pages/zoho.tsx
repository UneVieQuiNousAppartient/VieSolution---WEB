import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ZohoSection } from '@/components/vsw/zoho-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { ZohoApercu } from '@/components/vsw/zoho-apercu';
import { CTASection } from '@/components/vsw/cta-section';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaZoho = (lang: Lang): Metadata => ({
  title: t(lang, "Implantation Zoho"),
  description: t(lang, "Implantation, configuration et formation Zoho (CRM, Books, Desk, Campaigns) chez les PME québécoises. Votre gestion centralisée au même endroit."),
  alternates: { canonical: lang === 'en' ? '/en/zoho' : '/zoho', ...alternates('/zoho') },
});

export function PageZoho({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "Zoho, simplement")}
        title={<>{t(lang, "Toute votre gestion,")}<br />{t(lang, "au même endroit.")}</>}
        lede={t(lang, "Vos clients, vos factures, votre soutien client, vos infolettres : on installe Zoho chez vous, on le règle selon votre façon de travailler et on vous forme jusqu'à ce que vous soyez à l'aise.")}
      />
      <DemarrerSection variant="zoho" lang={lang} />
      <ZohoSection lang={lang} />
      <ZohoApercu lang={lang} />
      <CTASection
        lang={lang}
        text={<><em>{t(lang, "Une vie qui vous appartient")}</em> {t(lang, "— reprenez la main sur la gestion de votre entreprise.")}</>}
      />
    </>
  );
}
