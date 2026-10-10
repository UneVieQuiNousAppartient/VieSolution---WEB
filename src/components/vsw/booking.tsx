'use client';

import { useState } from 'react';
import { Icon } from './icon';
import { submitContactRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';

const DOW = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const SLOTS = ['09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];

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
    const available = !isPast && !isWeekend;
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

  const selectedLabel = selected && slot
    ? `${DOW[selected.getDay()]} ${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()} · ${slot}`
    : null;

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
              <div className="eyebrow">Prendre un RDV</div>
              <h2>Un appel découverte<br />gratuit, 30 minutes.</h2>
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
            <h3>30 min avec Vie Solution Web</h3>
            <p>
              On discute de votre projet, des délais, du budget approximatif et des
              prochaines étapes si on décide de collaborer.
            </p>
            <div className="booking-meta">
              <div className="row"><Icon name="clock" size={16} /> 30 minutes</div>
              <div className="row"><Icon name="vid" size={16} /> Google Meet ou téléphone</div>
              <div className="row"><Icon name="calendar" size={16} /> Lun-Ven, 9h-17h (HE)</div>
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
                  onClick={() => c.available && c.date && setSelected(c.date)}
                >
                  {c.day}
                </div>
              ))}
            </div>

            {selected && !confirmed && (
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

            {selected && slot && !confirmed && (
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
                {error && (
                  <p style={{ color: 'oklch(0.75 0.18 25)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={sending}
                  onClick={confirm}
                >
                  {sending ? 'Envoi…' : 'Demander ce créneau'} <Icon name="arrow" size={14} />
                </button>
              </div>
            )}
            {confirmed && (
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
