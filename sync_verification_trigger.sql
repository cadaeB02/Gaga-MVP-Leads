-- =====================================================
-- v2.7: SYNC EMAIL VERIFICATION TO REQUESTERS TABLE
-- =====================================================

-- This function updates the is_verified status in the requesters table
-- whenever a user's email is confirmed in auth.users
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.requesters
        SET is_verified = TRUE,
            verification_status = 'verified'
        WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
    EXECUTE FUNCTION public.handle_email_confirmation();

-- For existing users who are already confirmed, let's sync them now
UPDATE public.requesters r
SET is_verified = TRUE,
    verification_status = 'verified'
FROM auth.users u
WHERE r.user_id = u.id
AND u.email_confirmed_at IS NOT NULL;
