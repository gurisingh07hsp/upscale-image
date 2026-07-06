import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});

export interface UpscaleRecord {
  id: string;
  title: string | null;
  original_url: string;
  upscaled_url: string;
  scale: number;
  width: number;
  height: number;
  out_width: number;
  out_height: number;
  enhance: boolean;
  processing_ms: number;
  created_at: string;
}
