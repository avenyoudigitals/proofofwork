-- ================================================================
-- ProofForge — Works table
-- Run this in Supabase Dashboard → SQL Editor
-- ================================================================

CREATE TABLE IF NOT EXISTS public.works (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  role          TEXT        NOT NULL,
  company       TEXT,
  status        TEXT        NOT NULL DEFAULT 'self_claimed'
                            CHECK (status IN ('self_claimed', 'peer_verified', 'company_verified')),
  github_url    TEXT,
  figma_url     TEXT,
  live_url      TEXT,
  case_study_url TEXT,
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row-Level Security
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own works"   ON public.works;
DROP POLICY IF EXISTS "Users can insert own works" ON public.works;
DROP POLICY IF EXISTS "Users can update own works" ON public.works;
DROP POLICY IF EXISTS "Users can delete own works" ON public.works;

CREATE POLICY "Users can view own works"
  ON public.works FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own works"
  ON public.works FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own works"
  ON public.works FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own works"
  ON public.works FOR DELETE
  USING (auth.uid() = user_id);
