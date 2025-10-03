-- Create monthly billing cron job (runs 2am on 1st of each month)
SELECT cron.schedule(
  'monthly-billing',
  '0 2 1 * *',
  $$
  SELECT
    net.http_post(
        url:='https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/process-monthly-billing',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Create daily usage check cron job (runs 8am daily)
SELECT cron.schedule(
  'daily-usage-check',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/send-usage-alerts',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8"}'::jsonb,
        body:='{"alert_type": "daily_check"}'::jsonb
    ) as request_id;
  $$
);

-- Create weekly Vercel bandwidth monitoring (runs Monday 9am)
SELECT cron.schedule(
  'weekly-vercel-check',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
        url:='https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/vercel-usage-monitor',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);