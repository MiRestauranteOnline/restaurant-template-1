-- Add font fields to client_settings table
ALTER TABLE public.client_settings 
ADD COLUMN title_font text DEFAULT 'Cormorant Garamond',
ADD COLUMN body_font text DEFAULT 'Inter';