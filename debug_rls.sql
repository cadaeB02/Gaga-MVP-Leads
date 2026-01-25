-- =====================================================
-- DEBUG: Check RLS Status and All Policies
-- =====================================================

-- 1. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'requesters';

-- 2. Check ALL policies on requesters table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'requesters';

-- 3. Check table owner
SELECT tableowner 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'requesters';

-- 4. Try to disable and re-enable RLS
ALTER TABLE public.requesters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.requesters ENABLE ROW LEVEL SECURITY;

-- 5. Force recreate the INSERT policy
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;

CREATE POLICY "Allow requester signup"
ON public.requesters
FOR INSERT
WITH CHECK (true);  -- No role restriction, no auth check

-- 6. Verify again
SELECT policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'requesters' AND cmd = 'INSERT';
