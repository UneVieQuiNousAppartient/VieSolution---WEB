import Link from 'next/link';
import { LIBELLE_GENRE, lieuAffiche, pastilleDate, places, quandLisible } from '@/lib/evenements';
import type { EvenementPublic } from '@/lib/evenements-serveur';

/** Carte d'un atelier (page Événements). */
export function CarteEvenement({ e }: { e: EvenementPublic }) {
  const d = pastilleDate(e.debut);
  const p = places(e.places, e.inscrits);
  return (
    <article className="evt-carte" data-genre={e.genre}>
      <div className="evt-date" aria-hidden="true"><span>{d.mois}</span><b>{d.jour}</b><span>{d.semaine}</span></div>
      <div className="evt-corps">
        <span className={`evt-genre evt-genre--${e.genre}`}>{LIBELLE_GENRE[e.genre]}</span>
        <h2 className="evt-titre"><Link href={`/evenements/${e.slug}`}>{e.titre}</Link></h2>
        <p className="evt-quand">{quandLisible(e.debut, e.fin)} · {lieuAffiche(e)}</p>
        {e.presentation && <p className="evt-resume">{e.presentation.split('\n')[0].slice(0, 220)}</p>}
        <div className="evt-pied">
          <span className={`evt-places evt-places--${p.ton}`}>{p.libelle}</span>
          {p.restantes > 0
            ? <Link className="btn btn-primary" href={`/evenements/${e.slug}`}>Je m&apos;inscris →</Link>
            : <Link className="btn btn-ghost" href="/contact">Complet — écrivez-nous</Link>}
        </div>
      </div>
    </article>
  );
}

