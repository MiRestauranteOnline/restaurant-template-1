-- Enable pg_net extension for HTTP requests from triggers
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to trigger fast-load data generation
CREATE OR REPLACE FUNCTION trigger_fast_load_generation()
RETURNS TRIGGER AS $$
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
    PERFORM net.http_post(
      url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/prebuild-client-data',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object('subdomain', client_subdomain)::jsonb
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for all relevant tables
CREATE OR REPLACE TRIGGER trigger_clients_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

CREATE OR REPLACE TRIGGER trigger_admin_content_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON admin_content
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

CREATE OR REPLACE TRIGGER trigger_client_settings_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON client_settings
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

CREATE OR REPLACE TRIGGER trigger_reviews_fast_load
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_fast_load_generation();

-- Add a small delay to prevent too many rapid calls
CREATE OR REPLACE FUNCTION debounced_fast_load_generation()
RETURNS TRIGGER AS $$
BEGIN
  -- Use pg_sleep to add a small delay and reduce rapid-fire triggers
  PERFORM pg_sleep(0.5);
  RETURN trigger_fast_load_generation();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;