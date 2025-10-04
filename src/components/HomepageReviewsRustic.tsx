import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';

const HomepageReviewsRustic = () => {
  const { adminContent, reviews } = useClient();
  
  // Use separate title fields from database
  const reviewsTitleFirstLine = (adminContent as any)?.reviews_section_title_first_line || "Lo Que Dicen";
  const reviewsTitleSecondLine = (adminContent as any)?.reviews_section_title_second_line || "Nuestros Clientes";
  
  // If no reviews, don't render the section
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Show only the first 6 reviews on homepage
  const homepageReviews = reviews.slice(0, 6);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.star_rating, 0) / reviews.length;

  return (
    <section id="reviews" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            {(adminContent as any)?.testimonials_label || 'Testimonios'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6">
            <span className="block">{reviewsTitleFirstLine}</span>
            {reviewsTitleSecondLine && (
              <span className="block text-gradient mt-2">{reviewsTitleSecondLine}</span>
            )}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-foreground/80 leading-relaxed">
            Cada opinión refleja nuestro compromiso con la excelencia culinaria y el servicio excepcional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homepageReviews.map((review, index) => (
            <Card 
              key={review.id} 
              className="card-hover bg-card border-2 border-border overflow-hidden group relative transform transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-1">
                    {renderStars(review.star_rating)}
                  </div>
                  <span className="text-xs text-foreground/60 uppercase tracking-wider">
                    {new Date(review.created_at).toLocaleDateString('es-ES', { 
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <p className="text-foreground/80 mb-6 leading-relaxed min-h-[100px] text-center italic">
                  &ldquo;{review.review_text}&rdquo;
                </p>
                
                <div className="pt-6 border-t-2 border-accent/20 text-center">
                  <p className="font-heading text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {review.reviewer_name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center space-x-3 bg-accent/10 px-8 py-4 rounded-lg border-2 border-accent/30 backdrop-blur-sm">
            <div className="flex space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-3xl font-heading font-bold text-accent">{averageRating.toFixed(1)}</span>
            <span className="text-foreground/60 text-lg">de {reviews.length} reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageReviewsRustic;
