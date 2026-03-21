import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30': variant === 'primary',
            'bg-[#1e1e2a] text-gray-200 hover:bg-[#262636] border border-[#2a2a3a]': variant === 'secondary',
            'border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50': variant === 'outline',
            'text-gray-400 hover:text-white hover:bg-white/5': variant === 'ghost',
            'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/20 pulse-glow': variant === 'glow',
          },
          {
            'text-sm px-4 py-2': size === 'sm',
            'text-sm px-6 py-2.5': size === 'md',
            'text-base px-8 py-3.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
