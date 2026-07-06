'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Wand2,
  Image as ImageIcon,
  ArrowRight,
  Check,
  Star,
  ChevronDown,
  Gauge,
  Crop,
  ScanLine,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Marquee } from '@/components/ui/Marquee';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { SectionHeading } from '@/components/SectionHeading';
import { useInView } from '@/lib/useInView';
import { useCountUp } from '@/lib/useCountUp';

const logos = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella',
  'Hooli',
  'Stark',
  'Wayne',
  'Soylent',
];

const features = [
  {
    icon: Wand2,
    title: 'AI Detail Reconstruction',
    desc: 'Our model reconstructs lost detail and texture, not just stretches pixels — faces, text, and edges stay crisp.',
    span: 'md:col-span-2',
  },
  { icon: Zap, title: 'Instant Upscale', desc: '2x or 4x in seconds, right in your browser.' },
  { icon: ScanLine, title: 'Smart Denoise', desc: 'Removes compression artifacts before enhancing.' },
  { icon: Crop, title: 'Batch Ready', desc: 'Queue multiple images and process them in one flow.' },
  {
    icon: Shield,
    title: 'Private by Design',
    desc: 'Images are processed locally in your browser. Nothing leaves your device.',
    span: 'md:col-span-2',
  },
];

const steps = [
  { icon: ImageIcon, title: 'Upload your image', desc: 'Drag in any JPG, PNG, or WebP. Up to 10MB.' },
  { icon: Layers, title: 'Pick a scale', desc: 'Choose 2x or 4x and toggle detail enhancement.' },
  { icon: Wand2, title: 'Enhance', desc: 'Our engine reconstructs detail in seconds.' },
  { icon: ArrowRight, title: 'Download', desc: 'Save the crisp result or keep it in your gallery.' },
];

const stats = [
  { label: 'Images upscaled', value: 2.4, suffix: 'M+', decimals: 1 },
  { label: 'Avg. processing', value: 1.8, suffix: 's', decimals: 1 },
  { label: 'Max resolution', value: 8, suffix: 'K', decimals: 0 },
  { label: 'Happy creators', value: 98, suffix: '%', decimals: 0 },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying things out.',
    features: ['10 upscales / month', 'Up to 2x scale', 'PNG export', 'Gallery history'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ month',
    desc: 'For creators and freelancers.',
    features: ['Unlimited upscales', 'Up to 4x scale', 'Detail enhancement', 'Batch processing', 'Priority queue'],
    cta: 'Get Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For teams and high volume.',
    features: ['Everything in Pro', 'API access', '8K resolution', 'SSO & audit logs', 'Dedicated support'],
    cta: 'Contact sales',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'How does the upscaling work?',
    a: 'PixelLift uses a high-quality resampling pipeline combined with detail reconstruction. It analyzes your image and rebuilds edges, textures, and fine detail that simple interpolation loses.',
  },
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. All processing happens locally in your browser using the canvas API. Your images never leave your device unless you choose to save them to your gallery.',
  },
  {
    q: 'What formats are supported?',
    a: 'You can upload JPG, PNG, and WebP files up to 10MB. Results are exported as high-quality PNG.',
  },
  {
    q: 'Can I upscale multiple images at once?',
    a: 'Batch processing is available on the Pro plan. Queue as many images as you like and process them in a single flow.',
  },
  {
    q: 'What is the maximum resolution?',
    a: 'Free and Pro plans support up to 4x scaling. Enterprise supports up to 8K output resolution.',
  },
];

const testimonials = [
  { name: 'Alex Rivera', role: 'CTO at InnovateTech', text: 'PixelLift turned our product thumbnails from blurry to razor-sharp. Conversions jumped 18% in a month.' },
  { name: 'Samantha Lee', role: 'Marketing Director', text: 'I rescued a decade of low-res client photos. The detail reconstruction is genuinely impressive.' },
  { name: 'Raj Patel', role: 'Founder & CEO', text: 'We process thousands of images a week. PixelLift is the only tool that kept up without a server.' },
  { name: 'Maya Chen', role: 'Photographer', text: 'The 4x upscale on old phone shots is uncanny. Faces stay clean instead of turning to mush.' },
  { name: 'Tom Wright', role: 'Indie Game Dev', text: 'Upscaled all my 512px textures to 2K. Saved me weeks of redoing art by hand.' },
  { name: 'Lena Park', role: 'Content Lead', text: 'Private-by-design was the selling point for us. No image ever leaves the browser.' },
];

