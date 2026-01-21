-- supabase/scripts/testing/cleanup-test-user.sql
-- Cleanup script for test user: shenseanchen.dev@gmail.com
-- Run this before each signup test to ensure clean state.
--
-- This script handles all tables in the launch-mvp-demo schema:
-- - subscriptions (references public.users)
-- - user_preferences (references auth.users)
-- - user_trials (references auth.users)
-- - user_email_log (references auth.users) - tracks sent emails
-- - public.users (references auth.users)
-- - auth.users (main user record)
--
-- SAFETY: This script ONLY affects the specific test email address.

DO $$
DECLARE
    test_email TEXT := 'shenseanchen.dev@gmail.com';
    test_user_id UUID;
    deletion_count INTEGER;
BEGIN
    -- Get user ID from auth.users
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = test_email;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE '✅ Test user not found - nothing to clean up';
        RETURN;
    END IF;
    
    RAISE NOTICE '🧹 Starting cleanup for: % (ID: %)', test_email, test_user_id;
    RAISE NOTICE '─────────────────────────────────────────────────';
    
    -- 1. Delete subscriptions (references public.users.id)
    DELETE FROM public.subscriptions WHERE user_id = test_user_id;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;
    IF deletion_count > 0 THEN
        RAISE NOTICE '  ✓ Deleted % subscription record(s)', deletion_count;
    END IF;
    
    -- 2. Delete user preferences (references auth.users.id)
    DELETE FROM public.user_preferences WHERE user_id = test_user_id;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;
    IF deletion_count > 0 THEN
        RAISE NOTICE '  ✓ Deleted % user_preferences record(s)', deletion_count;
    END IF;
    
    -- 3. Delete user trials (references auth.users.id)
    DELETE FROM public.user_trials WHERE user_id = test_user_id;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;
    IF deletion_count > 0 THEN
        RAISE NOTICE '  ✓ Deleted % user_trials record(s)', deletion_count;
    END IF;
    
    -- 4. Delete email logs (references auth.users.id)
    -- Also delete by email address to catch any orphaned records
    DELETE FROM public.user_email_log 
    WHERE user_id = test_user_id OR email_address = test_email;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;
    IF deletion_count > 0 THEN
        RAISE NOTICE '  ✓ Deleted % user_email_log record(s)', deletion_count;
    END IF;
    
    -- 5. Delete from public.users (references auth.users.id)
    DELETE FROM public.users WHERE id = test_user_id;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;
    IF deletion_count > 0 THEN
        RAISE NOTICE '  ✓ Deleted % public.users record(s)', deletion_count;
    END IF;
    
    -- 6. Finally, delete from auth.users
    DELETE FROM auth.users WHERE id = test_user_id;
    GET DIAGNOSTICS deletion_count = ROW_COUNT;
    IF deletion_count > 0 THEN
        RAISE NOTICE '  ✓ Deleted % auth.users record(s)', deletion_count;
    END IF;
    
    RAISE NOTICE '─────────────────────────────────────────────────';
    RAISE NOTICE '✅ Cleanup completed for: %', test_email;
    
END $$;

-- ============================================================================
-- VERIFICATION: Check if test user was successfully removed
-- ============================================================================

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'shenseanchen.dev@gmail.com')
        THEN '❌ WARNING: Test user still exists!'
        ELSE '✅ SUCCESS: Test user completely removed - ready for testing!'
    END as cleanup_status;

-- Optional: Show recent users (to confirm cleanup)
-- Uncomment if you want to see remaining users
/*
SELECT 
    email, 
    created_at,
    'Recent user' as status
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
*/

