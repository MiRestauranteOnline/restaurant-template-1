-- Add layout_type field to client_settings table
ALTER TABLE public.client_settings 
ADD COLUMN layout_type text DEFAULT 'layout1' CHECK (layout_type IN ('layout1', 'layout2', 'layout3', 'layout4'));