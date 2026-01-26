-- =====================================================
-- FIX INFINITE RECURSION IN PROFILES RLS POLICIES
-- =====================================================

-- The error "infinite recursion detected in policy for relation 'profiles'"
-- happens when RLS policies reference themselves in a circular way.

-- STEP 1: Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- STEP 2: Create simple, non-recursive policies

-- Allow INSERT during signup (authenticated or anon)
CREATE POLICY "Allow profile creation during signup"
ON public.profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow users to view their own profile (simple, no recursion)
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Allow users to update their own profile (simple, no recursion)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- IMPORTANT: Do NOT create admin policies that query profiles table
-- This causes infinite recursion!

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
