-- Add visibility toggle fields for homepage sections
ALTER TABLE admin_content
ADD COLUMN homepage_about_section_visible boolean DEFAULT true,
ADD COLUMN homepage_about_stats_visible boolean DEFAULT true,
ADD COLUMN homepage_menu_section_visible boolean DEFAULT true,
ADD COLUMN homepage_services_section_visible boolean DEFAULT true,
ADD COLUMN homepage_reservations_section_visible boolean DEFAULT true,
ADD COLUMN homepage_reviews_section_visible boolean DEFAULT true,
ADD COLUMN homepage_contact_section_visible boolean DEFAULT true,
ADD COLUMN homepage_contact_map_visible boolean DEFAULT true,

-- Add visibility toggle fields for about page sections
ADD COLUMN about_page_about_section_visible boolean DEFAULT true,
ADD COLUMN about_page_about_stats_visible boolean DEFAULT true,
ADD COLUMN about_page_stats_section_visible boolean DEFAULT true,
ADD COLUMN about_page_team_section_visible boolean DEFAULT true,

-- Add visibility toggle fields for contact page sections
ADD COLUMN contact_page_contact_section_visible boolean DEFAULT true,
ADD COLUMN contact_page_map_visible boolean DEFAULT true;