'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Menu déroulant de la barre (> 640 px) : « Services » et « Métiers » (refonte du 2026-10-23,
 * inspirée de Supabase et Vercel). Ouverture : clic, Entrée ou Espace, survol de la souris.
 * Fermeture : Échap (le focus revient au bouton), clic ailleurs, choix d'un lien, sortie de la
 * souris. Sans JavaScript, le bouton n'ouvre rien : le menu mobile et le pied de page mènent aux
 * mêmes pages, et chaque menu a sa page principale (/services, /metiers).
 */
export function NavDeroulant({ id, libelle, children }: { id: string; libelle: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const fermeture = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ouvert par le survol juste avant le clic : le clic confirme l'ouverture au lieu de refermer.
  const parSurvol = useRef(false);
  const panelId = `nav-${id}-panel`;

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
      className="nav-deroulant"
      onMouseEnter={ouvrir}
      onMouseLeave={fermerBientot}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className="nav-deroulant-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={basculer}
      >
        {libelle} <span className="nav-deroulant-chev" aria-hidden="true">▾</span>
      </button>
      <div
        id={panelId}
        className="nav-deroulant-panel"
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setOpen(false);
        }}
      >
        {children}
      </div>
    </div>
  );
}
