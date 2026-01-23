-- =====================================================
-- Create Requesters Table
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create requesters table
CREATE TABLE IF NOT EXISTS public.requesters (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Future verification fields (not used yet)
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified'
    government_id_url TEXT
);

-- Add requester_id to leads table to link work orders to requesters
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS requester_id INTEGER REFERENCES public.requesters(id);

-- Update profiles table role check (if it has a constraint)
-- This allows 'requester' as a valid role value
-- Note: If there's no constraint, this is just documentation

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on requesters table
ALTER TABLE public.requesters ENABLE ROW LEVEL SECURITY;

-- Requesters can view their own profile
CREATE POLICY "Requesters can view own profile"
ON public.requesters
FOR SELECT
USING (auth.uid() = user_id);

-- Requesters can update their own profile
CREATE POLICY "Requesters can update own profile"
ON public.requesters
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow insert for new requester signups
CREATE POLICY "Allow requester signup"
ON public.requesters
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update leads RLS to allow requesters to view their own work orders
CREATE POLICY "Requesters can view own work orders"
ON public.leads
FOR SELECT
USING (requester_id IN (
    SELECT id FROM public.requesters WHERE user_id = auth.uid()
));

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_requesters_user_id ON public.requesters(user_id);
CREATE INDEX IF NOT EXISTS idx_requesters_email ON public.requesters(email);
CREATE INDEX IF NOT EXISTS idx_leads_requester_id ON public.leads(requester_id);

-- =====================================================
-- Verification
-- =====================================================
-- Check if table was created:
SELECT * FROM public.requesters LIMIT 1;

-- Check if column was added to leads:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'requester_id';
