import Link from 'next/link';
import type { Bloc, Morceau } from '@/lib/blog-markdown';

/* Texte d'un article du Blog : blocs lus par src/lib/blog-markdown.ts, rendus en éléments React
   (jamais de HTML brut). Liens internes par <Link>, liens externes dans un nouvel onglet. */
function Ligne({ morceaux }: { morceaux: Morceau[] }) {
  return (
    <>
      {morceaux.map((m, i) => {
        if (m.t === 'gras') return <strong key={i}>{m.v}</strong>;
        if (m.t === 'lien') {
          return m.href.startsWith('/') ? (
            <Link key={i} href={m.href}>{m.v}</Link>
          ) : (
            <a key={i} href={m.href} target="_blank" rel="noopener noreferrer">{m.v}</a>
          );
        }
        return <span key={i}>{m.v}</span>;
      })}
    </>
  );
}

export function BlogTexte({ blocs }: { blocs: Bloc[] }) {
  return (
    <div className="blog-texte">
      {blocs.map((b, i) => {
        if (b.type === 'h2') {
          const encadre = b.id === 'a-retenir' ? ' blog-h2--retenir' : b.id === 'sources' ? ' blog-h2--sources' : '';
          return <h2 key={i} id={b.id} className={`blog-h2${encadre}`}><Ligne morceaux={b.morceaux} /></h2>;
        }
        if (b.type === 'p') return <p key={i}><Ligne morceaux={b.morceaux} /></p>;
        const Liste = b.type === 'ul' ? 'ul' : 'ol';
        return (
          <Liste key={i}>
            {b.elements.map((e, j) => <li key={j}><Ligne morceaux={e} /></li>)}
          </Liste>
        );
      })}
    </div>
  );
}
