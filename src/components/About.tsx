import restaurantInterior from '@/assets/restaurant-interior.jpg';
import { useClient } from '@/contexts/ClientContext';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { ImageSkeleton, Skeleton } from '@/components/ui/skeleton';

const About = () => {
  const { client, adminContent } = useClient();
  const location = useLocation();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  // Lock initial render to the first available content (cached or live)
  const [stableAdmin, setStableAdmin] = useState<any>(
    adminContent ?? cachedAdminContent ?? null
  );

  useEffect(() => {
    if (!stableAdmin && (adminContent || cachedAdminContent)) {
      setStableAdmin(adminContent ?? cachedAdminContent ?? null);
    }
    // Intentionally avoid updating after first stable assignment to prevent swaps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminContent]);

  const contentSource: any = stableAdmin ?? cachedAdminContent;
  const hasStable = Boolean(stableAdmin || cachedAdminContent);
  
  const sectionTitle = 
    contentSource?.homepage_about_section_title ?? 
    "Nuestra Historia";
    
  const sectionDescription = 
    contentSource?.homepage_about_section_description ?? undefined;
  
  // Use contentSource with cached fallbacks to prevent shifts
  const aboutTitleFirstLine = 
    (contentSource as any)?.homepage_about_section_title_first_line ?? 
    "Donde la Tradición";
    
  const aboutTitleSecondLine = 
    (contentSource as any)?.homepage_about_section_title_second_line ?? 
    "Se Encuentra con la Innovación";
  
  // Get image URL from database with cached fallbacks
  const isAboutPage = location.pathname === '/about';
  const aboutImageUrl = isAboutPage 
    ? (contentSource as any)?.about_page_about_section_image_url ?? 
      restaurantInterior
    : (contentSource as any)?.homepage_about_section_image_url ?? 
      restaurantInterior;
  
  // Use separate content fields from database with cached fallbacks
  const aboutStory = 
    (contentSource as any)?.about_story ?? 
    'Desde 2010, nuestro restaurante ha sido un faro de excelencia culinaria, combinando técnicas tradicionales con un toque contemporáneo. Nuestra pasión por ingredientes excepcionales y métodos de preparación innovadores crea una experiencia gastronómica inolvidable.';
    
  const aboutChefInfo = 
    (contentSource as any)?.about_chef_info ?? 
    'Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona los mejores ingredientes de temporada de granjas locales y productores artesanales, asegurando que cada plato cuente una historia de calidad y artesanía.';
    
  const aboutMission = 
    (contentSource as any)?.about_mission ?? 
    'Desde cenas íntimas hasta grandes celebraciones, creamos momentos que perduran en la memoria mucho después del último bocado. Bienvenido a nuestro restaurante, donde cada comida es una obra maestra.';
  
  // Stats from database with cached fallbacks
  const stats = {
    experience: {
      number: (contentSource as any)?.stats_experience_number ?? '15+',
      label: (contentSource as any)?.stats_experience_label ?? 'Años de Experiencia'
    },
    clients: {
      number: (contentSource as any)?.stats_clients_number ?? '5K+',
      label: (contentSource as any)?.stats_clients_label ?? 'Clientes Felices'
    },
    awards: {
      number: (contentSource as any)?.stats_awards_number ?? '10+',
      label: (contentSource as any)?.stats_awards_label ?? 'Reconocimientos'
    }
  };

  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Restaurant interior image */}
          <div className="fade-in">
            {hasStable ? (
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
            ) : (
              <ImageSkeleton className="w-full h-[600px] rounded-2xl" />
            )}
          </div>

          {/* Content */}
          <div className="fade-in">
            <div className="mb-6 text-center">
              <span className="text-accent font-medium tracking-wider uppercase text-sm">
                {sectionTitle}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
                <span>{aboutTitleFirstLine}</span>
                {aboutTitleSecondLine && (
                  <span className="block text-gradient font-normal">{aboutTitleSecondLine}</span>
                )}
              </h2>
            </div>
            
            {hasStable ? (
              <div className="space-y-6 text-foreground/80 text-lg leading-relaxed text-center">
                <p>{aboutStory}</p>
                <p>{aboutChefInfo}</p>
                <p>{aboutMission}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-5 w-11/12 mx-auto" />
                <Skeleton className="h-5 w-10/12 mx-auto" />
                <Skeleton className="h-5 w-9/12 mx-auto" />
              </div>
            )}

            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.experience.number}</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">{stats.experience.label}</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.clients.number}</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">{stats.clients.label}</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <div className="text-2xl font-heading font-bold text-accent">{stats.awards.number}</div>
                </div>
                <div className="text-sm text-foreground/60 uppercase tracking-wider">{stats.awards.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;