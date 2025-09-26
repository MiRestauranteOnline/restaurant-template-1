import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import heroPasta from '@/assets/hero-pasta.jpg';

const Hero = () => {
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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImageUrl || heroPasta})` }}
      >
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light mb-6 leading-tight hero-text">
            <span>{heroTitleFirstLine}</span>
            {heroTitleSecondLine && (
              <span className="block text-gradient font-normal">{heroTitleSecondLine}</span>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl hero-text mb-8 max-w-2xl mx-auto leading-relaxed">
            {heroDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="btn-primary px-8 py-3 text-lg rounded-full">
              Ver Menú
            </Button>
            <Button 
              variant="contrast" 
              className="px-8 py-3 text-lg rounded-full"
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
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-accent" />
      </div>
    </section>
  );
};

export default Hero;