import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border border-[#2a2a3a] bg-[#111118] px-4 py-2.5 text-gray-100 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 appearance-none',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-[#111118] text-gray-500">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#111118]">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
