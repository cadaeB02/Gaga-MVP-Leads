-- =====================================================
-- Add Terms of Service Acceptance Tracking
-- =====================================================

-- Add tos_accepted_at to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tos_accepted_at TIMESTAMP WITH TIME ZONE;

-- Add tos_accepted_at to contractors table
ALTER TABLE public.contractors
ADD COLUMN IF NOT EXISTS tos_accepted_at TIMESTAMP WITH TIME ZONE;

-- Add tos_accepted_at to requesters table
ALTER TABLE public.requesters
ADD COLUMN IF NOT EXISTS tos_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create index for querying users who haven't accepted TOS
CREATE INDEX IF NOT EXISTS idx_profiles_tos_accepted ON public.profiles(tos_accepted_at);
CREATE INDEX IF NOT EXISTS idx_contractors_tos_accepted ON public.contractors(tos_accepted_at);
CREATE INDEX IF NOT EXISTS idx_requesters_tos_accepted ON public.requesters(tos_accepted_at);

-- =====================================================
-- Verification
-- =====================================================

-- Check if columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'contractors', 'requesters') 
AND column_name = 'tos_accepted_at'
ORDER BY table_name;
