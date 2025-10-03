import restaurantInterior from '@/assets/restaurant-interior.jpg';
import { useClient } from '@/contexts/ClientContext';
import { useLocation } from 'react-router-dom';
import { getCachedAdminContent } from '@/utils/cachedContent';

const AboutRustic = () => {
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
    <section id="about" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Bar at Top */}
        <div className="fade-in mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-background/50 backdrop-blur-sm border-2 border-border">
              <div className="text-5xl font-heading font-bold text-accent mb-2">{stats.experience.number}</div>
              <div className="text-sm text-foreground/70 uppercase tracking-widest">{stats.experience.label}</div>
            </div>
            <div className="text-center p-6 bg-background/50 backdrop-blur-sm border-2 border-border">
              <div className="text-5xl font-heading font-bold text-accent mb-2">{stats.clients.number}</div>
              <div className="text-sm text-foreground/70 uppercase tracking-widest">{stats.clients.label}</div>
            </div>
            <div className="text-center p-6 bg-background/50 backdrop-blur-sm border-2 border-border">
              <div className="text-5xl font-heading font-bold text-accent mb-2">{stats.awards.number}</div>
              <div className="text-sm text-foreground/70 uppercase tracking-widest">{stats.awards.label}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Content - Left Side */}
          <div className="fade-in order-2 lg:order-1">
            <div className="mb-8">
              <span className="text-accent font-medium tracking-widest uppercase text-xs mb-3 block">
                {sectionTitle}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6">
                <span className="block">{aboutTitleFirstLine}</span>
                {aboutTitleSecondLine && (
                  <span className="block text-gradient mt-2">{aboutTitleSecondLine}</span>
                )}
              </h2>
            </div>
            
            <div className="space-y-5 text-foreground/80 text-base leading-relaxed">
              <p className="border-l-4 border-accent pl-6">{aboutStory}</p>
              <p>{aboutChefInfo}</p>
              <p>{aboutMission}</p>
            </div>
          </div>

          {/* Image - Right Side */}
          <div className="fade-in order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 transform rotate-2"></div>
              <img
                src={aboutImageUrl}
                alt="Elegant restaurant interior with warm ambient lighting"
                className="relative w-full h-[500px] object-cover shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutRustic;
