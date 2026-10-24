import { Racine, metaRacine } from '@/components/vsw/racine';

// Pages anglaises (étape 1) : même gabarit que le français, <html lang="en-CA">.
export const metadata = metaRacine('en');

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Racine lang="en">{children}</Racine>;
}
