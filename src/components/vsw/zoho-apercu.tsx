/* « À quoi ça ressemble » (page /zoho) : trois ILLUSTRATIONS dessinées par Vie Solution Web
   (choix de Camille du 2026-10-24, option B), avec des données d'exemple. Aucune capture, aucun
   logo ni visuel de Zoho : ce sont des schémas de ce qu'on configure (suivi des ventes, tableau de
   bord, facture), pas des images du logiciel. */
import { phrase, t, type Lang } from '@/lib/i18n';

const COLONNES = [
  { nom: phrase("Nouveaux"), cartes: [['Clinique Rive-Sud', phrase("Appel à faire")], ['Studio Lumière', phrase("Courriel reçu")]] },
  { nom: phrase("Rendez-vous"), cartes: [['Cabinet Tremblay', phrase("Jeudi 10 h")]] },
  { nom: phrase("Soumission"), cartes: [['Rénovations Gagnon', phrase("Envoyée lundi")], ['Café du Coin', phrase("À relancer")]] },
  { nom: phrase("Clients"), cartes: [['Agence Roy', phrase("Gagné ✓")]] },
];
const BARRES = [38, 52, 45, 64, 58, 72, 80];

export function ZohoApercu({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section className="section zoho-apercu">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "À quoi ça ressemble")}</div>
            <h2>{t(lang, "Une fois installé, votre journée tient sur un écran.")}</h2>
          </div>
          <p className="desc">
            {t(lang, "Trois exemples de ce qu'on configure pour vous : le suivi de vos clients, un tableau de bord clair, et des factures qui partent toutes seules. Illustrations avec des données d'exemple.")}
          </p>
        </div>

        <div className="zoho-apercu-grille reveal">
          <figure className="za-fenetre za-large">
            <div className="za-barre" aria-hidden="true"><span /><span /><span /></div>
            <div className="za-kanban" role="img" aria-label={t(lang, "Illustration : suivi des ventes en colonnes — nouveaux, rendez-vous, soumission, clients")}>
              {COLONNES.map((c) => (
                <div key={c.nom} className="za-colonne">
                  <div className="za-colonne-tete">{t(lang, c.nom)} <b>{c.cartes.length}</b></div>
                  {c.cartes.map(([n, s]) => (
                    <div key={n} className="za-carte"><strong>{n}</strong><span>{t(lang, s)}</span></div>
                  ))}
                </div>
              ))}
            </div>
            <figcaption>{t(lang, "Vos clients, étape par étape : chacun sait qui rappeler aujourd'hui.")}</figcaption>
          </figure>

          <figure className="za-fenetre">
            <div className="za-barre" aria-hidden="true"><span /><span /><span /></div>
            <div className="za-tableau" role="img" aria-label={t(lang, "Illustration : tableau de bord avec trois chiffres et un graphique des ventes")}>
              <div className="za-chiffres">
                <div><span>{t(lang, "Ventes du mois")}</span><b>+18 %</b></div>
                <div><span>{t(lang, "Soumissions")}</span><b>12</b></div>
                <div><span>{t(lang, "À relancer")}</span><b>3</b></div>
              </div>
              <div className="za-graphe">{BARRES.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
            </div>
            <figcaption>{t(lang, "Vos chiffres du jour, sans fichier Excel à mettre à jour.")}</figcaption>
          </figure>

          <figure className="za-fenetre">
            <div className="za-barre" aria-hidden="true"><span /><span /><span /></div>
            <div className="za-facture" role="img" aria-label={t(lang, "Illustration : facture envoyée et payée, avec rappel automatique")}>
              <div className="za-facture-tete"><strong>{t(lang, "Facture 1042")}</strong><span className="za-paye">{t(lang, "Payée")}</span></div>
              <div className="za-ligne"><span>{t(lang, "Entretien mensuel")}</span><span>—</span></div>
              <div className="za-ligne"><span>{t(lang, "Formation de l'équipe")}</span><span>—</span></div>
              <div className="za-ligne za-total"><span>{t(lang, "Rappel automatique")}</span><span>{t(lang, "envoyé à J+7")}</span></div>
            </div>
            <figcaption>{t(lang, "Des factures qui partent et se relancent toutes seules.")}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
