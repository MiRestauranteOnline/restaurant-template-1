-- Add sample delivery service data for demo client
UPDATE client_settings 
SET delivery_info = jsonb_build_object(
  'rappi', jsonb_build_object(
    'url', 'https://www.rappi.com/restaurantes/123456-demo-restaurant',
    'show_in_nav', true
  ),
  'pedidosya', jsonb_build_object(
    'url', 'https://www.pedidosya.com/restaurantes/demo-restaurant-123',
    'show_in_nav', true
  ),
  'didi', jsonb_build_object(
    'url', 'https://food.didiglobal.com/restaurant/demo-123',
    'show_in_nav', false
  )
)
WHERE client_id IN (SELECT id FROM clients WHERE subdomain = 'demo');