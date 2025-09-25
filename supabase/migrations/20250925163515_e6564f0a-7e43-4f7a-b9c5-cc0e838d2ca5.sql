-- Add header background settings to client_settings table
ALTER TABLE public.client_settings 
ADD COLUMN IF NOT EXISTS header_background_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS header_background_style text DEFAULT 'dark' CHECK (header_background_style IN ('dark', 'bright'));