import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Reviews from '@/components/Reviews';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';
import { useHeroOverlay } from '@/hooks/useHeroOverlay';

const ReviewsPage = () => {
  const { reviews, adminContent, loading } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  useHeroOverlay(); // Apply dynamic hero overlay opacity
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const reviewsHeroTitleFirst = 
    (adminContent as any)?.reviews_page_hero_title_first_line ?? 
    cachedAdminContent?.reviews_page_hero_title_first_line ?? 'Nuestras';
  const reviewsHeroTitleSecond = 
    (adminContent as any)?.reviews_page_hero_title_second_line ?? 
    cachedAdminContent?.reviews_page_hero_title_second_line ?? 'Reseñas';
  const reviewsHeroDescription = 
    (adminContent as any)?.reviews_page_hero_description ?? 
    cachedAdminContent?.reviews_page_hero_description ?? 
    'Descubre lo que nuestros clientes dicen sobre su experiencia en Savoria.';
  const reviewsHeroBackground = 
    (adminContent as any)?.reviews_page_hero_background_url ?? 
    cachedAdminContent?.reviews_page_hero_background_url ?? '/src/assets/chocolate-dessert.jpg';

  // If loading, render page shell with skeleton grid to avoid shifts
  if (loading) {
    return (
      <>
        <HeadScripts />
        <StructuredData />
        <div className="min-h-screen bg-background">
          <Navigation />
          <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${reviewsHeroBackground}')` }}
              role="img"
              aria-label="Imagen de fondo de la página de reseñas"
            />
            <div className="absolute inset-0 hero-overlay" />
            <div className="relative z-10 container mx-auto px-4">
              <div className="text-center">
                <div className="h-12 w-80 bg-foreground/10 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </section>
          <main>
            <section className="py-16">
...
            </section>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // If no reviews exist, show a message instead
  if (!reviews || reviews.length === 0) {
    return (
      <>
        <HeadScripts />
        <StructuredData />
        <div className="min-h-screen bg-background">
          <Navigation />
          
          {/* Hero Section */}
          <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${reviewsHeroBackground}')`,
              }}
              role="img"
              aria-label="Imagen de fondo de la página de reseñas"
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
      </>
    );
  }

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${reviewsHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página de reseñas"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mb-6 text-foreground">
                  {reviewsHeroTitleFirst}
                  <span className="block text-gradient font-normal">{reviewsHeroTitleSecond}</span>
                </h1>
                <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
                  {reviewsHeroDescription}
                </p>
              </div>
          </div>
        </section>

        {/* Reviews Component */}
        <main>
          <Reviews />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ReviewsPage;