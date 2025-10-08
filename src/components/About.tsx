import restaurantInterior from '@/assets/restaurant-interior.jpg';
import { useClient } from '@/contexts/ClientContext';
import { useLocation } from 'react-router-dom';
import { getCachedAdminContent } from '@/utils/cachedContent';

const About = () => {
  const { client, adminContent } = useClient();
  const location = useLocation();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const sectionTitle = 
    adminContent?.homepage_about_section_title ?? 
    cachedAdminContent?.homepage_about_section_title ?? 
    "Nuestra Historia";
    
  const sectionDescription = 
    adminContent?.homepage_about_section_description ?? 
    cachedAdminContent?.homepage_about_section_description;
  
  // Use admin content with cached fallbacks to prevent shifts
  const aboutTitleFirstLine = 
    (adminContent as any)?.homepage_about_section_title_first_line ?? 
    (cachedAdminContent as any)?.homepage_about_section_title_first_line ?? 
    "Donde la Tradición";
    
  const aboutTitleSecondLine = 
    (adminContent as any)?.homepage_about_section_title_second_line ?? 
    (cachedAdminContent as any)?.homepage_about_section_title_second_line ?? 
    "Se Encuentra con la Innovación";
  
  // Get image URL from database with cached fallbacks
  const isAboutPage = location.pathname === '/about';
  const aboutImageUrl = isAboutPage 
    ? (adminContent as any)?.about_page_about_section_image_url ?? 
      (cachedAdminContent as any)?.about_page_about_section_image_url ?? 
      restaurantInterior
    : (adminContent as any)?.homepage_about_section_image_url ?? 
      (cachedAdminContent as any)?.homepage_about_section_image_url ?? 
      restaurantInterior;
  
  // Use separate content fields from database with cached fallbacks
  const aboutStory = 
    (adminContent as any)?.about_story ?? 
    (cachedAdminContent as any)?.about_story ?? 
    'Desde 2010, nuestro restaurante ha sido un faro de excelencia culinaria, combinando técnicas tradicionales con un toque contemporáneo. Nuestra pasión por ingredientes excepcionales y métodos de preparación innovadores crea una experiencia gastronómica inolvidable.';
    
  const aboutChefInfo = 
    (adminContent as any)?.about_chef_info ?? 
    (cachedAdminContent as any)?.about_chef_info ?? 
    'Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona los mejores ingredientes de temporada de granjas locales y productores artesanales, asegurando que cada plato cuente una historia de calidad y artesanía.';
    
  const aboutMission = 
    (adminContent as any)?.about_mission ?? 
    (cachedAdminContent as any)?.about_mission ?? 
    'Desde cenas íntimas hasta grandes celebraciones, creamos momentos que perduran en la memoria mucho después del último bocado. Bienvenido a nuestro restaurante, donde cada comida es una obra maestra.';
  
  // Stats from database with cached fallbacks
  const stats = {
    experience: {
      number: (adminContent as any)?.stats_experience_number ?? 
               (cachedAdminContent as any)?.stats_experience_number ?? '15+',
      label: (adminContent as any)?.stats_experience_label ?? 
             (cachedAdminContent as any)?.stats_experience_label ?? 'Años de Experiencia'
    },
    clients: {
      number: (adminContent as any)?.stats_clients_number ?? 
               (cachedAdminContent as any)?.stats_clients_number ?? '5K+',
      label: (adminContent as any)?.stats_clients_label ?? 
             (cachedAdminContent as any)?.stats_clients_label ?? 'Clientes Felices'
    },
    awards: {
      number: (adminContent as any)?.stats_awards_number ?? 
               (cachedAdminContent as any)?.stats_awards_number ?? '10+',
      label: (adminContent as any)?.stats_awards_label ?? 
             (cachedAdminContent as any)?.stats_awards_label ?? 'Reconocimientos'
    }
  };

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Restaurant interior image */}
          <div className="fade-in">
            <div className="relative">
              <img
                src={aboutImageUrl}
                alt="Elegant restaurant interior with warm ambient lighting"
                className="w-full h-[600px] object-cover rounded-2xl shadow-elegant"
                style={{ aspectRatio: '4/3' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="fade-in">
            <div className="mb-6 text-center">
              <span className="text-accent font-medium tracking-wider uppercase text-sm">
                {sectionTitle}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-2 mb-6">
                <span>{aboutTitleFirstLine}</span>
                {aboutTitleSecondLine && (
                  <span className="block text-gradient">{aboutTitleSecondLine}</span>
                )}
              </h2>
            </div>
            
            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed text-center">
              <p>{aboutStory}</p>
              <p>{aboutChefInfo}</p>
              <p>{aboutMission}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.experience.number}</div>
                </div>
                <div className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider break-words px-2">{stats.experience.label}</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.clients.number}</div>
                </div>
                <div className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider break-words px-2">{stats.clients.label}</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.awards.number}</div>
                </div>
                <div className="text-xs sm:text-sm text-foreground/60 uppercase tracking-wider break-words px-2">{stats.awards.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;