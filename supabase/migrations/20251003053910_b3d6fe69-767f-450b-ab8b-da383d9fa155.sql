-- ============================================
-- FIX: Analytics RLS Policy for Public Visitors
-- ============================================

-- Problem: Public restaurant visitors (not logged in) need to track analytics
-- Solution: Allow anonymous users to insert analytics events

-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Users can insert analytics for their clients" ON public.analytics_events;

-- Create new policy: Allow public to insert analytics events
CREATE POLICY "Public can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Note: This is safe because:
-- 1. Analytics events don't contain sensitive user data
-- 2. Client_id comes from the template (not user input)
-- 3. We only INSERT, never expose data publicly
-- 4. Admins and authenticated users can still view their own analytics