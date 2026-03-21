'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { FAQ_ITEMS } from '@/lib/constants/content';
import { cn } from '@/lib/utils/cn';
import type { FAQItem } from '@/types';

function FAQItemComponent({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-gray-200 pr-4 text-sm">{item.question}</span>
        <ChevronDown className={cn('w-4 h-4 text-gray-500 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Questions fréquentes"
          subtitle="Les réponses aux questions que vous vous posez."
        />
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItemComponent key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
