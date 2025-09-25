-- Add field to control text color on primary buttons
ALTER TABLE public.client_settings 
ADD COLUMN primary_button_text_style text DEFAULT 'bright' CHECK (primary_button_text_style IN ('bright', 'dark'));