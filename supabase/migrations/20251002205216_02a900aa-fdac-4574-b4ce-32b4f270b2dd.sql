-- Restrict user-managed policy to authenticated to avoid anon needing access to user_clients
DROP POLICY IF EXISTS "Users can manage their client schedules" ON public.reservation_schedules;

CREATE POLICY "Users can manage their client schedules"
ON public.reservation_schedules
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT uc.client_id FROM public.user_clients uc WHERE uc.user_id = auth.uid()
  )
)
WITH CHECK (
  client_id IN (
    SELECT uc.client_id FROM public.user_clients uc WHERE uc.user_id = auth.uid()
  )
);

-- Ensure public read remains open for active schedules
DROP POLICY IF EXISTS "Public can view active schedules by client" ON public.reservation_schedules;
CREATE POLICY "Public can view active schedules by client"
ON public.reservation_schedules
FOR SELECT
TO anon, authenticated
USING (is_active = true);