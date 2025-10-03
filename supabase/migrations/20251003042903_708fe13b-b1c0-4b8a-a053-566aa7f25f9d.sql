-- Add triggers to regenerate fast-load cache automatically when data changes
-- Using debounced version to prevent excessive regenerations

-- Trigger for client_settings (fonts, colors, layout changes)
DROP TRIGGER IF EXISTS trigger_fastload_on_client_settings_update ON public.client_settings;
CREATE TRIGGER trigger_fastload_on_client_settings_update
  AFTER UPDATE ON public.client_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Trigger for admin_content (hero text, section titles, descriptions)
DROP TRIGGER IF EXISTS trigger_fastload_on_admin_content_update ON public.admin_content;
CREATE TRIGGER trigger_fastload_on_admin_content_update
  AFTER UPDATE ON public.admin_content
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Trigger for clients (restaurant name, contact info, opening hours)
DROP TRIGGER IF EXISTS trigger_fastload_on_clients_update ON public.clients;
CREATE TRIGGER trigger_fastload_on_clients_update
  AFTER UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Triggers for menu_items (menu changes)
DROP TRIGGER IF EXISTS trigger_fastload_on_menu_items_insert ON public.menu_items;
CREATE TRIGGER trigger_fastload_on_menu_items_insert
  AFTER INSERT ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_menu_items_update ON public.menu_items;
CREATE TRIGGER trigger_fastload_on_menu_items_update
  AFTER UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_menu_items_delete ON public.menu_items;
CREATE TRIGGER trigger_fastload_on_menu_items_delete
  AFTER DELETE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Triggers for menu_categories (category changes)
DROP TRIGGER IF EXISTS trigger_fastload_on_menu_categories_insert ON public.menu_categories;
CREATE TRIGGER trigger_fastload_on_menu_categories_insert
  AFTER INSERT ON public.menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_menu_categories_update ON public.menu_categories;
CREATE TRIGGER trigger_fastload_on_menu_categories_update
  AFTER UPDATE ON public.menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_menu_categories_delete ON public.menu_categories;
CREATE TRIGGER trigger_fastload_on_menu_categories_delete
  AFTER DELETE ON public.menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Triggers for reviews (review changes)
DROP TRIGGER IF EXISTS trigger_fastload_on_reviews_insert ON public.reviews;
CREATE TRIGGER trigger_fastload_on_reviews_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_reviews_update ON public.reviews;
CREATE TRIGGER trigger_fastload_on_reviews_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_reviews_delete ON public.reviews;
CREATE TRIGGER trigger_fastload_on_reviews_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

-- Triggers for carousel_images (image carousel changes)
DROP TRIGGER IF EXISTS trigger_fastload_on_carousel_images_insert ON public.carousel_images;
CREATE TRIGGER trigger_fastload_on_carousel_images_insert
  AFTER INSERT ON public.carousel_images
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_carousel_images_update ON public.carousel_images;
CREATE TRIGGER trigger_fastload_on_carousel_images_update
  AFTER UPDATE ON public.carousel_images
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();

DROP TRIGGER IF EXISTS trigger_fastload_on_carousel_images_delete ON public.carousel_images;
CREATE TRIGGER trigger_fastload_on_carousel_images_delete
  AFTER DELETE ON public.carousel_images
  FOR EACH ROW
  EXECUTE FUNCTION public.debounced_fast_load_generation();