import { VideoPresentation } from './video-presentation';

/* Section « En 1 minute » de l'accueil (demande de Camille, 2026-10-23) : la même vidéo que la page
   À propos, entre « Nos solutions » et « C'est pour vous si… ». */
export function VideoSection() {
  return (
    <section id="video" className="section video-section">
      <div className="container">
        <div className="section-head reveal video-section-tete">
          <div>
            <div className="eyebrow">En 1 minute</div>
            <h2>Ce qu&apos;on change dans votre journée.</h2>
          </div>
        </div>
        <div className="video-section-cadre reveal">
          <VideoPresentation />
        </div>
      </div>
    </section>
  );
}
