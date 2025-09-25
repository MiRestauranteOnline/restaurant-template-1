-- Add admin content structure to clients table for customizable website content
-- This extends the other_customizations JSONB field to include standardized content fields

-- Update existing clients to have the proper admin_content structure if they don't have it
UPDATE public.clients 
SET other_customizations = COALESCE(other_customizations, '{}'::jsonb) || '{
  "admin_content": {
    "hero": {
      "title": null,
      "description": null,
      "background_image_url": null,
      "right_button_text": "Reservar Mesa",
      "right_button_link": "#contact"
    },
    "menu_section": {
      "title": "Nuestro Menú",
      "description": "Descubre nuestra selección de platos cuidadosamente elaborados"
    },
    "delivery_section": {
      "title": "Delivery Partners",
      "description": "Ordena desde la comodidad de tu hogar"
    },
    "contact_section": {
      "title": "Reserva Tu Experiencia",
      "description": "Contáctanos para reservar tu mesa y vivir una experiencia gastronómica única",
      "hide_reservation_box": false
    },
    "about_section": {
      "title": "Nuestra Historia",
      "description": null
    },
    "services_section": {
      "title": "Nuestros Servicios",
      "description": null
    }
  }
}'::jsonb
WHERE other_customizations->>'admin_content' IS NULL;