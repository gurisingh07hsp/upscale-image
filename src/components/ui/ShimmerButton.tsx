import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ShimmerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ShimmerButton({ className, children, ...props }: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'group relative inline-flex h-12 overflow-hidden rounded-full bg-accent px-8 text-sm font-medium text-white transition-transform active:scale-95',
        'shadow-[0_0_30px_-8px_rgba(37,99,235,0.6)]',
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}
