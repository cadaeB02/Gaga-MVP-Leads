-- =====================================================
-- EXPORT ALL TABLE DEFINITIONS
-- Run this in Supabase SQL Editor
-- =====================================================

-- This will show you the complete structure of all 4 tables

-- =====================================================
-- TABLE 1: PROFILES
-- =====================================================
SELECT 
    'profiles' as table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- TABLE 2: CONTRACTORS
-- =====================================================
SELECT 
    'contractors' as table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'contractors'
ORDER BY ordinal_position;

-- =====================================================
-- TABLE 3: REQUESTERS
-- =====================================================
SELECT 
    'requesters' as table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'requesters'
ORDER BY ordinal_position;

-- =====================================================
-- TABLE 4: LEADS
-- =====================================================
SELECT 
    'leads' as table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;

-- =====================================================
-- BONUS: ALL FOREIGN KEY RELATIONSHIPS
-- =====================================================
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('profiles', 'contractors', 'requesters', 'leads')
ORDER BY tc.table_name;

-- =====================================================
-- SAMPLE DATA FROM EACH TABLE (to see what's stored)
-- =====================================================

-- Profiles sample
SELECT 'PROFILES SAMPLE:' as info;
SELECT * FROM profiles LIMIT 3;

-- Contractors sample
SELECT 'CONTRACTORS SAMPLE:' as info;
SELECT * FROM contractors LIMIT 3;

-- Requesters sample
SELECT 'REQUESTERS SAMPLE:' as info;
SELECT * FROM requesters LIMIT 3;

-- Leads sample
SELECT 'LEADS SAMPLE:' as info;
SELECT * FROM leads LIMIT 3;
