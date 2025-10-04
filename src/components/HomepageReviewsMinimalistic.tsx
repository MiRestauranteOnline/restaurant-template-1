import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useClient } from '@/contexts/ClientContext';
import { getCachedAdminContent } from '@/utils/cachedContent';

const HomepageReviewsMinimalistic = () => {
  const { reviews, adminContent } = useClient();
  
  const cachedAdminContent = getCachedAdminContent();
  const reviewsTitle = (adminContent as any)?.homepage_reviews_title || cachedAdminContent?.homepage_reviews_title || 'What Our Guests Say';
  const reviewsDescription = (adminContent as any)?.homepage_reviews_description || cachedAdminContent?.homepage_reviews_description || 
    'Read about experiences from our valued customers.';

  const featuredReviews = reviews?.filter(r => r.is_active).slice(0, 3) || [];

  if (featuredReviews.length === 0) return null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-medium mb-4">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light mb-4">
              {reviewsTitle}
            </h2>
            <div className="w-12 h-px bg-accent mx-auto mb-6" />
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              {reviewsDescription}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredReviews.map((review, index) => (
              <div 
                key={review.id}
                className="fade-in border border-border p-8 hover:border-accent transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {renderStars(review.star_rating)}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 italic">
                  "{review.review_text}"
                </p>
                <div className="w-8 h-px bg-accent/30 mb-3" />
                <p className="text-sm font-heading tracking-wide">
                  {review.reviewer_name}
                </p>
              </div>
            ))}
          </div>

          {/* View All Reviews Button */}
          <div className="text-center">
            <Button 
              className="btn-primary px-8 py-3 text-sm rounded-none tracking-wider uppercase"
              onClick={() => window.location.href = '/reviews'}
            >
              View All Reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageReviewsMinimalistic;