function Hero() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge>
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Introducing 4x detail reconstruction
          </Badge>
          <h1
            className={`mt-6 text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Upscale images
            <br />
            <span className="shimmer-text">without losing detail</span>
          </h1>
          <p
            className={`mt-6 max-w-xl text-lg text-muted transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            PixelLift reconstructs lost detail and texture from low-resolution
            photos — crisp faces, sharp text, clean edges. All in your browser.
          </p>
          <div
            className={`mt-8 flex flex-col items-center gap-3 sm:flex-row transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link href="/upscale">
              <Button size="lg">
                Upscale an image
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="secondary">
                View pricing
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={`relative mx-auto mt-16 max-w-4xl transition-all duration-1000 delay-300 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Card className="overflow-hidden p-2">
            <BorderBeam size={250} duration={8} />
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-background/60 p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
                <div className="absolute inset-0 bg-dotted opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted/50" />
                    <p className="mt-2 text-xs text-muted">Before · 480×360</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-accent/30 bg-card">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-2 text-xs text-accent">After · 1920×1440</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted">Trusted by fast-growing startups</p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee className="[--duration:30s]">
            {logos.map((l) => (
              <span key={l} className="text-xl font-semibold text-muted/60 transition hover:text-foreground">
                {l}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { ref, inView } = useInView();
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Features"
          title="Empower your images with AI"
          subtitle="Everything you need to turn low-resolution photos into crisp, high-resolution masterpieces."
        />
        <div ref={ref} className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              hover
              className={`group p-6 ${f.span ?? ''} ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { ref, inView } = useInView();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} active={inView} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
  decimals,
  active,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  decimals: number;
  active: boolean;
  delay: number;
}) {
  const v = useCountUp(value, 1500, active);
  return (
    <Card
      className={`p-6 text-center transition-all duration-700 ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl font-semibold sm:text-4xl">
        {v.toFixed(decimals)}
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </Card>
  );
}

function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="How it works"
          title="Simple. Seamless. Sharp."
          subtitle="Turn a blurry photo into a crisp masterpiece in four easy steps."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <StepCard key={s.title} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: { icon: typeof Zap; title: string; desc: string };
  index: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border border-border bg-card/60 p-6 transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="absolute right-5 top-5 text-5xl font-bold text-black/5">{index + 1}</span>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
        <step.icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-medium">{step.title}</h3>
      <p className="mt-2 text-sm text-muted">{step.desc}</p>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Loved by creators"
          title="Don't take our word for it"
          subtitle="Thousands of creators trust PixelLift to rescue and enhance their images."
        />
        <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          <Marquee className="[--duration:50s]">
            {testimonials.map((t) => (
              <Card key={t.name} className="w-[340px] p-6">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{t.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-medium text-accent">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pricing"
          title="Pricing that scales with you"
          subtitle="Start free. Upgrade when you need more power. Cancel anytime."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={`relative p-6 ${p.highlight ? 'border-accent/40 bg-accent/5' : ''}`}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-medium">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold">{p.price}</span>
                <span className="text-sm text-muted">{p.period}</span>
              </div>
              <Link href={p.name === 'Enterprise' ? '/contact' : '/upscale'}>
                <Button variant={p.highlight ? 'primary' : 'secondary'} className="mt-6 w-full">
                  {p.cta}
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
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about upscaling with PixelLift."
        />
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <Card key={i} className="overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`h-5 w-5 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted">{f.a}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden p-10 text-center sm:p-16">
          <BorderBeam size={300} duration={10} />
          <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[100px]" />
          <Gauge className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to make your images sharp?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Upload your first image and see the difference in seconds. No signup required.
          </p>
          <Link href="/upscale">
            <Button size="lg" className="mt-8">
              Start upscaling
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Logos />
      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
