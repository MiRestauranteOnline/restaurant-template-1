import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useClient } from '@/contexts/ClientContext';

const Reviews = () => {
  const { adminContent } = useClient();
  
  // Use separate title fields from database
  const reviewsTitleFirstLine = (adminContent as any)?.reviews_section_title_first_line || "Lo Que Dicen";
  const reviewsTitleSecondLine = (adminContent as any)?.reviews_section_title_second_line || "Nuestros Clientes";
  
  const reviews = [
    {
      name: "María González",
      rating: 5,
      text: "¡Increíble experiencia! La comida estaba deliciosa y el servicio fue excepcional. Sin duda volveremos pronto.",
      date: "Hace 2 semanas"
    },
    {
      name: "Carlos Mendoza",
      rating: 5,
      text: "El mejor restaurante de Lima. Los sabores son únicos y el ambiente muy acogedor. Altamente recomendado.",
      date: "Hace 1 mes"
    },
    {
      name: "Ana Lucia Torres",
      rating: 5,
      text: "Platillos exquisitos y atención personalizada. Cada visita es una experiencia memorable.",
      date: "Hace 3 semanas"
    },
    {
      name: "Roberto Silva",
      rating: 4,
      text: "Muy buena comida y ambiente agradable. Los precios son justos para la calidad que ofrecen.",
      date: "Hace 1 semana"
    },
    {
      name: "Patricia Ramos",
      rating: 5,
      text: "Simplemente perfecto. Desde la entrada hasta el postre, todo estuvo espectacular. ¡Gracias por una noche inolvidable!",
      date: "Hace 4 días"
    },
    {
      name: "Diego Herrera",
      rating: 5,
      text: "La atención al cliente es excepcional y los platos están llenos de sabor. Un lugar que definitivamente recomiendo.",
      date: "Hace 2 días"
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

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
          {reviews.map((review, index) => (
            <Card key={index} className="bg-card border-border card-hover fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mr-3">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-foreground/60">{review.date}</span>
                </div>
                
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                
                <div className="border-t border-border pt-4">
                  <p className="font-medium text-foreground">
                    {review.name}
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
            <span className="text-lg font-medium">4.9/5</span>
            <span className="text-foreground/60">de 127 reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;