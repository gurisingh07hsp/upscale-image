'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  Wand2,
  Download,
  RotateCcw,
  Sparkles,
  Loader2,
  Check,
  X,
  ZoomIn,
  ScanLine,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/SectionHeading';
import { upscaleImage, loadImage, type UpscaleResult } from '@/lib/upscale';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'ready' | 'processing' | 'done' | 'error';

export default function UpscalePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [result, setResult] = useState<UpscaleResult | null>(null);
  const [scale] = useState<2 | 4>(2);
  const [enhance, setEnhance] = useState(true);
  const [denoise, setDenoise] = useState(true);
  const [useReplicate, setUseReplicate] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comparePos, setComparePos] = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setFile(null);
    setOriginalUrl(null);
    setResult(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setDims(null);
    setSaved(false);
  }, []);

  const onFile = useCallback(async (f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, or WebP).');
      setStatus('error');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      setStatus('error');
      return;
    }
    setError(null);
    setFile(f);
    setResult(null);
    setSaved(false);
    const url = URL.createObjectURL(f);
    setOriginalUrl(url);
    try {
      const img = await loadImage(url);
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
      setStatus('ready');
    } catch {
      setError('Could not read that image.');
      setStatus('error');
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    },
    [onFile]
  );

  const run = useCallback(async () => {
    if (!file) return;
    setStatus('processing');
    setProgress(0);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const res = await upscaleImage(file, { scale, enhance, denoise, useReplicate, onProgress: setProgress });
      setResult(res);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upscaling failed.');
      setStatus('error');
    }
  }, [file, scale, enhance, denoise, useReplicate]);

  const saveToGallery = useCallback(async () => {
    if (!result || !originalUrl || !file) return;
    setSaving(true);
    try {
      const { error: err } = await supabase.from('upscale_history').insert({
        title: file.name.replace(/\.[^.]+$/, ''),
        original_url: originalUrl,
        upscaled_url: result.dataUrl,
        scale,
        width: dims?.w ?? 0,
        height: dims?.h ?? 0,
        out_width: result.width,
        out_height: result.height,
        enhance,
        processing_ms: result.processingMs,
      });
      if (err) throw err;
      setSaved(true);
    } catch {
      setError('Could not save to gallery.');
    } finally {
      setSaving(false);
    }
  }, [result, originalUrl, file, scale, dims, enhance]);

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `pixellift-${scale}x-${Date.now()}.png`;
    a.click();
  }, [result, scale]);

  // useEffect(() => {
  //   const onMove = (e: MouseEvent) => {
  //     if (!dragRef.current || !compareRef.current) return;
  //     const rect = compareRef.current.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
  //     setComparePos(p);
  //   };
  //   const onUp = () => (dragRef.current = false);
  //   window.addEventListener('mousemove', onMove);
  //   window.addEventListener('mouseup', onUp);
  //   return () => {
  //     window.removeEventListener('mousemove', onMove);
  //     window.removeEventListener('mouseup', onUp);
  //   };
  // }, []);

  useEffect(() => {
  const updateFromClientX = (clientX: number) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setComparePos(p);
  };

  const onMove = (e: MouseEvent) => {
    if (!dragRef.current) return;
    updateFromClientX(e.clientX);
  };
  const onUp = () => (dragRef.current = false);

  const onTouchMove = (e: TouchEvent) => {
    if (!dragRef.current) return;
    // prevent the page from scrolling while dragging the slider
    e.preventDefault();
    updateFromClientX(e.touches[0].clientX);
  };
  const onTouchEnd = () => (dragRef.current = false);

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd);
  window.addEventListener('touchcancel', onTouchEnd);

  return () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
  };
}, []);

  const outW = dims ? dims.w * scale : 0;
  const outH = dims ? dims.h * scale : 0;

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] lg:w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Upscale studio"
          title="Upscale your image"
          subtitle="Upload, choose your settings, and let PixelLift reconstruct the detail."
        />

        {error && (
          <div className="mx-auto mt-6 flex max-w-2xl items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            <X className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {status === 'idle' && (
              <Card className="flex min-h-[420px] flex-col items-center justify-center border-dashed p-10 text-center" hover>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="flex h-full w-full flex-col items-center justify-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                    <Upload className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-lg font-medium">Drop an image here</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    or click to browse. JPG, PNG, or WebP up to 10MB.
                  </p>
                  <Button className="mt-6" onClick={() => inputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    Choose image
                  </Button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onFile(f);
                    }}
                  />
                </div>
              </Card>
            )}

            {(status === 'ready' || status === 'processing' || status === 'done') && originalUrl && (
              <Card className="overflow-hidden p-2">
                {status === 'done' && result ? (
                  <div
                    ref={compareRef}
                    className="relative aspect-auto w-full select-none overflow-hidden rounded-xl bg-black"
                    style={{ cursor: 'ew-resize' }}
                  >
                    <img src={result.dataUrl} alt="upscaled" className="block w-full" draggable={false} />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${comparePos}%` }}>
                      <img
                        src={originalUrl}
                        alt="original"
                        className="block h-full w-full object-cover"
                        style={{ width: compareRef.current?.clientWidth ?? '100%', maxWidth: 'none' }}
                        draggable={false}
                      />
                    </div>
                    <div className="absolute top-0 bottom-0 w-0.5 bg-accent" style={{ left: `${comparePos}%` }}>
                      <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-lg">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                      Before
                    </div>
                    <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent/80 px-3 py-1 text-xs text-white backdrop-blur">
                      After · {result.width}×{result.height}
                    </div>
                    {/* <div
                      className="absolute inset-y-0"
                      style={{ left: 0, width: `${comparePos}%` }}
                      onMouseDown={() => (dragRef.current = true)}
                    /> */}
                    {/* <div
                      className="absolute inset-y-0 right-0"
                      style={{ width: `${100 - comparePos}%` }}
                      onMouseDown={() => (dragRef.current = true)}
                    /> */}
                    <div
                      className="absolute inset-y-0"
                      style={{ left: 0, width: `${comparePos}%` }}
                      onMouseDown={() => (dragRef.current = true)}
                      onTouchStart={() => (dragRef.current = true)}
                    />
                    <div
                      className="absolute inset-y-0 right-0"
                      style={{ width: `${100 - comparePos}%` }}
                      onMouseDown={() => (dragRef.current = true)}
                      onTouchStart={() => (dragRef.current = true)}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img src={originalUrl} alt="original" className="block w-full rounded-xl" />
                    {status === 'processing' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        <p className="mt-4 text-sm text-muted">Enhancing detail… {Math.round(progress * 100)}%</p>
                        <div className="mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-black/10">
                          <div className="h-full bg-accent transition-all" style={{ width: `${progress * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {status === 'done' && result && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button onClick={download}>
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button variant="secondary" onClick={saveToGallery} disabled={saving || saved}>
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving…' : 'Save to gallery'}
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  New image
                </Button>
                <Link href="/gallery">
                  <Button variant="ghost">
                    View gallery
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-medium text-muted">Settings</h3>

              <div className="mt-5 space-y-2">
                <Toggle icon={Sparkles} label="AI Upscale (Replicate)" desc="Use AI for better quality" checked={useReplicate} onChange={setUseReplicate} />
                <Toggle icon={Wand2} label="Detail enhancement" desc="Reconstruct edges & texture" checked={enhance} onChange={setEnhance} disabled={useReplicate} />
                <Toggle icon={ScanLine} label="Smart denoise" desc="Remove compression artifacts" checked={denoise} onChange={setDenoise} disabled={useReplicate} />
              </div>

              {dims && (
                <div className="mt-5 rounded-xl border border-border bg-black/5 p-4 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Input</span>
                    <span className="text-foreground">{dims.w} × {dims.h}</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span>Output</span>
                    <span className="text-accent">{outW} × {outH}</span>
                  </div>
                </div>
              )}

              <Button className="mt-5 w-full" size="lg" onClick={run} disabled={status === 'processing' || !file}>
                {status === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Upscale now
                  </>
                )}
              </Button>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-medium text-muted">Tips</h3>
              <ul className="mt-3 space-y-2 text-xs text-muted">
                <li className="flex gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                  Use 2x for already-decent images.
                </li>
                <li className="flex gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                  Use 4x for very small or old photos.
                </li>
                <li className="flex gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                  Toggle denoise off for clean sources.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
  disabled = false,
}: {
  icon: typeof Wand2;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border border-border bg-black/5 p-3 text-left transition',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent/30 cursor-pointer'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-accent" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted">{desc}</p>
        </div>
      </div>
      <span className={cn('relative h-5 w-9 rounded-full transition', checked ? 'bg-accent' : 'bg-black/10')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', checked ? 'left-4' : 'left-0.5')} />
      </span>
    </button>
  );
}
