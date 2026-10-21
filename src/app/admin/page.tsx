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
  const [error, setError] = useState('');
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
      body: JSON.stringify({ code }),
    });
    setBusy(false);
    const json = await res.json();
    if (!res.ok) { setError(json.error || 'Erreur'); return; }
    setError('');
    setAuthed(true);
    load();
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

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {([['leads', 'Leads'], ['drafts', `Brouillons (${pending.length})`], ['tasks', 'Tâches']] as const).map(([k, label]) => (
                <button key={k} className={'calc-option' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>
                  {label}
                </button>
              ))}
              <button className="calc-option" onClick={load} disabled={busy} style={{ marginLeft: 'auto' }}>
                Rafraîchir
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
