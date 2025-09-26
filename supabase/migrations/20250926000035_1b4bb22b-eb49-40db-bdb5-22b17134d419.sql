-- Update existing admin_content record with missing hero titles and content
UPDATE admin_content SET
  -- Homepage Hero
  homepage_hero_title_first_line = 'Sabores Auténticos',
  homepage_hero_title_second_line = 'de Barranco',
  homepage_hero_description = 'Descubre la magia de la cocina peruana en cada plato, donde tradición y sabor se encuentran en perfecta armonía',
  homepage_hero_background_url = 'https://ptzcetvcccnojdbzzlyt.supabase.co/storage/v1/object/public/client-assets/9e530090-7ca0-435f-9c5f-08c921d4ebb4/1758839832948.webp',
  
  -- About Page Hero  
  about_page_hero_title_first_line = 'Nuestra',
  about_page_hero_title_second_line = 'Historia',
  about_page_hero_background_url = 'https://ptzcetvcccnojdbzzlyt.supabase.co/storage/v1/object/public/client-assets/9e530090-7ca0-435f-9c5f-08c921d4ebb4/1758839832948.webp',
  
  -- Menu Page Hero
  menu_page_hero_title_first_line = 'Nuestro',
  menu_page_hero_title_second_line = 'Menú',
  menu_page_hero_background_url = 'https://ptzcetvcccnojdbzzlyt.supabase.co/storage/v1/object/public/client-assets/9e530090-7ca0-435f-9c5f-08c921d4ebb4/1758839832948.webp',
  
  -- Contact Page Hero
  contact_page_hero_title_first_line = 'Reserva Tu',
  contact_page_hero_title_second_line = 'Mesa',
  contact_page_hero_background_url = 'https://ptzcetvcccnojdbzzlyt.supabase.co/storage/v1/object/public/client-assets/9e530090-7ca0-435f-9c5f-08c921d4ebb4/1758839832948.webp',
  
  -- Reviews Page Hero
  reviews_page_hero_title_first_line = 'Lo Que Dicen',
  reviews_page_hero_title_second_line = 'Nuestros Clientes',
  reviews_page_hero_background_url = 'https://ptzcetvcccnojdbzzlyt.supabase.co/storage/v1/object/public/client-assets/9e530090-7ca0-435f-9c5f-08c921d4ebb4/1758839832948.webp'
  
WHERE client_id IS NOT NULL;