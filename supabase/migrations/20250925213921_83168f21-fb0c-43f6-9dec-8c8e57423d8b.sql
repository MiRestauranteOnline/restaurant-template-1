-- Add homepage about section image field
ALTER TABLE public.admin_content 
ADD COLUMN IF NOT EXISTS homepage_about_section_image_url text DEFAULT '/src/assets/restaurant-interior.jpg';