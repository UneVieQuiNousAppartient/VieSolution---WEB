import { PageRdv, metaRdv } from '@/components/vsw/pages/rdv';

// Contenu partagé avec la version française : src/components/vsw/pages/rdv.tsx.
export const metadata = metaRdv('en');

export default function Page() {
  return <PageRdv lang="en" />;
}
