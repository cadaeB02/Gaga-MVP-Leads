-- =====================================================
-- RE-ENABLE RLS ON REQUESTERS TABLE
-- =====================================================

-- Re-enable RLS on requesters table
ALTER TABLE public.requesters ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can delete own profile" ON public.requesters;

-- =====================================================
-- POLICY 1: Allow INSERT during signup (authenticated or anon)
-- =====================================================
CREATE POLICY "Requesters can insert during signup"
ON public.requesters FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- =====================================================
-- POLICY 2: Requesters can view their own data
-- =====================================================
CREATE POLICY "Requesters can view own data"
ON public.requesters FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- POLICY 3: Requesters can update their own data
-- =====================================================
CREATE POLICY "Requesters can update own data"
ON public.requesters FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLICY 4: Requesters can delete their own data
-- =====================================================
CREATE POLICY "Requesters can delete own data"
ON public.requesters FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- ADMIN POLICIES: Allow admins to view/update all requesters
-- =====================================================
CREATE POLICY "Admins can view all requesters"
ON public.requesters FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can update all requesters"
ON public.requesters FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'requesters';
-- Should show rowsecurity = true

-- Test query (should only show your own data)
-- SELECT * FROM public.requesters;
