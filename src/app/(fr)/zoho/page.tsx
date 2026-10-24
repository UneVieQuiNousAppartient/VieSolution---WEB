import { PageZoho, metaZoho } from '@/components/vsw/pages/zoho';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/zoho.tsx.
export const metadata = metaZoho('fr');

export default function Page() {
  return <PageZoho lang="fr" />;
}
