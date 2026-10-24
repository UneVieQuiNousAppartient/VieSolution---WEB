import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ServiceDetailSection } from '@/components/vsw/service-detail-section';
import { RealisationsGrid } from '@/components/vsw/realisations-grid';
import { CTASection } from '@/components/vsw/cta-section';
import { alternates, t, type Lang } from '@/lib/i18n';

export const metaSitesWeb = (lang: Lang): Metadata => ({
  title: t(lang, "Sites et applications web"),
  description: t(lang, "Sites vitrines, pages de destination et applications web pour PME et travailleurs autonomes québécois, reliés à vos outils : formulaires, rendez-vous, carnet de clients."),
  alternates: { canonical: lang === 'en' ? '/en/sites-web' : '/sites-web', ...alternates('/sites-web') },
});

export function PageSitesWeb({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow={t(lang, "Sites et applications web")}
        title={<>{t(lang, "Un site qui travaille")}<br />{t(lang, "pour votre entreprise.")}</>}
        lede={t(lang, "Un site clair qui donne confiance, une page pour lancer une offre, ou une application web pour vos clients et votre équipe. Bâti pour vous et relié à vos outils.")}
      />
      <ServiceDetailSection
        lang={lang}
        id="sites"
        eyebrow={t(lang, "Ce qu'on bâtit")}
        titre={t(lang, "Trois façons d'être en ligne.")}
        accroche={t(lang, "Reliées à vos outils.")}
        intro={t(lang, "Votre site est relié à vos outils : formulaires, rendez-vous, carnet de clients. Chaque information entre une seule fois.")}
        piliers={[
          {
            titre: t(lang, "Sites vitrines"),
            desc: t(lang, "Un site clair qui donne confiance : qui vous êtes, ce que vous faites, comment vous joindre."),
            items: [t(lang, "Pages claires"), t(lang, "Formulaire de contact relié à vos outils"), t(lang, "Prise de rendez-vous")],
          },
          {
            titre: t(lang, "Pages de destination"),
            desc: t(lang, "Une page pour lancer une offre, avec un seul but : que la personne vous écrive ou prenne rendez-vous."),
            items: [t(lang, "Une offre, une page"), t(lang, "Prise de rendez-vous"), t(lang, "Suivi des demandes")],
          },
          {
            titre: t(lang, "Applications web"),
            desc: t(lang, "Une application web pour vos clients et votre équipe, bâtie pour vous et reliée à vos outils : formulaires, rendez-vous, carnet de clients."),
            items: [t(lang, "Pour vos clients"), t(lang, "Pour votre équipe"), t(lang, "Reliée à vos outils")],
          },
        ]}
        bandeau={<>{t(lang, "Un site, c'est aussi être")} <em>{t(lang, "trouvé sur Google et par les IA")}</em> {t(lang, ": on s'en occupe avec le site.")}</>}
        boutonLibelle={t(lang, "Voir le référencement")}
        boutonLien="/referencement"
      />
      <RealisationsGrid lang={lang} />
      <CTASection
        lang={lang}
        text={<>{t(lang, "Un site à")} <em>{t(lang, "créer ou à refaire")}</em> {t(lang, "? On en parle lors d'un appel gratuit de 30 minutes.")}</>}
      />
    </>
  );
}
