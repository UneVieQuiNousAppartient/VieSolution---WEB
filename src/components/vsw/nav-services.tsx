'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icon';
import type { ServiceNavItem } from './nav';

const PANEL_ID = 'nav-services-panel';

/**
 * Menu déroulant « Services » de la barre (> 640 px). Ouverture : clic, touche Entrée ou Espace,
 * survol de la souris. Fermeture : Échap (le focus revient au bouton), clic ailleurs, choix d'un
 * lien, sortie de la souris. Sans JavaScript, le bouton n'ouvre rien : « Services » du menu mobile
 * et du pied de page restent des liens.
 */
export function NavServices({ services }: { services: readonly ServiceNavItem[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const fermeture = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ouvert par le survol juste avant le clic : le clic confirme l'ouverture au lieu de refermer.
  const parSurvol = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // Minuteur de fermeture annulé si le composant disparaît.
  useEffect(() => () => {
    if (fermeture.current) clearTimeout(fermeture.current);
  }, []);

  const ouvrir = () => {
    if (fermeture.current) clearTimeout(fermeture.current);
    parSurvol.current = true;
    setOpen(true);
  };
  const basculer = () => {
    if (parSurvol.current) {
      parSurvol.current = false;
      setOpen(true);
      return;
    }
    setOpen((o) => !o);
  };
  const fermerBientot = () => {
    parSurvol.current = false;
    fermeture.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <div
      ref={wrapRef}
      className="nav-services"
      onMouseEnter={ouvrir}
      onMouseLeave={fermerBientot}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className="nav-services-btn"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={basculer}
      >
        Services <span className="nav-services-chev" aria-hidden="true">▾</span>
      </button>
      <div id={PANEL_ID} className="nav-services-panel" hidden={!open}>
        <ul className="nav-services-list">
          {services.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="nav-services-item" onClick={() => setOpen(false)}>
                <span className="nav-services-icone"><Icon name={s.icon} size={18} aria-hidden="true" /></span>
                <span>
                  <strong>{s.label}</strong>
                  <small>{s.desc}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/#demarrer" className="nav-services-pied" onClick={() => setOpen(false)}>
          <span>Vous ne savez pas par où commencer ?</span>
          <strong>Voir par où commencer <span aria-hidden="true">→</span></strong>
        </Link>
      </div>
    </div>
  );
}
