'use client';

// Tableau de bord « Aujourd'hui » de /admin (maquette validée par Camille le 2026-10-23) : 4 tuiles,
// courbe des 12 dernières semaines, provenance des demandes, « À appeler maintenant », rendez-vous du
// jour et du lendemain, tâches du jour. Les chiffres viennent de construireTableau (src/lib/crm/tableau.ts).

import type { Aujourdhui } from '@/lib/crm/aujourdhui';
import { SOURCES, cleSource, type LeadTableau, type RaisonAppel, type Tableau } from '@/lib/crm/tableau';

type Act = (type: string, id: string, value?: string) => unknown;
export type Vue = 'aujourdhui' | 'boite' | 'leads' | 'clients' | 'rdv' | 'stages' | 'drafts' | 'tasks' | 'regles';

const FUSEAU = 'America/Toronto';

const ilYa = (iso: string, maintenant: number) => {
  const min = Math.max(0, Math.round((maintenant - new Date(iso).getTime()) / 60000));
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  return h < 48 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`;
};

const heure = (iso: string) => {
  const p = new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU, hour: 'numeric', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((acc, x) => ({ ...acc, [x.type]: x.value }), {});
  return p.minute === '00' ? `${Number(p.hour)} h` : `${Number(p.hour)} h ${p.minute}`;
};

const RAISONS: Record<RaisonAppel, string> = {
  jamais_contacte: 'jamais contactée',
  a_relancer: 'à relancer',
  tache_en_retard: 'rappel en retard',
};
const libelleSource = (source: string) => SOURCES.find((s) => s.cle === cleSource(source))?.libelle ?? 'Autres';

// Couleurs des provenances, dans l'ordre de SOURCES : jetons de vsw.css (clair et sombre).
const COULEURS = ['var(--accent)', 'var(--accent-2)', 'var(--warn)', 'var(--fg-1)', 'var(--ok)', 'var(--danger)', 'var(--line)'];

function Pastille({ ton, children }: { ton: 'ok' | 'danger' | 'warn' | 'accent' | 'violet'; children: React.ReactNode }) {
  return <span className={`adm-pastille adm-pastille-${ton}`}>{children}</span>;
}

function Tuile({ titre, pastille, valeur, detail, children }: {
  titre: string; pastille?: React.ReactNode; valeur: string; detail: string; children?: React.ReactNode;
}) {
  return (
    <div className="adm-carte adm-tuile">
      <div className="adm-tuile-tete"><span>{titre}</span>{pastille}</div>
      <div className="adm-tuile-corps">
        <span className="adm-tuile-valeur">{valeur}</span>
        {children}
      </div>
      <span className="adm-gris">{detail}</span>
    </div>
  );
}

function PetiteCourbe({ serie }: { serie: number[] }) {
  const max = Math.max(1, ...serie);
  const pts = serie.map((v, i) => `${(i * 120) / (serie.length - 1)},${32 - (v / max) * 28}`).join(' ');
  return (
    <svg width="120" height="36" viewBox="0 0 120 36" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Barres({ valeurs }: { valeurs: number[] }) {
  const max = Math.max(1, ...valeurs);
  return (
    <svg width="120" height="36" viewBox="0 0 120 36" aria-hidden="true">
      {valeurs.map((v, i) => {
        const h = 6 + (v / max) * 30;
        return <rect key={i} x={2 + i * 17} y={36 - h} width="12" height={h} rx="3" fill="var(--accent)" opacity={i === 0 ? 1 : v ? 0.55 : 0.2} />;
      })}
    </svg>
  );
}

function Anneau({ part, couleur, taille = 44, epaisseur = 6 }: { part: number; couleur: string; taille?: number; epaisseur?: number }) {
  const r = (taille - epaisseur) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={taille} height={taille} viewBox={`0 0 ${taille} ${taille}`} aria-hidden="true">
      <circle cx={taille / 2} cy={taille / 2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth={epaisseur} />
      {part > 0 && (
        <circle cx={taille / 2} cy={taille / 2} r={r} fill="none" stroke={couleur} strokeWidth={epaisseur} strokeLinecap="round"
          strokeDasharray={`${Math.max(0.01, Math.min(1, part)) * c} ${c}`} transform={`rotate(-90 ${taille / 2} ${taille / 2})`} />
      )}
    </svg>
  );
}

function Courbe({ semaines }: { semaines: Tableau['semaines'] }) {
  const max = Math.max(4, ...semaines.map((s) => s.demandes));
  const haut = Math.ceil(max / 2) * 2;
  const x = (i: number) => 40 + (i * 660) / (semaines.length - 1);
  const y = (v: number) => 180 - (v / haut) * 160;
  const ligne = (cle: 'demandes' | 'rdv') => semaines.map((s, i) => `${x(i)},${y(s[cle])}`).join(' ');
  const total = semaines.reduce((n, s) => n + s.demandes, 0);
  return (
    <svg viewBox="0 0 720 230" role="img" style={{ width: '100%', height: 'auto' }}
      aria-label={`Demandes et rendez-vous par semaine, 12 dernières semaines : ${total} demande${total > 1 ? 's' : ''} au total`}>
      <g fontFamily="var(--font-body)" fontSize="12" fill="var(--fg-2)">
        {[haut, haut / 2, 0].map((v) => <text key={v} x="0" y={y(v) + 4}>{v}</text>)}
        {[0, 4, 8, 11].map((i) => <text key={i} x={x(i)} y="214" textAnchor={i === 11 ? 'end' : i === 0 ? 'start' : 'middle'}>{semaines[i].etiquette}</text>)}
      </g>
      <g stroke="var(--line-soft)" strokeDasharray="4 5">
        {[haut, haut / 2, 0].map((v) => <line key={v} x1="28" y1={y(v)} x2="720" y2={y(v)} />)}
      </g>
      <polygon points={`${x(0)},${y(0)} ${ligne('demandes')} ${x(11)},${y(0)}`} fill="var(--accent-soft)" />
      <polyline points={ligne('demandes')} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={ligne('rdv')} fill="none" stroke="var(--accent-2)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(11)} cy={y(semaines[11].demandes)} r="6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="3" />
    </svg>
  );
}

function Provenance({ sources }: { sources: Tableau['sources'] }) {
  const total = sources.reduce((n, s) => n + s.n, 0);
  const r = 55;
  const c = 2 * Math.PI * r;
  // Début de chaque arc : somme des parts précédentes.
  const arcs = sources.map((s, i) => ({
    ...s,
    long: (s.n / total) * c,
    depart: sources.slice(0, i).reduce((x, p) => x + (p.n / total) * c, 0),
  }));
  return (
    <div className="adm-provenance">
      <svg width="150" height="150" viewBox="0 0 150 150" role="img"
        aria-label={total ? `${total} demandes : ${sources.map((s) => `${s.libelle} ${s.n}`).join(', ')}` : 'Aucune demande dans la période'}>
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--bg-2)" strokeWidth="22" />
        <g fill="none" strokeWidth="22" transform="rotate(-90 75 75)">
          {arcs.map((s) => (
            <circle key={s.cle} cx="75" cy="75" r={r} stroke={COULEURS[SOURCES.findIndex((x) => x.cle === s.cle)]}
              strokeDasharray={`${s.long} ${c - s.long}`} strokeDashoffset={-s.depart} />
          ))}
        </g>
        <text x="75" y="78" textAnchor="middle" fontFamily="var(--font-display)" fontSize="30" fontWeight="700" fill="var(--fg-0)">{total}</text>
        <text x="75" y="98" textAnchor="middle" fontFamily="var(--font-body)" fontSize="12" fill="var(--fg-2)">demande{total > 1 ? 's' : ''}</text>
      </svg>
      {total ? (
        <ul className="adm-legende">
          {sources.map((s) => (
            <li key={s.cle}>
              <span><span className="adm-puce" style={{ background: COULEURS[SOURCES.findIndex((x) => x.cle === s.cle)] }} />{s.libelle}</span>
              <strong>{s.n}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="adm-gris" style={{ margin: 0 }}>Aucune demande dans la période.</p>
      )}
    </div>
  );
}

function EnTete({ titre, sousTitre, lien, onLien }: { titre: string; sousTitre: string; lien?: string; onLien?: () => void }) {
  return (
    <div className="adm-carte-tete">
      <div>
        <h2>{titre}</h2>
        <span className="adm-gris">{sousTitre}</span>
      </div>
      {lien && <button type="button" className="adm-lien" onClick={onLien}>{lien}</button>}
    </div>
  );
}

export function TableauDeBord({ t, aujourdhui, act, busy, ouvrir, ouvrirFiche, leadParId }: {
  t: Tableau; aujourdhui: Aujourdhui; act: Act; busy: boolean; ouvrir: (v: Vue) => void; ouvrirFiche: (id: string) => void;
  leadParId: (id: string) => LeadTableau | undefined;
}) {
  const maintenant = new Date(t.maintenant).getTime();
  const ecart = t.nouvelles.n - t.nouvelles.precedent;
  const taches = [...aujourdhui.enRetard.map((x) => ({ ...x, retard: true })), ...aujourdhui.duJour.map((x) => ({ ...x, retard: false }))];
  const libellePeriode = `${t.periode} derniers jours`;

  return (
    <div className="adm-tableau">
      <div className="adm-tuiles">
        <Tuile titre="Nouvelles demandes" valeur={String(t.nouvelles.n)}
          pastille={ecart !== 0 ? <Pastille ton={ecart > 0 ? 'ok' : 'warn'}>{ecart > 0 ? `+${ecart}` : ecart}</Pastille> : undefined}
          detail={`contre ${t.nouvelles.precedent} les ${t.periode} jours d’avant · ${t.nouvelles.jamaisContactees} jamais contactée${t.nouvelles.jamaisContactees > 1 ? 's' : ''}`}>
          <PetiteCourbe serie={t.nouvelles.serie} />
        </Tuile>
        <Tuile titre="Rappels en retard" valeur={String(t.retard.n)}
          pastille={t.retard.n > 0 ? <Pastille ton="danger">À reprendre</Pastille> : <Pastille ton="ok">À jour</Pastille>}
          detail={t.retard.sansContact24h ? `${t.retard.sansContact24h} demande${t.retard.sansContact24h > 1 ? 's' : ''} sans contact depuis 24 h` : 'aucune demande sans contact depuis 24 h'} />
        <Tuile titre="Rendez-vous à venir" valeur={String(t.rdv.n)}
          pastille={t.rdv.aujourdhui ? <Pastille ton="accent">{t.rdv.aujourdhui} aujourd’hui</Pastille> : undefined}
          detail="7 prochains jours · heure du Québec">
          <Barres valeurs={t.rdv.parJour} />
        </Tuile>
        <Tuile titre="Devenues clientes" valeur={t.clients.taux === null ? '—' : `${t.clients.taux} %`}
          pastille={t.clients.gagnes ? <Pastille ton="ok">+{t.clients.gagnes}</Pastille> : undefined}
          detail={`${t.clients.sur ? `${t.clients.n} sur ${t.clients.sur} · demandes des ${t.periode} derniers jours` : 'aucune demande dans la période'}${
            t.prospection.enCours || t.prospection.gagnes ? ` · prospection à part : ${t.prospection.enCours} en cours${t.prospection.gagnes ? `, ${t.prospection.gagnes} devenue${t.prospection.gagnes > 1 ? 's' : ''} cliente${t.prospection.gagnes > 1 ? 's' : ''}` : ''}` : ''}`}>
          <Anneau part={(t.clients.taux ?? 0) / 100} couleur="var(--accent-2)" />
        </Tuile>
      </div>

      <div className="adm-rangee-graphiques">
        <section className="adm-carte adm-large">
          <div className="adm-carte-tete">
            <div>
              <h2>Demandes et rendez-vous</h2>
              <span className="adm-gris">Par semaine, 12 dernières semaines</span>
            </div>
            <div className="adm-legende-ligne">
              <span><span className="adm-puce" style={{ background: 'var(--accent)' }} />Demandes</span>
              <span><span className="adm-puce" style={{ background: 'var(--accent-2)' }} />Rendez-vous</span>
            </div>
          </div>
          <Courbe semaines={t.semaines} />
        </section>
        <section className="adm-carte">
          <EnTete titre="D’où viennent les demandes" sousTitre={libellePeriode} />
          <Provenance sources={t.sources} />
        </section>
      </div>

      {t.brouillons > 0 && (
        <div className="adm-bandeau">
          <span><strong>{t.brouillons} première{t.brouillons > 1 ? 's' : ''} réponse{t.brouillons > 1 ? 's' : ''}</strong> {t.brouillons > 1 ? 'attendent' : 'attend'} votre accord avant de partir.</span>
          <button type="button" className="adm-bouton adm-bouton-violet" onClick={() => ouvrir('drafts')}>Relire et approuver</button>
        </div>
      )}

      {aujourdhui.alertes.length > 0 && (
        <section className="adm-carte">
          <EnTete titre="Alertes" sousTitre={`${aujourdhui.alertes.length} non lue${aujourdhui.alertes.length > 1 ? 's' : ''}`} />
          {aujourdhui.alertes.map((n) => (
            <div key={n.id} className="adm-ligne">
              <div className="adm-ligne-texte">
                <strong>{n.title}</strong>
                {n.body && <span className="adm-gris">{n.body}</span>}
              </div>
              <button type="button" className="adm-bouton adm-bouton-discret" disabled={busy} onClick={() => act('notif_read', n.id)}>Lu</button>
            </div>
          ))}
        </section>
      )}

      <div className="adm-rangee-cartes">
        <section className="adm-carte">
          <EnTete titre="À appeler maintenant" sousTitre="Triées par priorité" lien="Toutes les demandes" onLien={() => ouvrir('leads')} />
          {t.aAppeler.length === 0 && <p className="adm-vide">Personne à rappeler pour l’instant.</p>}
          {t.aAppeler.map(({ lead, priorite, raison }) => (
            <div key={lead.id} className="adm-ligne adm-ligne-bordee">
              <div className="adm-ligne-texte">
                <span>
                  <button type="button" className="adm-lien adm-lien-nom" onClick={() => ouvrirFiche(lead.id)}>{lead.name}</button>{' '}
                  {priorite !== 'Normale' && <Pastille ton={priorite === 'Urgente' ? 'danger' : 'warn'}>{priorite}</Pastille>}
                </span>
                <span className={priorite === 'Urgente' ? 'adm-rouge' : 'adm-gris'}>
                  {libelleSource(lead.source)} · {RAISONS[raison]} · reçue {ilYa(lead.created_at, maintenant)}
                </span>
              </div>
              <div className="adm-ligne-actions">
                {lead.phone
                  ? <a className="adm-bouton" href={`tel:${encodeURIComponent(lead.phone)}`}>Appeler</a>
                  : <a className="adm-bouton adm-bouton-contour" href={`mailto:${encodeURIComponent(lead.email)}`}>Écrire</a>}
                <button type="button" className="adm-bouton adm-bouton-discret" disabled={busy}
                  onClick={() => act('contact', lead.id, lead.phone ? 'appel' : 'courriel')}>
                  {lead.phone ? 'Appel fait' : 'Courriel envoyé'}
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="adm-carte">
          <EnTete titre="Rendez-vous" sousTitre="Aujourd’hui et demain · heure du Québec" lien="Toutes les demandes de rendez-vous" onLien={() => ouvrir('rdv')} />
          {t.rendezVous.length === 0 && t.rdvAConfirmer.length === 0 && <p className="adm-vide">Aucun rendez-vous aujourd’hui ni demain.</p>}
          {t.rendezVous.map(({ lead, creneau, demain }) => (
            <div key={lead.id} className={'adm-ligne ' + (demain ? 'adm-ligne-bordee' : 'adm-ligne-accent')}>
              <div className="adm-rdv-heure">
                <strong>{heure(creneau)}</strong>
                <span className={demain ? 'adm-gris' : 'adm-accent'}>{demain ? 'Demain' : 'Aujourd’hui'}</span>
              </div>
              <div className="adm-ligne-texte">
                <button type="button" className="adm-lien adm-lien-nom" onClick={() => ouvrirFiche(lead.id)}>{lead.name}</button>
                <span className="adm-gris">Appel découverte · {lead.phone ? <a href={`tel:${encodeURIComponent(lead.phone)}`}>{lead.phone}</a> : <a href={`mailto:${encodeURIComponent(lead.email)}`}>{lead.email}</a>}</span>
              </div>
            </div>
          ))}
          {t.rdvAConfirmer.length > 0 && (
            <>
              <h3 className="adm-sous-titre">À confirmer (heure non choisie dans le calendrier)</h3>
              {t.rdvAConfirmer.map(({ lead, moment }) => (
                <div key={lead.id} className="adm-ligne adm-ligne-bordee">
                  <div className="adm-ligne-texte">
                    <button type="button" className="adm-lien adm-lien-nom" onClick={() => ouvrirFiche(lead.id)}>{lead.name}</button>
                    <span className="adm-gris">{moment ? `Moment souhaité : ${moment}` : 'Moment non précisé'} · reçue {ilYa(lead.created_at, maintenant)}</span>
                  </div>
                  <a className="adm-bouton adm-bouton-contour" href={`mailto:${encodeURIComponent(lead.email)}`}>Écrire</a>
                </div>
              ))}
            </>
          )}
        </section>

        <section className="adm-carte">
          <EnTete titre="Tâches du jour"
            sousTitre={taches.length ? `${taches.length} à faire${aujourdhui.enRetard.length ? ` · ${aujourdhui.enRetard.length} en retard` : ''}` : 'Rien d’autre aujourd’hui'}
            lien="Toutes les tâches" onLien={() => ouvrir('tasks')} />
          {taches.length === 0 && <p className="adm-vide">Aucune tâche pour aujourd’hui.</p>}
          {taches.map((x) => {
            const lead = x.lead ?? leadParId(x.lead_id);
            return (
              <label key={x.id} className="adm-tache">
                <input type="checkbox" checked={false} disabled={busy} onChange={() => act('task_done', x.id)} />
                <span className="adm-ligne-texte">
                  <span>{x.title}{lead ? ` — ${lead.name}` : ''}</span>
                  <span className={x.retard ? 'adm-rouge' : 'adm-gris'}>
                    {x.retard ? `En retard · prévue ${ilYa(x.due_at as string, maintenant)}` : `Aujourd’hui, ${heure(x.due_at as string)}`}
                  </span>
                </span>
              </label>
            );
          })}
        </section>
      </div>
    </div>
  );
}
