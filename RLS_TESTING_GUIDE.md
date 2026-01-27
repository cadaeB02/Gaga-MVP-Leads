# Quick RLS Testing Guide

After running `enable_production_rls.sql`, follow these steps to verify everything works:

## 🧪 Test 1: Requester Signup (Most Critical)

1. **Clear any test data** (optional but recommended):
   - Go to Supabase → Table Editor → `requesters` table
   - Delete any test requester accounts

2. **Test signup**:
   - Go to `http://localhost:3000`
   - Click "Request Leads"
   - Fill out the form with NEW test data:
     - Service Type: Any option
     - Name: Test User RLS
     - Email: `test-rls-{timestamp}@example.com`
     - Phone: (555) 123-4567
     - Zip: 80301
     - Description: Testing RLS policies
     - Password: TestPassword123!
     - Confirm Password: TestPassword123!
     - ✅ Check Terms
   - Click "Get Your Free Quote"

3. **Expected Result**:
   - ✅ Form submits successfully
   - ✅ No RLS policy errors
   - ✅ Redirected to success page or dashboard
   - ✅ New requester appears in Supabase `requesters` table
   - ✅ New work order appears in `work_orders` table

4. **If you get an error**:
   - Screenshot the error
   - Check Supabase logs
   - Report back

---

## 🧪 Test 2: Contractor Signup

1. **Test signup**:
   - Go to `http://localhost:3000/join`
   - Fill out contractor form
   - Submit

2. **Expected Result**:
   - ✅ Signup succeeds
   - ✅ Redirected to "Pending Approval" page
   - ✅ New contractor in `contractors` table

---

## 🧪 Test 3: Admin Access

1. **Verify admin can see all data**:
   - Log in as admin at `http://localhost:3000/admin`
   - Check that you can see:
     - All requesters
     - All contractors
     - All work orders

---

## ✅ Success Criteria

All three tests pass without RLS errors = **Ready for production!** 🚀

## ❌ If Tests Fail

Report:
1. Which test failed
2. The exact error message
3. Screenshot if possible

I'll help you fix it immediately!
