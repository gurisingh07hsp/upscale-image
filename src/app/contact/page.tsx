'use client';

import { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, Check, Loader2, Twitter, Github, Linkedin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/SectionHeading';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { cn } from '@/lib/cn';

const channels = [
  { icon: Mail, title: 'Email us', value: 'hello@pixellift.app', desc: 'For any question. We reply within one business day.' },
  { icon: MessageSquare, title: 'Live chat', value: 'Available 9am–6pm UTC', desc: 'Quick questions while you work.' },
  { icon: MapPin, title: 'Visit us', value: 'Remote, worldwide', desc: 'We are a fully distributed team.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 900));
    setStatus('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Contact"
          title="Let's talk"
          subtitle="Questions, feedback, partnerships, or enterprise inquiries — we'd love to hear from you."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {channels.map((c) => (
              <Card key={c.title} hover className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{c.title}</h3>
                    <p className="mt-0.5 text-sm font-medium text-accent">{c.value}</p>
                    <p className="mt-1 text-sm text-muted">{c.desc}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-6">
              <h3 className="font-medium">Follow us</h3>
              <p className="mt-1 text-sm text-muted">Stay in the loop with product updates and tips.</p>
              <div className="mt-4 flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-accent/40 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </Card>
          </div>

          <Card className="relative overflow-hidden p-6 sm:p-8">
            <BorderBeam size={250} duration={12} />
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} placeholder="Jane Doe" />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} placeholder="jane@example.com" />
              </div>
              <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="How can we help?" />
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Tell us a bit more…"
                  className={cn(
                    'mt-2 w-full resize-none rounded-xl border bg-black/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:bg-white',
                    errors.message ? 'border-red-500/50' : 'border-border'
                  )}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : status === 'sent' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Message sent
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </Button>

              {status === 'sent' && <p className="text-center text-sm text-accent">Thanks! We'll get back to you shortly.</p>}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'mt-2 w-full rounded-xl border bg-black/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:bg-white',
          error ? 'border-red-500/50' : 'border-border'
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
