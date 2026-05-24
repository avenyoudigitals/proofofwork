-- ================================================================
-- ProofForge — Verification Requests table
-- Run this in Supabase Dashboard → SQL Editor
-- ================================================================

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id       UUID        REFERENCES public.works(id) ON DELETE CASCADE NOT NULL,
  token         TEXT        UNIQUE NOT NULL,
  company_email TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Service role bypasses RLS automatically.
-- Enable RLS so anon/authenticated users cannot access tokens directly.
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
