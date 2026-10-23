import Image from 'next/image';
import Link from 'next/link';
import { SITES } from './sites-band';
import { ECRANS } from './outils-galerie';

/* Compilation de ce qu'on a déjà bâti (demande de Camille, 2026-10-23), à la place de la photo de
   la page À propos : les vrais sites et écrans de CRM, en fondu enchaîné (CSS seulement). Avec
   « réduire les animations », seule la première image reste, sans mouvement. */
const DIAPOS = [
  ...SITES.map((s) => ({ image: s.image, type: 'Site web', nom: s.nom, alt: `Page d'accueil du site ${s.nom}` })),
  ...ECRANS.map((e) => ({ image: e.image, type: 'CRM sur mesure', nom: `${e.client} · ${e.titre}`, alt: `Écran « ${e.titre} » du CRM de ${e.client}` })),
];

export function AboutCompilation() {
  return (
    <figure className="about-compilation" style={{ ['--diapos' as string]: DIAPOS.length }}>
      <div className="about-compilation-cadre">
        <span className="site-card-bar" aria-hidden="true"><i /><i /><i /></span>
        <div className="about-compilation-ecran">
          {DIAPOS.map((d, i) => (
            <div key={d.image} className="about-diapo" style={{ ['--i' as string]: i }} aria-hidden={i > 0 || undefined}>
              <Image src={d.image} alt={i === 0 ? d.alt : ''} fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
              <span className="about-diapo-legende"><strong>{d.type}</strong> {d.nom}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption>
        Ce qu&apos;on a déjà bâti : {SITES.length} sites et {ECRANS.length} écrans de CRM sur mesure.{' '}
        <Link href="/realisations">Voir toutes nos réalisations <span aria-hidden="true">→</span></Link>
      </figcaption>
    </figure>
  );
}
