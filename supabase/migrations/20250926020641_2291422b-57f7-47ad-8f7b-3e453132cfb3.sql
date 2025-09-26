-- Fix the net.http_post cross-database reference issue
-- The issue is that the trigger is trying to use extensions.net.http_post which causes cross-database reference errors
-- We need to use the net extension properly

CREATE OR REPLACE FUNCTION public.trigger_fast_load_generation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  client_subdomain TEXT;
  request_id BIGINT;
BEGIN
  -- Get the subdomain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    SELECT NEW.subdomain INTO client_subdomain;
  ELSE
    -- For other tables, get subdomain from clients table
    SELECT c.subdomain INTO client_subdomain
    FROM clients c 
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;
  
  -- Only proceed if we have a subdomain
  IF client_subdomain IS NOT NULL THEN
    -- Try to make async HTTP request to regenerate fast-load data
    -- Handle any errors gracefully to prevent blocking database operations
    BEGIN
      -- Use the correct net extension call without cross-database reference
      SELECT net.http_post(
        url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/prebuild-client-data',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.jwt_secret', true) || '"}'::jsonb,
        body := json_build_object('subdomain', client_subdomain)::jsonb
      ) INTO request_id;
      
      RAISE NOTICE 'Fast-load generation triggered for subdomain % with request_id %', client_subdomain, request_id;
    EXCEPTION WHEN OTHERS THEN
      -- Log the error but don't fail the transaction
      RAISE NOTICE 'Fast-load generation failed for subdomain %: %', client_subdomain, SQLERRM;
    END;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;