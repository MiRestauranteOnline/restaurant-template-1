import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import restaurantInterior from '@/assets/restaurant-interior.jpg';

const AboutMinimalistic = () => {
  const { adminContent } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const sectionTitle = 
    adminContent?.homepage_about_section_title ?? 
    cachedAdminContent?.homepage_about_section_title ?? 
    "Nuestra Historia";
    
  const sectionDescription = 
    adminContent?.homepage_about_section_description ?? 
    cachedAdminContent?.homepage_about_section_description;
  
  // Use admin content with cached fallbacks
  const aboutTitleFirstLine = 
    (adminContent as any)?.homepage_about_section_title_first_line ?? 
    (cachedAdminContent as any)?.homepage_about_section_title_first_line ?? 
    "Donde la Tradición";
    
  const aboutTitleSecondLine = 
    (adminContent as any)?.homepage_about_section_title_second_line ?? 
    (cachedAdminContent as any)?.homepage_about_section_title_second_line ?? 
    "Se Encuentra con la Innovación";
  
  // Get image URL from database with cached fallbacks
  const aboutImageUrl = 
    (adminContent as any)?.homepage_about_section_image_url ?? 
    (cachedAdminContent as any)?.homepage_about_section_image_url ?? 
    restaurantInterior;

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="fade-in order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={aboutImageUrl}
                  alt={`${aboutTitleFirstLine} ${aboutTitleSecondLine}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-border opacity-50" />
              </div>
            </div>

            {/* Content */}
            <div className="fade-in order-1 lg:order-2 space-y-6">
              <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                {sectionTitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-light">
                {aboutTitleFirstLine}
                {aboutTitleSecondLine && (
                  <span className="block text-accent mt-2">{aboutTitleSecondLine}</span>
                )}
              </h2>
              <div className="w-12 h-px bg-accent" />
              {sectionDescription && (
                <p className="text-foreground/70 leading-relaxed text-lg">
                  {sectionDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMinimalistic;
