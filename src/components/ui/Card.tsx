import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border bg-card backdrop-blur-sm shadow-sm',
        hover &&
          'transition-all duration-300 hover:border-accent/40 hover:shadow-md',
        className
      )}
      {...props}
    />
  );
}
