import { PageContact, metaContact } from '@/components/vsw/pages/contact';

// Contenu partagé avec la version française : src/components/vsw/pages/contact.tsx.
export const metadata = metaContact('en');

export default function Page() {
  return <PageContact lang="en" />;
}
