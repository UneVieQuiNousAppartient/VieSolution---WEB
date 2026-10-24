import { PageAccueil, metaAccueil } from '@/components/vsw/pages/accueil';

// Contenu partagé avec la version française : src/components/vsw/pages/accueil.tsx.
export const metadata = metaAccueil('en');

export default function Page() {
  return <PageAccueil lang="en" />;
}
