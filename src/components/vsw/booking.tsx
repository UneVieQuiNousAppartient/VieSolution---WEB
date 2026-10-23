'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from './icon';
import { heureLisible, parJour, type Creneau } from '@/lib/agenda';
import { submitContactRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';

const DOW = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const SLOTS = ['09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];

/* Étape C : quand Google Agenda est branché (/api/rdv/creneaux), le calendrier montre les vrais créneaux
   libres et la réservation crée le rendez-vous (lien Meet) et la demande dans le CRM (/api/rdv/reserver).
   Sinon, l'ancien fonctionnement reste : une demande de créneau, confirmée par courriel. */
type Mode = 'chargement' | 'google' | 'demande';
const cleJour = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

type Cell = {
  day: number;
  date?: Date;
  available?: boolean;
  isToday?: boolean;
  isSel?: boolean;
  muted?: boolean;
};

export function Booking({ showHead = true }: { showHead?: boolean }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('chargement');
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [duree, setDuree] = useState(30);
  const [choix, setChoix] = useState<Creneau | null>(null);
  const [telephone, setTelephone] = useState('');
  const [sujet, setSujet] = useState('');
  const [piege, setPiege] = useState('');
  const [quand, setQuand] = useState('');

  const chargerCreneaux = () =>
    fetch('/api/rdv/creneaux', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j: { connecte?: boolean; creneaux?: Creneau[]; duree?: number }) => {
        setCreneaux(j.creneaux || []);
        if (j.duree) setDuree(j.duree);
        setMode(j.connecte ? 'google' : 'demande');
      })
      .catch(() => setMode('demande'));
  useEffect(() => { chargerCreneaux(); }, []);
  const jours = useMemo(() => parJour(creneaux), [creneaux]);

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells: Cell[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: daysPrev - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const available = mode === 'google' ? jours.has(cleJour(date)) : mode === 'demande' && !isPast && !isWeekend;
    const isToday = date.toDateString() === today.toDateString();
    const isSel = !!selected && date.toDateString() === selected.toDateString();
    cells.push({ day: d, date, available, isToday, isSel, muted: isPast });
  }
  while (cells.length < 42)
    cells.push({ day: cells.length - daysInMonth - firstDow + 1, muted: true });

  const nav = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const selectedLabel = selected && (slot || choix)
    ? `${DOW[selected.getDay()]} ${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()} · ${choix ? heureLisible(choix.debut) : slot}`
    : null;

  const reserver = async () => {
    if (!choix || !nom.trim() || !email.trim()) {
      setError('Indiquez votre nom et votre courriel pour réserver.');
      return;
    }
    setError('');
    setSending(true);
    try {
      const r = await fetch('/api/rdv/reserver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debut: choix.debut, nom, courriel: email, telephone, sujet, site: piege }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string; quand?: string };
      if (r.status === 409) { setChoix(null); chargerCreneaux(); }
      if (!r.ok) throw new Error(j.error || 'La réservation n’a pas pu être faite.');
      setQuand(j.quand || selectedLabel || '');
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  const confirm = async () => {
    if (!selected || !slot || !nom.trim() || !email.trim()) {
      setError('Indiquez votre nom et votre courriel pour confirmer.');
      return;
    }
    if (!checkRateLimit('rdv', 3, 300000)) {
      setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      return;
    }
    try {
      setError('');
      setSending(true);
      await submitContactRequest({
        nom: nom.trim(),
        email: email.trim(),
        sujet: 'rdv-decouverte',
        message: `Demande d'appel découverte — ${selectedLabel}`,
        source: 'booking-home',
      });
      setConfirmed(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="rdv" className="section">
      <div className="container">
        {showHead && (
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Votre appel gratuit</div>
              <h2>Un appel découverte<br />gratuit, {duree} minutes.</h2>
            </div>
            <p className="desc">
              Échangeons sur votre projet, vos objectifs et votre contexte. Sans engagement,
              en visio ou par téléphone. Vous repartez avec une vision claire des prochaines
              étapes.
            </p>
          </div>
        )}

        <div className="booking reveal">
          <div className="booking-left">
            <div className="eyebrow">Appel découverte</div>
            <h3>{duree} min avec Vie Solution Web</h3>
            <p>
              On discute de votre projet, des délais, du budget approximatif et des
              prochaines étapes si on décide de collaborer.
            </p>
            <div className="booking-meta">
              <div className="row"><Icon name="clock" size={16} /> {duree} minutes</div>
              <div className="row"><Icon name="vid" size={16} /> {mode === 'google' ? 'Google Meet (lien envoyé par courriel)' : 'Google Meet ou téléphone'}</div>
              <div className="row"><Icon name="calendar" size={16} /> {mode === 'google' ? 'Les créneaux libres de notre agenda (heure de Montréal)' : 'Lun-Ven, 9h-17h (HE)'}</div>
              <div className="row"><Icon name="check" size={16} /> Sans engagement · gratuit</div>
            </div>
            {selectedLabel && !confirmed && (
              <div className="booking-selected">✓ Créneau choisi : {selectedLabel}</div>
            )}
          </div>
          <div className="booking-right">
            <div className="cal-header">
              <h4>{MONTHS[viewMonth]} {viewYear}</h4>
              <div className="cal-nav">
                <button type="button" aria-label="Mois précédent" onClick={() => nav(-1)}>
                  <Icon name="chev-l" size={14} />
                </button>
                <button type="button" aria-label="Mois suivant" onClick={() => nav(1)}>
                  <Icon name="chev-r" size={14} />
                </button>
              </div>
            </div>
            <div className="cal-grid">
              {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
              {cells.map((c, i) => (
                <div
                  key={i}
                  className={[
                    'cal-day',
                    c.muted ? 'muted' : '',
                    c.available ? 'available' : '',
                    c.isToday ? 'today' : '',
                    c.isSel ? 'selected' : '',
                  ].join(' ')}
                  onClick={() => { if (c.available && c.date) { setSelected(c.date); setChoix(null); setSlot(null); } }}
                >
                  {c.day}
                </div>
              ))}
            </div>

            {mode === 'chargement' && <p className="booking-etat">Chargement des créneaux libres…</p>}
            {mode === 'google' && creneaux.length === 0 && (
              <p className="booking-etat">Aucun créneau libre pour le moment. Écrivez-nous à info@viesolutionweb.ca ou appelez le (438) 506-5243.</p>
            )}
            {mode === 'google' && error && !confirmed && (
              <p role="alert" style={{ color: 'var(--danger)', fontSize: 14, margin: '16px 0 0' }}>{error}</p>
            )}
            {mode === 'google' && selected && !confirmed && (
              <div className="slots">
                {(jours.get(cleJour(selected)) || []).map((c) => (
                  <button key={c.debut} type="button" className={'slot' + (choix?.debut === c.debut ? ' active' : '')} onClick={() => setChoix(c)}>
                    {heureLisible(c.debut)}
                  </button>
                ))}
              </div>
            )}
            {mode === 'demande' && selected && !confirmed && (
              <div className="slots">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={'slot' + (slot === s ? ' active' : '')}
                    onClick={() => setSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {selected && (mode === 'google' ? choix : slot) && !confirmed && (
              <div style={{ marginTop: 24 }}>
                <div className="form-row">
                  <div className="form-field">
                    <label>Nom complet</label>
                    <input
                      type="text"
                      placeholder="Jean Tremblay"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Courriel</label>
                    <input
                      type="email"
                      placeholder="jean@exemple.ca"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {mode === 'google' && (
                  <div className="form-row">
                    <div className="form-field">
                      <label>Téléphone <small>(facultatif)</small></label>
                      <input type="tel" placeholder="438 555-0123" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label>De quoi voulez-vous parler ? <small>(facultatif)</small></label>
                      <input type="text" maxLength={500} value={sujet} onChange={(e) => setSujet(e.target.value)} />
                    </div>
                  </div>
                )}
                <label className="avis-piege" aria-hidden="true">Site web<input tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} /></label>
                {error && mode !== 'google' && (
                  <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>
                )}
                {mode === 'google' && (
                  <p className="booking-etat booking-loi25">
                    Votre courriel et l&apos;heure choisie sont transmis à Google Agenda pour créer l&apos;invitation et le lien Meet.{' '}
                    <a href="/politique-confidentialite">Politique de confidentialité</a>
                  </p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={sending}
                  onClick={mode === 'google' ? reserver : confirm}
                >
                  {sending ? 'Envoi…' : mode === 'google' ? 'Réserver ce créneau' : 'Demander ce créneau'} <Icon name="arrow" size={14} />
                </button>
              </div>
            )}
            {confirmed && mode === 'google' && (
              <div className="booking-confirm" role="status">
                <Icon name="check" size={16} /> C&apos;est réservé : {quand}. L&apos;invitation avec le lien Google Meet arrive dans votre courriel. Au plaisir de vous parler !
              </div>
            )}
            {confirmed && mode !== 'google' && (
              <div className="booking-confirm">
                <Icon name="check" size={16} /> Demande envoyée ! On confirme votre créneau
                par courriel sous 24h ouvrables.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
