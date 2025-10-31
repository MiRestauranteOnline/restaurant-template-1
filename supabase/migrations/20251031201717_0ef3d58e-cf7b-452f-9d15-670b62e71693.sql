-- Create function to trigger prerender regeneration
CREATE OR REPLACE FUNCTION public.trigger_prerender_regeneration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  client_subdomain TEXT;
BEGIN
  -- Get the subdomain for the affected client
  IF TG_TABLE_NAME = 'clients' THEN
    client_subdomain := COALESCE(NEW.subdomain, OLD.subdomain);
  ELSE
    SELECT c.subdomain INTO client_subdomain
    FROM public.clients c
    WHERE c.id = COALESCE(NEW.client_id, OLD.client_id);
  END IF;

  IF client_subdomain IS NOT NULL THEN
    BEGIN
      -- Call the edge function to regenerate pre-renders
      PERFORM net.http_post(
        url := 'https://ptzcetvcccnojdbzzlyt.supabase.co/functions/v1/generate-prerender',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object('domain', client_subdomain)
      );
      RAISE NOTICE 'Pre-render regeneration triggered for domain %', client_subdomain;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Pre-render regeneration failed for domain %: %', client_subdomain, SQLERRM;
    END;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for automatic pre-render regeneration
DROP TRIGGER IF EXISTS trigger_prerender_on_menu_items ON public.menu_items;
CREATE TRIGGER trigger_prerender_on_menu_items
AFTER INSERT OR UPDATE OR DELETE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.trigger_prerender_regeneration();

DROP TRIGGER IF EXISTS trigger_prerender_on_admin_content ON public.admin_content;
CREATE TRIGGER trigger_prerender_on_admin_content
AFTER INSERT OR UPDATE ON public.admin_content
FOR EACH ROW
EXECUTE FUNCTION public.trigger_prerender_regeneration();

DROP TRIGGER IF EXISTS trigger_prerender_on_client_settings ON public.client_settings;
CREATE TRIGGER trigger_prerender_on_client_settings
AFTER INSERT OR UPDATE ON public.client_settings
FOR EACH ROW
EXECUTE FUNCTION public.trigger_prerender_regeneration();

DROP TRIGGER IF EXISTS trigger_prerender_on_reviews ON public.reviews;
CREATE TRIGGER trigger_prerender_on_reviews
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.trigger_prerender_regeneration();

DROP TRIGGER IF EXISTS trigger_prerender_on_clients ON public.clients;
CREATE TRIGGER trigger_prerender_on_clients
AFTER UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.trigger_prerender_regeneration();