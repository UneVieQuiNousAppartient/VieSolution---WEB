'use client';

// Admin Vie Solution Web : tableau de bord « Aujourd'hui » (src/components/vsw/admin-tableau.tsx),
// demandes, clients, rendez-vous, stages, brouillons à approuver, tâches, relances automatiques, dans un
// menu à gauche (maquette validée par Camille le 2026-10-23). Accès : code + double vérification
// (cookie httpOnly).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { encode } from 'uqr';
import { Icon } from '@/components/vsw/icon';
import { TableauDeBord, type Vue } from '@/components/vsw/admin-tableau';
import { FicheDemande } from '@/components/vsw/admin-fiche';
import { NouvelleDemande } from '@/components/vsw/admin-nouvelle';
import { BoiteReception } from '@/components/vsw/admin-boite';
import { EditeurModeles } from '@/components/vsw/admin-modeles';
import { STATUTS } from '@/lib/crm/regles';
import { PERIODES, construireTableau, estRdv, estStage, type Periode } from '@/lib/crm/tableau';
import type { Aujourdhui } from '@/lib/crm/aujourdhui';
import type { RegleAffichee } from '@/lib/crm/moteur';

type Lead = {
  id: string; name: string; email: string; phone: string; company: string | null;
  service_interest: string; need: string; status: string; source: string;
  created_at: string; status_changed_at: string | null; last_contact_at: string | null; email_opt_out_at: string | null;
};
type Draft = {
  id: string; target_id: string; kind: string; subject: string; body: string;
  status: string; created_at: string;
};
type Task = { id: string; lead_id: string; title: string; due_at: string | null };
type Notif = { id: string; title: string; body: string; created_at: string };

type Data = {
  leads: Lead[]; drafts: Draft[]; tasks: Task[]; notifications: Notif[];
  aujourdhui: Aujourdhui; regles: RegleAffichee[];
  /** Courriels reçus ni traités ni ignorés (boîte de réception). */
  boite?: number;
};

type Act = (type: string, id: string, value?: string) => void;

/** Boutons d'une fiche : un contact noté arrête les relances automatiques. */
function ActionsFiche({ lead, act, busy }: { lead: { id: string; email_opt_out_at: string | null }; act: Act; busy: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
      <button className="calc-option" disabled={busy} onClick={() => act('contact', lead.id, 'appel')}>Appel fait</button>
      <button className="calc-option" disabled={busy} onClick={() => act('contact', lead.id, 'courriel')}>Courriel envoyé</button>
      <button className="calc-option" disabled={busy} onClick={() => act('contact', lead.id, 'rdv')}>RDV pris</button>
      {lead.email_opt_out_at ? (
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', alignSelf: 'center' }}>Désabonnement enregistré</span>
      ) : (
        <button
          className="calc-option" disabled={busy}
          onClick={() => {
            if (window.confirm('Ne plus envoyer aucune relance automatique à cette adresse ?')) act('opt_out', lead.id);
          }}
        >
          Désabonner
        </button>
      )}
    </div>
  );
}

const heures = (h: number) => (h % 24 === 0 ? `${h / 24} jour${h / 24 > 1 ? 's' : ''}` : `${h} h`);

const box: React.CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-soft)',
  borderRadius: 'var(--radius-lg)', padding: 20,
};

const lienDiscret: React.CSSProperties = {
  background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent)', font: 'inherit',
};

/** Code QR du lien otpauth, dessiné dans le navigateur (le secret ne part vers aucun service externe).
 *  Noir sur blanc dans les deux thèmes : c'est ce que les applications d'authentification lisent le mieux. */
