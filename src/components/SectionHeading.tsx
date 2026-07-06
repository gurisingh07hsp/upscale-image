'use client';

import { useInView } from '@/lib/useInView';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className
      )}
    >
      {badge && (
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border bg-white/60 px-3 py-1 text-xs font-medium text-muted transition-all duration-700',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {badge}
        </span>
      )}
      <h2
        className={cn(
          'max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl transition-all duration-700',
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base text-muted sm:text-lg transition-all duration-700 delay-100',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
