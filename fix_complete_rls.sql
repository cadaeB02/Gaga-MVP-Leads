-- =====================================================
-- COMPLETE RLS FIX FOR SIGNUP FLOW
-- =====================================================
-- This fixes both profiles AND requesters RLS policies
-- to allow signup without infinite recursion errors

-- =====================================================
-- PART 1: FIX PROFILES TABLE
-- =====================================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Allow profile creation during signup"
ON public.profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- =====================================================
-- PART 2: FIX REQUESTERS TABLE
-- =====================================================

-- Drop all existing policies on requesters
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can delete own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can insert during signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own data" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own data" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can delete own data" ON public.requesters;
DROP POLICY IF EXISTS "Admins can view all requesters" ON public.requesters;
DROP POLICY IF EXISTS "Admins can update all requesters" ON public.requesters;

-- Make sure RLS is enabled
ALTER TABLE public.requesters ENABLE ROW LEVEL SECURITY;

-- Create simple policies for requesters
CREATE POLICY "Allow requester creation during signup"
ON public.requesters FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Requesters can view own data"
ON public.requesters FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Requesters can update own data"
ON public.requesters FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- PART 3: VERIFY POLICIES
-- =====================================================

-- Check profiles policies
SELECT 'PROFILES POLICIES:' as info;
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Check requesters policies
SELECT 'REQUESTERS POLICIES:' as info;
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'requesters';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'requesters');
