-- =====================================================
-- Phase 2: RLS Update for Scarcity Model
-- =====================================================

-- This script updates the "Leads" table RLS policies to enforce the 
-- Scarcity model, where contractors ONLY see leads assigned to them.

-- 1. DROP THE OLD TRADE-TYPE BASED POLICY
DROP POLICY IF EXISTS "Contractors view assigned leads" ON public.leads;

-- 2. CREATE THE NEW ASSIGNMENT-BASED POLICY
-- This policy allows a contractor to view a lead ONLY IF:
-- a) The lead's visible_to_user_id matches their own auth.uid()
-- b) They are a verified contractor in the system
CREATE POLICY "Contractors view assigned leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  visible_to_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.contractors
    WHERE user_id = auth.uid()
    AND verification_status = 'verified'
  )
);

-- 3. ENSURE CONTRACTORS CAN UPDATE ASSIGNED LEADS (For Handshake/Reveal)
DROP POLICY IF EXISTS "Contractors update assigned leads" ON public.leads;

CREATE POLICY "Contractors update assigned leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  visible_to_user_id = auth.uid()
)
WITH CHECK (
  visible_to_user_id = auth.uid()
);

-- 4. VERIFY POLICIES
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'leads';
