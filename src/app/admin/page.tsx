'use client';

// Admin Vie Solution Web — équivalent léger de l'admin KHI EDUC :
// leads, brouillons à approuver, tâches, notifications. Accès par code (cookie httpOnly).

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/vsw/icon';
import { STATUTS } from '@/lib/crm/regles';

type Lead = {
  id: string; name: string; email: string; phone: string; company: string | null;
  service_interest: string; need: string; status: string; source: string;
  created_at: string; last_contact_at: string | null;
};
type Draft = {
  id: string; target_id: string; kind: string; subject: string; body: string;
  status: string; created_at: string;
};
type Task = { id: string; lead_id: string; title: string; due_at: string | null };
type Notif = { id: string; title: string; body: string; created_at: string };

type Data = { leads: Lead[]; drafts: Draft[]; tasks: Task[]; notifications: Notif[] };

const box: React.CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-soft)',
  borderRadius: 'var(--radius-lg)', padding: 20,
};

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleString('fr-CA', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  // Double vérification : 'activer' (session « code seulement »), puis 'codes' (codes de secours à noter)
  const [mfaEtape, setMfaEtape] = useState<null | 'activer' | 'codes'>(null);
  const [mfa, setMfa] = useState<{ secret: string; lisible: string; lien: string } | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [codesSecours, setCodesSecours] = useState<string[]>([]);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<'leads' | 'drafts' | 'tasks'>('leads');
  const [busy, setBusy] = useState(false);
  const [openDraft, setOpenDraft] = useState<string | null>(null);

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
    setBusy(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, otp }),
    });
    setBusy(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || 'Erreur'); return; }
    setError('');
    setOtp('');
    if (json.activer_mfa) { setMfaEtape('activer'); return; }
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
    if (res.ok) load();
    else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || 'Erreur');
    }
  };

  const leadById = (id: string) => data?.leads.find((l) => l.id === id);

  if (mfaEtape === 'activer') {
    return (
      <section className="section" style={{ borderTop: 'none', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="eyebrow">{'Admin'}</div>
          <h1 className="display" style={{ fontSize: 32, margin: '20px 0 12px' }}>Activer la double vérification</h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6 }}>
            En plus du code d&apos;accès, l&apos;admin demandera un code à 6 chiffres affiché par une application sur
            votre téléphone. À faire une seule fois.
          </p>
          <div style={box}>
            {!mfa ? (
              <>
                <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.6 }}>
                  1. Installez une application d&apos;authentification gratuite : Google Authenticator, Microsoft
                  Authenticator ou 1Password.
                </p>
                <button className="btn btn-primary" disabled={busy} onClick={commencerMfa}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  {busy ? '…' : 'C’est fait, continuer'}
                </button>
              </>
            ) : (
              <form onSubmit={confirmerMfa}>
                <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.6 }}>
                  2. Ajoutez Vie Solution Web à l&apos;application. Sur ce téléphone :{' '}
                  <a href={mfa.lien} style={{ color: 'var(--accent)', fontWeight: 600 }}>ajouter à mon application</a>.
                </p>
                <p style={{ margin: '0 0 6px', fontSize: 14, lineHeight: 1.6 }}>
                  Ou, dans l&apos;application, choisissez « Saisir une clé de configuration » et tapez cette clé :
                </p>
                <p className="mono" style={{ margin: '0 0 18px', fontSize: 15, letterSpacing: '0.06em', color: 'var(--fg-0)', wordBreak: 'break-word' }}>
                  {mfa.lisible}
                </p>
                <div className="form-field">
                  <label htmlFor="mfa-code">3. Entrez le code à 6 chiffres affiché</label>
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
            <div className="form-field">
              <label htmlFor="code">Code d&apos;accès</label>
              <input
                id="code" type="password" value={code}
                onChange={(e) => setCode(e.target.value)} autoFocus
              />
            </div>
            <div className="form-field">
              <label htmlFor="otp">Code à 6 chiffres de votre application</label>
              <input
                id="otp" inputMode="numeric" autoComplete="one-time-code" value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                Première connexion : laissez vide, on l&apos;active ensuite. Téléphone perdu : entrez un code de secours.
              </span>
            </div>
            {error && <p style={{ color: 'oklch(0.75 0.18 25)', fontSize: 13 }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}
              style={{ width: '100%', justifyContent: 'center' }}>
              {busy ? '…' : 'Entrer'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const pending = data?.drafts.filter((d) => d.status === 'pending') ?? [];

  return (
    <section className="section" style={{ borderTop: 'none' }}>
      <div className="container">
        <div className="eyebrow">{'Admin — suivi des leads'}</div>
        <h1 className="display" style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '18px 0 24px' }}>
          Tableau de bord
        </h1>

        {info && (
          <div style={{ ...box, marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 14 }}>{info}</p>
          </div>
        )}

        {error && (
          <div style={{ ...box, borderColor: 'oklch(0.6 0.15 25)', marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 14 }}>{error}</p>
          </div>
        )}

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
              {[
                ['Leads', data.leads.length],
                ['Nouveaux', data.leads.filter((l) => l.status === 'Nouveau').length],
                ['Brouillons à approuver', pending.length],
                ['Tâches ouvertes', data.tasks.length],
              ].map(([label, n]) => (
                <div key={label as string} style={box}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--fg-0)' }}>{n}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {([['leads', 'Leads'], ['drafts', `Brouillons (${pending.length})`], ['tasks', 'Tâches']] as const).map(([k, label]) => (
                <button key={k} className={'calc-option' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>
                  {label}
                </button>
              ))}
              <button className="calc-option" onClick={load} disabled={busy} style={{ marginLeft: 'auto' }}>
                Rafraîchir
              </button>
              <button className="calc-option" onClick={logout}>
                Se déconnecter
              </button>
            </div>

            {tab === 'leads' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.leads.length === 0 && <p style={{ color: 'var(--fg-2)' }}>Aucun lead pour l&apos;instant.</p>}
                {data.leads.map((l) => (
                  <div key={l.id} style={{ ...box, display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                    <div>
                      <strong style={{ color: 'var(--fg-0)' }}>{l.name}</strong>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 10 }}>{l.source}</span>
                      <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                        <a href={`mailto:${l.email}`} style={{ color: 'var(--accent)' }}>{l.email}</a>
                        {l.phone ? ` · ${l.phone}` : ''}{l.company ? ` · ${l.company}` : ''}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--fg-1)', marginTop: 6, whiteSpace: 'pre-wrap' }}>{l.need}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>
                        Créé {fmtDate(l.created_at)} · Dernier contact {fmtDate(l.last_contact_at)}
                      </div>
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
                            Pour : {lead ? `${lead.name} <${lead.email}>` : d.target_id}
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
                      <div style={{ color: 'var(--fg-0)' }}>{t.title}</div>
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
    </section>
  );
}
