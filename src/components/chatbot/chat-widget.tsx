'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './chat-window';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-6 h-6" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
        )}
      </button>
    </>
  );
}
