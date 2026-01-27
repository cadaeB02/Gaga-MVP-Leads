-- Fix RLS policy to allow admin updates on contractors table
-- This allows the admin to verify contractors through the admin page

-- First, check if there's already an UPDATE policy for admins
-- If not, we'll create one

-- Drop existing admin update policy if it exists
DROP POLICY IF EXISTS "Admins can update contractors" ON contractors;

-- Create new policy that allows admins to update contractors
CREATE POLICY "Admins can update contractors"
ON contractors
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'contractors' AND cmd = 'UPDATE';
