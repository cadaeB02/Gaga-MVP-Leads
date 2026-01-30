-- ==========================================
-- FINAL FIX: Auth Signup Trigger
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Ensure the referral_source column exists in profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- 2. Update the trigger function to include the required 'role' column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, trade_type, referral_source)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'requester'), -- Fallback to 'requester' if null
    NEW.raw_user_meta_data->>'trade_type',
    NEW.raw_user_meta_data->>'referral_source'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create the trigger (AFTER INSERT on auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Set Permissions
GRANT ALL ON public.profiles TO postgres, service_role;
