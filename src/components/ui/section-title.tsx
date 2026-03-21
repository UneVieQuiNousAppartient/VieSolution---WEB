'use client';

import { cn } from '@/lib/utils/cn';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  gradient?: boolean;
}

export function SectionTitle({ title, subtitle, centered = true, className, gradient = false }: SectionTitleProps) {
  return (
    <div className={cn('mb-12', centered && 'text-center', className)}>
      <h2 className={cn('text-3xl font-bold sm:text-4xl', gradient ? 'gradient-text' : 'text-white')}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
