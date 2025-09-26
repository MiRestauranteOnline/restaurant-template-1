import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Reviews from '@/components/Reviews';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const ReviewsPage = () => {
  const { reviews, adminContent } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const reviewsHeroBackground = 
    (adminContent as any)?.reviews_page_hero_background_url ?? 
    cachedAdminContent?.reviews_page_hero_background_url ?? '/src/assets/chocolate-dessert.jpg';

  // If no reviews exist, show a message instead
  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${reviewsHeroBackground}')`,
            }}
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
                Nuestras
                <span className="block text-gradient font-normal">Reseñas</span>
              </h1>
              <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
                Aún no hay reseñas disponibles. ¡Sé el primero en compartir tu experiencia!
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${reviewsHeroBackground}')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
              Nuestras
              <span className="block text-gradient font-normal">Reseñas</span>
            </h1>
            <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Descubre lo que nuestros clientes dicen sobre su experiencia en Savoria.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Component */}
      <Reviews />

      <Footer />
    </div>
  );
};

export default ReviewsPage;