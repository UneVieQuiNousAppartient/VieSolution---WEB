import { PageContact, metaContact } from '@/components/vsw/pages/contact';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/contact.tsx.
export const metadata = metaContact('fr');

export default function Page() {
  return <PageContact lang="fr" />;
}
