-- Add configurable CTA section fields to admin_content table
ALTER TABLE public.admin_content 
ADD COLUMN homepage_cta_title text DEFAULT '¿Listo para una experiencia culinaria única?',
ADD COLUMN homepage_cta_description text DEFAULT 'Contáctanos ahora para hacer tu reserva o conocer más sobre nuestro menú.',
ADD COLUMN homepage_cta_button1_text text DEFAULT 'WhatsApp',
ADD COLUMN homepage_cta_button1_link text DEFAULT NULL,
ADD COLUMN homepage_cta_button2_text text DEFAULT 'Llamar',
ADD COLUMN homepage_cta_button2_link text DEFAULT NULL,
ADD COLUMN contact_reservation_title text DEFAULT 'Reserva Tu Mesa',
ADD COLUMN contact_reservation_description text DEFAULT '¿Listo para disfrutar de una experiencia culinaria excepcional? Contáctanos directamente para hacer tu reserva o resolver cualquier consulta.',
ADD COLUMN whatsapp_reservation_message text DEFAULT 'Hola, me gustaría hacer una reserva para [fecha] a las [hora] para [número de personas] personas.',
ADD COLUMN whatsapp_general_message text DEFAULT 'Hola, me gustaría hacer una reserva';