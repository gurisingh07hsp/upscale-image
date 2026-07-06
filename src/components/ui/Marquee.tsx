import { cn } from '@/lib/cn';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  children,
  className,
  reverse,
  vertical = false,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'marquee-group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
      style={{ gap: 'var(--gap)' }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn('flex shrink-0', vertical ? 'flex-col' : 'flex-row')}
          style={{
            gap: 'var(--gap)',
            animation: `marquee var(--duration) linear infinite`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
          aria-hidden={i > 0}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
