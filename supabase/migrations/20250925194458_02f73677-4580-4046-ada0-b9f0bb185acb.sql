-- Populate admin_content table with current website content
UPDATE public.admin_content 
SET 
  -- Homepage Hero
  homepage_hero_title = 'Excelencia
Culinaria',
  homepage_hero_description = 'Experimenta lo mejor de la gastronomía contemporánea con nuestros platos cuidadosamente elaborados y un servicio impecable en un ambiente de elegancia refinada.',
  homepage_hero_right_button_text = 'Reservar Mesa',
  homepage_hero_right_button_link = '#contact',
  
  -- Homepage Menu Section
  homepage_menu_section_title = 'Selecciones Especiales',
  homepage_menu_section_description = 'Descubre la selección cuidadosamente curada de nuestro chef con platos excepcionales, cada uno elaborado con pasión y los mejores ingredientes.',
  
  -- Homepage Delivery Section  
  homepage_delivery_section_title = 'Delivery Partners',
  homepage_delivery_section_description = 'Ordena desde la comodidad de tu hogar a través de nuestros partners de delivery',
  
  -- Homepage Contact Section
  homepage_contact_section_title = 'Reserva Tu Experiencia',
  homepage_contact_section_description = 'Contáctanos para reservar tu mesa y vivir una experiencia gastronómica única',
  homepage_contact_hide_reservation_box = false,
  
  -- Homepage About Section
  homepage_about_section_title = 'Nuestra Historia',
  
  -- About Page
  about_page_hero_title = 'Nuestra Historia',
  about_page_hero_description = 'Conoce la pasión y tradición detrás de cada plato',
  about_page_content = jsonb_build_object(
    'title', 'Donde la Tradición
Se Encuentra con la Innovación',
    'story', 'Desde 2010, Savoria ha sido un faro de excelencia culinaria, combinando técnicas tradicionales con un toque contemporáneo. Nuestra pasión por ingredientes excepcionales y métodos de preparación innovadores crea una experiencia gastronómica inolvidable.',
    'chef_info', 'Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona los mejores ingredientes de temporada de granjas locales y productores artesanales, asegurando que cada plato cuente una historia de calidad y artesanía.',
    'mission', 'Desde cenas íntimas hasta grandes celebraciones, creamos momentos que perduran en la memoria mucho después del último bocado. Bienvenido a Savoria, donde cada comida es una obra maestra.'
  ),
  
  -- Contact Page  
  contact_page_hero_title = 'Contáctanos',
  contact_page_hero_description = 'Estamos aquí para hacer de tu experiencia algo inolvidable',
  
  -- Menu Page
  menu_page_hero_title = 'Nuestro Menú',
  menu_page_hero_description = 'Explora nuestra carta completa de especialidades culinarias',
  
  -- Reviews Page
  reviews_page_hero_title = 'Testimonios', 
  reviews_page_hero_description = 'Lo que nuestros clientes dicen sobre nosotros'

WHERE client_id IN (SELECT id FROM public.clients);