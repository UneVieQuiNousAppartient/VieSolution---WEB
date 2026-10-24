import { PageSitesWeb, metaSitesWeb } from '@/components/vsw/pages/sites-web';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/sites-web.tsx.
export const metadata = metaSitesWeb('fr');

export default function Page() {
  return <PageSitesWeb lang="fr" />;
}
