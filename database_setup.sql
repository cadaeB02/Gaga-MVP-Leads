-- =====================================================
-- GC Ventures - Database Schema Setup
-- Run these scripts in Supabase SQL Editor
-- =====================================================

-- 1. CREATE PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'contractor', 'admin')),
    phone TEXT,
    zip_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- 2. UPDATE CONTRACTORS TABLE
-- =====================================================
-- Add new columns to existing contractors table
ALTER TABLE public.contractors 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'PENDING' CHECK (license_status IN ('PENDING', 'ACTIVE', 'REJECTED'));

-- Update existing license_number column if it doesn't have NOT NULL constraint
-- Note: If this fails, it means you already have the column set up correctly
ALTER TABLE public.contractors 
ALTER COLUMN license_number SET NOT NULL;

-- Add RLS policies for contractors
CREATE POLICY "Contractors can view own record" ON public.contractors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow contractor signup" ON public.contractors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all contractors" ON public.contractors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update contractors" ON public.contractors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );


-- 3. UPDATE LEADS TABLE
-- =====================================================
-- Add new columns to existing leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS service_category TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MATCHED', 'CLOSED')),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Note: We're keeping job_description as is, not renaming to description
-- The form already uses job_description


-- 4. CREATE ADMIN USER (OPTIONAL)
-- =====================================================
-- After creating your admin account through Supabase Auth,
-- run this to set your role to admin:
-- 
-- INSERT INTO public.profiles (id, role, phone, zip_code)
-- VALUES ('YOUR-USER-ID-HERE', 'admin', 'YOUR-PHONE', 'YOUR-ZIP')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
--
-- Replace 'YOUR-USER-ID-HERE' with your actual auth.users.id


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Check if tables were created successfully:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'contractors', 'leads');

-- Check profiles structure:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check contractors structure:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contractors';

-- Check leads structure:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads';
