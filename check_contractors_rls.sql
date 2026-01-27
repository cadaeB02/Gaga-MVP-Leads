-- Check current RLS policies on contractors table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'contractors';

-- Check if there's an UPDATE policy that allows admins to update contractors
