-- Add missing About page hero description field
ALTER TABLE admin_content 
ADD COLUMN IF NOT EXISTS about_page_hero_description text DEFAULT 'Conoce la historia detrás de nuestro restaurante y nuestro compromiso con la excelencia culinaria.';

-- Add team section fields  
ALTER TABLE admin_content
ADD COLUMN IF NOT EXISTS about_team_section_title_first_line text DEFAULT 'Nuestro',
ADD COLUMN IF NOT EXISTS about_team_section_title_second_line text DEFAULT 'Equipo',
ADD COLUMN IF NOT EXISTS about_team_section_description text DEFAULT 'Conoce a las personas apasionadas que hacen posible cada experiencia en nuestro restaurante.';

-- Add stats fields with icon selection (replacing existing stats fields)
ALTER TABLE admin_content
ADD COLUMN IF NOT EXISTS stats_item1_icon text DEFAULT 'Clock',
ADD COLUMN IF NOT EXISTS stats_item2_icon text DEFAULT 'Users', 
ADD COLUMN IF NOT EXISTS stats_item3_icon text DEFAULT 'Award';

-- Add Services section cards (homepage)
ALTER TABLE admin_content
ADD COLUMN IF NOT EXISTS services_card1_icon text DEFAULT 'Utensils',
ADD COLUMN IF NOT EXISTS services_card1_title text DEFAULT 'Comida en el Local',
ADD COLUMN IF NOT EXISTS services_card1_description text DEFAULT 'Disfruta de nuestros platos únicos en un ambiente acogedor y familiar.',
ADD COLUMN IF NOT EXISTS services_card1_button_text text DEFAULT 'Más Info',
ADD COLUMN IF NOT EXISTS services_card1_button_link text DEFAULT 'https://wa.me/51987654321?text=Hola, me gustaría saber más sobre comida en el local',

ADD COLUMN IF NOT EXISTS services_card2_icon text DEFAULT 'Truck',
ADD COLUMN IF NOT EXISTS services_card2_title text DEFAULT 'Delivery', 
ADD COLUMN IF NOT EXISTS services_card2_description text DEFAULT 'Lleva los sabores de nuestro restaurante a tu hogar con nuestro servicio de delivery.',
ADD COLUMN IF NOT EXISTS services_card2_button_text text DEFAULT 'Más Info',
ADD COLUMN IF NOT EXISTS services_card2_button_link text DEFAULT 'https://wa.me/51987654321?text=Hola, me gustaría saber más sobre delivery',

ADD COLUMN IF NOT EXISTS services_card3_icon text DEFAULT 'Users',
ADD COLUMN IF NOT EXISTS services_card3_title text DEFAULT 'Eventos Pequeños',
ADD COLUMN IF NOT EXISTS services_card3_description text DEFAULT 'Celebra tus momentos especiales con nosotros, perfecto para reuniones íntimas.',
ADD COLUMN IF NOT EXISTS services_card3_button_text text DEFAULT 'Más Info', 
ADD COLUMN IF NOT EXISTS services_card3_button_link text DEFAULT 'https://wa.me/51987654321?text=Hola, me gustaría saber más sobre eventos';

-- Add Services features bar (homepage)
ALTER TABLE admin_content
ADD COLUMN IF NOT EXISTS services_feature1_icon text DEFAULT 'Clock',
ADD COLUMN IF NOT EXISTS services_feature1_text text DEFAULT 'Abierto Todos los Días',

ADD COLUMN IF NOT EXISTS services_feature2_icon text DEFAULT 'Star',
ADD COLUMN IF NOT EXISTS services_feature2_text text DEFAULT 'Recomendado en Lima',

ADD COLUMN IF NOT EXISTS services_feature3_icon text DEFAULT 'MapPin',
ADD COLUMN IF NOT EXISTS services_feature3_text text DEFAULT 'En el Corazón de Miraflores';