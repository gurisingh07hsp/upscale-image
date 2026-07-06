// Client-side image upscaling using canvas high-quality resampling
// plus an optional unsharp-mask / detail enhancement pass.
// Also supports Replicate API for AI upscaling.

export interface UpscaleOptions {
  scale: number; // 2 or 4
  enhance: boolean; // apply detail enhancement
  denoise: boolean; // light noise reduction
  onProgress?: (p: number) => void;
  useReplicate?: boolean; // use Replicate AI upscaling
}

export interface UpscaleResult {
  dataUrl: string;
  width: number;
  height: number;
  processingMs: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// High-quality upscale using stepped 2x interpolation. Each step draws the
// previous canvas onto a fresh canvas at 2x until the target is reached. This
// avoids the corruption that happens when drawing a canvas onto itself.
function drawScaled(
  source: CanvasImageSource,
  sw: number,
  sh: number,
  tw: number,
  th: number
): HTMLCanvasElement {
  // Build the list of intermediate sizes, doubling each step.
  const sizes: Array<[number, number]> = [];
  let curW = sw;
  let curH = sh;
  while (curW * 2 <= tw) {
    curW *= 2;
    curH *= 2;
    sizes.push([curW, curH]);
  }
  // Final step to exact target (handles non-power-of-two final sizes)
  if (curW !== tw || curH !== th) {
    sizes.push([tw, th]);
  }

  let current: HTMLCanvasElement | undefined;
  let srcW = sw;
  let srcH = sh;
  let srcImage: CanvasImageSource = source;

  for (let i = 0; i < sizes.length; i++) {
    const [w, h] = sizes[i];
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(srcImage, 0, 0, srcW, srcH, 0, 0, w, h);
    current = canvas;
    srcImage = canvas;
    srcW = w;
    srcH = h;
  }

  // If no steps were needed, draw directly to target.
  if (!current) {
    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, sw, sh, 0, 0, tw, th);
    return canvas;
  }

  return current;
}

// Unsharp mask: out = original + amount * (original - blurred)
function applyUnsharp(
  canvas: HTMLCanvasElement,
  amount: number,
  radius: number
): void {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const src = ctx.getImageData(0, 0, width, height);
  const blurred = ctx.getImageData(0, 0, width, height);

  // Simple separable box blur
  boxBlur(blurred.data, width, height, radius);

  const out = ctx.createImageData(width, height);
  const s = src.data;
  const b = blurred.data;
  const o = out.data;
  for (let i = 0; i < s.length; i += 4) {
    o[i] = clamp(s[i] + amount * (s[i] - b[i]));
    o[i + 1] = clamp(s[i + 1] + amount * (s[i + 1] - b[i + 1]));
    o[i + 2] = clamp(s[i + 2] + amount * (s[i + 2] - b[i + 2]));
    o[i + 3] = s[i + 3];
  }
  ctx.putImageData(out, 0, 0);
}

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function boxBlur(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  r: number
): void {
  if (r < 1) return;
  const tmp = new Uint8ClampedArray(data.length);
  // horizontal
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let R = 0,
        G = 0,
        B = 0,
        A = 0,
        c = 0;
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= w) continue;
        const i = (y * w + xx) * 4;
        R += data[i];
        G += data[i + 1];
        B += data[i + 2];
        A += data[i + 3];
        c++;
      }
      const o = (y * w + x) * 4;
      tmp[o] = R / c;
      tmp[o + 1] = G / c;
      tmp[o + 2] = B / c;
      tmp[o + 3] = A / c;
    }
  }
  // vertical
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let R = 0,
        G = 0,
        B = 0,
        A = 0,
        c = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        const i = (yy * w + x) * 4;
        R += tmp[i];
        G += tmp[i + 1];
        B += tmp[i + 2];
        A += tmp[i + 3];
        c++;
      }
      const o = (y * w + x) * 4;
      data[o] = R / c;
      data[o + 1] = G / c;
      data[o + 2] = B / c;
      data[o + 3] = A / c;
    }
  }
}

// Light denoise: 3x3 median-ish via averaging low-frequency
function applyDenoise(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const src = ctx.getImageData(0, 0, width, height);
  const out = ctx.createImageData(width, height);
  const s = src.data;
  const o = out.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        o[i] = s[i];
        o[i + 1] = s[i + 1];
        o[i + 2] = s[i + 2];
        o[i + 3] = s[i + 3];
        continue;
      }
      // average of 3x3
      let R = 0,
        G = 0,
        B = 0,
        c = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const j = ((y + dy) * width + (x + dx)) * 4;
          R += s[j];
          G += s[j + 1];
          B += s[j + 2];
          c++;
        }
      }
      // blend 70% original 30% smoothed
      o[i] = s[i] * 0.7 + (R / c) * 0.3;
      o[i + 1] = s[i + 1] * 0.7 + (G / c) * 0.3;
      o[i + 2] = s[i + 2] * 0.7 + (B / c) * 0.3;
      o[i + 3] = s[i + 3];
    }
  }
  ctx.putImageData(out, 0, 0);
}

async function upscaleWithReplicate(
  file: File,
  opts: UpscaleOptions
): Promise<UpscaleResult> {
  const t0 = performance.now();
  opts.onProgress?.(0.1);
  const dataUrl = await fileToDataUrl(file);
  opts.onProgress?.(0.2);
  
  const response = await fetch('/api/upscale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: dataUrl,
      scale: opts.scale,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Replicate upscaling failed');
  }

  opts.onProgress?.(0.8);
  const { output } = await response.json();
  
  // API returns output as a URL string
  const resultUrl = output;

  // Load the result image to get dimensions
  const img = await loadImage(resultUrl);
  const processingMs = Math.round(performance.now() - t0);
  opts.onProgress?.(1);

  return {
    dataUrl: resultUrl,
    width: img.naturalWidth,
    height: img.naturalHeight,
    processingMs,
  };
}

export async function upscaleImage(
  file: File,
  opts: UpscaleOptions
): Promise<UpscaleResult> {
  if (opts.useReplicate) {
    return await upscaleWithReplicate(file, opts);
  }

  const t0 = performance.now();
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  opts.onProgress?.(0.1);

  const tw = Math.round(img.naturalWidth * opts.scale);
  const th = Math.round(img.naturalHeight * opts.scale);

  const canvas = drawScaled(img, img.naturalWidth, img.naturalHeight, tw, th);
  opts.onProgress?.(0.5);

  if (opts.denoise) {
    applyDenoise(canvas);
    opts.onProgress?.(0.65);
  }

  if (opts.enhance) {
    // radius scales with output size, amount moderate
    const radius = Math.max(1, Math.round(tw / 512));
    applyUnsharp(canvas, 0.6, radius);
    opts.onProgress?.(0.85);
  }

  opts.onProgress?.(0.95);

  const out = canvas.toDataURL('image/png');
  const processingMs = Math.round(performance.now() - t0);
  opts.onProgress?.(1);

  return { dataUrl: out, width: tw, height: th, processingMs };
}
