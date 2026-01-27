-- =====================================================
-- CHECK AUTH CONFIGURATION
-- =====================================================
-- This will show you what auth providers are enabled

-- Check auth config
SELECT 
    key,
    value
FROM auth.config
WHERE key IN ('enable_signup', 'email_provider_enabled', 'email_confirm_required');

-- If the above doesn't work, try this:
-- Check if email provider is enabled in your project settings
-- (This might not return results if it's a dashboard-only setting)
