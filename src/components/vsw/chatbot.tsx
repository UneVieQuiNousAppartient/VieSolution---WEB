'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';

type Chip = { text: string; next?: string; action?: 'goto-rdv' | 'goto-devis' | 'goto-zoho' | 'goto-ia' };
type Node = { bot: string; chips?: Chip[] };
type Msg = { from: 'bot' | 'user'; text: string; chips?: Chip[] };

/* Aucun montant (décision de Camille, 2026-10-17) : le prix est sur mesure, donné par écrit. */
const BOT_FLOW: Record<string, Node> = {
  start: {
    bot: "Bonjour 👋 Je suis l'assistant de Vie Solution Web. Comment puis-je vous aider aujourd'hui ?",
    chips: [
      { text: 'Je ne sais pas par où commencer', next: 'debuter' },
      { text: 'Combien ça coûte ?', next: 'estimer' },
      { text: 'Voir les services', next: 'services' },
      { text: 'Parler de Zoho', next: 'zoho' },
      { text: 'Réserver mon appel gratuit', next: 'rdv' },
    ],
  },
  debuter: {
    bot: "Bonne nouvelle : c'est la question qu'on préfère ! 😊 Pas besoin d'être techno. On commence souvent par une seule chose. Qu'est-ce qui vous prend le plus de temps ?",
    chips: [
      { text: 'Mes factures et mes clients', next: 'debut-zoho' },
      { text: 'Mes courriels et mes textes', next: 'debut-ia' },
      { text: 'Je préfère en parler', action: 'goto-rdv' },
    ],
  },
  'debut-zoho': {
    bot: 'On peut mettre en place Zoho pour vos clients et vos factures, tout au même endroit. C\'est sur mesure : on en discute lors d\'un appel gratuit de 30 minutes.',
    chips: [
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
      { text: 'Voir Zoho', action: 'goto-zoho' },
    ],
  },
  'debut-ia': {
    bot: 'On peut configurer un assistant IA pour votre entreprise et vous montrer comment vous en servir. C\'est sur mesure : on en discute lors d\'un appel gratuit de 30 minutes.',
    chips: [
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
      { text: 'Voir l\'IA', action: 'goto-ia' },
    ],
  },
  estimer: {
    bot: 'Parfait ! Quel type de projet avez-vous en tête ?',
    chips: [
      { text: 'Tâches automatiques (IA)', next: 'auto' },
      { text: 'Assistant IA sur mesure', next: 'agent' },
      { text: 'Implantation Zoho', next: 'zoho-estim' },
      { text: 'Formation', next: 'formation' },
    ],
  },
  auto: {
    bot: "On regarde comment vous travaillez, puis on automatise d'abord les tâches qui vous grugent le plus de temps. Le prix est sur mesure : on vous le donne par écrit, avant de commencer.",
    chips: [
      { text: 'Voir comment on établit un prix', action: 'goto-devis' },
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
    ],
  },
  agent: {
    bot: "Un assistant IA (clavardage client, assistant interne, tri de documents) dépend des outils à brancher : on le cadre ensemble lors d'un appel. Le prix est sur mesure : on vous le donne par écrit, avant de commencer.",
    chips: [
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
      { text: 'Voir comment on établit un prix', action: 'goto-devis' },
    ],
  },
  'zoho-estim': {
    bot: "Une implantation Zoho dépend des modules (CRM, Books, Desk, Campaigns…) et du nombre d'utilisateurs. Le prix est sur mesure : on vous le donne par écrit, avant de commencer.",
    chips: [
      { text: 'Voir comment on établit un prix', action: 'goto-devis' },
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
    ],
  },
  formation: {
    bot: "Nos formations IA et Zoho : ateliers pratiques, cas d'usage de votre métier, et suivi jusqu'à l'autonomie de votre équipe. Le prix est sur mesure : on vous le donne par écrit, avant de commencer.",
    chips: [{ text: 'Réserver mon appel gratuit', action: 'goto-rdv' }],
  },
  services: {
    bot: "On peut vous aider de quatre façons : rendre vos tâches automatiques, créer un assistant IA, installer Zoho pour vos clients et vos factures, ou vous former. Qu'est-ce qui vous intéresse ?",
    chips: [
      { text: 'Tâches automatiques', next: 'auto' },
      { text: 'Assistant IA', next: 'agent' },
      { text: 'Zoho', next: 'zoho' },
      { text: 'Formation', next: 'formation' },
    ],
  },
  zoho: {
    bot: "Zoho réunit vos clients, vos factures, votre soutien client et vos infolettres au même endroit. On l'installe, on le règle selon votre façon de travailler et on vous forme.",
    chips: [
      { text: 'Combien ça coûte ?', next: 'zoho-estim' },
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
    ],
  },
  rdv: {
    bot: "Excellente idée ! Je vous redirige vers notre calendrier pour choisir un créneau (appel de 30 min, gratuit).",
    chips: [{ text: 'Voir le calendrier', action: 'goto-rdv' }],
  },
  fallback: {
    bot: "Bonne question ! Pour une réponse précise, le plus simple est d'en discuter de vive voix — l'appel découverte est gratuit — ou de nous écrire à bonjour@viesolutionweb.ca.",
    chips: [
      { text: 'Réserver mon appel gratuit', action: 'goto-rdv' },
      { text: 'Combien ça coûte ?', action: 'goto-devis' },
    ],
  },
};

export function VswChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: BOT_FLOW.start.bot, chips: BOT_FLOW.start.chips },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  const goToNode = (key: string) => {
    const node = BOT_FLOW[key];
    if (!node) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: 'bot', text: node.bot, chips: node.chips }]);
    }, 700);
  };

  const goToPage = (path: string) => {
    setTimeout(() => {
      setOpen(false);
      router.push(path);
    }, 400);
  };

  const handleChip = (chip: Chip) => {
    setMessages((m) => [...m, { from: 'user', text: chip.text }]);
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: 'user', text: q }]);
    setInput('');
    goToNode('fallback');
  };

  return (
    <>
      <button
        className={'chat-fab' + (open ? ' open' : '')}
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir l'assistant"
      >
        <Icon name={open ? 'close' : 'chat'} size={22} />
      </button>
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div className="chat-avatar">VS</div>
            <div style={{ flex: 1 }}>
              <div className="name">Assistant Vie Solution</div>
              <div className="status">En ligne</div>
            </div>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <Fragment key={i}>
                <div className={'chat-msg ' + m.from}>{m.text}</div>
                {m.chips && m.from === 'bot' && (
                  <div className="chat-quick">
                    {m.chips.map((c, j) => (
                      <button key={j} className="chat-chip" onClick={() => handleChip(c)}>
                        {c.text}
                      </button>
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
            {typing && (
              <div className="typing"><span /><span /><span /></div>
            )}
          </div>
          <form className="chat-input" onSubmit={handleSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question…"
            />
            <button type="submit" aria-label="Envoyer">
              <Icon name="send" size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
