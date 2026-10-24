import { PageAccueil, metaAccueil } from '@/components/vsw/pages/accueil';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/accueil.tsx.
export const metadata = metaAccueil('fr');

export default function Page() {
  return <PageAccueil lang="fr" />;
}
