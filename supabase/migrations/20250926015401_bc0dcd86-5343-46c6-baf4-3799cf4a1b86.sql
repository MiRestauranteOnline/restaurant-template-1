-- Fix security issues from previous migration

-- Drop extension from public and create in extensions schema
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Update function with proper search_path
CREATE OR REPLACE FUNCTION trigger_fast_load_generation()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions
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
    FROM clients c 
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;
  
  -- Only proceed if we have a subdomain
  IF client_subdomain IS NOT NULL THEN
    -- Make async HTTP request to regenerate fast-load data
    PERFORM extensions.net.http_post(
      url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/prebuild-client-data',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object('subdomain', client_subdomain)::jsonb
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Update debounced function with proper search_path
CREATE OR REPLACE FUNCTION debounced_fast_load_generation()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- Use pg_sleep to add a small delay and reduce rapid-fire triggers
  PERFORM pg_sleep(0.5);
  RETURN trigger_fast_load_generation();
END;
$$;