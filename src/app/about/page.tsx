'use client';

import Link from 'next/link';
import {
  Target,
  Eye,
  Heart,
  Shield,
  Zap,
  Users,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/SectionHeading';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { useInView } from '@/lib/useInView';

const values = [
  { icon: Shield, title: 'Privacy first', desc: 'Your images are processed in your browser. We never see, store, or sell your data.' },
  { icon: Zap, title: 'Speed matters', desc: 'Seconds, not minutes. We obsess over performance so you can move fast.' },
  { icon: Heart, title: 'Quality obsessed', desc: 'We benchmark every change against real photos. If it looks worse, we ship it never.' },
  { icon: Globe, title: 'For everyone', desc: 'From hobbyists to enterprises, PixelLift is built to be useful at every scale.' },
];

const milestones = [
  { year: '2023', text: 'PixelLift started as a weekend project to rescue old phone photos.' },
  { year: '2024', text: 'Launched the in-browser engine — no uploads, no servers, no waiting.' },
  { year: '2025', text: 'Crossed 2 million images upscaled by creators worldwide.' },
  { year: '2026', text: 'Introduced 4x detail reconstruction and batch processing.' },
];

const team = [
  { name: 'Maya Chen', role: 'Founder & CEO', initial: 'M' },
  { name: 'Raj Patel', role: 'Head of Engineering', initial: 'R' },
  { name: 'Lena Park', role: 'Design Lead', initial: 'L' },
  { name: 'Tom Wright', role: 'ML Research', initial: 'T' },
];

export default function AboutPage() {
  const { ref, inView } = useInView();
  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-12 text-center">
          <Badge>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Our story
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            We make every pixel count
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            PixelLift started with a simple frustration: the photos that matter most — old memories,
            early work, quick phone shots — are often the lowest quality. We built a tool to fix that,
            right in your browser.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="p-8">
            <Target className="h-8 w-8 text-accent" />
            <h2 className="mt-5 text-2xl font-semibold">Our mission</h2>
            <p className="mt-3 text-muted">
              Give everyone — not just studios with expensive software — the power to turn low-resolution
              images into crisp, usable, high-resolution work. Free to start, private by design.
            </p>
          </Card>
          <Card className="p-8">
            <Eye className="h-8 w-8 text-accent" />
            <h2 className="mt-5 text-2xl font-semibold">Our vision</h2>
            <p className="mt-3 text-muted">
              A world where no great photo is discarded for being &quot;too small.&quot; Where creators rescue
              instead of redo, and where image quality is never a barrier to a good idea.
            </p>
          </Card>
        </section>

        <section className="py-20">
          <SectionHeading
            badge="Values"
            title="What we stand for"
            subtitle="The principles that guide every decision we make."
          />
          <div ref={ref} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Card
                key={v.title}
                hover
                className={`p-6 transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-medium">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-12">
          <SectionHeading badge="Journey" title="How we got here" align="left" />
          <div className="mt-10 space-y-4">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 rounded-2xl border border-border bg-card/60 p-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent ring-1 ring-accent/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < milestones.length - 1 && <span className="mt-2 h-full w-px bg-border" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-accent">{m.year}</p>
                  <p className="mt-1 text-muted">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <SectionHeading
            badge="Team"
            title="The people behind PixelLift"
            subtitle="A small, remote team obsessed with image quality."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t) => (
              <Card key={t.name} hover className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-xl font-semibold text-accent ring-1 ring-accent/20">
                  {t.initial}
                </div>
                <h3 className="mt-4 font-medium">{t.name}</h3>
                <p className="mt-1 text-sm text-muted">{t.role}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="relative overflow-hidden p-10 text-center">
          <BorderBeam size={250} duration={10} />
          <Users className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-6 text-3xl font-semibold tracking-tight">Join the creators using PixelLift</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Try it free — no signup, no upload, no waiting.</p>
          <Link href="/upscale">
            <Button size="lg" className="mt-8">
              Start upscaling
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
