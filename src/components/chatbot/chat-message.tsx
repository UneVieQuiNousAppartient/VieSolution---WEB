import { cn } from '@/lib/utils/cn';

interface ChatMessageProps {
  type: 'bot' | 'user';
  content: string;
}

export function ChatMessage({ type, content }: ChatMessageProps) {
  return (
    <div className={cn('flex mb-3', type === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          type === 'bot'
            ? 'bg-blue-50 text-gray-800 rounded-bl-md'
            : 'bg-blue-600 text-white rounded-br-md'
        )}
      >
        {content}
      </div>
    </div>
  );
}
