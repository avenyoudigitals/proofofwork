-- ================================================================
-- ProofForge — Monotonic serial counter for round-robin assignment
-- Run this in Supabase Dashboard → SQL Editor
-- ================================================================

-- 1. Create the counter table
CREATE TABLE IF NOT EXISTS public.work_serial (
  id      INT  PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- singleton row
  counter BIGINT NOT NULL DEFAULT 0
);

-- Seed the singleton row
INSERT INTO public.work_serial (id, counter)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Seed counter to match however many works already exist,
-- so existing assignment parity is preserved going forward.
UPDATE public.work_serial
SET counter = (SELECT COUNT(*) FROM public.works);

-- 2. RPC: atomically increment and return the new value
CREATE OR REPLACE FUNCTION public.next_work_serial()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next BIGINT;
BEGIN
  UPDATE public.work_serial
  SET counter = counter + 1
  WHERE id = 1
  RETURNING counter INTO v_next;
  RETURN v_next;
END;
$$;

-- 3. Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.next_work_serial() TO authenticated;
