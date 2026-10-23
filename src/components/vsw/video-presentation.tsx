'use client';

import { useEffect, useRef, useState } from 'react';

/* Vidéo de présentation (demande de Camille, 2026-10-23) : « avant → ce qu'on installe → après »,
   56 s, fabriquée à partir des textes et des vrais écrans du site, musique douce composée pour
   l'occasion (aucun droit à payer). Démarre seule en sourdine (les navigateurs interdisent le son
   automatique) avec les boutons « Activer le son » et « Pause » (WCAG 2.2.2). Avec « réduire les
   animations » : pas de lecture automatique, l'image finale reste affichée, « Lecture » la lance. */
export function VideoPresentation() {
  const ref = useRef<HTMLVideoElement>(null);
  const [son, setSon] = useState(false);
  // Sans attribut autoPlay, la vidéo est à l'arrêt au départ ; onPlay et onPause tiennent l'état à jour.
  const [enPause, setEnPause] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ref.current?.play().catch(() => undefined);
  }, []);

  const lecture = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  };

  const basculerSon = () => {
    const v = ref.current;
    if (!v) return;
    const actif = !son;
    v.muted = !actif;
    if (actif) {
      v.currentTime = 0;
      v.play().catch(() => undefined);
    }
    setSon(actif);
  };

  return (
    <figure className="video-presentation">
      <div className="video-presentation-cadre">
        <video
          ref={ref}
          poster="/videos/presentation.webp"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Vidéo de présentation de Vie Solution Web : avant, ce qu'on installe, après"
          onPause={() => setEnPause(true)}
          onPlay={() => setEnPause(false)}
        >
          <source src="/videos/presentation.webm" type="video/webm" />
          <source src="/videos/presentation.mp4" type="video/mp4" />
        </video>
        <div className="video-presentation-boutons">
          <button type="button" className="video-presentation-bouton" onClick={lecture}>
            <span aria-hidden="true">{enPause ? '▶' : '❚❚'}</span> {enPause ? 'Lecture' : 'Pause'}
          </button>
          <button type="button" className="video-presentation-bouton" onClick={basculerSon}>
            <span aria-hidden="true">{son ? '🔇' : '🔊'}</span> {son ? 'Couper le son' : 'Activer le son'}
          </button>
        </div>
      </div>
      <figcaption>
        En 1 minute : ce qui gruge le temps d&apos;une entreprise, ce qu&apos;on installe (demandes, CRM, IA,
        Zoho) et ce que ça change.
      </figcaption>
    </figure>
  );
}
