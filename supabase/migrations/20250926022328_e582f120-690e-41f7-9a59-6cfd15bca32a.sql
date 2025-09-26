-- Clean up duplicate/old triggers first
DROP TRIGGER IF EXISTS trigger_clients_fast_load ON public.clients;
DROP TRIGGER IF EXISTS trigger_admin_content_fast_load ON public.admin_content;  
DROP TRIGGER IF EXISTS trigger_client_settings_fast_load ON public.client_settings;
DROP TRIGGER IF EXISTS trigger_reviews_fast_load ON public.reviews;

-- Test the function by manually calling it  
SELECT generate_fast_load_data('demos');

-- Also test with a small update to trigger the remaining triggers
UPDATE admin_content 
SET updated_at = now()
WHERE client_id = '9e530090-7ca0-435f-9c5f-08c921d4ebb4';