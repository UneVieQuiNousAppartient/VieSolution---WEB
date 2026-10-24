import { PageAPropos, metaAPropos } from '@/components/vsw/pages/a-propos';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/a-propos.tsx.
export const metadata = metaAPropos('fr');

export default function Page() {
  return <PageAPropos lang="fr" />;
}
