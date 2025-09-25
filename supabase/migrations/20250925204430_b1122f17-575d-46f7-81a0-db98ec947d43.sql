-- Add separate fields for all section titles with double color styling
ALTER TABLE admin_content 
ADD COLUMN homepage_menu_section_title_first_line text DEFAULT 'Selecciones',
ADD COLUMN homepage_menu_section_title_second_line text DEFAULT 'Especiales',
ADD COLUMN homepage_contact_section_title_first_line text DEFAULT 'Reserva Tu',
ADD COLUMN homepage_contact_section_title_second_line text DEFAULT 'Experiencia',
ADD COLUMN homepage_services_section_title_first_line text DEFAULT 'Experiencias',
ADD COLUMN homepage_services_section_title_second_line text DEFAULT 'Auténticas',
ADD COLUMN reviews_section_title_first_line text DEFAULT 'Lo Que Dicen',
ADD COLUMN reviews_section_title_second_line text DEFAULT 'Nuestros Clientes',
ADD COLUMN homepage_about_section_title_first_line text DEFAULT 'Donde la Tradición',
ADD COLUMN homepage_about_section_title_second_line text DEFAULT 'Se Encuentra con la Innovación';

-- Add about content fields to replace the jsonb structure
ALTER TABLE admin_content
ADD COLUMN about_story text DEFAULT 'Desde 2010, nuestro restaurante ha sido un faro de excelencia culinaria, combinando técnicas tradicionales con un toque contemporáneo. Nuestra pasión por ingredientes excepcionales y métodos de preparación innovadores crea una experiencia gastronómica inolvidable.',
ADD COLUMN about_chef_info text DEFAULT 'Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona los mejores ingredientes de temporada de granjas locales y productores artesanales, asegurando que cada plato cuente una historia de calidad y artesanía.',
ADD COLUMN about_mission text DEFAULT 'Desde cenas íntimas hasta grandes celebraciones, creamos momentos que perduran en la memoria mucho después del último bocado. Bienvenido a nuestro restaurante, donde cada comida es una obra maestra.';

-- Add stats fields
ALTER TABLE admin_content
ADD COLUMN stats_experience_number text DEFAULT '15+',
ADD COLUMN stats_experience_label text DEFAULT 'Años de Experiencia',
ADD COLUMN stats_clients_number text DEFAULT '5K+',
ADD COLUMN stats_clients_label text DEFAULT 'Clientes Felices',
ADD COLUMN stats_awards_number text DEFAULT '10+',
ADD COLUMN stats_awards_label text DEFAULT 'Reconocimientos';