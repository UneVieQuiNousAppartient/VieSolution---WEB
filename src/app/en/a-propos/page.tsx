import { PageAPropos, metaAPropos } from '@/components/vsw/pages/a-propos';

// Contenu partagé avec la version française : src/components/vsw/pages/a-propos.tsx.
export const metadata = metaAPropos('en');

export default function Page() {
  return <PageAPropos lang="en" />;
}
