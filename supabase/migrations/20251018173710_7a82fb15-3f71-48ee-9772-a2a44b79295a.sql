-- Add visibility toggles for FAQ and Delivery sections
ALTER TABLE public.admin_content 
ADD COLUMN IF NOT EXISTS homepage_faq_section_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS homepage_delivery_section_visible BOOLEAN DEFAULT true;