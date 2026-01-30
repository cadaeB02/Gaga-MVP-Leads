-- =====================================================
-- FINAL SIGNUP FLOW FIX
-- This script aligns the database schema with the frontend 
-- and re-installs the trigger for automatic profile creation.
-- =====================================================

-- 1. Ensure all columns exist in 'profiles' table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS trade_type TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- 2. Update role constraint to allow 'requester'
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (
    role = 'contractor' OR 
    role = 'admin' OR 
    role = 'requester' OR
    role = 'customer'
);

-- 3. Re-install user creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with metadata from auth.users
  -- Uses COALESCE to avoid errors if some metadata is missing
  INSERT INTO public.profiles (id, full_name, role, trade_type, referral_source)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'requester'),
    NEW.raw_user_meta_data->>'trade_type',
    NEW.raw_user_meta_data->>'referral_source'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-install trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Final Permission Check
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
