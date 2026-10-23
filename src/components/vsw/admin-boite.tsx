'use client';

// Boîte de réception de /admin (étape B, maquette validée par Camille le 2026-10-23) : courriels reçus à
// @viesolutionweb.ca, rangés par personne ; réponse depuis l'admin avec un modèle approuvé, ou une
// proposition de l'IA (choisie parmi les modèles, à relire : rien ne part sans le clic de Camille).
// Données : GET /api/admin/courriels ; changements : POST /api/admin/courriels ; IA : POST
// /api/admin/courriels/suggestion.

import { useCallback, useEffect, useState } from 'react';

export type ModeleInsere = { cle: string; libelle: string; sujet: string; corps: string };

type Conversation = {
  cle: string; leadId: string | null; adresse: string; nom: string; sujet: string; extrait: string;
  deNous: boolean; date: string; aRepondre: boolean; ignoree: boolean; recus: number;
};
type Message = {
  id: string; direction: string; from_email: string; subject: string; body_text: string | null; snippet: string;
  received_at: string; attachments: { nom: string }[] | null; traite_at: string | null; ignore_at: string | null;
};
type Detail = {
  cle: string; adresse: string; ia: boolean; modeles: ModeleInsere[]; messages: Message[];
  fiche: { id: string; name: string; email: string; status: string; email_opt_out_at: string | null } | null;
};
type Reponse = { sujet: string; corps: string; modele: string | null };
type Suggestion = { raison: string; ajouts: string[]; crochets: string[]; aucun: boolean };
type Filtre = 'a_repondre' | 'tout' | 'inconnus';

const FUSEAU = 'America/Toronto';
const quand = (iso: string, maintenant: number) => {
  const d = new Date(iso);
  const jours = Math.floor((maintenant - d.getTime()) / 86_400_000);
  const opts: Intl.DateTimeFormatOptions = jours < 1 ? { hour: 'numeric', minute: '2-digit' } : jours < 6 ? { weekday: 'short' } : { day: 'numeric', month: 'short' };
  return new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU, ...opts }).format(d);
};
const dateHeure = (iso: string) =>
  new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso));

const sujetReponse = (s: string) => (/^\s*(re|rép|réf)\s*:/i.test(s) ? s.trim() : `Re : ${s.trim() || 'votre message'}`);

/** Liste « Insérer un modèle » (boîte et fiche) : le modèle choisi remplace le texte en cours. */
export function ChoixModele({ modeles, disabled, onChoisir }: { modeles: ModeleInsere[]; disabled?: boolean; onChoisir: (m: ModeleInsere) => void }) {
  if (!modeles.length) return null;
  return (
    <label className="adm-champ" style={{ flex: '1 1 220px' }}>
      Insérer un modèle
      <select value="" disabled={disabled} onChange={(e) => {
        const m = modeles.find((x) => x.cle === e.target.value);
        if (m) onChoisir(m);
      }}>
        <option value="">Choisir un modèle…</option>
        {modeles.map((m) => <option key={m.cle} value={m.cle}>{m.libelle}</option>)}
      </select>
    </label>
  );
}

async function poster(url: string, corps: Record<string, unknown>) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, json };
}

