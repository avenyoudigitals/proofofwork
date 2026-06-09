-- ================================================================
-- ProofForge — Assignment fix (run this in Supabase SQL Editor)
-- 1. Re-balances ALL existing works by created_at order
-- 2. Installs a monotonic counter so future assignments never skew
-- ================================================================

-- ── STEP 1: Rebalance existing works ─────────────────────────────
-- Uses a CTE with ROW_NUMBER (the correct PostgreSQL pattern for
-- UPDATE ... with window functions).
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM public.works
)
UPDATE public.works w
SET assigned_to = CASE
  WHEN ranked.rn % 2 = 1 THEN 'nextovate'
  ELSE 'ax-ventures'
END
FROM ranked
WHERE w.id = ranked.id;

-- ── STEP 2: Ensure the serial counter table exists ────────────────
CREATE TABLE IF NOT EXISTS public.work_serial (
  id      INT    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  counter BIGINT NOT NULL DEFAULT 0
);

INSERT INTO public.work_serial (id, counter)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Seed the counter to current work count so future parity continues
-- correctly from where the existing works left off.
UPDATE public.work_serial
SET counter = (SELECT COUNT(*) FROM public.works)
WHERE id = 1;

-- ── STEP 3: Create / replace the RPC ─────────────────────────────
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

GRANT EXECUTE ON FUNCTION public.next_work_serial() TO authenticated;
