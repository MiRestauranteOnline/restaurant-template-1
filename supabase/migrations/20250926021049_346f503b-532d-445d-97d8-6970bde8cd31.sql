-- Ensure pg_net is available in the proper schema
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Recreate helper functions with correct search_path and safe error handling
CREATE OR REPLACE FUNCTION public.trigger_fast_load_generation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  client_subdomain TEXT;
BEGIN
  -- Determine subdomain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    client_subdomain := COALESCE(NEW.subdomain, OLD.subdomain);
  ELSE
    SELECT c.subdomain INTO client_subdomain
    FROM public.clients c 
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;

  IF client_subdomain IS NOT NULL THEN
    BEGIN
      -- Public edge function, no JWT required (verify_jwt = false)
      PERFORM net.http_post(
        url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/prebuild-client-data',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object('subdomain', client_subdomain)
      );
      RAISE NOTICE 'Fast-load generation queued for subdomain %', client_subdomain;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Fast-load generation failed for subdomain %: %', client_subdomain, SQLERRM;
    END;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.debounced_fast_load_generation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  -- Light debounce to avoid rapid-fire calls
  PERFORM pg_sleep(0.5);
  RETURN trigger_fast_load_generation();
END;
$$;

-- Attach triggers to all relevant tables (drop if exist first to avoid duplication)
DROP TRIGGER IF EXISTS trg_fast_load_clients ON public.clients;
CREATE TRIGGER trg_fast_load_clients
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trg_fast_load_admin_content ON public.admin_content;
CREATE TRIGGER trg_fast_load_admin_content
AFTER INSERT OR UPDATE OR DELETE ON public.admin_content
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trg_fast_load_client_settings ON public.client_settings;
CREATE TRIGGER trg_fast_load_client_settings
AFTER INSERT OR UPDATE OR DELETE ON public.client_settings
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trg_fast_load_reviews ON public.reviews;
CREATE TRIGGER trg_fast_load_reviews
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();