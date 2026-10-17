import Link from 'next/link';
import { Icon } from './icon';

type Variant = 'accueil' | 'ia' | 'zoho';

type Carte = {
  title: string;
  desc: string;
  items: string[];
  href?: string;
};

const CARTES: Record<Variant, Carte[]> = {
  accueil: [
    {
      title: 'Configuration IA de base',
      desc: 'On installe un assistant IA (comme ChatGPT ou Claude) et on le règle pour votre entreprise : courriels, soumissions, textes.',
      items: ['Installation et réglages avec vous', 'Exemples adaptés à votre métier', 'Bonnes pratiques et limites'],
      href: '/ia#demarrer',
    },
    {
      title: 'Mise en place d’un logiciel de gestion (Zoho)',
      desc: 'On installe Zoho pour vos clients et vos factures. Un seul endroit, au lieu de cinq.',
      items: ['Carnet de clients (CRM)', 'Facturation (Books)', 'Transfert de vos données existantes'],
      href: '/zoho#demarrer',
    },
    {
      title: 'Formation courte',
      desc: 'Une formation pratique, avec vos vrais dossiers, pour être à l’aise seul ensuite.',
      items: ['En français, sans jargon', 'Pour vous ou votre équipe', 'Durée : [à confirmer]'],
      href: '/ia#formation',
    },
  ],
  ia: [
    {
      title: 'Votre assistant IA, bien réglé',
      desc: 'On choisit l’outil avec vous et on le configure pour votre façon de travailler.',
      items: ['Choix de l’outil', 'Réglages pour votre entreprise', 'Premiers usages guidés'],
    },
    {
      title: 'Vos trois premières tâches simplifiées',
      desc: 'On repère trois tâches qui reviennent souvent : courriels, soumissions, résumés. On les simplifie avec l’IA.',
      items: ['Courriels types', 'Soumissions plus rapides', 'Résumés de documents'],
    },
    {
      title: 'Une formation pour être autonome',
      desc: 'On vous apprend à vous en servir seul, sans dépendre de nous.',
      items: ['Atelier pratique', 'Aide-mémoire', 'Suivi après la formation'],
    },
  ],
  zoho: [
    {
      title: 'Votre carnet de clients (Zoho CRM)',
      desc: 'Tous vos clients, vos soumissions et vos suivis au même endroit.',
      items: ['Configuration de base', 'Import de votre liste de clients', 'Rappels de suivi'],
    },
    {
      title: 'Votre facturation (Zoho Books)',
      desc: 'Des factures propres, envoyées plus vite, et un œil clair sur qui vous doit quoi.',
      // « Taxes du Québec configurées » : à valider par Camille (PRD 4.4) — sinon retirer.
      items: ['Modèles de factures à votre image', 'Taxes du Québec configurées', 'Rappels de paiement'],
    },
    {
      title: 'Une formation courte pour bien partir',
      desc: 'On vous montre l’essentiel, avec vos vrais clients. Vous repartez à l’aise.',
      items: ['Formation pratique', 'Pour vous ou votre équipe', 'Soutien après le démarrage'],
    },
  ],
};

export function DemarrerSection({ variant }: { variant: Variant }) {
  const cartes = CARTES[variant];
  return (
    <section id="demarrer" className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{'// Démarrer simplement'}</div>
              <h2>
                Pas besoin de tout changer.<br />
                <span className="glow">On commence petit.</span>
              </h2>
            </div>
            <p>
              Vous n&apos;avez pas à tout comprendre ni à tout faire d&apos;un coup. On choisit
              avec vous une seule chose qui vous fera gagner du temps, on la met en place, et on
              vous montre comment l&apos;utiliser. Le reste viendra quand vous serez prêt.
            </p>
          </div>

          <div className="ai-pillars">
            {cartes.map((c, i) => (
              <div className="ai-pillar" key={c.title}>
                <div className="ai-pillar-num">{String(i + 1).padStart(2, '0')} · Premier pas</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {c.href && (
                  <Link href={c.href} className="ai-pillar-link">
                    En savoir plus <Icon name="arrow" size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              Un premier pas, <em>à votre rythme</em>. Sur mesure — on en discute à l&apos;appel
              découverte gratuit.
            </div>
            <Link href="/rdv" className="btn btn-primary btn-lg">
              Parler de mon premier pas <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
