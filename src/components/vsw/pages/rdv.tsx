import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Booking } from '@/components/vsw/booking';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaRdv = (lang: Lang): Metadata => ({
  title: t(lang, "Réserver mon appel gratuit"),
  description: t(lang, "Réservez un appel découverte gratuit de 30 minutes avec Vie Solution Web : automatisation, IA et implantation Zoho pour votre entreprise."),
  alternates: { canonical: lang === 'en' ? '/en/rdv' : '/rdv', ...alternates('/rdv') },
});

export function PageRdv({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "Votre appel gratuit")}
        title={<>{t(lang, "Un appel découverte")}<br />{t(lang, "gratuit, 30 minutes.")}</>}
        lede={t(lang, "Échangeons sur votre projet, vos objectifs et votre contexte. Sans engagement, en visio ou par téléphone. Vous repartez avec une vision claire des prochaines étapes.")}
      />
      <Booking showHead={false} lang={lang} />
    </>
  );
}
