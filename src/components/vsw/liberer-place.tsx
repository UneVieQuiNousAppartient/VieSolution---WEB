'use client';

import Link from 'next/link';
import { useState } from 'react';

/* Bouton « Libérer ma place » (étape F) : la place repart pour quelqu'un d'autre. */
export function LibererPlace({ i, t }: { i: string; t: string }) {
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState('');
  const liberer = async () => {
    setEtat('envoi'); setErreur('');
    const r = await fetch('/api/evenements/liberer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ i, t }) }).catch(() => null);
    const j = (await r?.json().catch(() => ({}))) as { error?: string } | undefined;
    if (r?.ok) return setEtat('ok');
    setEtat('repos');
    setErreur(j?.error || 'L’opération n’a pas pu être faite. Réessayez dans quelques minutes.');
  };
  if (etat === 'ok') return <p className="avis-intro" role="status">C&apos;est fait : votre place est libérée. Merci d&apos;avoir pensé aux autres ! Au plaisir de vous voir à un prochain atelier.</p>;
  return (
    <>
      <p className="avis-intro">Vous ne pourrez pas venir ? Pas de souci : libérez votre place, et quelqu&apos;un d&apos;autre pourra la prendre.</p>
      {erreur && <p className="avis-erreur" role="alert">{erreur}</p>}
      <div className="evt-liberer-boutons">
        <button type="button" className="btn btn-primary" onClick={liberer} disabled={etat === 'envoi' || !i || !t}>Libérer ma place</button>
        <Link className="btn btn-ghost" href="/evenements">Finalement, je garde ma place</Link>
      </div>
    </>
  );
}
