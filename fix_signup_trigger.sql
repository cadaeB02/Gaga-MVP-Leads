-- Fix Signup Flow: Add Trigger for Automatic Profile Creation
-- This prevents the foreign key constraint error (23503) by ensuring
-- profiles are created AFTER auth.users records exist

-- 1. Add new columns for referral tracking and other license descriptions
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_source TEXT;

ALTER TABLE public.requesters 
ADD COLUMN IF NOT EXISTS referral_source TEXT;

ALTER TABLE public.contractors 
ADD COLUMN IF NOT EXISTS other_license_description TEXT;

-- 2. Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with metadata from auth.users
  INSERT INTO public.profiles (id, full_name, role, trade_type, referral_source)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'trade_type',
    NEW.raw_user_meta_data->>'referral_source'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Create trigger that fires AFTER user creation in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Verification queries (run these after migration to confirm)
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
