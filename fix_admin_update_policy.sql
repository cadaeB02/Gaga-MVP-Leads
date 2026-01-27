-- Fix the admin update policy - it's using the wrong column name
-- It should check profiles.user_id, not profiles.id

-- Drop the incorrect policy
DROP POLICY IF EXISTS "Admins update contractors" ON contractors;

-- Create the corrected policy
CREATE POLICY "Admins update contractors"
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

-- Verify the fix
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'contractors' AND policyname = 'Admins update contractors';
