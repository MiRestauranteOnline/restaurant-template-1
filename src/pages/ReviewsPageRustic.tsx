import NavigationRustic from '@/components/NavigationRustic';
import FooterRustic from '@/components/FooterRustic';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';
import { useTitleScale } from '@/hooks/useTitleScale';

const ReviewsPageRustic = () => {
  const { reviews, adminContent, loading } = useClient();
  useTitleScale(); // Apply dynamic title scaling
  
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
    'Descubre lo que nuestros clientes dicen sobre su experiencia.';
  const reviewsHeroBackground = 
    (adminContent as any)?.reviews_page_hero_background_url ?? 
    cachedAdminContent?.reviews_page_hero_background_url ?? '/src/assets/chocolate-dessert.jpg';

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-accent fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.star_rating, 0) / reviews.length 
    : 0;

  // If loading, render page shell with skeleton grid to avoid shifts
  if (loading) {
    return (
      <>
        <HeadScripts />
        <StructuredData />
        <div className="min-h-screen bg-background">
          <NavigationRustic />
          <section className="relative pt-20 min-h-[50vh] flex items-center justify-start overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${reviewsHeroBackground}')` }}
              role="img"
              aria-label="Imagen de fondo de la página de reseñas"
            />
            <div className="absolute inset-0 hero-overlay" />
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="max-w-3xl">
                <div className="h-12 w-80 bg-foreground/10 rounded animate-pulse" />
              </div>
            </div>
          </section>
          <main>
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={`rev-skel-${i}`} className="bg-card border-2 border-border">
                      <CardContent className="p-6 space-y-4">
                        <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse" />
                        <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-foreground/10 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <FooterRustic />
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
          <NavigationRustic />
          
          {/* Hero Section */}
          <section className="relative pt-20 min-h-[50vh] flex items-center justify-start overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${reviewsHeroBackground}')`,
              }}
              role="img"
              aria-label="Imagen de fondo de la página de reseñas"
            />
            <div className="absolute inset-0 hero-overlay" />
            
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="max-w-3xl">
                <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4 block mb-4">
                  Testimonios
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 border-l-4 border-foreground/10 pl-4">
                  <span className="block">{reviewsHeroTitleFirst}</span>
                  <span className="block text-gradient mt-2">{reviewsHeroTitleSecond}</span>
                </h1>
                <p className="text-xl text-foreground/90 leading-relaxed pl-4">
                  Aún no hay reseñas disponibles. ¡Sé el primero en compartir tu experiencia!
                </p>
              </div>
            </div>
          </section>

          <FooterRustic />
        </div>
      </>
    );
  }

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationRustic />
        
        {/* Hero Section - Rustic Style */}
        <section className="relative pt-20 min-h-[50vh] flex items-center justify-start overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${reviewsHeroBackground}')`,
            }}
            role="img"
            aria-label="Imagen de fondo de la página de reseñas"
          />
          <div className="absolute inset-0 hero-overlay" />
          
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4 block mb-4">
                Testimonios
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 border-l-4 border-foreground/10 pl-4">
                <span className="block">{reviewsHeroTitleFirst}</span>
                <span className="block text-gradient mt-2">{reviewsHeroTitleSecond}</span>
              </h1>
              <p className="text-xl text-foreground/90 leading-relaxed pl-4">
                {reviewsHeroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <main>
          <section className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
              {/* Average Rating Display */}
              <div className="text-left max-w-3xl mb-12 fade-in">
                <div className="inline-flex items-center gap-4 border-l-4 border-accent pl-4">
                  <div className="flex gap-1">
                    {renderStars(5)}
                  </div>
                  <span className="text-3xl font-heading font-bold text-accent">{averageRating.toFixed(1)}/5</span>
                  <span className="text-foreground/70">basado en {reviews.length} reseñas</span>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                  <Card 
                    key={review.id} 
                    className="bg-card border-2 border-border card-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-accent/20">
                        <div className="flex gap-1">
                          {renderStars(review.star_rating)}
                        </div>
                        <span className="text-xs text-foreground/60">
                          {new Date(review.review_date).toLocaleDateString('es-ES', { 
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-foreground/80 mb-4 leading-relaxed italic">
                        "{review.review_text}"
                      </p>
                      
                      <div className="pt-4">
                        <p className="font-heading font-bold text-foreground">
                          {review.reviewer_name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <FooterRustic />
      </div>
    </>
  );
};

export default ReviewsPageRustic;
