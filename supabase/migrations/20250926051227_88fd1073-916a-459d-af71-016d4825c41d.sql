-- Add title font weight field to client_settings table
ALTER TABLE public.client_settings 
ADD COLUMN title_font_weight text DEFAULT '400';