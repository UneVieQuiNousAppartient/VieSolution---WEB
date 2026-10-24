import { PageZoho, metaZoho } from '@/components/vsw/pages/zoho';

// Contenu partagé avec la version française : src/components/vsw/pages/zoho.tsx.
export const metadata = metaZoho('en');

export default function Page() {
  return <PageZoho lang="en" />;
}
