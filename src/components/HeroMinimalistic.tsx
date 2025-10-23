import { Button } from '@/components/ui/button';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import { useAnalyticsContext } from '@/components/AnalyticsProvider';
import heroPasta from '@/assets/hero-pasta.jpg';

const HeroMinimalistic = () => {
  const { client, adminContent } = useClient();
  const { trackButtonClick } = useAnalyticsContext();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const heroTitleFirstLine = 
    (adminContent as any)?.homepage_hero_title_first_line ?? 
    cachedAdminContent?.homepage_hero_title_first_line ??
    client?.other_customizations?.hero_title?.split('\n')[0] ?? 
    'Culinary';
  
  const heroTitleSecondLine = 
    (adminContent as any)?.homepage_hero_title_second_line ?? 
    cachedAdminContent?.homepage_hero_title_second_line ??
    client?.other_customizations?.hero_title?.split('\n')[1] ?? 
    'Excellence';
  
  const heroDescription = 
    adminContent?.homepage_hero_description ?? 
    cachedAdminContent?.homepage_hero_description ??
    client?.other_customizations?.hero_description ?? 
    'Experience the finest in contemporary dining with our carefully crafted dishes and impeccable service.';
  
  const viewMenuButtonText = (adminContent as any)?.view_menu_button_text || (cachedAdminContent as any)?.view_menu_button_text || 'View Menu';
  const rightButtonText = adminContent?.homepage_hero_right_button_text ?? 'Reserve Table';
  const rightButtonLink = adminContent?.homepage_hero_right_button_link ?? '#contact';
  const backgroundImageUrl = 
    adminContent?.homepage_hero_background_url ?? 
    cachedAdminContent?.homepage_hero_background_url;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center" aria-label="Hero section">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('${backgroundImageUrl || heroPasta}')` }}
        role="img"
        aria-label="Hero background"
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-light tracking-tight leading-[1.1]">
            {heroTitleFirstLine}
            {heroTitleSecondLine && (
              <span className="block text-accent mt-2">{heroTitleSecondLine}</span>
            )}
          </h1>
          
          <div className="w-16 h-px bg-accent mx-auto" />
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {heroDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              className="btn-primary px-8 py-3 text-sm rounded-none tracking-wider uppercase"
              onClick={() => {
                trackButtonClick('view_menu', { source: 'hero' });
                window.location.href = '/menu';
              }}
            >
              {viewMenuButtonText}
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-3 text-sm rounded-none tracking-wider uppercase border-foreground/20 hover:border-accent hover:text-accent"
              onClick={() => {
                trackButtonClick('reservation', { source: 'hero', text: rightButtonText });
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
    </section>
  );
};

export default HeroMinimalistic;
