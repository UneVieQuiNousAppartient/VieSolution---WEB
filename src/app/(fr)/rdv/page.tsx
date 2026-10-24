import { PageRdv, metaRdv } from '@/components/vsw/pages/rdv';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/rdv.tsx.
export const metadata = metaRdv('fr');

export default function Page() {
  return <PageRdv lang="fr" />;
}
