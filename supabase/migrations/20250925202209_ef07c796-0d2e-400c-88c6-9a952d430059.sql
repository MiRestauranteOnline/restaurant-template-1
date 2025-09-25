-- Add separate fields for two-part titles across all pages
ALTER TABLE admin_content 
ADD COLUMN homepage_hero_title_first_line text,
ADD COLUMN homepage_hero_title_second_line text,
ADD COLUMN about_page_hero_title_first_line text,
ADD COLUMN about_page_hero_title_second_line text,
ADD COLUMN contact_page_hero_title_first_line text,
ADD COLUMN contact_page_hero_title_second_line text,
ADD COLUMN menu_page_hero_title_first_line text,
ADD COLUMN menu_page_hero_title_second_line text,
ADD COLUMN reviews_page_hero_title_first_line text,
ADD COLUMN reviews_page_hero_title_second_line text;

-- Set default values for better UX
UPDATE admin_content SET 
homepage_hero_title_first_line = 'Excelencia',
homepage_hero_title_second_line = 'Culinaria',
about_page_hero_title_first_line = 'Nuestra',
about_page_hero_title_second_line = 'Historia',
contact_page_hero_title_first_line = 'Contáctanos',
contact_page_hero_title_second_line = '',
menu_page_hero_title_first_line = 'Nuestro',
menu_page_hero_title_second_line = 'Menú',
reviews_page_hero_title_first_line = 'Testimonios',
reviews_page_hero_title_second_line = ''
WHERE homepage_hero_title_first_line IS NULL;