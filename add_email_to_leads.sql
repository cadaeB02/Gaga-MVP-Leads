-- =====================================================
-- ADD MISSING EMAIL COLUMN TO LEADS TABLE
-- =====================================================

-- Add email column to leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS email TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'email';
