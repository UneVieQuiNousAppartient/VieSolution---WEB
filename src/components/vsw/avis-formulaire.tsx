'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CONSENTEMENT_AVIS, METIERS_AVIS } from '@/lib/avis';

/* Formulaire de la page /avis (étape E). La note est enregistrée avec le témoignage. Le choix des
   plateformes est offert à tout le monde, quelle que soit la note (Google interdit de n'y envoyer
   que les bonnes notes) ; une note de 3 ou moins ajoute un message d'écoute vers Contact. */
type Liens = { google: string; facebook: string; whatsapp: string };

const LIBELLES = ['', 'À améliorer : expérience décevante', 'Moyen : des attentes non comblées', 'Bien : quelques points à perfectionner', 'Très bien : très satisfait(e)', 'Exceptionnel : totalement satisfait(e)'];

export function AvisFormulaire({ liens }: { liens: Liens }) {
  const [note, setNote] = useState(5);
  const [survol, setSurvol] = useState(0);
  const [nom, setNom] = useState('');
  const [metier, setMetier] = useState('');
  const [message, setMessage] = useState('');
  const [accord, setAccord] = useState(false);
  const [piege, setPiege] = useState('');
  const [envoi, setEnvoi] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState('');

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');
    if (!accord) return setErreur('Votre accord est requis pour publier votre témoignage.');
    setEnvoi('envoi');
    // Visite venue du code QR (?src=qr) : notée avec l'avis, pour savoir si le code imprimé sert.
    const source = new URLSearchParams(window.location.search).get('src') === 'qr' ? 'qr' : null;
    try {
      const r = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, metier, note, message, consentement: true, site: piege, source }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) throw new Error(j.error || 'Votre témoignage n’a pas pu être envoyé.');
      setEnvoi('ok');
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Votre témoignage n’a pas pu être envoyé.');
      setEnvoi('repos');
    }
  };

  const affichee = survol || note;
  const plateformes = [liens.google, liens.facebook, liens.whatsapp].some(Boolean);

  return (
    <div className="avis-blocs">
      <fieldset className="avis-etoiles" aria-describedby="avis-libelle">
        <legend className="sr-only">Votre note</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="avis-etoile"
            data-on={n <= affichee || undefined}
            aria-pressed={note === n}
            aria-label={`${n} ${n === 1 ? 'étoile' : 'étoiles'} sur 5`}
            onClick={() => setNote(n)}
            onMouseEnter={() => setSurvol(n)}
            onMouseLeave={() => setSurvol(0)}
          >
            ★
          </button>
        ))}
      </fieldset>
      <p id="avis-libelle" className="avis-libelle" aria-live="polite">{note} étoile{note > 1 ? 's' : ''} · {LIBELLES[note]}</p>

      {note <= 3 && (
        <div className="avis-ecoute">
          <p className="avis-ecoute-titre">Merci de votre franchise.</p>
          <p>
            Dites-nous ce qui n&apos;a pas été à la hauteur : Camille vous répond personnellement.{' '}
            <Link href="/contact">Nous écrire <span aria-hidden="true">→</span></Link>
          </p>
        </div>
      )}

      {plateformes && (
        <div className="avis-plateformes">
          <p className="avis-sous-titre">Choisissez où partager votre avis :</p>
          {liens.google && (
            <a className="avis-plateforme avis-plateforme--google" href={liens.google} target="_blank" rel="noopener noreferrer">
              <span className="avis-plateforme-ico" aria-hidden="true">G</span>
              <span><strong>Laisser un avis sur Google</strong> <span className="avis-recommande">Recommandé</span><small>Aidez d&apos;autres entreprises d&apos;ici à nous trouver, en un clic.</small></span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <div className="avis-plateformes-grille">
            {liens.whatsapp && (
              <a className="avis-plateforme" href={liens.whatsapp} target="_blank" rel="noopener noreferrer">
                <span className="avis-plateforme-ico" aria-hidden="true">✆</span>
                <span><strong>Message direct sur WhatsApp</strong><small>Écrivez-nous directement.</small></span>
              </a>
            )}
            {liens.facebook && (
              <a className="avis-plateforme" href={liens.facebook} target="_blank" rel="noopener noreferrer">
                <span className="avis-plateforme-ico" aria-hidden="true">f</span>
                <span><strong>Recommander sur Facebook</strong><small>Partagez votre avis avec votre réseau.</small></span>
              </a>
            )}
          </div>
        </div>
      )}

      <form className="avis-formulaire" onSubmit={envoyer} noValidate>
        <h2 className="avis-form-titre">Témoignage pour le site de Vie Solution Web</h2>
        {envoi === 'ok' ? (
          <p className="avis-merci" role="status">Merci ! Votre témoignage a bien été reçu. Il sera publié après vérification par Camille.</p>
        ) : (
          <>
            <div className="avis-champs">
              <label>
                <span>Votre nom *</span>
                <input value={nom} onChange={(e) => setNom(e.target.value)} maxLength={80} required autoComplete="name" placeholder="Ex. : Marie Tremblay" />
                <small>Publié sous la forme « Marie T. »</small>
              </label>
              <label>
                <span>Votre métier (facultatif)</span>
                <select value={metier} onChange={(e) => setMetier(e.target.value)}>
                  <option value="">—</option>
                  {METIERS_AVIS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
            </div>
            <label className="avis-champ-plein">
              <span>Votre témoignage *</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} rows={5} required placeholder="Qu'est-ce qui a changé pour vous ?" />
            </label>
            <label className="avis-piege" aria-hidden="true">
              Site web
              <input tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
            </label>
            <label className="avis-accord">
              <input type="checkbox" checked={accord} onChange={(e) => setAccord(e.target.checked)} required />
              <span>{CONSENTEMENT_AVIS}</span>
            </label>
            {erreur && <p className="avis-erreur" role="alert">{erreur}</p>}
            <button type="submit" className="btn btn-primary btn-lg" disabled={envoi === 'envoi'}>
              {envoi === 'envoi' ? 'Envoi…' : 'Envoyer mon témoignage'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