export function BoiteReception({ onOuvrirFiche, onChange }: { onOuvrirFiche: (id: string) => void; onChange: () => void }) {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [chargeA, setChargeA] = useState(0); // instant du dernier chargement : dates relatives
  const [filtre, setFiltre] = useState<Filtre>('a_repondre');
  const [choisie, setChoisie] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [reponse, setReponse] = useState<Reponse>({ sujet: '', corps: '', modele: null });
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [enCours, setEnCours] = useState(false);

  const chargerListe = useCallback(async () => {
    const res = await fetch('/api/admin/courriels');
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setErreur(json.error || 'Boîte de réception illisible pour le moment.'); return; }
    setChargeA(Date.now());
    setConversations(json.conversations);
  }, []);

  const chargerDetail = useCallback(async (cle: string) => {
    const res = await fetch(`/api/admin/courriels?cle=${encodeURIComponent(cle)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setErreur(json.error || 'Conversation illisible pour le moment.'); return; }
    const d = json as Detail;
    setDetail(d);
    const dernierRecu = [...d.messages].reverse().find((m) => m.direction === 'in');
    setReponse({ sujet: sujetReponse(dernierRecu?.subject || ''), corps: '', modele: null });
    setSuggestion(null);
  }, []);

  useEffect(() => { chargerListe(); }, [chargerListe]);
  useEffect(() => { if (choisie) chargerDetail(choisie); }, [choisie, chargerDetail]);

  const ouvrir = (cle: string) => { setChoisie(cle); setDetail(null); setErreur(''); setMessage(''); };

  const faire = async (op: string, extra: Record<string, unknown>, succes: string) => {
    if (!detail) return false;
    setEnCours(true);
    const r = await poster('/api/admin/courriels', { op, cle: detail.cle, ...extra });
    setEnCours(false);
    if (!r.ok) { setErreur(String(r.json.error || 'Erreur')); setMessage(''); return false; }
    setErreur('');
    setMessage(succes);
    await chargerListe();
    onChange();
    return r.json;
  };

  const proposer = async () => {
    if (!detail) return;
    setEnCours(true);
    setErreur('');
    const r = await poster('/api/admin/courriels/suggestion', { cle: detail.cle });
    setEnCours(false);
    if (!r.ok) { setErreur(String(r.json.error || 'Suggestion impossible pour le moment.')); return; }
    const j = r.json as { modele: string; sujet: string; corps: string; raison: string; ajouts: string[]; crochets: string[] };
    if (j.modele === 'aucun') {
      setSuggestion({ raison: j.raison, ajouts: [], crochets: [], aucun: true });
      return;
    }
    setReponse({ sujet: reponse.sujet.trim() ? reponse.sujet : j.sujet, corps: j.corps, modele: j.modele });
    setSuggestion({ raison: j.raison, ajouts: j.ajouts, crochets: j.crochets, aucun: false });
  };

  const visibles = (conversations ?? []).filter((c) =>
    filtre === 'a_repondre' ? c.aRepondre : filtre === 'inconnus' ? !c.leadId && !c.ignoree : !c.ignoree);
  const nbARepondre = (conversations ?? []).filter((c) => c.aRepondre).length;
  const conv = conversations?.find((c) => c.cle === choisie) ?? null;
  const occupe = enCours;

  return (
    <div className="adm-tableau">
      <span className="adm-gris">
        Les courriels reçus à info@viesolutionweb.ca arrivent ici ; une copie part aussi dans votre Gmail. Répondez d’ici pour garder l’historique sur la fiche.
      </span>
      <div className="adm-boite">
        <section className="adm-carte adm-boite-liste" aria-label="Conversations">
          <div className="adm-periodes" role="group" aria-label="Filtre">
            {([['a_repondre', `À répondre (${nbARepondre})`], ['tout', 'Tout'], ['inconnus', 'Inconnus']] as const).map(([f, libelle]) => (
              <button key={f} type="button" aria-pressed={filtre === f} className={filtre === f ? 'actif' : ''} onClick={() => setFiltre(f)}>{libelle}</button>
            ))}
          </div>
          {!conversations && !erreur && <p className="adm-gris">Chargement…</p>}
          {conversations && visibles.length === 0 && (
            <p className="adm-vide">{filtre === 'a_repondre' ? 'Rien à répondre pour le moment. Bravo !' : 'Aucun courriel reçu pour l’instant.'}</p>
          )}
          <ul className="adm-conversations">
            {visibles.map((c) => (
              <li key={c.cle}>
                <button type="button" className={'adm-conversation' + (c.cle === choisie ? ' actif' : '')} aria-current={c.cle === choisie ? 'true' : undefined} onClick={() => ouvrir(c.cle)}>
                  <span className="adm-conversation-tete">
                    <strong>{c.nom || c.adresse}</strong>
                    <span className="adm-gris">{quand(c.date, chargeA)}</span>
                  </span>
                  <span className="adm-conversation-sujet">
                    {c.aRepondre && <span className="adm-puce-ronde" style={{ background: 'var(--accent)', marginTop: 0 }} aria-label="à répondre" />}
                    {c.sujet || '(sans objet)'}
                    {!c.leadId && <span className="adm-pastille adm-pastille-warn">Inconnu</span>}
                  </span>
                  <span className="adm-gris adm-conversation-extrait">{c.deNous ? 'Vous : ' : ''}{c.extrait}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="adm-carte adm-boite-fil" aria-label="Conversation">
          {(erreur || message) && (
            <div role={erreur ? 'alert' : 'status'} className="adm-ligne adm-ligne-bordee" style={{ borderColor: erreur ? 'var(--danger)' : 'var(--ok)' }}>{erreur || message}</div>
          )}
          {!choisie && <p className="adm-vide">Choisissez une conversation à gauche.</p>}
          {choisie && !detail && !erreur && <p className="adm-gris">Chargement…</p>}
          {detail && (
            <>
              <div className="adm-carte-tete">
                <div>
                  <h2>{conv?.sujet || detail.messages.at(-1)?.subject || '(sans objet)'}</h2>
                  <span className="adm-gris">
                    {detail.fiche ? `${detail.fiche.name} · ${detail.fiche.email} · étape ${detail.fiche.status}` : `${detail.adresse} · aucune demande à ce courriel`}
                  </span>
                </div>
                {detail.fiche && <button type="button" className="adm-lien" onClick={() => onOuvrirFiche(detail.fiche!.id)}>Ouvrir sa fiche</button>}
              </div>

              <ol className="adm-messages">
                {detail.messages.map((m) => (
                  <li key={m.id} className={'adm-message' + (m.direction === 'in' ? '' : ' adm-message-nous')}>
                    <span className="adm-gris">{m.direction === 'in' ? (detail.fiche?.name || m.from_email) : 'Vous'} · {dateHeure(m.received_at)}</span>
                    <p className="adm-texte-long">{m.body_text || m.snippet || '(courriel sans texte)'}</p>
                    {m.attachments && m.attachments.length > 0 && (
                      <span className="adm-gris">Pièces jointes (dans votre Gmail ou dans Resend) : {m.attachments.map((a) => a.nom).join(', ')}</span>
                    )}
                  </li>
                ))}
              </ol>

              {!detail.fiche && conv && !conv.ignoree && (
                <div className="adm-bandeau">
                  <span>Ce courriel ne correspond à aucune demande. Créez-en une pour lui répondre, ou ignorez-le (pourriel, publicité).</span>
                  <div className="adm-ligne-actions">
                    <button type="button" className="adm-bouton" disabled={occupe} onClick={async () => {
                      const j = await faire('creer_depuis', {}, 'Demande créée. Vous pouvez maintenant lui répondre.');
                      if (j && typeof j.id === 'string') { setChoisie(`fiche:${j.id}`); }
                    }}>Créer une demande avec ce courriel</button>
                    <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe}
                      onClick={() => faire('ignorer', {}, 'Courriel ignoré.')}>Ignorer</button>
                  </div>
                </div>
              )}

              {detail.fiche && detail.fiche.email_opt_out_at && (
                <p className="adm-gris">Cette personne s’est désabonnée : aucun courriel ne peut lui partir. Appelez-la si elle attend une réponse.</p>
              )}

              {detail.fiche && !detail.fiche.email_opt_out_at && (
                <form className="adm-formulaire adm-reponse" onSubmit={async (e) => {
                  e.preventDefault();
                  if (!window.confirm(`Envoyer cette réponse à ${detail.fiche!.email} ?`)) return;
                  if (await faire('repondre', reponse, 'Réponse envoyée. Les relances automatiques sont arrêtées pour cette personne.')) {
                    await chargerDetail(detail.cle);
                  }
                }}>
                  <div className="adm-carte-tete">
                    <h2>Votre réponse</h2>
                  </div>
                  <div className="adm-ligne-actions" style={{ alignItems: 'flex-end' }}>
                    <ChoixModele modeles={detail.modeles} disabled={occupe} onChoisir={(m) => {
                      if (reponse.corps.trim() && !window.confirm('Remplacer le texte en cours par ce modèle ?')) return;
                      setReponse({ sujet: reponse.sujet.trim() ? reponse.sujet : m.sujet, corps: m.corps, modele: m.cle });
                      setSuggestion(null);
                    }} />
                    {detail.ia && (
                      <button type="button" className="adm-bouton adm-bouton-violet" disabled={occupe} onClick={() => {
                        if (reponse.corps.trim() && !window.confirm('Remplacer le texte en cours par la proposition de l’IA ?')) return;
                        proposer();
                      }}>{enCours ? 'Un instant…' : 'Proposer une réponse (IA)'}</button>
                    )}
                  </div>
                  {suggestion && (
                    <div className="adm-ligne adm-ligne-bordee adm-suggestion">
                      <span className="adm-ligne-texte">
                        <span>{suggestion.aucun ? 'Aucun modèle ne convient' : 'Proposée par l’IA à partir d’un de vos modèles'} : {suggestion.raison}</span>
                        {suggestion.crochets.length > 0 && <span className="adm-accent">À compléter : {suggestion.crochets.join(' · ')}</span>}
                        {suggestion.ajouts.length > 0 && <span className="adm-rouge">À vérifier, absent de la conversation : {suggestion.ajouts.join(' · ')}</span>}
                        <span className="adm-gris">Relisez-la : rien ne part sans votre clic.</span>
                      </span>
                    </div>
                  )}
                  <label className="adm-champ">Objet
                    <input value={reponse.sujet} onChange={(e) => setReponse({ ...reponse, sujet: e.target.value })} />
                  </label>
                  <label className="adm-champ">Message
                    <textarea rows={10} value={reponse.corps} onChange={(e) => setReponse({ ...reponse, corps: e.target.value })} />
                  </label>
                  <span className="adm-gris">Votre signature, le logo et le pied de courriel (adresse postale, désabonnement) sont ajoutés automatiquement.</span>
                  <div className="adm-ligne-actions">
                    <button type="submit" className="adm-bouton" disabled={occupe || !reponse.corps.trim()}>Envoyer</button>
                    {conv?.aRepondre && (
                      <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe}
                        onClick={() => faire('traiter', {}, 'Marqué comme traité.')}>Marquer comme traité</button>
                    )}
                  </div>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
