-- Fix security issues from previous migration

-- Drop and recreate functions with proper search_path
DROP FUNCTION IF EXISTS trigger_fast_load_generation() CASCADE;
DROP FUNCTION IF EXISTS debounced_fast_load_generation() CASCADE;

-- Create function with proper security settings
CREATE OR REPLACE FUNCTION trigger_fast_load_generation()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  client_subdomain TEXT;
BEGIN
  -- Get the subdomain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    SELECT NEW.subdomain INTO client_subdomain;
  ELSE
    -- For other tables, get subdomain from clients table
    SELECT c.subdomain INTO client_subdomain
    FROM public.clients c 
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;
  
  -- Only proceed if we have a subdomain
  IF client_subdomain IS NOT NULL THEN
    -- Make async HTTP request to regenerate fast-load data
    PERFORM net.http_post(
      url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/prebuild-client-data',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object('subdomain', client_subdomain)::jsonb
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recreate triggers for all relevant tables
DROP TRIGGER IF EXISTS trigger_clients_fast_load ON clients;
DROP TRIGGER IF EXISTS trigger_admin_content_fast_load ON admin_content;
DROP TRIGGER IF EXISTS trigger_client_settings_fast_load ON client_settings;
DROP TRIGGER IF EXISTS trigger_reviews_fast_load ON reviews;

CREATE TRIGGER trigger_clients_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

CREATE TRIGGER trigger_admin_content_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_content
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

CREATE TRIGGER trigger_client_settings_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON public.client_settings
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

CREATE TRIGGER trigger_reviews_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();