-- Drop existing triggers first
DROP TRIGGER IF EXISTS trg_fast_load_clients ON public.clients;
DROP TRIGGER IF EXISTS trg_fast_load_admin_content ON public.admin_content;
DROP TRIGGER IF EXISTS trg_fast_load_client_settings ON public.client_settings;
DROP TRIGGER IF EXISTS trg_fast_load_reviews ON public.reviews;

-- Create a base function that can be called directly
CREATE OR REPLACE FUNCTION public.generate_fast_load_data(client_subdomain TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
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
END;
$$;

-- Create trigger-specific function that calls the base function
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

  -- Call the base function
  PERFORM public.generate_fast_load_data(client_subdomain);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create debounced trigger function
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

-- Recreate triggers
CREATE TRIGGER trg_fast_load_clients
AFTER INSERT OR UPDATE OR DELETE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();

CREATE TRIGGER trg_fast_load_admin_content
AFTER INSERT OR UPDATE OR DELETE ON public.admin_content
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();

CREATE TRIGGER trg_fast_load_client_settings
AFTER INSERT OR UPDATE OR DELETE ON public.client_settings
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();

CREATE TRIGGER trg_fast_load_reviews
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.debounced_fast_load_generation();