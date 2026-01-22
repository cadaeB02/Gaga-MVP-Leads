# Setup Instructions for Test Contractors

## Overview
This guide will help you set up test contractor accounts to verify the login flow is working correctly.

## Step 1: Run Database Fix Script

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `Gaga-Leads-MVP`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `database_fix.sql` and paste into the editor
6. Click **Run** (or press Cmd+Enter)
7. You should see: "Success. No rows returned"

## Step 2: Create Test Auth Users

### Create Verified Test Contractor
1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Fill in:
   - **Email**: `testpro@example.com`
   - **Password**: `TestPassword123!`
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**
5. **IMPORTANT**: Copy the **User UID** (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
6. Save this UID somewhere - you'll need it in Step 3

### Create Pending Test Contractor
1. Click **Add user** > **Create new user** again
2. Fill in:
   - **Email**: `pending@example.com`
   - **Password**: `TestPassword123!`
   - **Auto Confirm User**: ✅ Check this box
3. Click **Create user**
4. **IMPORTANT**: Copy the **User UID**
5. Save this UID as well

## Step 3: Seed Test Data

1. Open the file `seed_test_data.sql` in your code editor
2. Find line 23: `verified_user_id UUID := 'YOUR-VERIFIED-USER-ID-HERE';`
3. Replace `'YOUR-VERIFIED-USER-ID-HERE'` with the UID from the first user (testpro@example.com)
   - Example: `verified_user_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';`
4. Find line 67: `pending_user_id UUID := 'YOUR-PENDING-USER-ID-HERE';`
5. Replace `'YOUR-PENDING-USER-ID-HERE'` with the UID from the second user (pending@example.com)
6. Save the file
7. Go back to Supabase **SQL Editor**
8. Create a **New Query**
9. Copy the ENTIRE contents of `seed_test_data.sql` (with your updated UUIDs) and paste it
10. Click **Run**
11. You should see a success message

## Step 4: Test the Login Flow

### Test Verified Contractor (Success Case)
1. Open your app: http://localhost:3000/login
2. Enter credentials:
   - Email: `testpro@example.com`
   - Password: `TestPassword123!`
3. Click **Log In**
4. ✅ **Expected**: You should be redirected to `/dashboard`
5. ✅ **Expected**: You should see 5 sample leads displayed
6. ✅ **Expected**: No "Pending" banner

### Test Pending Contractor (Pending Case)
1. Log out (or open incognito window)
2. Go to: http://localhost:3000/login
3. Enter credentials:
   - Email: `pending@example.com`
   - Password: `TestPassword123!`
4. Click **Log In**
5. ✅ **Expected**: You should be redirected to `/dashboard`
6. ⚠️ **Expected**: You should see a "Pending Verification" message
7. ✅ **Expected**: No leads shown (empty state)

### Test Signup with Validation
1. Go to: http://localhost:3000
2. Click **"I am a Pro"** toggle
3. Click **"Join as Contractor"**
4. Try to submit the form WITHOUT filling any fields
5. ✅ **Expected**: All required fields show **red borders** with specific error messages
6. Fill in the Name field only
7. Try to submit again
8. ✅ **Expected**: Name field is now normal, other fields still show red borders
9. Continue filling fields one by one to test validation

### Test Duplicate Email Prevention
1. On the signup form, enter email: `testpro@example.com`
2. Fill in all other required fields
3. Click **Submit Application**
4. ✅ **Expected**: Error message: "Account already exists. Please log in instead."
5. ✅ **Expected**: Link to `/login` page is shown

## Troubleshooting

### "RLS policy violation" error
- Make sure you ran `database_fix.sql` in Step 1
- Check that RLS policies were created by running this query in SQL Editor:
  ```sql
  SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
  ```

### "User not found" when logging in
- Make sure you created the auth users in Step 2
- Check that you checked "Auto Confirm User" when creating them

### No leads showing for verified contractor
- Make sure you replaced the UUIDs in `seed_test_data.sql` with the actual user IDs
- Run the verification query at the bottom of `seed_test_data.sql` to check if data was inserted

### Fields not showing red borders
- Make sure your browser cache is cleared
- Try hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## Next Steps

Once you've verified everything works:
1. You can create real contractor accounts using the signup flow
2. Admin can verify contractors manually in Supabase dashboard
3. Update contractor `license_status` to 'ACTIVE' to give them access to leads

## Questions?

If you run into any issues, check the browser console (F12) for error messages and let me know what you see!
