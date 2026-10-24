import { phrase, t, type Lang } from '@/lib/i18n';

const STEPS = [
  {
    num: '01',
    title: phrase("Appel découverte"),
    desc: phrase("30 minutes, gratuit et sans engagement. On comprend votre réalité, vos irritants et vos objectifs avant de parler solution."),
  },
  {
    num: '02',
    title: phrase("Portrait de vos façons de faire"),
    desc: phrase("On regarde comment vous travaillez et on repère où l'IA et Zoho vous feront gagner du temps."),
  },
  {
    num: '03',
    title: phrase("Implantation"),
    desc: phrase("Tâches automatiques, assistants IA, configuration Zoho : on avance par étapes, en validant chaque étape avec vous."),
  },
  {
    num: '04',
    title: phrase("Formation & suivi"),
    desc: phrase("On forme votre équipe jusqu'à l'autonomie, puis on reste disponibles pour optimiser et faire évoluer vos outils."),
  },
];

/* Frise : pastilles numérotées reliées par une ligne fine au-dessus des cartes
   (inspiration « How it works 09 », 21st.dev). Le modificateur `process-grid--timeline`
   ne touche pas les autres grilles `process-grid` du site (/devis, /postuler-stagiaire). */
export function ProcessSection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="processus" className="section section--band">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "Notre processus")}</div>
            <h2>{t(lang, "Simple, du début")}<br />{t(lang, "à la fin.")}</h2>
          </div>
          <p className="desc">
            {t(lang, "Une méthode simple et transparente : vous savez toujours où on s'en va, ce que ça coûte et ce que ça rapporte.")}
          </p>
        </div>
        <ol className="process-grid process-grid--timeline reveal">
          {STEPS.map((s) => (
            <li className="process-step" key={s.num}>
              <span className="step-dot" aria-hidden="true">{s.num}</span>
              <div className="step-body">
                <div className="step-num">{t(lang, "Étape {num}", { num: s.num })}</div>
                <h4>{t(lang, s.title)}</h4>
                <p>{t(lang, s.desc)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
