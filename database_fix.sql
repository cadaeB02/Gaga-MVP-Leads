-- =====================================================
-- Fix RLS Policy Error for Contractor Signup
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Drop existing INSERT policy on profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 2. Create new INSERT policy that allows both service_role and authenticated users
CREATE POLICY "Allow profile creation during signup" ON public.profiles
    FOR INSERT 
    WITH CHECK (
        auth.uid() = id OR 
        auth.role() = 'service_role' OR
        auth.role() = 'authenticated'
    );

-- 3. Ensure anon users can also insert during the signup flow
-- This is needed because the user might not be fully authenticated yet
CREATE POLICY "Allow anon profile creation" ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.role() = 'anon');

-- 4. Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- =====================================================
-- Note: After running this script, test the signup flow
-- The RLS error should be resolved
-- =====================================================
