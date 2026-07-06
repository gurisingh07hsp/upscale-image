import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Upscale', path: '/upscale' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Pricing', path: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', path: '/about' },
      { label: 'Terms', path: '/about' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/30">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>PixelLift</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              AI-powered image upscaling that turns low-resolution photos into
              crisp, high-resolution masterpieces.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:text-foreground hover:border-accent/40"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-medium text-foreground">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.path}
                      className="text-sm text-muted transition hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} PixelLift. All rights reserved.
          </p>
          <p className="text-xs text-muted">Built with AI · Powered by pixels</p>
        </div>
      </div>
    </footer>
  );
}
