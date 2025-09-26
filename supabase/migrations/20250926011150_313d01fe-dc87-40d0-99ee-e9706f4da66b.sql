-- Add footer text field and logo fields to admin_content table
ALTER TABLE admin_content 
ADD COLUMN footer_description text DEFAULT 'Experimenta la excelencia culinaria en un ambiente de elegancia refinada. Cada comida está elaborada con pasión y los mejores ingredientes.'::text,
ADD COLUMN header_logo_url text,
ADD COLUMN footer_logo_url text;