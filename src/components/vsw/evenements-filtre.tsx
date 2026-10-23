'use client';

import { useState } from 'react';
import { LIBELLE_GENRE, type Genre } from '@/lib/evenements';

/* Filtre « Tous / En ligne / En personne » de la page Événements (étape F) : il masque les cartes par
   leur attribut data-genre, sans recharger. Affiché seulement quand les deux genres existent. */
export function EvenementsFiltre({ genres, children }: { genres: Genre[]; children: React.ReactNode }) {
  const [filtre, setFiltre] = useState<Genre | 'tous'>('tous');
  return (
    <div className="evt-liste-bloc" data-filtre={filtre}>
      {genres.length > 1 && (
        <div className="evt-filtres" role="group" aria-label="Filtrer les ateliers">
          {(['tous', ...genres] as const).map((g) => (
            <button key={g} type="button" aria-pressed={filtre === g} onClick={() => setFiltre(g)}>
              {g === 'tous' ? 'Tous' : LIBELLE_GENRE[g]}
            </button>
          ))}
        </div>
      )}
      <div className="evt-liste">{children}</div>
    </div>
  );
}