function CodeQr({ texte }: { texte: string }) {
  const { data, size } = encode(texte, { ecc: 'M', border: 4 });
  let d = '';
  data.forEach((ligne, y) => ligne.forEach((plein, x) => { if (plein) d += `M${x} ${y}h1v1h-1z`; }));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={208} height={208} shapeRendering="crispEdges" role="img"
      aria-label="Code QR à scanner avec votre application d'authentification"
      style={{ display: 'block', margin: '0 auto 18px', background: '#fff', borderRadius: 8 }}>
      <path d={d} fill="#000" />
    </svg>
  );
}

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleString('fr-CA', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState('');
  // Connexion en deux écrans : le code d'accès, puis le code à 6 chiffres (ou un code de secours).
  const [etapeConnexion, setEtapeConnexion] = useState<'code' | 'otp'>('code');
  const [secours, setSecours] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  // Double vérification : 'activer' (session « code seulement »), puis 'codes' (codes de secours à noter)
  const [mfaEtape, setMfaEtape] = useState<null | 'activer' | 'codes'>(null);
  const [mfa, setMfa] = useState<{ secret: string; lisible: string; lien: string } | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [codesSecours, setCodesSecours] = useState<string[]>([]);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<Vue>('aujourdhui');
  const [periode, setPeriode] = useState<Periode>(30);
  const [recherche, setRecherche] = useState('');
  const [delais, setDelais] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [openDraft, setOpenDraft] = useState<string | null>(null);
  // Fiche ouverte (étape A) et fenêtre « Nouvelle demande ».
  const [ficheId, setFicheId] = useState<string | null>(null);
  const [nouvelle, setNouvelle] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/data');
    if (res.status === 401) { setAuthed(false); return; }
    const json = await res.json();
    if (!res.ok) { setError(json.hint || json.error || 'Erreur'); return; }
    setError('');
    setAuthed(true);
    setData(json);
  }, []);

  useEffect(() => { load(); }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (etapeConnexion === 'otp' && !otp.trim()) {
      setError(secours ? 'Entrez un de vos codes de secours.' : 'Entrez le code à 6 chiffres affiché par votre application.');
      return;
    }
    setBusy(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(etapeConnexion === 'otp' ? { code, otp } : { code }),
    });
    setBusy(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || 'Erreur'); return; }
    setError('');
    setOtp('');
    if (json.otp_requis) { setEtapeConnexion('otp'); return; }
    setEtapeConnexion('code');
    setSecours(false);
    setCode(''); // le code d'accès ne reste pas en mémoire une fois la connexion faite
    if (json.activer_mfa) { setMfaEtape('activer'); commencerMfa(); return; }
    if (json.code_secours_utilise) setInfo('Connexion faite avec un code de secours : il ne servira plus. S’il vous en reste peu, réactivez la double vérification avec votre nouveau téléphone.');
    setAuthed(true);
    load();
  };

  const mfaPost = async (payload: Record<string, string>) => {
    setBusy(true);
    const res = await fetch('/api/admin/mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || 'Erreur'); return null; }
    setError('');
    return json;
  };

  const commencerMfa = async () => {
    const json = await mfaPost({ etape: 'debut' });
    if (json) setMfa(json);
  };

  const confirmerMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfa) return;
    const json = await mfaPost({ etape: 'confirmer', secret: mfa.secret, otp: mfaCode });
    if (!json) return;
    setMfa(null);
    setMfaCode('');
    setCodesSecours(json.codes || []);
    setMfaEtape('codes');
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setData(null);
    setCode('');
  };

  const act = async (type: string, id: string, value?: string) => {
    setBusy(true);
    const res = await fetch('/api/admin/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, value }),
    });
    setBusy(false);
    if (res.ok) { load(); return true; }
    const json = await res.json().catch(() => ({}));
    setError(json.error || 'Erreur');
    return false;
  };

  const regler = async (key: string, reglage: { enabled?: boolean; delai_jours?: number }) => {
    setBusy(true);
    const res = await fetch('/api/admin/regles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, ...reglage }),
    });
    setBusy(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || 'Erreur'); return; }
    setError('');
    setDelais((d) => ({ ...d, [key]: '' }));
    load();
  };

  const leadById = (id: string) => data?.leads.find((l) => l.id === id);

  const tableau = useMemo(
    () => (data ? construireTableau({ leads: data.leads, taches: data.tasks, brouillons: data.drafts }, periode) : null),
    [data, periode],
  );
  // Listes « Demandes », « Clients », « Rendez-vous », « Stagiaires », filtrées par la recherche.
  const listeLeads = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return (data?.leads ?? [])
      .filter((l) =>
        tab === 'clients' ? l.status === 'Client'
          : tab === 'rdv' ? estRdv(l)
            : tab === 'stages' ? estStage(l)
              : !estStage(l))
      .filter((l) => !q || [l.name, l.email, l.phone, l.company ?? ''].some((x) => x.toLowerCase().includes(q)));
  }, [data, tab, recherche]);

  if (mfaEtape === 'activer') {
    return (
      <section className="section" style={{ borderTop: 'none', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="eyebrow">{'Admin'}</div>
          <h1 className="display" style={{ fontSize: 32, margin: '20px 0 24px' }}>Activer la double vérification</h1>
          <div style={box}>
            {!mfa ? (
              <button className="btn btn-primary" disabled={busy} onClick={commencerMfa}
                style={{ width: '100%', justifyContent: 'center' }}>
                {busy ? '…' : 'Afficher le code QR'}
              </button>
            ) : (
              <form onSubmit={confirmerMfa}>
                <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.6 }}>
                  Scannez ce code avec Google Authenticator ou Microsoft Authenticator.
                </p>
                <CodeQr texte={mfa.lien} />
                <details style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--fg-2)' }}>
                  <summary style={{ cursor: 'pointer' }}>Impossible de scanner ?</summary>
                  <p style={{ margin: '10px 0 6px', lineHeight: 1.6 }}>
                    Sur ce téléphone :{' '}
                    <a href={mfa.lien} style={{ color: 'var(--accent)', fontWeight: 600 }}>ajouter à mon application</a>.
                    Ou choisissez « Saisir une clé de configuration » et tapez cette clé :
                  </p>
                  <p className="mono" style={{ margin: 0, fontSize: 15, letterSpacing: '0.06em', color: 'var(--fg-0)', wordBreak: 'break-word' }}>
                    {mfa.lisible}
                  </p>
                </details>
                <div className="form-field">
                  <label htmlFor="mfa-code">Code à 6 chiffres affiché</label>
                  <input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)} autoFocus />
                </div>
                <button type="submit" className="btn btn-primary" disabled={busy}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  {busy ? '…' : 'Activer'}
                </button>
              </form>
            )}
            {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{error}</p>}
          </div>
        </div>
      </section>
    );
  }

  if (mfaEtape === 'codes') {
    return (
      <section className="section" style={{ borderTop: 'none', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="eyebrow">{'Admin'}</div>
          <h1 className="display" style={{ fontSize: 32, margin: '20px 0 12px' }}>Vos codes de secours</h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6 }}>
            Si vous perdez votre téléphone, un de ces codes remplace le code à 6 chiffres. Chacun ne sert
            qu&apos;une fois. Notez-les sur papier ou dans votre gestionnaire de mots de passe : ils ne
            seront plus jamais affichés.
          </p>
          <div style={box}>
            <ul className="mono" style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 15, color: 'var(--fg-0)' }}>
              {codesSecours.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <button className="btn btn-primary" onClick={() => { setMfaEtape(null); setCodesSecours([]); setAuthed(true); load(); }}
              style={{ width: '100%', justifyContent: 'center' }}>
              Je les ai notés — ouvrir le tableau de bord
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!authed) {
    return (
      <section className="section" style={{ borderTop: 'none', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: 420 }}>
          <div className="eyebrow">{'Admin'}</div>
          <h1 className="display" style={{ fontSize: 36, margin: '20px 0 24px' }}>Espace admin</h1>
          <form onSubmit={login} style={box}>
            {etapeConnexion === 'code' ? (
              <div className="form-field">
                <label htmlFor="code">Code d&apos;accès</label>
                <input
                  id="code" type="password" value={code}
                  onChange={(e) => setCode(e.target.value)} autoFocus
                />
              </div>
            ) : (
              <div className="form-field">
                <label htmlFor="otp">{secours ? 'Code de secours' : 'Code à 6 chiffres de votre application'}</label>
                <input
                  key={secours ? 'secours' : 'otp'}
                  id="otp" inputMode={secours ? 'text' : 'numeric'} autoComplete="one-time-code" value={otp}
                  onChange={(e) => setOtp(e.target.value)} autoFocus
                />
              </div>
            )}
            {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}
              style={{ width: '100%', justifyContent: 'center' }}>
              {busy ? '…' : 'Entrer'}
            </button>
            {etapeConnexion === 'otp' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 14, fontSize: 13 }}>
                <button type="button" style={lienDiscret}
                  onClick={() => { setEtapeConnexion('code'); setSecours(false); setOtp(''); setError(''); }}>
                  ← Code d&apos;accès
                </button>
                <button type="button" style={lienDiscret}
                  onClick={() => { setSecours((s) => !s); setOtp(''); setError(''); }}>
                  {secours ? 'Utiliser l’application' : 'Téléphone perdu ?'}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    );
  }

  const pending = data?.drafts.filter((d) => d.status === 'pending') ?? [];

  const compteurs = tableau?.compteurs;
  const menu: { titre: string; vues: [Vue, string, number | undefined, boolean?][] }[] = [
    { titre: 'Pilotage', vues: [
      ['aujourdhui', 'Aujourd’hui', data?.aujourdhui.total],
      ['boite', 'Boîte de réception', data?.boite],
      ['leads', 'Demandes', compteurs?.demandes],
      ['tasks', 'Tâches', compteurs?.taches],
      ['rdv', 'Rendez-vous', compteurs?.rdv],
    ] },
    { titre: 'Suivi', vues: [
      ['clients', 'Clients', compteurs?.clients],
      ['drafts', 'Brouillons à approuver', pending.length, true],
      ['regles', 'Courriels et relances', undefined],
      ['stages', 'Stagiaires', compteurs?.stages],
    ] },
  ];
  const titres: Record<Vue, string> = {
    aujourdhui: 'Bonjour, Camille', boite: 'Boîte de réception', leads: 'Demandes', clients: 'Clients', rdv: 'Demandes de rendez-vous',
    stages: 'Stagiaires', drafts: 'Brouillons à approuver', tasks: 'Tâches', regles: 'Courriels et relances',
  };
  const date = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Toronto', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const ouvrir = (v: Vue) => { setTab(v); setFicheId(null); window.scrollTo({ top: 0 }); };
  const ouvrirFiche = (id: string) => { setFicheId(id); window.scrollTo({ top: 0 }); };

  return (
    <div className="adm-page">
      <nav className="adm-menu" aria-label="Menu de l’admin">
        <div className="adm-marque">
          <span className="adm-marque-nom">Vie Solution Web</span>
          <span className="adm-gris">Tableau de bord</span>
        </div>
        {menu.map((g) => (
          <div key={g.titre} className="adm-menu-groupe">
            <span className="adm-menu-titre">{g.titre}</span>
            {g.vues.map(([v, libelle, n, violet]) => (
              <button key={v} type="button" className={'adm-menu-lien' + (tab === v ? ' actif' : '')}
                aria-current={tab === v ? 'page' : undefined} onClick={() => ouvrir(v)}>
                {libelle}
                {n ? <span className={'adm-menu-compte' + (violet ? ' violet' : '')}>{n}</span> : null}
              </button>
            ))}
          </div>
        ))}
        <div className="adm-menu-bas">
          <button type="button" className="adm-menu-lien" onClick={load} disabled={busy}>Rafraîchir</button>
          <button type="button" className="adm-menu-lien" onClick={logout}>Se déconnecter</button>
        </div>
      </nav>

      <div className="adm-contenu">
        <div className="adm-entete">
          <div>
            <h1>{ficheId ? 'Fiche de la demande' : titres[tab]}</h1>
            {tab === 'aujourdhui' && !ficheId && (
              <span className="adm-gris">{date.charAt(0).toUpperCase() + date.slice(1)} · voici ce qui demande votre attention</span>
            )}
          </div>
          <div className="adm-entete-outils">
            <form role="search" className="adm-recherche"
              onSubmit={(e) => { e.preventDefault(); if (!['leads', 'clients', 'rdv', 'stages'].includes(tab)) ouvrir('leads'); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
              <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
                placeholder="Chercher un nom, un courriel…" aria-label="Chercher une demande" />
            </form>
            <button type="button" className="adm-bouton" onClick={() => setNouvelle(true)}>+ Nouvelle demande</button>
            {tab === 'aujourdhui' && !ficheId && (
              <div className="adm-periodes" role="group" aria-label="Période">
                {PERIODES.map((p) => (
                  <button key={p} type="button" aria-pressed={periode === p} className={periode === p ? 'actif' : ''}
                    onClick={() => setPeriode(p)}>
                    {p} jours
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {info && <div className="adm-carte"><p style={{ margin: 0, fontSize: 14 }}>{info}</p></div>}
        {error && <div className="adm-carte" role="alert" style={{ borderColor: 'var(--danger)' }}><p style={{ margin: 0, fontSize: 14 }}>{error}</p></div>}
        {!data && !error && <p className="adm-gris">Chargement…</p>}

        {nouvelle && (
          <NouvelleDemande onFermer={() => setNouvelle(false)} onCreee={(id) => { setNouvelle(false); load(); ouvrirFiche(id); }} />
        )}
        {data && ficheId && (
          <FicheDemande key={ficheId} id={ficheId} act={act} busy={busy} onRetour={() => setFicheId(null)} onChange={load} />
        )}
        {data && !ficheId && (
          <>
            {tab === 'aujourdhui' && tableau && (
              <TableauDeBord t={tableau} aujourdhui={data.aujourdhui} act={act} busy={busy} ouvrir={ouvrir} ouvrirFiche={ouvrirFiche} leadParId={leadById} />
            )}

            {tab === 'boite' && <BoiteReception onOuvrirFiche={ouvrirFiche} onChange={load} />}

            {tab === 'regles' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  Le suivi tourne toutes les heures. Tout s&apos;arrête pour une personne dès qu&apos;un contact
                  (appel, courriel, RDV) est noté sur sa fiche.
                </p>
                {data.regles.length === 0 && <p style={{ color: 'var(--fg-2)' }}>Réglages indisponibles pour le moment.</p>}
                {data.regles.map((r) => (
                  <div key={r.key} style={box}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      <div style={{ flex: '1 1 260px' }}>
                        <div style={{ color: 'var(--fg-0)', fontWeight: 500 }}>
                          {r.libelle}
                          {r.ecrit_au_prospect && <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 8 }}>courriel au prospect</span>}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 4 }}>{r.description}</div>
                        {r.delai_reglable && (
                          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>Après {heures(r.delay_hours)}</div>
                        )}
                      </div>
                      <button
                        className={'calc-option' + (r.enabled ? ' active' : '')} disabled={busy}
                        aria-pressed={r.enabled}
                        onClick={() => regler(r.key, { enabled: !r.enabled })}
                      >
                        {r.enabled ? 'Activée' : 'Désactivée'}
                      </button>
                    </div>
                    {r.delai_reglable && (
                      <form
                        style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}
                        onSubmit={(e) => { e.preventDefault(); regler(r.key, { delai_jours: Number(delais[r.key]) }); }}
                      >
                        <label htmlFor={`delai-${r.key}`} style={{ fontSize: 13, color: 'var(--fg-2)' }}>Nouveau délai (jours)</label>
                        <input
                          id={`delai-${r.key}`} type="number" min={1} max={90} step={1}
                          value={delais[r.key] ?? ''}
                          onChange={(e) => setDelais((d) => ({ ...d, [r.key]: e.target.value }))}
                          style={{ width: 80, background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--fg-0)', padding: '6px 8px' }}
                        />
                        <button type="submit" className="calc-option" disabled={busy || !delais[r.key]}>Enregistrer</button>
                      </form>
                    )}
                  </div>
                ))}
                <EditeurModeles />
              </div>
            )}

            {(tab === 'leads' || tab === 'clients' || tab === 'rdv' || tab === 'stages') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {listeLeads.length === 0 && (
                  <p style={{ color: 'var(--fg-2)' }}>{recherche.trim() ? 'Aucun résultat pour cette recherche.' : 'Rien ici pour l’instant.'}</p>
                )}
                {listeLeads.map((l) => (
                  <div key={l.id} style={{ ...box, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                    <div>
                      <button type="button" className="adm-lien adm-lien-nom" onClick={() => ouvrirFiche(l.id)}>{l.name}</button>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 10 }}>{l.source}</span>
                      <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                        <a href={`mailto:${l.email}`} style={{ color: 'var(--accent)' }}>{l.email}</a>
                        {l.phone ? ` · ${l.phone}` : ''}{l.company ? ` · ${l.company}` : ''}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--fg-1)', marginTop: 6, whiteSpace: 'pre-wrap' }}>{l.need}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>
                        Créé {fmtDate(l.created_at)} · Dernier contact {fmtDate(l.last_contact_at)}
                      </div>
                      <ActionsFiche lead={l} act={act} busy={busy} />
                    </div>
                    <div>
                      <select
                        value={l.status}
                        onChange={(e) => act('lead_status', l.id, e.target.value)}
                        style={{ background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--fg-0)', padding: '8px 10px', fontSize: 13 }}
                      >
                        {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'drafts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.drafts.length === 0 && <p style={{ color: 'var(--fg-2)' }}>Aucun brouillon.</p>}
                {data.drafts.map((d) => {
                  const lead = leadById(d.target_id);
                  const mailto = lead
                    ? `mailto:${lead.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`
                    : '#';
                  return (
                    <div key={d.id} style={box}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                          <span className="mono" style={{ fontSize: 11, color: d.status === 'pending' ? 'var(--warn)' : 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {d.kind} · {d.status}
                          </span>
                          <div style={{ color: 'var(--fg-0)', fontWeight: 500, marginTop: 4 }}>{d.subject}</div>
                          <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                            Pour : {lead ? <button type="button" className="adm-lien" onClick={() => ouvrirFiche(lead.id)}>{`${lead.name} <${lead.email}>`}</button> : d.target_id}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <button className="calc-option" onClick={() => setOpenDraft(openDraft === d.id ? null : d.id)}>
                            {openDraft === d.id ? 'Masquer' : 'Lire'}
                          </button>
                          {d.status === 'pending' && (
                            <>
                              <button className="calc-option active" disabled={busy} onClick={() => act('draft_status', d.id, 'approved')}>
                                Approuver
                              </button>
                              <button className="calc-option" disabled={busy} onClick={() => act('draft_status', d.id, 'rejected')}>
                                Rejeter
                              </button>
                            </>
                          )}
                          {(d.status === 'approved' || d.status === 'pending') && lead && (
                            <>
                              <a className="btn btn-primary" style={{ padding: '10px 16px', fontSize: 13 }} href={mailto}>
                                <Icon name="send" size={13} /> Ouvrir le courriel
                              </a>
                              <button className="calc-option" disabled={busy} onClick={() => act('draft_sent', d.id)}>
                                Marquer envoyé
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {openDraft === d.id && (
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--fg-1)', background: 'var(--bg-2)', border: '1px solid var(--line-soft)', borderRadius: 10, padding: 16, marginTop: 14 }}>
                          {d.body}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'tasks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.tasks.length === 0 && <p style={{ color: 'var(--fg-2)' }}>Aucune tâche ouverte.</p>}
                {data.tasks.map((t) => (
                  <div key={t.id} style={{ ...box, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <div style={{ color: 'var(--fg-0)' }}>
                        {t.title}
                        {leadById(t.lead_id) && <> — <button type="button" className="adm-lien" onClick={() => ouvrirFiche(t.lead_id)}>{leadById(t.lead_id)?.name}</button></>}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>Échéance {fmtDate(t.due_at)}</div>
                    </div>
                    <button className="calc-option" disabled={busy} onClick={() => act('task_done', t.id)}>
                      <Icon name="check" size={13} /> Fait
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
