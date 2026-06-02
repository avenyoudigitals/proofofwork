-- Add assigned_to column for round-robin assignment
ALTER TABLE public.works
  ADD COLUMN IF NOT EXISTS assigned_to TEXT CHECK (assigned_to IN ('nextovate', 'ax-ventures'));

-- Index for fast portal filtering
CREATE INDEX IF NOT EXISTS idx_works_assigned_to ON public.works (assigned_to);

-- Backfill existing works with alternating assignment
UPDATE public.works
SET assigned_to = CASE
  WHEN ROW_NUMBER() OVER (ORDER BY created_at) % 2 = 1 THEN 'nextovate'
  ELSE 'ax-ventures'
END
WHERE assigned_to IS NULL;
