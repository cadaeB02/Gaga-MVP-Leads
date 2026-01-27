-- ============================================
-- PRODUCTION RLS POLICIES (CORRECTED)
-- Enable Row Level Security for Production
-- ============================================
-- This script enables RLS with proper policies for:
-- 1. Requesters table (customer data protection)
-- 2. Leads table (project/work order data protection)
-- 3. Profiles table (user data protection)
-- 4. Contractors table (contractor data protection)

-- ============================================
-- REQUESTERS TABLE
-- ============================================

-- Enable RLS
ALTER TABLE public.requesters ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters view own data" ON public.requesters;
DROP POLICY IF EXISTS "Requesters update own data" ON public.requesters;
DROP POLICY IF EXISTS "Admins view all requesters" ON public.requesters;

-- Policy 1: Allow signup (INSERT) - Anyone can create a requester account
CREATE POLICY "Allow requester signup"
ON public.requesters
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Policy 2: Requesters can view their own data
CREATE POLICY "Requesters view own data"
ON public.requesters
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 3: Requesters can update their own data
CREATE POLICY "Requesters update own data"
ON public.requesters
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 4: Admins can view all requesters
CREATE POLICY "Admins view all requesters"
ON public.requesters
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- LEADS TABLE (Work Orders/Projects)
-- ============================================

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Requesters can view own work orders" ON public.leads;
DROP POLICY IF EXISTS "Requesters view own leads" ON public.leads;
DROP POLICY IF EXISTS "Requesters create leads" ON public.leads;
DROP POLICY IF EXISTS "Requesters update own leads" ON public.leads;
DROP POLICY IF EXISTS "Contractors view assigned leads" ON public.leads;
DROP POLICY IF EXISTS "Admins view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins manage all leads" ON public.leads;

-- Policy 1: Requesters can view their own leads
CREATE POLICY "Requesters view own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  requester_id IN (
    SELECT id FROM public.requesters WHERE user_id = auth.uid()
  )
);

-- Policy 2: Requesters can create leads
CREATE POLICY "Requesters create leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  requester_id IN (
    SELECT id FROM public.requesters WHERE user_id = auth.uid()
  )
);

-- Policy 3: Requesters can update their own leads
CREATE POLICY "Requesters update own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  requester_id IN (
    SELECT id FROM public.requesters WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  requester_id IN (
    SELECT id FROM public.requesters WHERE user_id = auth.uid()
  )
);

-- Policy 4: Contractors can view leads matching their trade type (only if verified)
CREATE POLICY "Contractors view assigned leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  trade_type IN (
    SELECT trade_type FROM public.contractors 
    WHERE user_id = auth.uid() 
    AND insurance_verified = true 
    AND license_status = 'ACTIVE'
  )
);

-- Policy 5: Admins can view all leads
CREATE POLICY "Admins view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy 6: Admins can manage all leads
CREATE POLICY "Admins manage all leads"
ON public.leads
FOR ALL
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

-- ============================================
-- PROFILES TABLE
-- ============================================

-- Enable RLS (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;

-- Policy 1: Users can view their own profile
CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 2: Users can update their own profile
CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy 3: Allow profile creation during signup
CREATE POLICY "Allow profile creation"
ON public.profiles
FOR INSERT
TO authenticated, anon
WITH CHECK (id = auth.uid() OR auth.uid() IS NULL);

-- ============================================
-- CONTRACTORS TABLE
-- ============================================

-- Enable RLS
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Contractors view own data" ON public.contractors;
DROP POLICY IF EXISTS "Contractors update own data" ON public.contractors;
DROP POLICY IF EXISTS "Allow contractor signup" ON public.contractors;
DROP POLICY IF EXISTS "Admins view all contractors" ON public.contractors;
DROP POLICY IF EXISTS "Admins update contractors" ON public.contractors;

-- Policy 1: Contractors can view their own data
CREATE POLICY "Contractors view own data"
ON public.contractors
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Contractors can update their own data
CREATE POLICY "Contractors update own data"
ON public.contractors
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 3: Allow contractor signup
CREATE POLICY "Allow contractor signup"
ON public.contractors
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Policy 4: Admins can view all contractors
CREATE POLICY "Admins view all contractors"
ON public.contractors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy 5: Admins can update contractors (for verification)
CREATE POLICY "Admins update contractors"
ON public.contractors
FOR UPDATE
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

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('requesters', 'leads', 'profiles', 'contractors')
ORDER BY tablename;

-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('requesters', 'leads', 'profiles', 'contractors')
ORDER BY tablename, policyname;
