-- Get the client ID for menu items
WITH demo_client AS (
  SELECT id FROM public.clients WHERE subdomain = 'demo'
)
-- Insert demo menu items
INSERT INTO public.menu_items (
  client_id,
  name,
  description,
  price,
  category,
  is_active
) 
SELECT 
  demo_client.id,
  item.name,
  item.description,
  item.price,
  item.category,
  true
FROM demo_client,
(VALUES 
  ('Pasta Suprema con Trufa', 'Pasta artesanal con láminas de trufa negra, hongos silvestres y salsa cremosa de parmesano', 65.00, 'Especialidad'),
  ('Lomo de Res Premium', 'Corte premium con romero, ajo confitado y vegetales de temporada', 85.00, 'Plato Principal'),
  ('Plato del Océano', 'Langosta fresca, ostras y mariscos de temporada con mignonette cítrica', 95.00, 'Mariscos'),
  ('Decadencia de Chocolate', 'Soufflé de chocolate negro con hoja de oro y helado de vainilla', 28.00, 'Postre'),
  ('Ensalada Mediterránea', 'Mix de lechugas, tomates cherry, aceitunas, queso feta y vinagreta de hierbas', 32.00, 'Entrada'),
  ('Risotto de Hongos', 'Arroz arborio cremoso con hongos porcini y trufa blanca', 58.00, 'Especialidad')
) AS item(name, description, price, category)
ON CONFLICT DO NOTHING;

-- Insert demo client settings
WITH demo_client AS (
  SELECT id FROM public.clients WHERE subdomain = 'demo'
)
INSERT INTO public.client_settings (
  client_id,
  whatsapp_messages,
  delivery_info,
  other_customizations
)
SELECT 
  demo_client.id,
  '{
    "reservation": "Hola, me gustaría hacer una reserva para [fecha] a las [hora] para [número de personas] personas.",
    "delivery": "Hola, me gustaría hacer un pedido de delivery."
  }',
  '{
    "delivery_areas": ["Miraflores", "San Isidro", "Barranco", "Surco"],
    "delivery_fee": 10,
    "min_order": 50
  }',
  '{
    "theme": "elegant",
    "features": ["reservations", "delivery", "whatsapp"]
  }'
FROM demo_client
ON CONFLICT (client_id) DO UPDATE SET
  whatsapp_messages = EXCLUDED.whatsapp_messages,
  delivery_info = EXCLUDED.delivery_info,
  other_customizations = EXCLUDED.other_customizations,
  updated_at = now();