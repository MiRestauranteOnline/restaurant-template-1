-- Add new fields to client_settings for menu button controls and WhatsApp popup
ALTER TABLE public.client_settings 
ADD COLUMN hide_whatsapp_button_menu boolean DEFAULT false,
ADD COLUMN hide_phone_button_menu boolean DEFAULT false,
ADD COLUMN custom_cta_button_link text,
ADD COLUMN custom_cta_button_text text,
ADD COLUMN show_whatsapp_popup boolean DEFAULT false;