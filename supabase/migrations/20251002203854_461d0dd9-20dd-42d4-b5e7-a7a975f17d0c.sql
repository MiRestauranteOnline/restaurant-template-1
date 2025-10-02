-- Public read access for site content (RLS still applies)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON TABLE public.clients TO anon, authenticated;
GRANT SELECT ON TABLE public.admin_content TO anon, authenticated;
GRANT SELECT ON TABLE public.client_settings TO anon, authenticated;
GRANT SELECT ON TABLE public.menu_items TO anon, authenticated;
GRANT SELECT ON TABLE public.menu_categories TO anon, authenticated;
GRANT SELECT ON TABLE public.reviews TO anon, authenticated;
GRANT SELECT ON TABLE public.reservation_schedules TO anon, authenticated;