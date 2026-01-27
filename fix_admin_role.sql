-- First, revert the policy back to the original (it was correct)
DROP POLICY IF EXISTS "Admins update contractors" ON contractors;

CREATE POLICY "Admins update contractors"
ON contractors
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Now check if your admin account actually has role='admin'
SELECT id, email, role FROM profiles;

-- If your account doesn't have role='admin', run this to fix it:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
