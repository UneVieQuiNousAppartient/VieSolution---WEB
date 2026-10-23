'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { encode } from 'uqr';
import { chiffresAvis, nomAffiche, type StatutAvis } from '@/lib/avis';
import { SITE_URL } from '@/lib/site';

/* Onglet « Avis » de l'admin (étape E, même disposition que l'onglet « Avis & Témoignages » de KHI) :
   chiffres, code QR de la page /avis, liens Google / Facebook / WhatsApp, filtres, et pour chaque
   témoignage : Publier, Refuser, Remettre en attente. */
type Avis = { id: string; nom: string; metier: string | null; note: number; message: string; statut: StatutAvis; source: string | null; created_at: string; consentement_at: string };
type Reglages = { google: string; facebook: string; whatsapp: string };
const FILTRES: [StatutAvis | 'tous', string][] = [['tous', 'Tous'], ['en_attente', 'En attente'], ['publie', 'Publiés'], ['refuse', 'Refusés']];
const LIBELLE: Record<StatutAvis, [string, string]> = { en_attente: ['En attente', 'adm-pastille-warn'], publie: ['Publié', 'adm-pastille-ok'], refuse: ['Refusé', 'adm-pastille-danger'] };
const CIBLE_QR = `${SITE_URL}/avis?src=qr`;

