import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import restaurantInterior from '@/assets/restaurant-interior.jpg';

const AboutMinimalistic = () => {
  const { adminContent } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const aboutTitle = (adminContent as any)?.homepage_about_title || (cachedAdminContent as any)?.homepage_about_title || 'Our Story';
  const aboutDescription = (adminContent as any)?.homepage_about_description || (cachedAdminContent as any)?.homepage_about_description || 
    'We are dedicated to providing an exceptional dining experience with carefully curated dishes and impeccable service.';
  const aboutImageUrl = (adminContent as any)?.homepage_about_image_url || (cachedAdminContent as any)?.homepage_about_image_url;

  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="fade-in order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={aboutImageUrl || restaurantInterior}
                  alt={aboutTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-border opacity-50" />
              </div>
            </div>

            {/* Content */}
            <div className="fade-in order-1 lg:order-2 space-y-6">
              <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                About Us
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-light">
                {aboutTitle}
              </h2>
              <div className="w-12 h-px bg-accent" />
              <p className="text-foreground/70 leading-relaxed text-lg">
                {aboutDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMinimalistic;
