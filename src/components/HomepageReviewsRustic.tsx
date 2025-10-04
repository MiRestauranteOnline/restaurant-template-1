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
    <section id="reviews" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-left max-w-3xl mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm border-l-4 border-accent pl-4">
            {(adminContent as any)?.testimonials_label || 'Testimonios'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading mt-4 mb-6 border-l-4 border-foreground/10 pl-4">
            <span className="block">{reviewsTitleFirstLine}</span>
            {reviewsTitleSecondLine && (
              <span className="block text-gradient mt-2">{reviewsTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-foreground/80 leading-relaxed pl-4">
            Cada opinión refleja nuestro compromiso con la excelencia culinaria y el servicio excepcional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homepageReviews.map((review, index) => (
            <Card 
              key={review.id} 
              className="card-hover bg-card border-2 border-border overflow-hidden group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4 pb-4 border-b-2 border-accent/20">
                  <div className="flex space-x-1 mr-3">
                    {renderStars(review.star_rating)}
                  </div>
                  <span className="text-sm text-foreground/60">
                    {new Date(review.created_at).toLocaleDateString('es-ES', { 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <p className="text-foreground/80 mb-6 leading-relaxed min-h-[100px]">
                  "{review.review_text}"
                </p>
                
                <div className="pt-4">
                  <p className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                    {review.reviewer_name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="inline-flex items-center space-x-2 bg-accent/10 px-6 py-3 rounded-md border-2 border-accent/20">
            <div className="flex space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-2xl font-heading font-bold text-accent">{averageRating.toFixed(1)}/5</span>
            <span className="text-foreground/60">de {reviews.length} reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageReviewsRustic;
