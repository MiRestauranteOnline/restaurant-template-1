import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';

const HomepageReviews = () => {
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
        <div className="text-center mb-16 fade-in">
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Testimonios
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light mt-2 mb-6">
            <span>{reviewsTitleFirstLine}</span>
            {reviewsTitleSecondLine && (
              <span className="block text-gradient font-normal">{reviewsTitleSecondLine}</span>
            )}
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Cada opinión refleja nuestro compromiso con la excelencia culinaria y el servicio excepcional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homepageReviews.map((review) => (
            <Card key={review.id} className="bg-card border-border card-hover fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
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
                
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  "{review.review_text}"
                </p>
                
                <div className="border-t border-border pt-4">
                  <p className="font-medium text-foreground">
                    {review.reviewer_name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-accent">
            <div className="flex space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-lg font-medium">{averageRating.toFixed(1)}/5</span>
            <span className="text-foreground/60">de {reviews.length} reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageReviews;