'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from './icon';
import { heureLisible, parJour, type Creneau } from '@/lib/agenda';
import { submitContactRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

const DOW = [phrase("Dim"), phrase("Lun"), phrase("Mar"), phrase("Mer"), phrase("Jeu"), phrase("Ven"), phrase("Sam")];
const MONTHS = [
  phrase("janvier"), phrase("février"), phrase("mars"), phrase("avril"), phrase("mai"), phrase("juin"),
  phrase("juillet"), phrase("août"), phrase("septembre"), phrase("octobre"), phrase("novembre"), phrase("décembre"),
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

export function Booking({ showHead = true, lang = 'fr' }: { showHead?: boolean; lang?: Lang }) {
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

  // Créneau choisi en mots : en français pour le message envoyé au CRM, dans la langue de la page pour l'affichage.
  const libelleCreneau = (l: Lang) => selected && (slot || choix)
    ? t(l, "{jour} {date} {mois} {annee} · {heure}", {
        jour: t(l, DOW[selected.getDay()]),
        date: selected.getDate(),
        mois: t(l, MONTHS[selected.getMonth()]),
        annee: selected.getFullYear(),
        heure: (choix ? heureLisible(choix.debut) : slot) ?? '',
      })
    : null;
  const selectedLabel = libelleCreneau('fr');
  const selectedLabelAffiche = libelleCreneau(lang);

  const reserver = async () => {
    if (!choix || !nom.trim() || !email.trim()) {
      setError(t(lang, "Indiquez votre nom et votre courriel pour réserver."));
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
      if (!r.ok) throw new Error(j.error ? t(lang, j.error) : t(lang, "La réservation n’a pas pu être faite."));
      setQuand(lang === 'fr' ? j.quand || selectedLabel || '' : selectedLabelAffiche || j.quand || '');
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(lang, "Une erreur est survenue. Veuillez réessayer."));
    } finally {
      setSending(false);
    }
  };

  const confirm = async () => {
    if (!selected || !slot || !nom.trim() || !email.trim()) {
      setError(t(lang, "Indiquez votre nom et votre courriel pour confirmer."));
      return;
    }
    if (!checkRateLimit('rdv', 3, 300000)) {
      setError(t(lang, "Trop de tentatives. Veuillez patienter quelques minutes."));
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
      setError(t(lang, "Une erreur est survenue. Veuillez réessayer."));
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
              <div className="eyebrow">{t(lang, "Votre appel gratuit")}</div>
              <h2>{t(lang, "Un appel découverte")}<br />{t(lang, "gratuit, {n} minutes.", { n: duree })}</h2>
            </div>
            <p className="desc">
              {t(lang, "Échangeons sur votre projet, vos objectifs et votre contexte. Sans engagement, en visio ou par téléphone. Vous repartez avec une vision claire des prochaines étapes.")}
            </p>
          </div>
        )}

        <div className="booking reveal">
          <div className="booking-left">
            <div className="eyebrow">{t(lang, "Appel découverte")}</div>
            <h3>{t(lang, "{n} min avec Vie Solution Web", { n: duree })}</h3>
            <p>
              {t(lang, "On discute de votre projet, des délais, du budget approximatif et des prochaines étapes si on décide de collaborer.")}
            </p>
            <div className="booking-meta">
              <div className="row"><Icon name="clock" size={16} /> {t(lang, "{n} minutes", { n: duree })}</div>
              <div className="row"><Icon name="vid" size={16} /> {mode === 'google' ? t(lang, "Google Meet (lien envoyé par courriel)") : t(lang, "Google Meet ou téléphone")}</div>
              <div className="row"><Icon name="calendar" size={16} /> {mode === 'google' ? t(lang, "Les créneaux libres de notre agenda (heure de Montréal)") : t(lang, "Lun-Ven, 9h-17h (HE)")}</div>
              <div className="row"><Icon name="check" size={16} /> {t(lang, "Sans engagement · gratuit")}</div>
            </div>
            {selectedLabelAffiche && !confirmed && (
              <div className="booking-selected">{t(lang, "✓ Créneau choisi : {creneau}", { creneau: selectedLabelAffiche })}</div>
            )}
          </div>
          <div className="booking-right">
            <div className="cal-header">
              <h4>{t(lang, MONTHS[viewMonth])} {viewYear}</h4>
              <div className="cal-nav">
                <button type="button" aria-label={t(lang, "Mois précédent")} onClick={() => nav(-1)}>
                  <Icon name="chev-l" size={14} />
                </button>
                <button type="button" aria-label={t(lang, "Mois suivant")} onClick={() => nav(1)}>
                  <Icon name="chev-r" size={14} />
                </button>
              </div>
            </div>
            <div className="cal-grid">
              {DOW.map((d) => <div key={d} className="cal-dow">{t(lang, d)}</div>)}
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

            {mode === 'chargement' && <p className="booking-etat">{t(lang, "Chargement des créneaux libres…")}</p>}
            {mode === 'google' && creneaux.length === 0 && (
              <p className="booking-etat">{t(lang, "Aucun créneau libre pour le moment. Écrivez-nous à info@viesolutionweb.ca ou appelez le (438) 506-5243.")}</p>
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
                    <label>{t(lang, "Nom complet")}</label>
                    <input
                      type="text"
                      placeholder={t(lang, "Jean Tremblay")}
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>{t(lang, "Courriel")}</label>
                    <input
                      type="email"
                      placeholder={t(lang, "jean@exemple.ca")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {mode === 'google' && (
                  <div className="form-row">
                    <div className="form-field">
                      <label>{t(lang, "Téléphone")} <small>{t(lang, "(facultatif)")}</small></label>
                      <input type="tel" placeholder="438 555-0123" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label>{t(lang, "De quoi voulez-vous parler ?")} <small>{t(lang, "(facultatif)")}</small></label>
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
                    {t(lang, "Votre courriel et l'heure choisie sont transmis à Google Agenda pour créer l'invitation et le lien Meet.")}{' '}
                    <a href={lienLangue(lang, '/politique-confidentialite')}>{t(lang, "Politique de confidentialité")}</a>
                  </p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={sending}
                  onClick={mode === 'google' ? reserver : confirm}
                >
                  {sending ? t(lang, "Envoi…") : mode === 'google' ? t(lang, "Réserver ce créneau") : t(lang, "Demander ce créneau")} <Icon name="arrow" size={14} />
                </button>
              </div>
            )}
            {confirmed && mode === 'google' && (
              <div className="booking-confirm" role="status">
                <Icon name="check" size={16} /> {t(lang, "C'est réservé : {quand}. L'invitation avec le lien Google Meet arrive dans votre courriel. Au plaisir de vous parler !", { quand })}
              </div>
            )}
            {confirmed && mode !== 'google' && (
              <div className="booking-confirm">
                <Icon name="check" size={16} /> {t(lang, "Demande envoyée ! On confirme votre créneau par courriel sous 24h ouvrables.")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
