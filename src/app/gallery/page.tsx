'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  Trash2,
  Download,
  X,
  Calendar,
  Layers,
  Clock,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/SectionHeading';
import { supabase, type UpscaleRecord } from '@/lib/supabase';

export default function GalleryPage() {
  const [records, setRecords] = useState<UpscaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<UpscaleRecord | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('upscale_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(60);
      if (err) throw err;
      setRecords((data ?? []) as UpscaleRecord[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(
    async (id: string) => {
      const prev = records;
      setRecords((r) => r.filter((x) => x.id !== id));
      try {
        const { error: err } = await supabase.from('upscale_history').delete().eq('id', id);
        if (err) throw err;
      } catch {
        setRecords(prev);
      }
    },
    [records]
  );

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Your gallery"
          title="Saved upscales"
          subtitle="Every image you save to PixelLift lives here, ready to re-download."
        />

        <div className="mt-8 flex items-center justify-between">
          <Badge>
            <ImageIcon className="h-3.5 w-3.5" />
            {records.length} {records.length === 1 ? 'image' : 'images'}
          </Badge>
          <Link href="/upscale">
            <Button variant="secondary" size="sm">
              <Sparkles className="h-4 w-4" />
              New upscale
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="mt-4 text-sm">Loading your gallery…</p>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <Card className="mt-10 flex flex-col items-center justify-center p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-medium">No images yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Upscale an image and save it to your gallery to see it here.
            </p>
            <Link href="/upscale">
              <Button className="mt-6">
                <Sparkles className="h-4 w-4" />
                Upscale your first image
              </Button>
            </Link>
          </Card>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {records.map((r) => (
              <Card
                key={r.id}
                hover
                className="group cursor-pointer overflow-hidden p-0"
                onClick={() => setSelected(r)}
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    src={r.upscaled_url}
                    alt={r.title ?? 'upscaled'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span className="absolute right-2 top-2 rounded-full bg-accent/80 px-2 py-0.5 text-xs font-medium text-white">
                    {r.scale}x
                  </span>
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-between p-3 opacity-0 transition group-hover:opacity-100">
                    <span className="truncate text-xs text-white/90">{r.title ?? 'Untitled'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(r.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500/80"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <Card className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden p-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="flex items-center justify-center bg-black p-4">
                <img
                  src={selected.upscaled_url}
                  alt={selected.title ?? 'upscaled'}
                  className="max-h-[60vh] w-auto rounded-lg object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium">{selected.title ?? 'Untitled'}</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <Row icon={Layers} label="Scale" value={`${selected.scale}x`} />
                  <Row icon={ImageIcon} label="Input" value={`${selected.width} × ${selected.height}`} />
                  <Row icon={Sparkles} label="Output" value={`${selected.out_width} × ${selected.out_height}`} />
                  <Row icon={Clock} label="Processing" value={`${(selected.processing_ms / 1000).toFixed(2)}s`} />
                  <Row icon={Calendar} label="Created" value={new Date(selected.created_at).toLocaleString()} />
                </div>
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selected.upscaled_url;
                      a.download = `${selected.title ?? 'pixellift'}.png`;
                      a.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      remove(selected.id);
                      setSelected(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
