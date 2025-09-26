-- Fix: debounced trigger should not call a trigger function directly
CREATE OR REPLACE FUNCTION public.debounced_fast_load_generation()
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

  -- Debounce
  PERFORM pg_sleep(0.5);

  -- Call the base function (safe to call directly)
  PERFORM public.generate_fast_load_data(client_subdomain);

  RETURN COALESCE(NEW, OLD);
END;
$$;