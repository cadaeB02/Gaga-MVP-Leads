-- =====================================================
-- SIMPLE RLS FIX - RUN THIS INSTEAD
-- =====================================================
-- This version won't error if policies already exist

-- =====================================================
-- PART 1: FIX REQUESTERS TABLE (the main issue)
-- =====================================================

-- Drop existing requester policies
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can delete own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can insert during signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own data" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own data" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can delete own data" ON public.requesters;
DROP POLICY IF EXISTS "Allow requester creation during signup" ON public.requesters;

-- Make sure RLS is enabled
ALTER TABLE public.requesters ENABLE ROW LEVEL SECURITY;

-- Create new policies for requesters
CREATE POLICY "Allow requester signup"
ON public.requesters FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Requesters view own data"
ON public.requesters FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Requesters update own data"
ON public.requesters FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- VERIFY IT WORKED
-- =====================================================

SELECT 'REQUESTERS POLICIES:' as info;
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'requesters';
