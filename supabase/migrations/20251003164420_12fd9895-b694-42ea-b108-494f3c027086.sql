-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule monthly billing to run at 2am on the 1st of each month
SELECT cron.schedule(
  'monthly-billing-process',
  '0 2 1 * *', -- 2am on 1st of each month
  $$
  SELECT net.http_post(
    url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/process-monthly-billing',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);