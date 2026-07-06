'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Upscale', path: '/upscale' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[15px]">PixelLift</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              className={cn(
                'rounded-full px-4 py-2 text-sm transition-colors',
                pathname === l.path
                  ? 'text-foreground bg-black/5'
                  : 'text-muted hover:text-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/upscale"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-[0_0_20px_-6px_rgba(37,99,235,0.6)] transition hover:bg-accent/90"
          >
            Try Free
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm',
                  pathname === l.path ? 'text-foreground bg-black/5' : 'text-muted'
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/upscale"
              className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
            >
              Try Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
