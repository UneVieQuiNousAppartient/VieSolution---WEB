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
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
        <ChevronDown className={cn('w-5 h-5 text-gray-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-20 bg-white">
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
