'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/SectionHeading';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { cn } from '@/lib/cn';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    desc: 'Perfect for trying things out.',
    features: ['10 upscales / month', 'Up to 2x scale', 'PNG export', 'Gallery history', 'Standard queue'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 12,
    period: '/ month',
    desc: 'For creators and freelancers.',
    features: ['Unlimited upscales', 'Up to 4x scale', 'Detail enhancement', 'Batch processing', 'Priority queue', 'No watermark'],
    cta: 'Get Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: null,
    period: '',
    desc: 'For teams and high volume.',
    features: ['Everything in Pro', 'API access', '8K resolution', 'SSO & audit logs', 'Dedicated support', 'Custom SLAs'],
    cta: 'Contact sales',
    highlight: false,
  },
];

const comparison = [
  { feature: 'Monthly upscales', free: '10', pro: 'Unlimited', ent: 'Unlimited' },
  { feature: 'Max scale', free: '2x', pro: '4x', ent: '8K' },
  { feature: 'Detail enhancement', free: false, pro: true, ent: true },
  { feature: 'Batch processing', free: false, pro: true, ent: true },
  { feature: 'Priority queue', free: false, pro: true, ent: true },
  { feature: 'API access', free: false, pro: false, ent: true },
  { feature: 'SSO & audit logs', free: false, pro: false, ent: true },
  { feature: 'Support', free: 'Community', pro: 'Email', ent: 'Dedicated' },
];

const faqs = [
  { q: 'Can I change plans anytime?', a: 'Yes. Upgrade or downgrade from your account at any time. Changes prorate automatically.' },
  { q: 'Is there a free trial for Pro?', a: 'The Free plan is free forever and includes 10 upscales a month — no credit card required. Upgrade to Pro whenever you need more.' },
  { q: 'How does billing work?', a: 'Pro is billed monthly. Enterprise is custom — talk to our team about volume and SLAs.' },
  { q: 'What happens to my gallery if I downgrade?', a: 'Your saved images stay in your gallery. You just lose access to Pro-only features like 4x scale and batch processing.' },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title="Pricing that scales with you"
          subtitle="Start free. Upgrade when you need more power. Cancel anytime."
        />

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn('text-sm', !annual && 'text-foreground', annual && 'text-muted')}>Monthly</span>
          <button
            onClick={() => setAnnual((v) => !v)}
            className={cn('relative h-7 w-12 rounded-full transition', annual ? 'bg-accent' : 'bg-black/10')}
          >
            <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white transition-all', annual ? 'left-6' : 'left-1')} />
          </button>
          <span className={cn('text-sm', annual && 'text-foreground', !annual && 'text-muted')}>
            Annual <span className="text-accent">(-20%)</span>
          </span>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((p) => {
            const price =
              p.price === null ? 'Custom' : p.price === 0 ? '$0' : annual ? `$${Math.round(p.price * 0.8)}` : `$${p.price}`;
            return (
              <Card key={p.name} className={cn('relative p-6', p.highlight && 'border-accent/40 bg-accent/5')}>
                {p.highlight && <BorderBeam size={200} duration={8} />}
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-medium">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">{price}</span>
                  {p.price !== null && p.price > 0 && (
                    <span className="text-sm text-muted">{annual ? '/ mo billed yearly' : p.period}</span>
                  )}
                  {p.price === 0 && <span className="text-sm text-muted">{p.period}</span>}
                </div>
                <Link href={p.name === 'Enterprise' ? '/contact' : '/upscale'}>
                  <Button variant={p.highlight ? 'primary' : 'secondary'} className="mt-6 w-full">
                    {p.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted">
                      <Check className="h-4 w-4 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <div className="mt-20">
          <SectionHeading badge="Compare" title="Compare every feature" align="left" />
          <Card className="mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left font-medium text-muted">Feature</th>
                    <th className="p-4 text-center font-medium">Free</th>
                    <th className="p-4 text-center font-medium text-accent">Pro</th>
                    <th className="p-4 text-center font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-b border-border/60 last:border-0">
                      <td className="p-4 text-muted">{row.feature}</td>
                      <td className="p-4 text-center">{renderCell(row.free)}</td>
                      <td className="p-4 text-center">{renderCell(row.pro)}</td>
                      <td className="p-4 text-center">{renderCell(row.ent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="mt-20">
          <SectionHeading badge="Billing FAQ" title="Questions about pricing" />
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
            {faqs.map((f) => (
              <Card key={f.q} className="p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <h4 className="font-medium">{f.q}</h4>
                    <p className="mt-2 text-sm text-muted">{f.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="relative mt-20 overflow-hidden p-10 text-center">
          <BorderBeam size={250} duration={10} />
          <Sparkles className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tight">Still not sure?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Try PixelLift free — no credit card required. Upgrade only when you love it.
          </p>
          <Link href="/upscale">
            <Button size="lg" className="mt-8">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function renderCell(v: string | boolean) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-accent" />;
  if (v === false) return <span className="text-muted/40">—</span>;
  return <span className="text-foreground">{v}</span>;
}
