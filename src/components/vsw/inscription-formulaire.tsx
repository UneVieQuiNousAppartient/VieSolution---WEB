'use client';

import { useState } from 'react';
import { CONSENTEMENT_INSCRIPTION, TEXTE_AVERTIR } from '@/lib/evenements';

/* Fiche d'inscription à un atelier (étape F, maquette SiteEvenements). Accord obligatoire ; la case
   « prochains ateliers » n'est jamais cochée d'avance (loi anti-pourriel). Champ « site » : piège à robots. */
export function InscriptionFormulaire({ slug }: { slug: string }) {
  const [v, setV] = useState({ nom: '', courriel: '', entreprise: '', question: '' });
  const [accord, setAccord] = useState(false);
  const [avertir, setAvertir] = useState(false);
  const [piege, setPiege] = useState('');
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState('');
  const champ = (k: keyof typeof v) => ({ value: v[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value }) });

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    if (!accord) return setErreur('Votre accord est requis pour vous envoyer la confirmation.');
    setEtat('envoi');
    try {
      const r = await fetch('/api/evenements/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...v, avertir, consentement: true, site: piege }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) throw new Error(j.error || 'Votre inscription n’a pas pu être envoyée.');
      setEtat('ok');
    } catch (err) {
      setEtat('repos');
      setErreur(err instanceof Error ? err.message : 'Votre inscription n’a pas pu être envoyée.');
    }
  };

  if (etat === 'ok') {
    const prenom = v.nom.trim().split(/\s+/)[0];
    return (
      <div className="avis-formulaire evt-merci" role="status">
        <h2 className="avis-form-titre">✓ C&apos;est noté{prenom ? `, ${prenom}` : ''} !</h2>
        <p>Votre place est réservée. Le courriel de confirmation part vers {v.courriel.trim()}, avec tous les détails, et on vous écrit aussi la veille. Rien reçu d&apos;ici quelques minutes ? Regardez vos courriels indésirables, ou écrivez-nous à info@viesolutionweb.ca.</p>
      </div>
    );
  }

  return (
    <form className="avis-formulaire" onSubmit={envoyer} noValidate>
      <h2 className="avis-form-titre">Réserver ma place</h2>
      <label>Votre nom<input required maxLength={80} autoComplete="name" {...champ('nom')} /></label>
      <label>Votre courriel<input required type="email" maxLength={200} autoComplete="email" {...champ('courriel')} /></label>
      <label>Entreprise ou métier <small>(facultatif)</small><input maxLength={120} autoComplete="organization" {...champ('entreprise')} /></label>
      <label>Une question pour l&apos;atelier ? <small>(facultatif)</small><textarea rows={3} maxLength={1000} {...champ('question')} /></label>
      <label className="avis-piege" aria-hidden="true">Site web<input tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} /></label>
      <label className="avis-accord"><input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} required /><span>{CONSENTEMENT_INSCRIPTION}</span></label>
      <label className="avis-accord"><input type="checkbox" checked={avertir} onChange={(e) => setAvertir(e.target.checked)} /><span>{TEXTE_AVERTIR} <small>(facultatif)</small></span></label>
      {erreur && <p className="avis-erreur" role="alert">{erreur}</p>}
      <button type="submit" className="btn btn-primary btn-lg" disabled={etat === 'envoi'}>{etat === 'envoi' ? 'Envoi…' : 'Confirmer mon inscription'}</button>
    </form>
  );
}
