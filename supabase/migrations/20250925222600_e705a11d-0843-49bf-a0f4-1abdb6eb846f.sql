-- Add About page about section image field and backfill with current image
ALTER TABLE public.admin_content 
ADD COLUMN IF NOT EXISTS about_page_about_section_image_url text;

-- Backfill existing rows with the current image path used in the About section
UPDATE public.admin_content 
SET about_page_about_section_image_url = '/src/assets/restaurant-interior.jpg'
WHERE about_page_about_section_image_url IS NULL;

-- Set default for future rows
ALTER TABLE public.admin_content 
ALTER COLUMN about_page_about_section_image_url SET DEFAULT '/src/assets/restaurant-interior.jpg';