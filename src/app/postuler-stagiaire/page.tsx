import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/vsw/icon';
import { RevealInit } from '@/components/vsw/reveal-init';
import { InternApplyForm } from '@/components/vsw/intern-apply-form';
import { OFFRES_STAGE } from '@/components/vsw/stage-section';

export const metadata: Metadata = {
  title: 'Postuler comme stagiaire',
  description:
    "Vie Solution Web accueille des stagiaires en informatique, en IA et sur Zoho pour apprendre le métier sur de vrais mandats clients québécois.",
};


export default function PostulerStagiairePage() {
  return (
    <>
      <RevealInit />
      <section className="section" style={{ paddingTop: 96, borderTop: 'none' }}>
        <div className="container">
          <p className="retour">
            <Link href="/#stagiaires">
              <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} aria-hidden="true" /> Retour à l&apos;accueil
            </Link>
          </p>
          <div className="eyebrow">{'Programme de stage'}</div>
          <h1
            className="display"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '24px 0 20px', maxWidth: 780 }}
          >
            Apprenez le métier sur de vrais mandats.
          </h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 17, maxWidth: 620, lineHeight: 1.6 }}>
            Vie Solution Web accueille des jeunes en informatique, en intelligence
            artificielle et en administration pour travailler aux côtés de l&apos;équipe sur
            des projets clients réels — automatisation, agents IA et implantation Zoho.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Ce que vous y trouverez</div>
              <h2>Un vrai terrain<br />d&apos;apprentissage.</h2>
            </div>
            <p className="desc">
              Mentorat, mandats réels et outils d&apos;aujourd&apos;hui : tout ce qu&apos;il faut pour
              démarrer une carrière en IA et en gestion numérique d&apos;entreprise.
            </p>
          </div>
          <div className="process-grid cols-3 reveal">
            {OFFRES_STAGE.map((o, i) => (
              <div className="process-step" key={o.title}>
                <div className="step-num">0{i + 1}</div>
                <h4>{o.title}</h4>
                <p>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-wrap reveal">
            <div className="contact-left">
              <div className="eyebrow">Candidature</div>
              <h2>Postuler comme stagiaire.</h2>
              <p>
                Réponse sous 5 jours ouvrables. Stages disponibles en cours de session et
                à temps plein l&apos;été.
              </p>
              <div className="contact-item">
                <div className="icon"><Icon name="mail" size={16} /></div>
                <div>
                  <div className="txt">Courriel</div>
                  <div className="val">stages@viesolutionweb.ca</div>
                </div>
              </div>
            </div>
            <div className="contact-right">
              <InternApplyForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
