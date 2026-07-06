/*
# Create upscale_history table (single-tenant, no auth)

1. New Tables
- `upscale_history`
  - `id` (uuid, primary key)
  - `title` (text, optional label for the image)
  - `original_url` (text, data URL of the source image)
  - `upscaled_url` (text, data URL of the upscaled result)
  - `scale` (integer, upscale factor e.g. 2 or 4)
  - `width` (integer, original width in px)
  - `height` (integer, original height in px)
  - `out_width` (integer, output width in px)
  - `out_height` (integer, output height in px)
  - `enhance` (boolean, whether face/detail enhancement was applied)
  - `processing_ms` (integer, processing time in milliseconds)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `upscale_history`.
- Allow anon + authenticated full CRUD because the data is intentionally
  shared/public (no sign-in screen in this app).

3. Notes
- This is a single-tenant app with no authentication. The anon-key client
  must be able to read and write its own history, so policies are scoped
  to `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.
- Image data is stored as data URLs (base64) in text columns to avoid
  requiring Storage bucket setup.
*/

CREATE TABLE IF NOT EXISTS upscale_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  original_url text NOT NULL,
  upscaled_url text NOT NULL,
  scale integer NOT NULL DEFAULT 2,
  width integer NOT NULL DEFAULT 0,
  height integer NOT NULL DEFAULT 0,
  out_width integer NOT NULL DEFAULT 0,
  out_height integer NOT NULL DEFAULT 0,
  enhance boolean NOT NULL DEFAULT false,
  processing_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE upscale_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_history" ON upscale_history;
CREATE POLICY "anon_select_history" ON upscale_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_history" ON upscale_history;
CREATE POLICY "anon_insert_history" ON upscale_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_history" ON upscale_history;
CREATE POLICY "anon_update_history" ON upscale_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_history" ON upscale_history;
CREATE POLICY "anon_delete_history" ON upscale_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_upscale_history_created_at
  ON upscale_history (created_at DESC);
