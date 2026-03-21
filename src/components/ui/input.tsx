import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border border-[#2a2a3a] bg-[#111118] px-4 py-2.5 text-gray-100 placeholder-gray-500 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:bg-[#16161f]',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
