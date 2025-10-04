-- Add reviews section description field to admin_content table
ALTER TABLE public.admin_content 
ADD COLUMN reviews_section_description text DEFAULT 'Cada opinión refleja nuestro compromiso con la excelencia culinaria y el servicio excepcional.';