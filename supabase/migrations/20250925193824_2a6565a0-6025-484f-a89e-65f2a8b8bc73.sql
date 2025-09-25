-- Create admin_content table for all customizable website content
CREATE TABLE public.admin_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Homepage content
  homepage_hero_title TEXT,
  homepage_hero_description TEXT,
  homepage_hero_background_url TEXT,
  homepage_hero_right_button_text TEXT DEFAULT 'Reservar Mesa',
  homepage_hero_right_button_link TEXT DEFAULT '#contact',
  
  homepage_menu_section_title TEXT DEFAULT 'Nuestro Menú',
  homepage_menu_section_description TEXT DEFAULT 'Descubre nuestra selección de platos cuidadosamente elaborados',
  
  homepage_delivery_section_title TEXT DEFAULT 'Delivery Partners',
  homepage_delivery_section_description TEXT DEFAULT 'Ordena desde la comodidad de tu hogar',
  
  homepage_contact_section_title TEXT DEFAULT 'Reserva Tu Experiencia',
  homepage_contact_section_description TEXT DEFAULT 'Contáctanos para reservar tu mesa y vivir una experiencia gastronómica única',
  homepage_contact_hide_reservation_box BOOLEAN DEFAULT FALSE,
  
  homepage_about_section_title TEXT DEFAULT 'Nuestra Historia',
  homepage_about_section_description TEXT,
  
  homepage_services_section_title TEXT DEFAULT 'Nuestros Servicios',
  homepage_services_section_description TEXT,
  
  -- About page content
  about_page_hero_title TEXT DEFAULT 'Nuestra Historia',
  about_page_hero_description TEXT DEFAULT 'Conoce la pasión y tradición detrás de cada plato',
  about_page_hero_background_url TEXT,
  about_page_content JSONB DEFAULT '{}',
  
  -- Contact page content  
  contact_page_hero_title TEXT DEFAULT 'Contáctanos',
  contact_page_hero_description TEXT DEFAULT 'Estamos aquí para hacer de tu experiencia algo inolvidable',
  contact_page_hero_background_url TEXT,
  
  -- Menu page content
  menu_page_hero_title TEXT DEFAULT 'Nuestro Menú',
  menu_page_hero_description TEXT DEFAULT 'Explora nuestra carta completa de especialidades culinarias',
  menu_page_hero_background_url TEXT,
  
  -- Reviews page content
  reviews_page_hero_title TEXT DEFAULT 'Testimonios',
  reviews_page_hero_description TEXT DEFAULT 'Lo que nuestros clientes dicen sobre nosotros',
  reviews_page_hero_background_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view admin content" 
ON public.admin_content 
FOR SELECT 
USING (true);

CREATE POLICY "Users can view their client admin content" 
ON public.admin_content 
FOR SELECT 
USING (client_id IN (
  SELECT user_clients.client_id
  FROM user_clients
  WHERE user_clients.user_id = auth.uid()
));

CREATE POLICY "Users can manage their client admin content" 
ON public.admin_content 
FOR ALL 
USING (client_id IN (
  SELECT user_clients.client_id
  FROM user_clients
  WHERE user_clients.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all admin content" 
ON public.admin_content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_content_updated_at
BEFORE UPDATE ON public.admin_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin content for existing clients
INSERT INTO public.admin_content (client_id)
SELECT id FROM public.clients
ON CONFLICT DO NOTHING;