-- supabase/scripts/setup/create-user-email-log-table.sql
-- Create user_email_log table to track sent emails and prevent duplicates.
-- This table is used by the /api/email/send route.

-- ================================
-- 1. CREATE USER_EMAIL_LOG TABLE
-- ================================
CREATE TABLE IF NOT EXISTS public.user_email_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate emails of the same type to the same user
    CONSTRAINT unique_user_email_type UNIQUE (user_id, email_type)
);

-- ================================
-- 2. CREATE INDEXES
-- ================================
CREATE INDEX IF NOT EXISTS idx_user_email_log_user_id ON public.user_email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_email_log_email_type ON public.user_email_log(email_type);
CREATE INDEX IF NOT EXISTS idx_user_email_log_status ON public.user_email_log(status);

-- ================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ================================
ALTER TABLE public.user_email_log ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role can manage email logs"
    ON public.user_email_log
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Users can read their own email logs (optional)
CREATE POLICY "Users can read own email logs"
    ON public.user_email_log
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- ================================
-- 4. ADD COMMENTS
-- ================================
COMMENT ON TABLE public.user_email_log IS 'Tracks all transactional emails sent to users for auditing and deduplication';
COMMENT ON COLUMN public.user_email_log.email_type IS 'Type of email: welcome, billing_confirmation, cancellation, etc.';
COMMENT ON COLUMN public.user_email_log.status IS 'Status: pending, sent, failed';

-- ================================
-- 5. VERIFY TABLE CREATED
-- ================================
SELECT 
    'user_email_log table created' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_email_log'
ORDER BY ordinal_position;

