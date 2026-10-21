import Link from 'next/link';
import { Icon } from './icon';

const SITUATIONS = [
  'Vous faites vos factures le soir ou la fin de semaine.',
  'Vous répondez aux mêmes questions par courriel, encore et encore.',
  'Vos clients sont notés un peu partout : un cahier, un fichier Excel, votre téléphone.',
  'Vous oubliez parfois de relancer une soumission ou un paiement.',
  "Vous entendez parler de l'IA, mais vous ne savez pas par où commencer.",
  'Vous voulez un logiciel de gestion, mais vous avez peur d’un gros projet compliqué.',
];

export function PourVousSection() {
  return (
    <section id="pour-vous" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{'C’est pour vous si…'}</div>
            <h2>Vous vous reconnaissez ?<br />On est là pour vous.</h2>
          </div>
          <p className="desc">
            Vous êtes seul dans votre entreprise ou vous avez une petite équipe. Vous êtes bon
            dans votre métier, mais l&apos;administration vous gruge. On commence là.
          </p>
        </div>
        <div className="benefits-grid reveal">
          {SITUATIONS.map((s) => (
            <div className="benefit pv-card" key={s}>
              <span className="pv-check" aria-hidden="true">
                <Icon name="check" size={18} />
              </span>
              <p className="pv-situation">{s}</p>
            </div>
          ))}
        </div>
        <div className="pv-outro reveal">
          <p>
            Une seule de ces phrases vous ressemble ? Un appel de 30 minutes suffit pour voir
            par où commencer.
          </p>
          <Link href="/rdv" className="btn btn-primary">
            Prendre un RDV gratuit <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
