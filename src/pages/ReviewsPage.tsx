import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Reviews from '@/components/Reviews';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const ReviewsPage = () => {
  const { reviews, adminContent, loading } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const reviewsHeroBackground = 
    (adminContent as any)?.reviews_page_hero_background_url ?? 
    cachedAdminContent?.reviews_page_hero_background_url ?? '/src/assets/chocolate-dessert.jpg';

  // If loading, render page shell with skeleton grid to avoid shifts
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${reviewsHeroBackground}')` }}
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="relative z-10 container mx-auto px-4">
            <div className="text-center">
              <div className="h-12 w-80 bg-foreground/10 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={`revp-skel-${i}`} className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

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