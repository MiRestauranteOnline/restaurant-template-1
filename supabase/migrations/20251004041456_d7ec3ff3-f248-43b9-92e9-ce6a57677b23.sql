-- Create triggers for fast-load data regeneration
-- These triggers ensure that when clients update their data, the fast-load cache regenerates automatically

-- Trigger for clients table (restaurant info, theme, colors, contact)
CREATE TRIGGER trigger_clients_fast_load_update
  AFTER UPDATE ON public.clients
  FOR EACH ROW
  WHEN (
    OLD.restaurant_name IS DISTINCT FROM NEW.restaurant_name OR
    OLD.phone IS DISTINCT FROM NEW.phone OR
    OLD.whatsapp IS DISTINCT FROM NEW.whatsapp OR
    OLD.theme IS DISTINCT FROM NEW.theme OR
    OLD.subdomain IS DISTINCT FROM NEW.subdomain OR
    OLD.domain IS DISTINCT FROM NEW.domain
  )
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Trigger for admin_content table (all hero content, logos, descriptions)
CREATE TRIGGER trigger_admin_content_fast_load_update
  AFTER UPDATE ON public.admin_content
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

CREATE TRIGGER trigger_admin_content_fast_load_insert
  AFTER INSERT ON public.admin_content
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Trigger for client_settings table (colors, fonts, header, button styles)
CREATE TRIGGER trigger_client_settings_fast_load_update
  AFTER UPDATE ON public.client_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

CREATE TRIGGER trigger_client_settings_fast_load_insert
  AFTER INSERT ON public.client_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Trigger for reviews table (affects has_reviews flag)
CREATE TRIGGER trigger_reviews_fast_load_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

CREATE TRIGGER trigger_reviews_fast_load_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();