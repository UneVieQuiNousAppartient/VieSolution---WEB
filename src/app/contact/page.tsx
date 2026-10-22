import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Contact } from '@/components/vsw/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Écrivez à Vie Solution Web : automatisation, agents IA, implantation Zoho et formation. Réponse sous 24h ouvrables.",
};

export default function ContactPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Parlons de<br />votre projet.
          </>
        }
        lede="Réponse sous 24h, du lundi au vendredi. Pour les urgences, privilégiez le téléphone."
      />
      <Contact showIntro={false} />
    </>
  );
}
