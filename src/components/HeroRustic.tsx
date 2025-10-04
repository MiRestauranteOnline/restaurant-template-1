import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';

const HeroRustic = () => {
  const { client, adminContent } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  // Use cached content as fallback to prevent layout shifts
  const heroTitleFirstLine = 
    (adminContent as any)?.homepage_hero_title_first_line ?? 
    cachedAdminContent?.homepage_hero_title_first_line ??
    client?.other_customizations?.hero_title?.split('\n')[0] ?? 
    'Excelencia';
  
  const heroTitleSecondLine = 
    (adminContent as any)?.homepage_hero_title_second_line ?? 
    cachedAdminContent?.homepage_hero_title_second_line ??
    client?.other_customizations?.hero_title?.split('\n')[1] ?? 
    'Culinaria';
  
  const heroDescription = 
    adminContent?.homepage_hero_description ?? 
    cachedAdminContent?.homepage_hero_description ??
    client?.other_customizations?.hero_description ?? 
    'Experimenta lo mejor de la gastronomía contemporánea con nuestros platos cuidadosamente elaborados y un servicio impecable en un ambiente de elegancia refinada.';
  
  const rightButtonText = adminContent?.homepage_hero_right_button_text ?? 'Reservar Mesa';
  const rightButtonLink = adminContent?.homepage_hero_right_button_link ?? '#contact';
  const backgroundImageUrl = 
    adminContent?.homepage_hero_background_url ?? 
    cachedAdminContent?.homepage_hero_background_url;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center py-20 px-4" aria-label="Hero principal del restaurante">
      {/* Container with max width */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="fade-in text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading mb-6 leading-tight">
              <span className="block">{heroTitleFirstLine}</span>
              {heroTitleSecondLine && (
                <span className="block text-gradient">{heroTitleSecondLine}</span>
              )}
            </h1>
            
            <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
              {heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="btn-primary px-8 py-3 text-lg rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105"
                onClick={() => window.location.href = '/menu'}
              >
                Ver Menú
              </Button>
              <Button 
                variant="contrast" 
                className="px-8 py-3 text-lg rounded-xl border-2 hover:scale-105 transition-all"
                onClick={() => {
                  if (rightButtonLink.startsWith('#')) {
                    document.querySelector(rightButtonLink)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.open(rightButtonLink, '_blank');
                  }
                }}
              >
                {rightButtonText}
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="fade-in order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img 
                src={backgroundImageUrl || heroPasta}
                alt={`${heroTitleFirstLine} ${heroTitleSecondLine}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-accent" />
      </div>
    </section>
  );
};

export default HeroRustic;
