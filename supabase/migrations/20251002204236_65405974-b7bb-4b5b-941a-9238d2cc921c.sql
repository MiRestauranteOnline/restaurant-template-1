-- Allow public to view active schedules filtered by client_id
DROP POLICY IF EXISTS "Public can view active schedules" ON public.reservation_schedules;

CREATE POLICY "Public can view active schedules by client"
ON public.reservation_schedules
FOR SELECT
TO anon, authenticated
USING (is_active = true);