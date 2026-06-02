-- ================================================================
-- ProofForge — Admin Portals Schema Additions
-- Run this in Supabase Dashboard → SQL Editor
-- ================================================================

-- Track which company portal verified a work (prevents double-approval)
ALTER TABLE public.works
  ADD COLUMN IF NOT EXISTS verified_by_company TEXT;

-- Per-portal rejection log
-- A rejection by one company does NOT block the other company from approving.
-- This table records which portal declined which work and why.
CREATE TABLE IF NOT EXISTS public.admin_rejections (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id      UUID        REFERENCES public.works(id) ON DELETE CASCADE NOT NULL,
  portal_slug  TEXT        NOT NULL,
  admin_note   TEXT,
  rejected_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (work_id, portal_slug)   -- one rejection record per portal per work
);

-- Service role bypasses RLS automatically.
ALTER TABLE public.admin_rejections ENABLE ROW LEVEL SECURITY;

-- Indexes for fast lookups in the admin portal
CREATE INDEX IF NOT EXISTS idx_works_verified_by ON public.works (verified_by_company);
CREATE INDEX IF NOT EXISTS idx_works_status      ON public.works (status);
CREATE INDEX IF NOT EXISTS idx_admin_rej_work    ON public.admin_rejections (work_id);
CREATE INDEX IF NOT EXISTS idx_admin_rej_portal  ON public.admin_rejections (portal_slug);
