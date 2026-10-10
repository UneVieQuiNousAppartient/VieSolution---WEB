'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';

type Chip = { text: string; next?: string; action?: 'goto-rdv' | 'goto-devis' };
type Node = { bot: string; chips?: Chip[] };
type Msg = { from: 'bot' | 'user'; text: string; chips?: Chip[] };

/* Tarifs mentionnés : indicatifs — [à confirmer] */
const BOT_FLOW: Record<string, Node> = {
  start: {
    bot: "Bonjour 👋 Je suis l'assistant de Vie Solution Web. Comment puis-je vous aider aujourd'hui ?",
    chips: [
      { text: 'Estimer un projet', next: 'estimer' },
      { text: 'Voir les services', next: 'services' },
      { text: 'Parler de Zoho', next: 'zoho' },
      { text: 'Prendre un RDV', next: 'rdv' },
    ],
  },
  estimer: {
    bot: 'Parfait ! Quel type de projet avez-vous en tête ?',
    chips: [
      { text: 'Automatisation IA', next: 'auto' },
      { text: 'Agent IA', next: 'agent' },
      { text: 'Implantation Zoho', next: 'zoho-estim' },
      { text: 'Formation', next: 'formation' },
    ],
  },
  auto: {
    bot: "L'automatisation démarre autour de 1 800 $ CAD. On audite vos processus actuels, puis on automatise d'abord les tâches qui vous grugent le plus de temps.",
    chips: [
      { text: 'Ouvrir le calculateur', action: 'goto-devis' },
      { text: 'Prendre un RDV', action: 'goto-rdv' },
    ],
  },
  agent: {
    bot: "Un agent IA sur mesure (chatbot, assistant interne, traitement de documents) démarre autour de 4 500 $ CAD selon les intégrations. On cadre ça ensemble lors d'un appel.",
    chips: [
      { text: 'Prendre un RDV', action: 'goto-rdv' },
      { text: 'Ouvrir le calculateur', action: 'goto-devis' },
    ],
  },
  'zoho-estim': {
    bot: "Une implantation Zoho démarre autour de 3 200 $ CAD (CRM + configuration de base). Le prix varie selon les modules (Books, Desk, Campaigns…) et le nombre d'utilisateurs.",
    chips: [
      { text: 'Ouvrir le calculateur', action: 'goto-devis' },
      { text: 'Prendre un RDV', action: 'goto-rdv' },
    ],
  },
  formation: {
    bot: "Nos formations IA et Zoho démarrent autour de 1 500 $ CAD : ateliers pratiques, cas d'usage de votre métier, et suivi jusqu'à l'autonomie de votre équipe.",
    chips: [{ text: 'Prendre un RDV', action: 'goto-rdv' }],
  },
  services: {
    bot: 'Nous avons quatre expertises : automatisation des processus, agents et intégrations IA, implantation Zoho, et formation IA & Zoho. Laquelle vous intéresse ?',
    chips: [
      { text: 'Automatisation', next: 'auto' },
      { text: 'Agents IA', next: 'agent' },
      { text: 'Zoho', next: 'zoho' },
      { text: 'Formation', next: 'formation' },
    ],
  },
  zoho: {
    bot: "Zoho réunit CRM, facturation, soutien client et marketing dans un seul écosystème. On l'installe chez vous, on le configure selon vos processus et on forme votre équipe. Une vie qui vous appartient dans la gestion de votre business !",
    chips: [
      { text: 'Estimer une implantation', next: 'zoho-estim' },
      { text: 'Prendre un RDV', action: 'goto-rdv' },
    ],
  },
  rdv: {
    bot: "Excellente idée ! Je vous redirige vers notre calendrier pour choisir un créneau (appel de 30 min, gratuit).",
    chips: [{ text: 'Voir le calendrier', action: 'goto-rdv' }],
  },
  fallback: {
    bot: "Bonne question ! Pour une réponse précise, le plus simple est d'en discuter de vive voix — l'appel découverte est gratuit — ou de nous écrire à bonjour@viesolutionweb.ca.",
    chips: [
      { text: 'Prendre un RDV', action: 'goto-rdv' },
      { text: 'Estimer un projet', action: 'goto-devis' },
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
