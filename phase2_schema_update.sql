-- =====================================================
-- Phase 2: The Monetization & Handshake Schema Update
-- =====================================================

-- 1. UPDATE PROFILES TABLE
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lead_credits INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS beta_opt_in BOOLEAN DEFAULT FALSE;

-- 2. UPDATE LEADS TABLE
-- Note: status update to include 'CLAIMED' and 'MATCHED' (Matched is already there)
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS work_started TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_relead BOOLEAN DEFAULT FALSE;

-- 3. ENSURE STATUS CONSTRAINT IS UP TO DATE
-- We want: OPEN, ASSIGNED, CLAIMED, MATCHED, CLOSED
-- Drop and recreate the constraint if needed (might vary by previous setup)
DO $$ 
BEGIN
    ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
    ALTER TABLE public.leads ADD CONSTRAINT leads_status_check 
    CHECK (status IN ('OPEN', 'ASSIGNED', 'CLAIMED', 'MATCHED', 'CLOSED'));
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 4. RLS UPDATES FOR PHASE 2
-- Ensure contractors can only see leads assigned to them or the open pool
-- (They already have this from v3.2, but good to verify)
DROP POLICY IF EXISTS "Contractors view assigned leads" ON public.leads;
CREATE POLICY "Contractors view assigned leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  (visible_to_user_id = auth.uid()) OR 
  (visible_to_user_id IS NULL AND trade_type IN (
    SELECT trade_type FROM public.contractors 
    WHERE user_id = auth.uid() 
    AND insurance_verified = true 
    AND license_status = 'ACTIVE'
  ))
);

-- Policy to allow update of leads assigned to them (for revealing/claiming)
DROP POLICY IF EXISTS "Contractors can claim assigned leads" ON public.leads;
CREATE POLICY "Contractors can claim assigned leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (visible_to_user_id = auth.uid())
WITH CHECK (visible_to_user_id = auth.uid());
