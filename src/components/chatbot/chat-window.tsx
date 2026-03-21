'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { ChatOptionButtons } from './chat-option-buttons';
import { CHATBOT_FLOW, COLLECT_STEPS_ORDER } from '@/lib/constants/chatbot-flow';
import { submitChatbotLead } from '@/lib/supabase/actions';
import type { ChatbotOption, ChatMessage as ChatMessageType } from '@/types';

interface ChatWindowProps {
  onClose: () => void;
}

interface LeadData {
  categorie: string;
  sous_categorie: string;
  budget: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      type: 'bot',
      content: CHATBOT_FLOW.welcome.message,
      options: CHATBOT_FLOW.welcome.options,
      timestamp: new Date(),
    },
  ]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [inputValue, setInputValue] = useState('');
  const [leadData, setLeadData] = useState<Partial<LeadData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (stepId: string) => {
    const step = CHATBOT_FLOW[stepId];
    if (!step) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'bot',
        content: step.message,
        options: step.options,
        timestamp: new Date(),
      },
    ]);
    setCurrentStep(stepId);
  };

  const handleOptionSelect = (option: ChatbotOption) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: option.label, timestamp: new Date() },
    ]);

    const step = CHATBOT_FLOW[currentStep];
    if (currentStep === 'welcome') {
      setLeadData((prev) => ({ ...prev, categorie: option.value }));
    } else if (step && currentStep !== 'budget') {
      setLeadData((prev) => ({ ...prev, sous_categorie: option.value }));
    }
    if (currentStep === 'budget') {
      setLeadData((prev) => ({ ...prev, budget: option.label }));
    }

    setTimeout(() => addBotMessage(option.nextStep), 400);
  };

  const getNextCollectStep = (currentCollect: string): string => {
    const idx = COLLECT_STEPS_ORDER.indexOf(currentCollect);
    return idx >= 0 && idx < COLLECT_STEPS_ORDER.length - 1
      ? COLLECT_STEPS_ORDER[idx + 1]
      : 'confirmation';
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim() && currentStep !== 'collect-phone' && currentStep !== 'collect-message') return;

    const step = CHATBOT_FLOW[currentStep];
    const value = inputValue.trim().toLowerCase() === 'passer' ? '' : inputValue.trim();

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: inputValue.trim() || '(ignoré)', timestamp: new Date() },
    ]);

    if (step?.field) {
      setLeadData((prev) => ({ ...prev, [step.field!]: value }));
    }

    setInputValue('');

    const nextStep = getNextCollectStep(currentStep);

    if (nextStep === 'confirmation') {
      const finalData = { ...leadData, ...(step?.field ? { [step.field]: value } : {}) };
      try {
        await submitChatbotLead({
          nom: finalData.nom || '',
          email: finalData.email || '',
          telephone: finalData.telephone,
          categorie: finalData.categorie || '',
          sous_categorie: finalData.sous_categorie,
          budget: finalData.budget,
          message: finalData.message,
          source: 'chatbot',
        });
      } catch {
        // silently fail - we still show confirmation
      }
      setIsSubmitted(true);
    }

    setTimeout(() => addBotMessage(nextStep), 400);
  };

  const currentFlowStep = CHATBOT_FLOW[currentStep];
  const showInput = currentFlowStep?.inputType && !isSubmitted;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 w-[340px] sm:w-[380px] glass rounded-2xl shadow-2xl flex flex-col z-50 max-h-[500px] border-white/10">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl">
        <span className="text-white font-medium text-sm">Assistant VieSolution</span>
        <button onClick={onClose} className="text-white/80 hover:text-white" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 min-h-[250px] max-h-[350px]">
        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage type={msg.type} content={msg.content} />
            {msg.type === 'bot' && msg.options && msg.id === messages[messages.length - 1]?.id && (
              <ChatOptionButtons options={msg.options} onSelect={handleOptionSelect} />
            )}
          </div>
        ))}
      </div>

      {showInput && (
        <div className="border-t border-white/5 p-3 flex gap-2">
          <input
            type={currentFlowStep.inputType}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            placeholder="Votre réponse..."
            className="flex-1 text-sm bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleInputSubmit}
            className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
