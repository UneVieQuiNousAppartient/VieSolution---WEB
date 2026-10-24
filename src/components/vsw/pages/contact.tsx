import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Contact } from '@/components/vsw/contact';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaContact = (lang: Lang): Metadata => ({
  title: t(lang, "Contact"),
  description: t(lang, "Écrivez à Vie Solution Web : automatisation, agents IA, implantation Zoho et formation. Réponse sous 24h ouvrables."),
  alternates: { canonical: lang === 'en' ? '/en/contact' : '/contact', ...alternates('/contact') },
});

export function PageContact({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "Contact")}
        title={<>{t(lang, "Parlons de")}<br />{t(lang, "votre projet.")}</>}
        lede={t(lang, "Réponse sous 24h, du lundi au vendredi. Pour les urgences, privilégiez le téléphone.")}
      />
      <Contact showIntro={false} lang={lang} />
    </>
  );
}
