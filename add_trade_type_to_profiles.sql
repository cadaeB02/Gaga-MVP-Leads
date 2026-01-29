-- Add trade_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trade_type TEXT;

-- Index for better searching
CREATE INDEX IF NOT EXISTS idx_profiles_trade_type ON public.profiles(trade_type);

-- Verification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'trade_type';
