-- Add navigation label fields to admin_content table
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS navigation_home_label text DEFAULT 'Inicio';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS navigation_about_label text DEFAULT 'Nosotros';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS navigation_menu_label text DEFAULT 'Menú';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS navigation_contact_label text DEFAULT 'Contacto';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS navigation_reviews_label text DEFAULT 'Testimonios';

-- Add generic section label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS our_story_label text DEFAULT 'Nuestra Historia';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS culinary_masterpieces_label text DEFAULT 'Obras Maestras Culinarias';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS testimonials_label text DEFAULT 'Testimonios';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS our_services_label text DEFAULT 'Nuestros Servicios';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS contact_us_label text DEFAULT 'Contáctanos';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS about_us_label text DEFAULT 'Acerca de Nosotros';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS our_menu_label text DEFAULT 'Nuestro Menú';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS our_team_label text DEFAULT 'Nuestro Equipo';

-- Add button label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS view_full_menu_button_label text DEFAULT 'Ver Menú Completo';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS call_button_label text DEFAULT 'Llamar';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS whatsapp_button_label text DEFAULT 'WhatsApp';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS reserve_table_button_label text DEFAULT 'Reservar Mesa';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS more_info_button_label text DEFAULT 'Más Info';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS back_to_home_button_label text DEFAULT 'Volver al Inicio';

-- Add form label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS name_field_label text DEFAULT 'Nombre';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS email_field_label text DEFAULT 'Email';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS phone_field_label text DEFAULT 'Teléfono';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS message_field_label text DEFAULT 'Mensaje';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS send_message_button_label text DEFAULT 'Enviar Mensaje';

-- Add footer label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS quick_links_label text DEFAULT 'Enlaces Rápidos';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS contact_info_label text DEFAULT 'Información de Contacto';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS follow_us_label text DEFAULT 'Síguenos';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS opening_hours_label text DEFAULT 'Horarios de Atención';

-- Add menu page label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS categories_label text DEFAULT 'Categorías';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS price_label text DEFAULT 'Precio';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS description_label text DEFAULT 'Descripción';

-- Add reviews page label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS customer_reviews_label text DEFAULT 'Reseñas de Clientes';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS rating_label text DEFAULT 'Calificación';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS review_date_label text DEFAULT 'Fecha';

-- Add error and status label fields
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS page_not_found_label text DEFAULT 'Página no encontrada';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS loading_label text DEFAULT 'Cargando...';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS error_label text DEFAULT 'Error';
ALTER TABLE public.admin_content ADD COLUMN IF NOT EXISTS try_again_label text DEFAULT 'Intentar de nuevo';