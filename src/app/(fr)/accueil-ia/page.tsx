import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ServiceDetailSection } from '@/components/vsw/service-detail-section';
import { CTASection } from '@/components/vsw/cta-section';
import { APPEL } from '@/components/vsw/appel';

/*
 * Service « Accueil IA : clavardage, rendez-vous et voix » (demande de Camille, 2026-10-22 :
 * « je veux aussi un chatbot, on offre aussi ce service, on facilite la prise de rdv, prise de
 * rendez-vous avec IA, la voix c'est aussi un bon service »). Ce que fait l'agent vocal : réponses
 * de Camille (répond au téléphone, prend les rendez-vous, prend les messages, rappels et
 * confirmations). Aucun outil, prix ni délai nommé : rien que Camille n'a pas dit.
 */
export const metadata: Metadata = {
  title: 'Accueil IA : clavardage, rendez-vous et voix',
  description:
    "Un assistant de clavardage sur votre site, une prise de rendez-vous qui se fait toute seule, et un agent vocal qui répond au téléphone, prend les rendez-vous et les messages. Pour PME et travailleurs autonomes québécois.",
};

export default function AccueilIaPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Accueil IA"
        title={
          <>
            Bien accueillir<br />chaque client.
          </>
        }
        lede="Un assistant de clavardage sur votre site, une prise de rendez-vous qui se fait toute seule, et un agent vocal qui répond au téléphone. Vos clients sont accueillis tout de suite ; vous gardez le dernier mot."
      />
      <ServiceDetailSection
        id="accueil-ia"
        eyebrow="Ce qu'on installe"
        titre="Trois façons d'accueillir vos clients."
        accroche="Sur votre site, dans votre calendrier, au téléphone."
        intro="On part de votre façon de travailler : vos heures, vos services, les questions qu'on vous pose chaque semaine. L'assistant répond à ce qui revient souvent et vous transmet le reste."
        piliers={[
          {
            titre: 'Clavardage sur votre site',
            desc: "Un assistant répond aux questions de vos visiteurs : vos services, vos heures, comment se préparer. Ce qu'il ne sait pas, il vous le transmet.",
            items: ['Questions fréquentes', 'Sur votre site', 'Transfert vers vous'],
          },
          {
            titre: 'Prise de rendez-vous par IA',
            desc: "Le client choisit une heure libre dans votre calendrier. La confirmation et le rappel partent tout seuls.",
            items: ['Heures libres de votre calendrier', 'Confirmation', 'Rappel avant le rendez-vous'],
          },
          {
            titre: 'Agent vocal au téléphone',
            desc: "Quand vous ne pouvez pas répondre, un agent vocal le fait pour vous : il répond au téléphone, prend les rendez-vous et les messages, et confirme ou rappelle les rendez-vous.",
            items: ['Répond aux appels', 'Prend les rendez-vous', 'Prend les messages', 'Rappels et confirmations'],
          },
        ]}
        bandeau={
          <>
            <em>Vous gardez le dernier mot</em> : l&apos;assistant ne donne ni conseil ni réponse
            personnalisée ; il vous les transmet. On configure les accès selon la Loi 25.
          </>
        }
        boutonLibelle={APPEL.libelle}
        boutonLien={APPEL.href}
      />
      <CTASection
        text={
          <>
            Des appels <em>manqués</em> ou des questions qui reviennent ? On en parle lors d&apos;un
            appel gratuit de 30 minutes.
          </>
        }
      />
    </>
  );
}
