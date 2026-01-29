-- Security: Refined Trade Matching & Lead Visibility for Phase 2
-- =====================================================

-- 1. HELPER FUNCTION FOR LICENSE MATCHING
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_license_match(contractor_trade TEXT, lead_trade TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    contractor_code TEXT;
    lead_code TEXT;
BEGIN
    -- If either is null, no match (except for unassigned leads which are handled by NULL check)
    IF contractor_trade IS NULL OR lead_trade IS NULL THEN RETURN FALSE; END IF;
    
    -- Exact match is easiest
    IF contractor_trade = lead_trade THEN RETURN TRUE; END IF;
    
    -- Parse codes (e.g. "C-10" from "C-10 (Electrical)")
    contractor_code := split_part(contractor_trade, ' ', 1);
    lead_code := split_part(lead_trade, ' ', 1);
    
    -- Class B (General Building) special handling
    -- Class B can take B, B-2, and standard leads that aren't purely specialty
    IF contractor_code = 'Class' AND contractor_trade ILIKE '%(B)%' THEN
        IF lead_code = 'Class' AND lead_trade ILIKE '%(B)%' THEN RETURN TRUE; END IF;
        IF lead_code = 'B-2' THEN RETURN TRUE; END IF;
    END IF;

    -- B-2 (Residential Remodeling)
    IF contractor_code = 'B-2' AND lead_code = 'B-2' THEN RETURN TRUE; END IF;

    -- Specialty matches (Exact code match)
    IF contractor_code = lead_code THEN RETURN TRUE; END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. UPDATE LEADS ACCESS POLICY
-- =====================================================
-- Goal: 
-- - Admins see everything.
-- - Contractors see leads specifically assigned to THEM.
-- - Contractors see Standard pool leads ONLY IF:
--     - They are verified
--     - They have an active subscription
--     - Their trade matches the lead's trade
DROP POLICY IF EXISTS "Leads access policy" ON public.leads;
DROP POLICY IF EXISTS "Contractors viewable leads" ON public.leads;

CREATE POLICY "Leads access policy" ON public.leads
FOR SELECT TO authenticated
USING (
    -- 1. Admin bypass
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    
    -- 2. Direct assignment (Manual Assignment)
    OR (visible_to_user_id = auth.uid())
    
    -- 3. Open Pool (Standard Tiers)
    OR (
        tier = 'standard' 
        AND status = 'OPEN'
        AND EXISTS (
            SELECT 1 FROM public.contractors 
            WHERE user_id = auth.uid() 
            AND verification_status = 'verified'
            AND subscription_status = 'active'
            AND is_license_match(trade_type, leads.trade_type)
        )
    )
);

-- 3. VERIFICATION
-- =====================================================
-- Run this to check if Cade (if he's a contractor) can see leads
-- SELECT * FROM leads; 
