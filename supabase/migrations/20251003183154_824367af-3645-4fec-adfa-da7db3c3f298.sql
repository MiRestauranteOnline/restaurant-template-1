-- Create cron job to run daily analytics processing every day at 2 AM
SELECT cron.schedule(
  'process-daily-analytics',
  '0 2 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/process-daily-analytics',
        headers:='{"Content-Type": "application/json"}'::jsonb,
        body:=jsonb_build_object('date', (CURRENT_DATE - 1)::text)
    ) as request_id;
  $$
);

-- Create helper function to increment client usage
CREATE OR REPLACE FUNCTION public.increment_client_usage(
  p_client_id UUID,
  p_bandwidth_gb NUMERIC DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.client_monthly_usage (
    client_id,
    month,
    total_visits,
    total_bandwidth_gb
  )
  VALUES (
    p_client_id,
    DATE_TRUNC('month', CURRENT_DATE),
    1,
    p_bandwidth_gb
  )
  ON CONFLICT (client_id, month)
  DO UPDATE SET
    total_visits = client_monthly_usage.total_visits + 1,
    total_bandwidth_gb = client_monthly_usage.total_bandwidth_gb + p_bandwidth_gb,
    updated_at = now();
END;
$$;