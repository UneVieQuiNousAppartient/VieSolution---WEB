'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';
import { submitContactRequest } from '@/lib/supabase/actions';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';
import { LIMITES, messagePourCrm, validerDemandeRdv, type DemandeRdv, type MessageChat } from '@/lib/chat/regles';

/*
 * Bulle de clavardage. Deux modes (demande de Camille du 2026-10-22, « lance le chatbot IA ») :
 * - IA : une question écrite part à /api/chat, qui répond à partir du site seulement ;
 *   les boutons (chips) gardent leurs réponses toutes faites.
 * - Réponses toutes faites (BOT_FLOW) : si l'IA n'est pas branchée (clé absente) ou ne répond pas.
 * La conversation reste dans la page : rien n'est enregistré, sauf la demande de rendez-vous que le
 * visiteur relit et envoie lui-même (même enregistrement que le formulaire de rendez-vous).
 */
type Chip = { text: string; next?: string; action?: 'goto-rdv' | 'goto-devis' | 'goto-zoho' | 'goto-ia' };
type Node = { bot: string; chips?: Chip[] };
type Msg = { from: 'bot' | 'user'; text: string; chips?: Chip[]; proposition?: DemandeRdv; envoi?: 'en-cours' | 'fait' | 'corrige' };

const ACCUEIL_IA = phrase(
  "Bonjour 👋 Je suis l'assistant IA de Vie Solution Web. Posez-moi vos questions sur nos services, ou choisissez une option. Je peux aussi transmettre une demande de rendez-vous.",
);
const CHIP_RDV: Chip = { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' };

/* Aucun montant (décision de Camille, 2026-10-17) : le prix est sur mesure, donné par écrit. */
const BOT_FLOW: Record<string, Node> = {
  start: {
    bot: phrase("Bonjour 👋 Je suis l'assistant de Vie Solution Web. Comment puis-je vous aider aujourd'hui ?"),
    chips: [
      { text: phrase("Je ne sais pas par où commencer"), next: 'debuter' },
      { text: phrase("Combien ça coûte ?"), next: 'estimer' },
      { text: phrase("Voir les services"), next: 'services' },
      { text: phrase("Parler de Zoho"), next: 'zoho' },
      { text: phrase("Réserver mon appel gratuit"), next: 'rdv' },
    ],
  },
  debuter: {
    bot: phrase("Bonne nouvelle : c'est la question qu'on préfère ! 😊 Pas besoin d'être techno. On commence souvent par une seule chose. Qu'est-ce qui vous prend le plus de temps ?"),
    chips: [
      { text: phrase("Mes factures et mes clients"), next: 'debut-zoho' },
      { text: phrase("Mes courriels et mes textes"), next: 'debut-ia' },
      { text: phrase("Je préfère en parler"), action: 'goto-rdv' },
    ],
  },
  'debut-zoho': {
    bot: phrase("On peut mettre en place Zoho pour vos clients et vos factures, tout au même endroit. C'est sur mesure : on en discute lors d'un appel gratuit de 30 minutes."),
    chips: [
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
      { text: phrase("Voir Zoho"), action: 'goto-zoho' },
    ],
  },
  'debut-ia': {
    bot: phrase("On peut configurer un assistant IA pour votre entreprise et vous montrer comment vous en servir. C'est sur mesure : on en discute lors d'un appel gratuit de 30 minutes."),
    chips: [
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
      { text: phrase("Voir l'IA"), action: 'goto-ia' },
    ],
  },
  estimer: {
    bot: phrase("Parfait ! Quel type de projet avez-vous en tête ?"),
    chips: [
      { text: phrase("Tâches automatiques (IA)"), next: 'auto' },
      { text: phrase("Assistant IA sur mesure"), next: 'agent' },
      { text: phrase("Implantation Zoho"), next: 'zoho-estim' },
      { text: phrase("Formation"), next: 'formation' },
    ],
  },
  auto: {
    bot: phrase("On regarde comment vous travaillez, puis on automatise d'abord les tâches qui vous grugent le plus de temps. Le prix est sur mesure : on vous le donne par écrit, avant de commencer."),
    chips: [
      { text: phrase("Voir comment on établit un prix"), action: 'goto-devis' },
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
    ],
  },
  agent: {
    bot: phrase("Un assistant IA (clavardage client, assistant interne, tri de documents) dépend des outils à brancher : on le cadre ensemble lors d'un appel. Le prix est sur mesure : on vous le donne par écrit, avant de commencer."),
    chips: [
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
      { text: phrase("Voir comment on établit un prix"), action: 'goto-devis' },
    ],
  },
  'zoho-estim': {
    bot: phrase("Une implantation Zoho dépend des modules (CRM, Books, Desk, Campaigns…) et du nombre d'utilisateurs. Le prix est sur mesure : on vous le donne par écrit, avant de commencer."),
    chips: [
      { text: phrase("Voir comment on établit un prix"), action: 'goto-devis' },
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
    ],
  },
  formation: {
    bot: phrase("Nos formations IA et Zoho : ateliers pratiques, cas d'usage de votre métier, et suivi jusqu'à l'autonomie de votre équipe. Le prix est sur mesure : on vous le donne par écrit, avant de commencer."),
    chips: [{ text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' }],
  },
  services: {
    bot: phrase("On peut vous aider de quatre façons : rendre vos tâches automatiques, créer un assistant IA, installer Zoho pour vos clients et vos factures, ou vous former. Qu'est-ce qui vous intéresse ?"),
    chips: [
      { text: phrase("Tâches automatiques"), next: 'auto' },
      { text: phrase("Assistant IA"), next: 'agent' },
      { text: phrase("Zoho"), next: 'zoho' },
      { text: phrase("Formation"), next: 'formation' },
    ],
  },
  zoho: {
    bot: phrase("Zoho réunit vos clients, vos factures, votre soutien client et vos infolettres au même endroit. On l'installe, on le règle selon votre façon de travailler et on vous forme."),
    chips: [
      { text: phrase("Combien ça coûte ?"), next: 'zoho-estim' },
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
    ],
  },
  rdv: {
    bot: phrase("Excellente idée ! Je vous redirige vers notre calendrier pour choisir un créneau (appel de 30 min, gratuit)."),
    chips: [{ text: phrase("Voir le calendrier"), action: 'goto-rdv' }],
  },
  fallback: {
    bot: phrase("Bonne question ! Pour une réponse précise, le plus simple est d'en discuter de vive voix — l'appel découverte est gratuit — ou de nous écrire à info@viesolutionweb.ca."),
    chips: [
      { text: phrase("Réserver mon appel gratuit"), action: 'goto-rdv' },
      { text: phrase("Combien ça coûte ?"), action: 'goto-devis' },
    ],
  },
};

export function VswChatbot({ lang = 'fr' }: { lang?: Lang }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: t(lang, BOT_FLOW.start.bot), chips: BOT_FLOW.start.chips },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  // null : pas encore vérifié ; false : réponses toutes faites seulement.
  const [ia, setIa] = useState<boolean | null>(null);
  const [historique, setHistorique] = useState<MessageChat[]>([]);
  const [fin, setFin] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const champRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  // Ouverture : le curseur va dans le champ (pas sur téléphone : le clavier cacherait la bulle) ;
  // Échap ferme la bulle.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia('(pointer: fine)').matches) champRef.current?.focus();
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', echap);
    return () => window.removeEventListener('keydown', echap);
  }, [open]);

  // À la première ouverture : l'IA est-elle branchée ? Le message d'accueil le dit honnêtement.
  useEffect(() => {
    if (!open || ia !== null) return;
    let annule = false;
    fetch('/api/chat')
      .then((r) => r.json())
      .then((j: { actif?: boolean }) => {
        if (annule) return;
        const actif = j.actif === true;
        setIa(actif);
        if (actif) setMessages((m) => (m.length === 1 ? [{ ...m[0], text: t(lang, ACCUEIL_IA) }] : m));
      })
      .catch(() => !annule && setIa(false));
    return () => {
      annule = true;
    };
  }, [open, ia, lang]);

  const ajouter = (msg: Msg) => setMessages((m) => [...m, msg]);
  const modifier = (i: number, maj: Partial<Msg>) => setMessages((m) => m.map((x, j) => (j === i ? { ...x, ...maj } : x)));

  const goToNode = (key: string) => {
    const node = BOT_FLOW[key];
    if (!node) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      ajouter({ from: 'bot', text: t(lang, node.bot), chips: node.chips });
    }, 700);
  };

  const goToPage = (path: string) => {
    setTimeout(() => {
      setOpen(false);
      router.push(lienLangue(lang, path));
    }, 400);
  };

  const handleChip = (chip: Chip) => {
    ajouter({ from: 'user', text: t(lang, chip.text) });
    if (chip.next) {
      goToNode(chip.next);
    } else if (chip.action === 'goto-rdv') {
      goToPage('/rdv');
    } else if (chip.action === 'goto-devis') {
      goToPage('/devis');
    } else if (chip.action === 'goto-zoho') {
      goToPage('/zoho#demarrer');
    } else if (chip.action === 'goto-ia') {
      goToPage('/ia#demarrer');
    }
  };

  const demanderIa = async (q: string) => {
    const envoi = [...historique, { role: 'user' as const, text: q }];
    setTyping(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: envoi }),
      });
      const j = (await r.json()) as { texte?: string; proposition?: DemandeRdv; fin?: boolean; repli?: boolean };
      if (j.repli || typeof j.texte !== 'string') throw new Error('repli');
      // L'IA garde en mémoire le résumé proposé, pour pouvoir le corriger au message suivant.
      const p = j.proposition;
      const memoire = p
        ? `${j.texte} (Nom : ${p.nom} ; courriel : ${p.courriel} ; moment : ${p.moment || 'non précisé'} ; besoin : ${p.besoin || 'non précisé'})`
        : j.texte;
      setHistorique([...envoi, { role: 'assistant', text: memoire.slice(0, LIMITES.caracteresParReponse) }]);
      // Un nouveau résumé remplace les précédents non envoyés : une seule demande peut partir.
      if (p) setMessages((m) => m.map((x) => (x.proposition && !x.envoi ? { ...x, envoi: 'corrige' } : x)));
      ajouter({ from: 'bot', text: j.texte, proposition: p, chips: j.fin ? [CHIP_RDV] : undefined });
      if (j.fin) setFin(true);
    } catch {
      // L'IA ne répond pas : la bulle reprend ses réponses toutes faites, pour le reste de la visite.
      setIa(false);
      ajouter({ from: 'bot', text: t(lang, BOT_FLOW.fallback.bot), chips: BOT_FLOW.fallback.chips });
    } finally {
      setTyping(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim().slice(0, LIMITES.caracteresParMessage);
    if (!q || typing) return;
    ajouter({ from: 'user', text: q });
    setInput('');
    if (ia && !fin) demanderIa(q);
    else goToNode('fallback');
  };

  const envoyerDemande = async (i: number, p: DemandeRdv) => {
    const v = validerDemandeRdv(p);
    if (!v.ok) {
      ajouter({ from: 'bot', text: t(lang, "{erreur} Écrivez-moi la bonne information, et je refais le résumé.", { erreur: t(lang, v.erreur) }) });
      return;
    }
    modifier(i, { envoi: 'en-cours' });
    try {
      await submitContactRequest({
        nom: v.demande.nom,
        email: v.demande.courriel,
        sujet: 'rdv-decouverte',
        message: messagePourCrm(v.demande),
        source: 'chatbot-ia',
      });
      modifier(i, { envoi: 'fait' });
      champRef.current?.focus();
      ajouter({ from: 'bot', text: t(lang, "Demande envoyée, merci ! On confirme votre rendez-vous par courriel sous 24 h ouvrables.") });
    } catch {
      modifier(i, { envoi: undefined });
      ajouter({ from: 'bot', text: t(lang, "L'envoi n'a pas fonctionné. Réessayez, ou choisissez votre heure dans le calendrier."), chips: [CHIP_RDV] });
    }
  };

  const corriger = (i: number) => {
    modifier(i, { envoi: 'corrige' });
    ajouter({ from: 'bot', text: t(lang, "D'accord ! Écrivez-moi ce qu'il faut corriger.") });
  };

  return (
    <>
      <button
        className={'chat-fab' + (open ? ' open' : '')}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t(lang, "Fermer l'assistant") : t(lang, "Ouvrir l'assistant")}
        aria-expanded={open}
      >
        <Icon name={open ? 'close' : 'chat'} size={22} />
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label={t(lang, "Assistant Vie Solution")}>
          <div className="chat-head">
            <div className="chat-avatar" aria-hidden="true">VS</div>
            <div style={{ flex: 1 }}>
              <div className="name">{t(lang, "Assistant Vie Solution")}</div>
              <div className="status">{ia ? t(lang, "Assistant IA") : t(lang, "En ligne")}</div>
            </div>
          </div>
          {ia && (
            <p className="chat-avis">
              {t(lang, "Vous parlez à une IA qui répond à partir de notre site. Nous ne conservons pas la conversation ; n'y écrivez pas de renseignements sensibles.")}{' '}
              <Link href={lienLangue(lang, '/politique-confidentialite')}>{t(lang, "Confidentialité")}</Link>
            </p>
          )}
          <div className="chat-body" ref={bodyRef} aria-live="polite">
            {messages.map((m, i) => (
              <Fragment key={i}>
                <div className={'chat-msg ' + m.from}>{m.text}</div>
                {m.proposition && (
                  <div className="chat-rdv">
                    <dl>
                      <dt>{t(lang, "Nom")}</dt>
                      <dd>{m.proposition.nom}</dd>
                      <dt>{t(lang, "Courriel")}</dt>
                      <dd>{m.proposition.courriel}</dd>
                      <dt>{t(lang, "Moment souhaité")}</dt>
                      <dd>{m.proposition.moment || t(lang, "Non précisé")}</dd>
                      <dt>{t(lang, "Besoin")}</dt>
                      <dd>{m.proposition.besoin || t(lang, "Non précisé")}</dd>
                    </dl>
                    {m.envoi === 'fait' ? (
                      <p className="chat-rdv-etat"><Icon name="check" size={14} /> {t(lang, "Demande envoyée")}</p>
                    ) : m.envoi === 'corrige' ? null : (
                      <>
                        <p className="chat-rdv-note">
                          {t(lang, "En cliquant sur « Envoyer ma demande », vous acceptez que Vie Solution Web utilise ces renseignements pour vous recontacter.")}
                        </p>
                        <div className="chat-rdv-actions">
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={m.envoi === 'en-cours'}
                            onClick={() => m.proposition && envoyerDemande(i, m.proposition)}
                          >
                            {m.envoi === 'en-cours' ? t(lang, "Envoi…") : t(lang, "Envoyer ma demande")}
                          </button>
                          <button type="button" className="chat-chip" disabled={m.envoi === 'en-cours'} onClick={() => corriger(i)}>
                            {t(lang, "Corriger")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
                {m.chips && m.from === 'bot' && (
                  <div className="chat-quick">
                    {m.chips.map((c, j) => (
                      <button key={j} className="chat-chip" disabled={typing} onClick={() => handleChip(c)}>
                        {t(lang, c.text)}
                      </button>
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
            {typing && (
              <div className="typing" role="status" aria-label={t(lang, "L'assistant écrit")}><span /><span /><span /></div>
            )}
          </div>
          <form className="chat-input" onSubmit={handleSend}>
            <input
              ref={champRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={fin ? t(lang, "Réservez votre appel pour continuer") : t(lang, "Votre question…")}
              aria-label={t(lang, "Votre question")}
              maxLength={LIMITES.caracteresParMessage}
              disabled={fin}
            />
            <button type="submit" aria-label={t(lang, "Envoyer")} disabled={fin || typing}>
              <Icon name="send" size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
