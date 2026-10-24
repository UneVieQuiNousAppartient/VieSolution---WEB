import { PageDevis, metaDevis } from '@/components/vsw/pages/devis';

// Contenu partagé avec la version française : src/components/vsw/pages/devis.tsx.
export const metadata = metaDevis('en');

export default function Page() {
  return <PageDevis lang="en" />;
}
