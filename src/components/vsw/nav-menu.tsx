'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icon';
import type { NavLinkItem, PilierNav, ServiceNavItem } from './nav';
import { APPEL } from './appel';

const PANEL_ID = 'nav-menu-panel';

/**
 * Menu mobile (≤ 640 px, issue #3) : bouton 44 × 44 + panneau plein écran sous la nav.
 * Fermeture : bouton, touche Échap, clic sur un lien. Défilement du corps bloqué quand ouvert ;
 * le focus revient au bouton à la fermeture. Style : vsw.css (« pme-accessible — premium »).
 */
export function NavMenu({ links, piliers, metiers }: {
  links: readonly NavLinkItem[];
  piliers: readonly PilierNav[];
  metiers: readonly ServiceNavItem[];
}) {
  const [open, setOpen] = useState(false);
  // Un seul sous-menu ouvert à la fois : « Services » ou « Métiers ».
  const [sousMenu, setSousMenu] = useState<null | 'services' | 'metiers'>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) btnRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // Écran élargi au-delà de 640 px : le menu n'a plus lieu d'être
    const wide = window.matchMedia('(min-width: 641px)');
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="nav-menu-btn"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nav-menu-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div id={PANEL_ID} className="nav-menu-panel" hidden={!open}>
        <ul className="nav-menu-list">
          <li>
            <button
              type="button"
              className="nav-menu-sous-btn"
              aria-expanded={sousMenu === 'services'}
              aria-controls="nav-menu-services"
              onClick={() => setSousMenu((m) => (m === 'services' ? null : 'services'))}
            >
              Services <span aria-hidden="true">{sousMenu === 'services' ? '▴' : '▾'}</span>
            </button>
            <ul id="nav-menu-services" className="nav-menu-sous" hidden={sousMenu !== 'services'}>
              {piliers.map((p) => (
                <li key={p.pilier}>
                  <p className="nav-menu-pilier">{p.pilier}</p>
                  <ul>
                    {p.services.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} onClick={close}>{s.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              <li>
                <Link href="/services" onClick={close}><strong>Tous les services →</strong></Link>
              </li>
            </ul>
          </li>
          <li>
            <button
              type="button"
              className="nav-menu-sous-btn"
              aria-expanded={sousMenu === 'metiers'}
              aria-controls="nav-menu-metiers"
              onClick={() => setSousMenu((m) => (m === 'metiers' ? null : 'metiers'))}
            >
              Métiers <span aria-hidden="true">{sousMenu === 'metiers' ? '▴' : '▾'}</span>
            </button>
            <ul id="nav-menu-metiers" className="nav-menu-sous" hidden={sousMenu !== 'metiers'}>
              {metiers.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} onClick={close}>{m.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/metiers" onClick={close}><strong>Tous les métiers →</strong></Link>
              </li>
            </ul>
          </li>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={close}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={APPEL.href} className="btn btn-primary btn-lg nav-menu-cta" onClick={close}>
          {APPEL.court} <Icon name="arrow" size={14} />
        </Link>
      </div>
    </>
  );
}
