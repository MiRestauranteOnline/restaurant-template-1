-- Update some menu items to show on homepage (max 8)
UPDATE menu_items 
SET show_on_homepage = true, show_image_home = true
WHERE client_id IN (SELECT id FROM clients WHERE subdomain = 'demo')
AND name IN (
  'Pasta Suprema con Trufa',
  'Lomo de Res Premium', 
  'Plato del Océano',
  'Decadencia de Chocolate'
)
AND id IN (
  -- Get only the first occurrence of each duplicate
  SELECT DISTINCT ON (name) id 
  FROM menu_items 
  WHERE client_id IN (SELECT id FROM clients WHERE subdomain = 'demo')
  AND name IN ('Pasta Suprema con Trufa', 'Lomo de Res Premium', 'Plato del Océano', 'Decadencia de Chocolate')
  ORDER BY name, created_at
);