function svgQr(taille: number) {
  const { data, size } = encode(CIBLE_QR, { ecc: 'Q', border: 4 });
  let d = '';
  data.forEach((ligne, y) => ligne.forEach((plein, x) => { if (plein) d += `M${x} ${y}h1v1h-1z`; }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${taille}" height="${taille}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

function telecharger(nom: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nom; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CarteQr() {
  const [copie, setCopie] = useState(false);
  const svg = useMemo(() => svgQr(180), []);
  const png = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 1200; c.height = 1200;
      c.getContext('2d')!.drawImage(img, 0, 0, 1200, 1200);
      c.toBlob((b) => b && telecharger('vie-solution-web-avis-qr.png', b), 'image/png');
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgQr(1200))}`;
  };
  return (
    <section className="adm-carte adm-avis-qr" aria-label="Code QR de la page Avis">
      <div className="adm-avis-qr-image" role="img" aria-label="Code QR de la page Avis" dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="adm-avis-qr-texte">
        <strong>Code QR de la page Avis</strong>
        <p className="adm-gris">À imprimer sur vos cartes professionnelles, factures ou affiches. Le client qui le scanne arrive sur la page Avis et choisit lui-même où laisser son avis.</p>
        <p className="adm-gris">Adresse encodée : <strong>{CIBLE_QR}</strong></p>
        <div className="adm-avis-boutons">
          <button type="button" className="btn btn-primary" onClick={png}>Télécharger en PNG (impression)</button>
          <button type="button" className="btn btn-ghost" onClick={() => telecharger('vie-solution-web-avis-qr.svg', new Blob([svgQr(1200)], { type: 'image/svg+xml' }))}>Télécharger en SVG (imprimeur)</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(`${SITE_URL}/avis`).then(() => { setCopie(true); setTimeout(() => setCopie(false), 2000); })}>
            {copie ? 'Lien copié' : 'Copier le lien de la page Avis'}
          </button>
        </div>
      </div>
    </section>
  );
}

function CarteReglages({ reglages, onEnregistre }: { reglages: Reglages; onEnregistre: (r: Reglages) => void }) {
  const [v, setV] = useState(reglages);
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState('');
  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEtat('envoi'); setErreur('');
    const r = await fetch('/api/admin/avis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'reglages', ...v }) });
    const j = (await r.json().catch(() => ({}))) as { error?: string; reglages?: Reglages };
    if (!r.ok) { setErreur(j.error || 'Réglages non enregistrés.'); setEtat('repos'); return; }
    if (j.reglages) onEnregistre(j.reglages);
    setEtat('ok'); setTimeout(() => setEtat('repos'), 2500);
  };
  return (
    <form className="adm-carte adm-avis-reglages" onSubmit={enregistrer}>
      <strong>Boutons de la page Avis</strong>
      <p className="adm-gris">Chaque bouton apparaît sur la page dès que son lien est rempli. Laissez vide pour le cacher.</p>
      <label className="adm-champ">Lien Google « Demander des avis »<input value={v.google} onChange={(e) => setV({ ...v, google: e.target.value })} placeholder="https://g.page/r/…/review" /></label>
      <label className="adm-champ">Page Facebook<input value={v.facebook} onChange={(e) => setV({ ...v, facebook: e.target.value })} placeholder="https://www.facebook.com/…" /></label>
      <label className="adm-champ">Numéro WhatsApp<input value={v.whatsapp} onChange={(e) => setV({ ...v, whatsapp: e.target.value })} placeholder="438 506-5243" /></label>
      {erreur && <p className="adm-erreur" role="alert">{erreur}</p>}
      <button type="submit" className="btn btn-primary" disabled={etat === 'envoi'}>{etat === 'ok' ? 'Enregistré ✓' : etat === 'envoi' ? 'Enregistrement…' : 'Enregistrer'}</button>
    </form>
  );
}

export function AdminAvis({ onChange }: { onChange?: () => void }) {
  const [avis, setAvis] = useState<Avis[] | null>(null);
  const [reglages, setReglages] = useState<Reglages | null>(null);
  const [filtre, setFiltre] = useState<StatutAvis | 'tous'>('tous');
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    const r = await fetch('/api/admin/avis');
    const j = (await r.json().catch(() => ({}))) as { avis?: Avis[]; reglages?: Reglages; error?: string };
    if (!r.ok) { setErreur(j.error || 'Avis illisibles pour le moment.'); return; }
    setAvis(j.avis || []); setReglages(j.reglages || { google: '', facebook: '', whatsapp: '' });
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const changer = async (id: string, statut: StatutAvis) => {
    const r = await fetch('/api/admin/avis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'statut', id, statut }) });
    if (!r.ok) { setErreur('Le changement n’a pas pu être enregistré.'); return; }
    await charger(); onChange?.();
  };

  const supprimer = async (a: Avis) => {
    if (!window.confirm(`Supprimer définitivement le témoignage de ${a.nom} ? Il ne pourra pas être récupéré (à faire, par exemple, quand la personne demande le retrait).`)) return;
    const r = await fetch('/api/admin/avis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'supprimer', id: a.id }) });
    if (!r.ok) { setErreur('La suppression n’a pas pu être faite.'); return; }
    await charger(); onChange?.();
  };

  const k = chiffresAvis(avis || []);
  const visibles = (avis || []).filter((a) => filtre === 'tous' || a.statut === filtre);

  return (
    <div className="adm-avis">
      <div className="adm-tuiles">
        <button type="button" className="adm-carte adm-tuile adm-avis-tuile" data-alerte={k.enAttente > 0 || undefined} onClick={() => setFiltre('en_attente')}>
          <span className="adm-tuile-tete">Avis en attente</span><span className="adm-tuile-valeur">{k.enAttente}</span><span className="adm-gris">{k.enAttente ? 'À publier ou refuser' : 'Aucun avis à vérifier'}</span>
        </button>
        <button type="button" className="adm-carte adm-tuile adm-avis-tuile" onClick={() => setFiltre('publie')}>
          <span className="adm-tuile-tete">Publiés</span><span className="adm-tuile-valeur">{k.publies}</span><span className="adm-gris">Visibles sur le site</span>
        </button>
        <button type="button" className="adm-carte adm-tuile adm-avis-tuile" onClick={() => setFiltre('refuse')}>
          <span className="adm-tuile-tete">Refusés</span><span className="adm-tuile-valeur">{k.refuses}</span><span className="adm-gris">Jamais affichés</span>
        </button>
        <div className="adm-carte adm-tuile">
          <span className="adm-tuile-tete">Note moyenne</span><span className="adm-tuile-valeur">{k.moyenne === null ? '—' : `${k.moyenne.toLocaleString('fr-CA')} ★`}</span><span className="adm-gris">Des avis reçus sur le site</span>
        </div>
      </div>

      <div className="adm-avis-haut">
        <CarteQr />
        {reglages && <CarteReglages reglages={reglages} onEnregistre={setReglages} />}
      </div>

      {erreur && <p className="adm-erreur" role="alert">{erreur}</p>}
      <div className="adm-periodes" role="group" aria-label="Filtrer les avis">
        {FILTRES.map(([f, l]) => (
          <button key={f} type="button" aria-pressed={filtre === f} className={filtre === f ? 'actif' : ''} onClick={() => setFiltre(f)}>{l}</button>
        ))}
      </div>

      {!avis && !erreur && <p className="adm-gris">Chargement…</p>}
      {avis && visibles.length === 0 && (
        <p className="adm-vide">{avis.length === 0 ? 'Aucun témoignage reçu pour le moment. Partagez le lien ou le code QR de la page Avis avec vos clients.' : 'Aucun avis dans ce filtre.'}</p>
      )}
      <ul className="adm-avis-liste">
        {visibles.map((a) => (
          <li key={a.id} className="adm-carte adm-avis-carte">
            <div className="adm-avis-tete">
              <span>
                <strong>{a.nom}</strong> <span className={`adm-pastille ${LIBELLE[a.statut][1]}`}>{LIBELLE[a.statut][0]}</span>
                {a.metier ? <> · {a.metier}</> : null} · <span className="adm-avis-etoiles" role="img" aria-label={`${a.note} sur 5`}>{'★'.repeat(a.note)}</span>
              </span>
              <span className="adm-gris">reçu le {new Date(a.created_at).toLocaleDateString('fr-CA')}{a.source === 'qr' ? ' · par le code QR' : ''} · accord de publication coché</span>
            </div>
            <p className="adm-avis-message">« {a.message} »</p>
            <p className="adm-gris">Affiché sur le site : « {nomAffiche(a.nom)}{a.metier ? ` · ${a.metier}` : ''} »</p>
            <div className="adm-avis-boutons">
              {a.statut !== 'publie' && <button type="button" className="btn btn-primary" onClick={() => changer(a.id, 'publie')}>✓ Publier</button>}
              {a.statut !== 'refuse' && <button type="button" className="btn btn-ghost" onClick={() => changer(a.id, 'refuse')}>{a.statut === 'publie' ? 'Retirer du site' : '✕ Refuser'}</button>}
              {a.statut !== 'en_attente' && <button type="button" className="btn btn-ghost" onClick={() => changer(a.id, 'en_attente')}>↺ Remettre en attente</button>}
              <button type="button" className="btn btn-ghost adm-avis-supprimer" onClick={() => supprimer(a)}>Supprimer définitivement</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
