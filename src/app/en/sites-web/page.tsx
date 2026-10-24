import { PageSitesWeb, metaSitesWeb } from '@/components/vsw/pages/sites-web';

// Contenu partagé avec la version française : src/components/vsw/pages/sites-web.tsx.
export const metadata = metaSitesWeb('en');

export default function Page() {
  return <PageSitesWeb lang="en" />;
}
