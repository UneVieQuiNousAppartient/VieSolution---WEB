import { PageDevis, metaDevis } from '@/components/vsw/pages/devis';

// Contenu partagé avec la version anglaise : src/components/vsw/pages/devis.tsx.
export const metadata = metaDevis('fr');

export default function Page() {
  return <PageDevis lang="fr" />;
}
