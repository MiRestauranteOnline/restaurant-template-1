import NavigationMinimalistic from '@/components/NavigationMinimalistic';
import FooterMinimalistic from '@/components/FooterMinimalistic';
import { Star } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';
import StructuredData from '@/components/StructuredData';
import HeadScripts from '@/components/HeadScripts';

const ReviewsPageMinimalistic = () => {
  const { reviews, adminContent, loading } = useClient();
  
  // Get cached content to prevent layout shifts
  const cachedAdminContent = getCachedAdminContent();
  
  const reviewsHeroTitleFirst = 
    (adminContent as any)?.reviews_page_hero_title_first_line ?? 
    cachedAdminContent?.reviews_page_hero_title_first_line ?? 'Our';
  const reviewsHeroTitleSecond = 
    (adminContent as any)?.reviews_page_hero_title_second_line ?? 
    cachedAdminContent?.reviews_page_hero_title_second_line ?? 'Reviews';
  const reviewsHeroDescription = 
    (adminContent as any)?.reviews_page_hero_description ?? 
    cachedAdminContent?.reviews_page_hero_description ?? 
    'See what our guests are saying about their experience.';
  const reviewsHeroBackground = 
    (adminContent as any)?.reviews_page_hero_background_url ?? 
    cachedAdminContent?.reviews_page_hero_background_url ?? '/src/assets/chocolate-dessert.jpg';

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.star_rating, 0) / reviews.length 
    : 0;

  // If loading, render page shell with skeleton to avoid shifts
  if (loading) {
    return (
      <>
        <HeadScripts />
        <StructuredData />
        <div className="min-h-screen bg-background">
          <NavigationMinimalistic />
          <section className="relative pt-20 min-h-[40vh] flex items-center justify-center">
            <div className="relative z-10 container mx-auto px-4 py-16 text-center">
              <div className="h-12 w-80 bg-foreground/10 rounded animate-pulse mx-auto" />
            </div>
          </section>
          <main>
            <section className="py-16 bg-background">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={`rev-skel-${i}`} className="border-b border-border/50 pb-6">
                      <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse mb-3" />
                      <div className="h-4 w-full bg-foreground/10 rounded animate-pulse mb-2" />
                      <div className="h-4 w-5/6 bg-foreground/10 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <FooterMinimalistic />
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
          <NavigationMinimalistic />
          
          {/* Hero Section */}
          <section className="relative pt-20 min-h-[40vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url('${reviewsHeroBackground}')` }}
              role="img"
              aria-label="Reviews page background"
            />
            
            <div className="relative z-10 container mx-auto px-4 py-16 text-center">
              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                  {(adminContent as any)?.testimonials_label || 'Testimonios'}
                </p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight">
                  {reviewsHeroTitleFirst}
                  {reviewsHeroTitleSecond && (
                    <span className="block text-accent">{reviewsHeroTitleSecond}</span>
                  )}
                </h1>
                <p className="text-lg text-foreground/70">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            </div>
          </section>

          <FooterMinimalistic />
        </div>
      </>
    );
  }

  return (
    <>
      <HeadScripts />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <NavigationMinimalistic />
        
        {/* Hero Section - Minimalistic Style */}
        <section className="relative pt-20 min-h-[40vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${reviewsHeroBackground}')` }}
            role="img"
            aria-label="Reviews page background"
          />
          
          <div className="relative z-10 container mx-auto px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium">
                  {(adminContent as any)?.testimonials_label || 'Testimonios'}
                </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight">
                {reviewsHeroTitleFirst}
                {reviewsHeroTitleSecond && (
                  <span className="block text-accent">{reviewsHeroTitleSecond}</span>
                )}
              </h1>
              <p className="text-lg text-foreground/70 max-w-xl mx-auto">
                {reviewsHeroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <main>
          <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Average Rating Display */}
              <div className="text-center mb-16 fade-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {renderStars(5)}
                </div>
                <p className="text-5xl font-heading font-light text-accent mb-2">{averageRating.toFixed(1)}</p>
                <p className="text-foreground/60 text-sm tracking-wider uppercase">Based on {reviews.length} reviews</p>
                <div className="w-12 h-px bg-accent mx-auto mt-6" />
              </div>

              {/* Reviews List */}
              <div className="space-y-8">
                {reviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className="fade-in border-b border-border/50 pb-8 last:border-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-1">
                        {renderStars(review.star_rating)}
                      </div>
                      <span className="text-xs text-foreground/40 tracking-wider uppercase">
                        {new Date(review.review_date).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <p className="text-foreground/80 leading-relaxed mb-4 text-lg">
                      "{review.review_text}"
                    </p>
                    
                    <p className="font-heading text-foreground tracking-wide">
                      — {review.reviewer_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <FooterMinimalistic />
      </div>
    </>
  );
};

export default ReviewsPageMinimalistic;
