import type { ChatbotOption } from '@/types';

interface ChatOptionButtonsProps {
  options: ChatbotOption[];
  onSelect: (option: ChatbotOption) => void;
}

export function ChatOptionButtons({ options, onSelect }: ChatOptionButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mb-3 ml-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option)}
          className="text-left text-sm px-4 py-2 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
