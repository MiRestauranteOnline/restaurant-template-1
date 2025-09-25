-- Add missing other_customizations column to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS other_customizations JSONB DEFAULT '{}';

-- Insert demo client data for testing
INSERT INTO public.clients (
  subdomain,
  restaurant_name,
  phone,
  email,
  whatsapp,
  address,
  opening_hours,
  social_media_links,
  brand_colors,
  other_customizations
) VALUES (
  'demo',
  'Savoria',
  '+51 987 654 321',
  'info@savoria.com',
  '51987654321',
  'Av. Larco 123, Miraflores, Lima',
  '{
    "weekdays": {"open": "12:00 PM", "close": "10:00 PM"},
    "weekend": {"open": "12:00 PM", "close": "11:00 PM"},
    "sunday": {"open": "12:00 PM", "close": "9:00 PM"}
  }',
  '{
    "instagram": "https://instagram.com/savoria",
    "facebook": "https://facebook.com/savoria",
    "twitter": "https://twitter.com/savoria"
  }',
  '{
    "primary": "#8B5CF6",
    "secondary": "#10B981",
    "accent": "#F59E0B"
  }',
  '{
    "hero_title": "Excelencia\nCulinaria",
    "hero_description": "Experimenta lo mejor de la gastronomía contemporánea con nuestros platos cuidadosamente elaborados y un servicio impecable en un ambiente de elegancia refinada.",
    "currency": "S/"
  }'
) ON CONFLICT (subdomain) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  address = EXCLUDED.address,
  opening_hours = EXCLUDED.opening_hours,
  social_media_links = EXCLUDED.social_media_links,
  brand_colors = EXCLUDED.brand_colors,
  other_customizations = EXCLUDED.other_customizations,
  updated_at = now();