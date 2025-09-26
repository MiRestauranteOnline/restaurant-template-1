-- Rename subdomain column to domain in clients table
ALTER TABLE public.clients RENAME COLUMN subdomain TO domain;

-- Drop the old function first and recreate with new parameter name
DROP FUNCTION IF EXISTS public.generate_fast_load_data(text);

-- Create the new function with updated parameter name
CREATE OR REPLACE FUNCTION public.generate_fast_load_data(client_domain text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  IF client_domain IS NOT NULL THEN
    BEGIN
      -- Public edge function, no JWT required (verify_jwt = false)
      PERFORM net.http_post(
        url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/prebuild-client-data',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object('subdomain', client_domain)
      );
      RAISE NOTICE 'Fast-load generation queued for domain %', client_domain;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Fast-load generation failed for domain %: %', client_domain, SQLERRM;
    END;
  END IF;
END;
$function$;

-- Update the trigger function to use domain instead of subdomain
CREATE OR REPLACE FUNCTION public.trigger_fast_load_generation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  client_domain TEXT;
BEGIN
  -- Determine domain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    client_domain := COALESCE(NEW.domain, OLD.domain);
  ELSE
    SELECT c.domain INTO client_domain
    FROM public.clients c 
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;

  -- Call the base function
  PERFORM public.generate_fast_load_data(client_domain);

  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update the debounced trigger function to use domain instead of subdomain
CREATE OR REPLACE FUNCTION public.debounced_fast_load_generation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  client_domain TEXT;
BEGIN
  -- Determine domain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    client_domain := COALESCE(NEW.domain, OLD.domain);
  ELSE
    SELECT c.domain INTO client_domain
    FROM public.clients c 
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;

  -- Debounce
  PERFORM pg_sleep(0.5);

  -- Call the base function (safe to call directly)
  PERFORM public.generate_fast_load_data(client_domain);

  RETURN COALESCE(NEW, OLD);
END;
$function$;