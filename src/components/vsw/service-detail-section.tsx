import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from './icon';

export type Pilier = { titre: string; desc: string; items: string[] };

type Props = {
  id: string;
  eyebrow: string;
  titre: ReactNode;
  accroche: string;
  intro: ReactNode;
  piliers: Pilier[];
  bandeau: ReactNode;
  boutonLibelle: string;
  boutonLien: string;
};

/*
 * Section « trois volets » des pages de service (sites web, CRM sur mesure, référencement) :
 * même gabarit visuel que la section IA (.ai-wrap / .ai-pillars / .ai-banner), textes en props.
 */
export function ServiceDetailSection({ id, eyebrow, titre, accroche, intro, piliers, bandeau, boutonLibelle, boutonLien }: Props) {
  return (
    <section id={id} className="section">
      <div className="container">
        <div className="ai-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{eyebrow}</div>
              <h2>
                {titre}
                <br />
                <span className="glow">{accroche}</span>
              </h2>
            </div>
            <p>{intro}</p>
          </div>
          <div className="ai-pillars">
            {piliers.map((p, i) => (
              <div className="ai-pillar" key={p.titre}>
                <div className="ai-pillar-num">{String(i + 1).padStart(2, '0')} · Volet</div>
                <h3>{p.titre}</h3>
                <p>{p.desc}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="ai-banner">
            <div className="ai-banner-text">{bandeau}</div>
            <Link href={boutonLien} className="btn btn-primary btn-lg">
              {boutonLibelle} <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
