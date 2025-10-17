-- Add hero overlay opacity control to client_settings
ALTER TABLE public.client_settings
ADD COLUMN hero_overlay_opacity integer DEFAULT 70 CHECK (hero_overlay_opacity >= 0 AND hero_overlay_opacity <= 100);

COMMENT ON COLUMN public.client_settings.hero_overlay_opacity IS 'Hero overlay opacity percentage (0-100). 0 = no overlay, 100 = solid';