-- =====================================================
-- UPDATE SUPABASE EMAIL REDIRECT URL
-- =====================================================

-- This is a reminder to update the Supabase email template redirect URL
-- You need to do this manually in the Supabase Dashboard

-- Steps:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Authentication → Email Templates
-- 3. Find "Confirm signup" template
-- 4. Update the redirect URL to: {{ .SiteURL }}/auth/confirm
-- 5. Save the template

-- The confirmation link will now redirect to:
-- https://your-domain.com/auth/confirm
-- Instead of the default error page

-- Note: The {{ .ConfirmationURL }} variable already includes the token,
-- so the full URL will be:
-- https://your-domain.com/auth/confirm?token=...&type=signup
