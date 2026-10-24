import { Racine, metaRacine } from '@/components/vsw/racine';

export const metadata = metaRacine('fr');

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Racine lang="fr">{children}</Racine>;
}
